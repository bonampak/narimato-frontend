/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import TinderCard from "react-tinder-card";
import { useKeyPressEvent } from "react-use";

import { LoadingImagePlacepholder } from "../../assets";
import { CardYesButton, CardNoButton, LoadingComponent } from "../../components";
import { gameAddRightSwipedCard, gameAddLeftSwipedCard, gameNewCard } from "../../api";

import type { AxiosResponse, AxiosError } from "axios";

type SingleCardProps = {
    card: any;
    playState?: any;
    setPlayState?: any;
};

function SingleCard({ card, playState, setPlayState }: SingleCardProps) {
    const cardId = card._id;
    const tinderCardRef = React.createRef<any>();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { mutateAsync: addRightSwipedCard } = useMutation((context: any) => gameAddRightSwipedCard(playState.gameId as string, context), {
        onSuccess: (response: AxiosResponse) => {
            // Get the Card Data
            const card = playState.allCards.find((card: any) => card._id === cardId);

            // If answer is true add to rightSwipedCards bucket
            playState.rightSwipedCards.unshift(card);
            setPlayState({ rightSwipedCards: playState.rightSwipedCards });
        },
        onError: (error: AxiosError) => {
            toast.error("Something went wrong, please try again.");
        }
    });

    const { mutateAsync: addLeftSwipedCard } = useMutation((context: any) => gameAddLeftSwipedCard(playState.gameId as string, context), {
        onSuccess: (response: AxiosResponse) => {
            // Get the Card Data
            const card = playState.allCards.find((card: any) => card._id === cardId);

            // If answer is false add to leftSwipedCards bucket
            playState.leftSwipedCards.unshift(card);
            setPlayState({ leftSwipedCards: playState.leftSwipedCards });
        },
        onError: (error: AxiosError) => {
            toast.error("Something went wrong, please try again.");
        }
    });

    const handleAnswerClick = async (answer: boolean) => {
        // If loading something, don't do anything
        if (isLoading) return;

        // Start Loading
        setIsLoading(true);

        // Add new Yes Card to DB
        if (answer) await addRightSwipedCard({ cardId });

        // Add new No Card to DB
        if (!answer) await addLeftSwipedCard({ cardId });

        // If the answer is true and number of cards in rightSwipedCards bucket is greater than 2
        if (answer && playState.rightSwipedCards.length >= 2) {
            // Enter Vote mode to rank rightSwipedCards
            setPlayState({ isLoading: true, gameMode: "vote" });
            return;
        }

        // Get new Card based on yes/leftSwiped Cards from the Database / Check if the game is over
        try {
            // Get a new card
            const { data: newCard } = await gameNewCard(playState.gameId as string);

            if (newCard.success) {
                // Add the new Cards to the allCards bucket
                // Update the current Card Number +1 and continue game
                setPlayState({
                    allCards: [...playState.allCards, newCard.data],
                    currentCard: playState.currentCard + 1
                });
            }
        } catch (error: any) {
            // Not In Production
            console.log(error.response ? error.response.data.message : error.message);

            // Last Card Vote
            if (playState.allCards.length === playState.currentCard && playState.rightSwipedCards.length >= 2 && answer) {
                // If the current Card is equal to number of Cards and answer is true
                // Enter Vote mode to rank rightSwipedCards
                setPlayState({ isLoading: true, gameMode: "vote" });
                return;
            }

            // Out of Cards for the Card, Enter hashTagSwipeMode
            setPlayState({ isLoading: true, gameMode: "hashtag" });
            return;
        }

        // Close the loading screen, api calls would be done now
        setIsLoading(false);
    };

    if (setPlayState) {
        // Key Press Event Handlers
        useKeyPressEvent("ArrowRight", () => tinderCardRef.current.swipe("right"));
        useKeyPressEvent("ArrowLeft", () => tinderCardRef.current.swipe("left"));
    }

    // Swipe Event Handlers
    const handleSwipe = (direction: string) => {
        if (!setPlayState) return;

        if (direction === "right") handleAnswerClick(true);
        if (direction === "left") handleAnswerClick(false);
    };

    return (
        <>
            {isLoading ? <LoadingComponent /> : null}

            {!isLoading && (
                <>
                    {/* Potrait View */}
                    <div className="mt-2 mb-5 p-4 hidden portrait:block">
                        <TinderCard ref={tinderCardRef} onSwipe={handleSwipe} preventSwipe={["up", "down", setPlayState ? "" : "right", setPlayState ? "" : "left"]}>
                            <div className="h-52 w-52 lg:h-80 lg:w-80 relative mx-auto">
                                <Image src={card.imageUrl} layout="fill" objectFit="cover" placeholder="blur" blurDataURL={LoadingImagePlacepholder} alt={card.title} />
                            </div>

                            <div className="mt-4 mb-8">
                                <h1 className="font-bold md:max-w-xs text-[4vh] mx-auto text-center">{card.title}</h1>
                                <p className="font-bold md:max-w-xs text-[2vh] mx-auto text-center">{card.description}</p>
                                {!setPlayState && (
                                    <p className="text-center text-[4vh]">
                                        {card.hashtags.map((hashtag: any) => (
                                            <span key={hashtag._id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                                #{hashtag.title}
                                            </span>
                                        ))}
                                    </p>
                                )}
                            </div>
                        </TinderCard>

                        {setPlayState && (
                            <div className="flex justify-center mb-4">
                                <CardNoButton onClickHandler={() => handleAnswerClick(false)} />
                                <CardYesButton onClickHandler={() => handleAnswerClick(true)} />
                            </div>
                        )}
                    </div>

                    {/* Landscape View */}
                    <div className="p-4 hidden landscape:block">
                        <div className="grid grid-cols-4">
                            {setPlayState && (
                                <div className="flex justify-center my-auto">
                                    <CardNoButton onClickHandler={() => handleAnswerClick(false)} />
                                </div>
                            )}
                            <div className={setPlayState ? "col-span-2" : "col-span-full"}>
                                <TinderCard ref={tinderCardRef} onSwipe={handleSwipe} preventSwipe={["up", "down", setPlayState ? "" : "right", setPlayState ? "" : "left"]}>
                                    <div className="h-52 w-52 lg:h-80 lg:w-80 relative mx-auto">
                                        <Image src={card.imageUrl} layout="fill" objectFit="cover" placeholder="blur" blurDataURL={LoadingImagePlacepholder} alt={card.title} />
                                    </div>

                                    <div className="mt-4 w-full">
                                        <h1 className="font-bold md:max-w-xs text-[4vh] mx-auto text-center">{card.title}</h1>
                                        <p className="font-bold md:max-w-xs text-[2vh] mx-auto text-center">{card.description}</p>
                                        {!setPlayState && (
                                            <p className="text-center text-[4vh]">
                                                {card.hashtags.map((hashtag: any) => (
                                                    <span key={hashtag._id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                                        #{hashtag.title}
                                                    </span>
                                                ))}
                                            </p>
                                        )}
                                    </div>
                                </TinderCard>
                            </div>

                            {setPlayState && (
                                <div className="flex justify-center my-auto">
                                    <CardYesButton onClickHandler={() => handleAnswerClick(true)} />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default SingleCard;
