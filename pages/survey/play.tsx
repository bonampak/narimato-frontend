import React from "react";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useImmer } from "use-immer";
import { withAuth } from "../../utils";
import { surveyCreate, surveyGetNewCard, surveyGetNewHashtag, surveyUpdate, surveyUpdateLeftSwipedCardRefs, surveyUpdateLeftSwipedHashtagRefs, surveyUpdateRightSwipedCardRefs, surveyUpdateRightSwipedHashtagRefs } from "../../http";
import { Loading, NavigationBar, SingleCard, SingleHashtag, VoteCard } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const Play: NextPage = ({ query }: any) => {
    const { projectId } = query;
    const router: NextRouter = useRouter();

    const [surveyState, updateSurveyState] = useImmer<{
        id: string;
        uniqueId: string;
        projectRef: string;

        leftSwipedCardRefs: Array<{
            _id: string;
            title: string;
            description?: string;
            imageUrl?: string;
            bgColor?: string;
            hashtagRefs: Array<any>;
        }>;
        rightSwipedCardRefs: Array<{
            _id: string;
            title: string;
            description?: string;
            imageUrl?: string;
            bgColor?: string;
            hashtagRefs: Array<any>;
        }>;
        leftSwipedHashtagRefs: Array<{
            _id: string;
            title: string;
            description?: string;
            imageUrl?: string;
            bgColor?: string;
            parentHashtagRef?: any;
        }>;
        rightSwipedHashtagRefs: Array<{
            _id: string;
            title: string;
            description?: string;
            imageUrl?: string;
            bgColor?: string;
            parentHashtagRef?: any;
        }>;

        // Game State
        currentMode: null | "card" | "hashtag" | "vote";
        currentCard: null | {
            _id: string;
            title: string;
            description?: string;
            imageUrl?: string;
            bgColor?: string;
            hashtagRefs: Array<any>;
        };
        currentHashtag: null | {
            _id: string;
            title: string;
            description?: string;
            imageUrl?: string;
            bgColor?: string;
            parentHashtagRef?: any;
        };
        isFinalHashtag: boolean;
    }>({
        id: "",
        uniqueId: "",
        projectRef: projectId,

        leftSwipedCardRefs: [],
        rightSwipedCardRefs: [],
        leftSwipedHashtagRefs: [],
        rightSwipedHashtagRefs: [],

        currentMode: null,
        currentCard: null,
        currentHashtag: null,
        isFinalHashtag: false
    });

    const { isLoading: isCreatingSurvey } = useQuery(["survey"], () => surveyCreate({ projectRef: projectId }), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;

            updateSurveyState((prev) => {
                prev.id = data._id;
                prev.uniqueId = data.uniqueId;

                prev.leftSwipedCardRefs = data.leftSwipedCardRefs;
                prev.rightSwipedCardRefs = data.rightSwipedCardRefs;
                prev.leftSwipedHashtagRefs = data.leftSwipedHashtagRefs;
                prev.rightSwipedHashtagRefs = data.rightSwipedHashtagRefs;

                prev.currentMode = data.leftSwipedCardRefs.concat(data.rightSwipedCardRefs).length > 0 ? "card" : "hashtag";
            });

            // Commenting status updates toasts
            // toast.success(`survey ${data.status == "new" ? "started" : "resumed"}`);
        },
        enabled: !!projectId
    });

    const { isLoading: isFetchingNewCard, mutate: fetchNewCard } = useMutation(() => surveyGetNewCard(surveyState.id), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;

            if (data !== null) {
                updateSurveyState((prev) => {
                    prev.currentCard = data;
                });
                return;
            }

            // Last Card Vote
            // if (surveyState.rightSwipedCardRefs.length >= 2) {
            //     // Enter Vote mode to rank rightSwipedCardRefs
            //     updateSurveyState((prev) => {
            //         prev.currentMode = "vote";
            //     });
            //     return;
            // }

            updateSurveyState((prev) => {
                prev.currentCard = null;
                // Out of Cards for the Hashtag, get new hashtag
                prev.currentMode = "hashtag";
            });
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const { isLoading: isFetchingNewHashtag, mutate: fetchNewHashtag } = useMutation(() => surveyGetNewHashtag(surveyState.id), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;

            if (data !== null) {
                updateSurveyState((prev) => {
                    prev.currentHashtag = data;
                });
                return;
            }

            updateSurveyState((prev) => {
                prev.currentHashtag = null;
                // Out of Hashtag, switch to cards and set isFinalHashtag
                prev.currentMode = "card";
                prev.isFinalHashtag = true;
            });
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const { isLoading: isUpdatingRightSwipedHashtagRefs, mutateAsync: updateRightSwipedHashtagRefs } = useMutation((context: any) => surveyUpdateRightSwipedHashtagRefs(surveyState.id, context), {
        onSuccess: (response: AxiosResponse) => {
            updateSurveyState((prev) => {
                prev.currentMode = "card";
            });
            // Commenting status updates toasts
            // toast.success("right swiped hashtags updated");
        },
        onError: (error: AxiosError) => {
            toast.error("Something went wrong, please try again.");
        }
    });

    const { isLoading: isUpdatingLeftSwipedHashtagRefs, mutateAsync: updateLeftSwipedHashtagRefs } = useMutation((context: any) => surveyUpdateLeftSwipedHashtagRefs(surveyState.id, context), {
        onSuccess: (response: AxiosResponse) => {
            // Commenting status updates toasts
            // toast.success("left swiped hashtags updated");

            // fetch new hashtag because mode does not change so useEffect will not be called
            fetchNewHashtag()
        },
        onError: (error: AxiosError) => {
            toast.error("Something went wrong, please try again.");
        }
    });

    const { isLoading: isUpdatingRightSwipedCardRefs, mutateAsync: updateRightSwipedCardRefs } = useMutation((context: any) => surveyUpdateRightSwipedCardRefs(surveyState.id, context), {
        onSuccess: (response: AxiosResponse) => {
            // Commenting status updates toasts
            // toast.success("right swiped cards updated");
        },
        onError: (error: AxiosError) => {
            toast.error("Something went wrong, please try again.");
        }
    });

    const { isLoading: isUpdatingLeftSwipedCardRefs, mutateAsync: updateLeftSwipedCardRefs } = useMutation((context: any) => surveyUpdateLeftSwipedCardRefs(surveyState.id, context), {
        onSuccess: (response: AxiosResponse) => {
            // Commenting status updates toasts
            // toast.success("left swiped cards updated");
        },
        onError: (error: AxiosError) => {
            toast.error("Something went wrong, please try again.");
        }
    });

    const { isLoading: isUpdatingSurvey, mutate: updateSurvey } = useMutation((context) => surveyUpdate(surveyState.id as string, context), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            // Commenting status updates toasts
            // toast.success(`update made to survey`);
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    React.useEffect(() => {
        if (!surveyState.currentMode) return;

        if (surveyState.currentMode === "card") {
            // Get a new card
            fetchNewCard();
        }

        if (surveyState.currentMode === "hashtag") {
            // If about to load a new hashtag and the isFinalHashtag has already been set, then just redirect to result
            if (surveyState.isFinalHashtag === true) {
                toast.success("Survey complete, Generating result...");
                setTimeout(() => router.push(`/surveys/${surveyState.id}`), 1200);
                return;
            }

            // Get a new Hashtag
            fetchNewHashtag();
        }
    }, [surveyState.currentMode]);

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {/* <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Play - {projectId}</section> */}

                    {isCreatingSurvey || isUpdatingSurvey || isFetchingNewCard || isFetchingNewHashtag || isUpdatingRightSwipedHashtagRefs || isUpdatingLeftSwipedHashtagRefs || isUpdatingRightSwipedCardRefs || isUpdatingLeftSwipedCardRefs ? <Loading isParent={true} /> : null}

                    {!isCreatingSurvey && !isUpdatingSurvey && !isFetchingNewCard && !isFetchingNewHashtag && !isUpdatingRightSwipedHashtagRefs && !isUpdatingLeftSwipedHashtagRefs && !isUpdatingRightSwipedCardRefs && !isUpdatingLeftSwipedCardRefs && (
                        <>
                            {surveyState.currentMode === "vote" && (
                                <VoteCard
                                    // Breaker
                                    showTitle={true}
                                    surveyState={surveyState}
                                    updateSurveyState={updateSurveyState}
                                    updateRightSwipedCardRefs={updateRightSwipedCardRefs}
                                />
                            )}

                            {surveyState.currentMode === "card" && surveyState.currentCard && (
                                <SingleCard
                                    // breaker
                                    card={surveyState.currentCard}
                                    showTitle={true}
                                    showButtons={true}
                                    showHashtags={false}
                                    activeControls={true}
                                    leftSwipeHandler={async () => {
                                        const leftSwipedCardRefs: any[] = [surveyState.currentCard].concat(surveyState.leftSwipedCardRefs);

                                        // State update
                                        updateSurveyState((prev) => {
                                            prev.leftSwipedCardRefs = leftSwipedCardRefs;
                                        });

                                        // API Update call
                                        await updateLeftSwipedCardRefs({ ids: leftSwipedCardRefs.map((card) => card._id) });

                                        // Get a new card
                                        fetchNewCard();
                                    }}
                                    rightSwipeHandler={async () => {
                                        const rightSwipedCardRefs: any[] = [surveyState.currentCard].concat(surveyState.rightSwipedCardRefs);

                                        // State update
                                        updateSurveyState((prev) => {
                                            prev.rightSwipedCardRefs = rightSwipedCardRefs;
                                        });

                                        // API Update call
                                        await updateRightSwipedCardRefs({ ids: rightSwipedCardRefs.map((card) => card._id) });

                                        // If number of cards in rightSwipedCardRefs bucket is greater than 2
                                        if (rightSwipedCardRefs.length >= 2) {
                                            // Enter Vote mode to rank rightSwipedCardRefs
                                            updateSurveyState((prev) => {
                                                prev.currentMode = "vote";
                                            });
                                            return;
                                        }

                                        // Get a new card
                                        fetchNewCard();
                                    }}
                                />
                            )}

                            {surveyState.currentMode === "hashtag" && surveyState.currentHashtag && (
                                <SingleHashtag
                                    // breaker
                                    hashtag={surveyState.currentHashtag}
                                    showTitle={true}
                                    showButtons={true}
                                    showHashtags={false}
                                    activeControls={true}
                                    leftSwipeHandler={async () => {
                                        const leftSwipedHashtagRefs: any[] = [surveyState.currentHashtag].concat(surveyState.leftSwipedHashtagRefs);

                                        // State update
                                        updateSurveyState((prev) => {
                                            prev.leftSwipedHashtagRefs = leftSwipedHashtagRefs;
                                        });

                                        // API Update call
                                        await updateLeftSwipedHashtagRefs({ ids: leftSwipedHashtagRefs.map((hashtag) => hashtag._id) });
                                    }}
                                    rightSwipeHandler={async () => {
                                        const rightSwipedHashtagRefs: any[] = [surveyState.currentHashtag].concat(surveyState.rightSwipedHashtagRefs);

                                        // State update
                                        updateSurveyState((prev) => {
                                            prev.rightSwipedHashtagRefs = rightSwipedHashtagRefs;
                                        });

                                        // API Update call
                                        await updateRightSwipedHashtagRefs({ ids: rightSwipedHashtagRefs.map((hashtag) => hashtag._id) });
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(Play);
