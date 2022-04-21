import React from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { NextRouter, useRouter } from "next/router";

import { useMergeState, withAuth, ArrayMethods } from "../../utils";
import { SingleCard, VoteCard, HashtagCard, LoadingComponent, NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import { surveyCreate, surveyNewCard } from "../../api";
import { AxiosResponse, AxiosError } from "axios";

const PlaySurvey: NextPage = () => {
    const router: NextRouter = useRouter();

    const [playState, setPlayState] = useMergeState({
        isLoading: false,

        // Survey
        surveyId: null,
        allCards: [],
        rightSwipedCards: [],
        leftSwipedCards: [],
        currentCard: 0,
        finalHashTagSwipeMode: false,

        // Mode
        surveyMode: "hashtag"
    });

    const { projectId } = router.query;

    const { isLoading, surveyId, allCards, rightSwipedCards, currentCard, surveyMode } = playState;

    const { isLoading: isCreatingSurvey, mutate: startSurvey } = useMutation(surveyCreate, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;

            // Check if we're continuing a survey
            if (data.continue) {
                const allCards = data.leftSwipedCards.concat(data.rightSwipedCards);

                setPlayState({
                    surveyId: data._id,
                    allCards: allCards,
                    rightSwipedCards: data.rightSwipedCards,
                    leftSwipedCards: data.leftSwipedCards,
                    currentCard: allCards.length,
                    surveyMode: allCards.length > 0 ? "swipe" : "hashtag"
                });
            }

            // Check if we're not continuing a survey
            if (!data.continue) {
                // Set SurveyId and continue play flow
                setPlayState({ surveyId: data._id });
            }
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    const { isLoading: isAddingNewCard, mutateAsync: addNewCard } = useMutation(surveyNewCard, {
        onSuccess: (response: AxiosResponse) => {
            const { data, success } = response.data;

            if (success) {
                const functionNewCards = ArrayMethods.getUnique([...allCards, data], "_id");
                setPlayState({ allCards: functionNewCards, currentCard: functionNewCards.length });
            }
        },
        onError: (error: AxiosError) => {
            // Out of Cards for the Hashtag, Enter hashTagSwipeMode
            setPlayState({ isLoading: true, surveyMode: "hashtag" });

            console.log(error.response ? error.response.data.message : error.message);
        }
    });

    // Create a Survey or Continue a survey
    React.useEffect(() => {
        if (!router.isReady) return;
        startSurvey({ project: projectId });
    }, [router.isReady]);

    // @ts-ignore
    React.useEffect(async () => {
        if (surveyMode === "swipe") await addNewCard(surveyId);
        setPlayState({ isLoading: false });
    }, [surveyMode]);

    return (
        <>
            <Head>
                <title>Play Cards - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isCreatingSurvey || isAddingNewCard || isLoading ? <LoadingComponent /> : null}

                    {surveyId && !isCreatingSurvey && !isAddingNewCard && !isLoading && (
                        <>
                            {/* <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">Play Cards</section> */}

                            {surveyMode === "swipe" && typeof allCards[currentCard - 1] !== undefined && (
                                <SingleCard card={allCards[currentCard - 1]} playState={playState} setPlayState={setPlayState} />
                            )}
                            {surveyMode === "vote" && <VoteCard surveyId={surveyId} setPlayState={setPlayState} rightSwipedCards={rightSwipedCards} />}
                            {surveyMode === "hashtag" && <HashtagCard playState={playState} setPlayState={setPlayState} />}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(PlaySurvey);
