import React from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import { NextRouter, useRouter } from "next/router";

import { useMergeState, withAuth, ArrayMethods } from "../../utils";
import { SingleCard, VoteCard, HashtagCard, LoadingComponent, NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import { gameCreate, gameNewCard } from "../../api";
import { AxiosResponse, AxiosError } from "axios";

const PlayCards: NextPage = () => {
    const router: NextRouter = useRouter();

    const [playState, setPlayState] = useMergeState({
        isLoading: false,

        // Game
        gameId: null,
        allCards: [],
        rightSwipedCards: [],
        leftSwipedCards: [],
        currentCard: 0,
        finalHashTagSwipeMode: false,

        // Mode
        gameMode: "hashtag"
    });

    const { isLoading, gameId, allCards, rightSwipedCards, currentCard, gameMode } = playState;

    const { isLoading: isCreatingGame, mutate: startGame } = useMutation(gameCreate, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;

            // Check if we're continuing a game
            if (data.continue) {
                const allCards = data.leftSwipedCards.concat(data.rightSwipedCards);

                setPlayState({
                    gameId: data._id,
                    allCards: allCards,
                    rightSwipedCards: data.rightSwipedCards,
                    leftSwipedCards: data.leftSwipedCards,
                    currentCard: allCards.length,
                    gameMode: allCards.length > 0 ? "swipe" : "hashtag"
                });
            }

            // Check if we're not continuing a game
            if (!data.continue) {
                // Set GameId and continue play flow
                setPlayState({ gameId: data._id });
            }
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message, {
                onClose: () => router.push("/dashboard")
            });
        }
    });

    const { isLoading: isAddingNewCard, mutateAsync: addNewCard } = useMutation(gameNewCard, {
        onSuccess: (response: AxiosResponse) => {
            const { data, success } = response.data;

            if (success) {
                const functionNewCards = ArrayMethods.getUnique([...allCards, data], "_id");
                setPlayState({ allCards: functionNewCards, currentCard: functionNewCards.length });
            }
        },
        onError: (error: AxiosError) => {
            // Out of Cards for the Hashtag, Enter hashTagSwipeMode
            setPlayState({ isLoading: true, gameMode: "hashtag" });

            console.log(error.response ? error.response.data.message : error.message);
        }
    });

    // Create a Game or Continue a game
    React.useEffect(() => startGame({}), []);

    // @ts-ignore
    React.useEffect(async () => {
        if (gameMode === "swipe") await addNewCard(gameId);
        setPlayState({ isLoading: false });
    }, [gameMode]);

    return (
        <>
            <Head>
                <title>Play Cards - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isCreatingGame || isAddingNewCard || isLoading ? <LoadingComponent /> : null}

                    {gameId && !isCreatingGame && !isAddingNewCard && !isLoading && (
                        <>
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">Play Cards</section>

                            {gameMode === "swipe" && typeof allCards[currentCard - 1] !== undefined && (
                                <SingleCard card={allCards[currentCard - 1]} playState={playState} setPlayState={setPlayState} />
                            )}
                            {gameMode === "vote" && <VoteCard gameId={gameId} setPlayState={setPlayState} rightSwipedCards={rightSwipedCards} />}
                            {gameMode === "hashtag" && <HashtagCard playState={playState} setPlayState={setPlayState} />}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(PlayCards);
