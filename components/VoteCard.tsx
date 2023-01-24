import React from "react";
import { useImmer } from "use-immer";
import { Textfit } from "react-textfit";
import { useKeyPressEvent } from "react-use";

import { arrayMethods } from "../utils";

interface VoteCardProp {
    showTitle?: boolean;
    surveyState: any;
    updateSurveyState: any;
    updateRightSwipedCardRefs: any;
}

const VoteCard = ({ showTitle, surveyState, updateSurveyState, updateRightSwipedCardRefs }: VoteCardProp) => {
    const [voteState, updateVoteState] = useImmer<{
        currentCard: any;
        randomVoteIndex: number;
        rightSwipedCardRefsFilteredByHashtag: any;
    }>({
        currentCard: surveyState.currentCard,
        randomVoteIndex: arrayMethods.getRandomIndex(surveyState.rightSwipedCardRefs.slice(1)),
        rightSwipedCardRefsFilteredByHashtag: surveyState.rightSwipedCardRefs.slice(1)
    });

    // Key Press Event Handlers
    useKeyPressEvent("ArrowRight", () => handleClick(voteState.currentCard._id));
    useKeyPressEvent("ArrowLeft", () => handleClick(voteState.rightSwipedCardRefsFilteredByHashtag[voteState.randomVoteIndex]._id));

    const handleClick = async (cardId: string) => {
        // If picked cardId is currentCard, set tempStore to upper half of randomVoteIndex in rightSwipedCardRefsFilteredByHashtag
        let tempStore: any;
        if (cardId === voteState.currentCard._id) {
            tempStore = voteState.rightSwipedCardRefsFilteredByHashtag.slice(0, voteState.randomVoteIndex);
        }

        // If picked cardId is not currentCard, set tempStore to lower half of randomVoteIndex in rightSwipedCardRefsFilteredByHashtag
        if (cardId !== voteState.currentCard._id) {
            tempStore = voteState.rightSwipedCardRefsFilteredByHashtag.slice(voteState.randomVoteIndex + 1);
        }

        // Terminate the vote and update order, if there's no more upper or lower half
        if (tempStore.length <= 0) {
            let newlyGeneratedRightSwipedCards: any;

            const voteRandomIndexCardInRightSwipedCards = surveyState.rightSwipedCardRefs.slice(1).findIndex((card: any) => card._id === voteState.rightSwipedCardRefsFilteredByHashtag[voteState.randomVoteIndex]._id);

            if (cardId === voteState.currentCard._id) {
                // Insert voteState.currentCard before the index of voteRandomIndex
                newlyGeneratedRightSwipedCards = arrayMethods.insertItem(surveyState.rightSwipedCardRefs.slice(1), voteRandomIndexCardInRightSwipedCards, voteState.currentCard);
            } else {
                // Insert voteState.currentCard after the index of voteRandomIndex
                newlyGeneratedRightSwipedCards = arrayMethods.insertItem(surveyState.rightSwipedCardRefs.slice(1), voteRandomIndexCardInRightSwipedCards + 1, voteState.currentCard);
            }

            // API Update call
            await updateRightSwipedCardRefs({ ids: newlyGeneratedRightSwipedCards.map((card: any) => card._id) });

            // Update the surveyState
            updateSurveyState((prev: any) => {
                prev.currentMode = "card";
                prev.rightSwipedCardRefs = newlyGeneratedRightSwipedCards;
            });
            return;
        }

        // Update the voteState
        updateVoteState((prev) => {
            prev.rightSwipedCardRefsFilteredByHashtag = tempStore;
            prev.randomVoteIndex = arrayMethods.getRandomIndex(tempStore);
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col justify-center items-center max-w-lg w-full gap-3 mx-auto cursor-pointer" onClick={() => handleClick(voteState.currentCard._id)}>
                {voteState.currentCard.imageUrl ? (
                    // For Image
                    <div className="h-full w-full aspect-square max-w-[15rem] max-h-[15rem] md:max-w-full md:max-h-full">
                        <img src={voteState.currentCard.imageUrl} alt="card-image" className="w-full h-full object-contain" />
                    </div>
                ) : (
                    // For Text
                    <div className="h-full w-full aspect-square max-w-[15rem] max-h-[15rem] md:max-w-full md:max-h-full bg-black" style={{ backgroundColor: voteState.currentCard.bgColor && voteState.currentCard.bgColor }}>
                        <Textfit mode="multi" style={{ height: "100%" }} className="m-auto text-center text-white leading-normal p-5">
                            {voteState.currentCard.description}
                        </Textfit>
                    </div>
                )}

                {showTitle && <h2 className="text-center text-3xl font-bold">{voteState.currentCard.title}</h2>}
            </div>

            <div className="flex flex-col justify-center items-center max-w-lg w-full gap-3 mx-auto cursor-pointer" onClick={() => handleClick(voteState.rightSwipedCardRefsFilteredByHashtag[voteState.randomVoteIndex]._id)}>
                {voteState.rightSwipedCardRefsFilteredByHashtag[voteState.randomVoteIndex].imageUrl ? (
                    // For Image
                    <div className="h-full w-full aspect-square max-w-[15rem] max-h-[15rem] md:max-w-full md:max-h-full">
                        <img src={voteState.rightSwipedCardRefsFilteredByHashtag[voteState.randomVoteIndex].imageUrl} alt="card-image" className="w-full h-full object-contain" />
                    </div>
                ) : (
                    // For Text
                    <div className="h-full w-full aspect-square max-w-[15rem] max-h-[15rem] md:max-w-full md:max-h-full bg-black" style={{ backgroundColor: voteState.rightSwipedCardRefsFilteredByHashtag[voteState.randomVoteIndex].bgColor && voteState.rightSwipedCardRefsFilteredByHashtag[voteState.randomVoteIndex].bgColor }}>
                        <Textfit mode="multi" style={{ height: "100%" }} className="m-auto text-center text-white leading-normal p-5">
                            {voteState.rightSwipedCardRefsFilteredByHashtag[voteState.randomVoteIndex].description}
                        </Textfit>
                    </div>
                )}

                {showTitle && <h2 className="text-center text-3xl font-bold">{voteState.rightSwipedCardRefsFilteredByHashtag[voteState.randomVoteIndex].title}</h2>}
            </div>
        </div>
    );
};

export default VoteCard;
