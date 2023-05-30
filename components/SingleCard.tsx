import React from "react";
import { Textfit } from "react-textfit";
import { useKeyPressEvent } from "react-use";
import SwipeableCard from "react-tinder-card";

interface SingleCardProp {
    card: {
        _id: string;
        title: string;
        description?: string;
        imageUrl?: string;
        bgColor?: string;
        hashtagRefs: Array<any>;
    };
    showTitle?: boolean;
    showButtons?: boolean;
    showHashtags?: boolean;
    activeControls?: boolean;

    leftSwipeHandler?: () => void;
    rightSwipeHandler?: () => void;
}

const SingleCard = ({ card, showTitle, showButtons, showHashtags, activeControls, leftSwipeHandler, rightSwipeHandler }: SingleCardProp) => {
    const handleNo = () => {
        if (!activeControls) return;
        leftSwipeHandler!();
    };

    const handleYes = () => {
        if (!activeControls) return;
        rightSwipeHandler!();
    };

    // Key Press Event Handlers
    useKeyPressEvent("ArrowRight", () => handleYes());
    useKeyPressEvent("ArrowLeft", () => handleNo());

    // Swipe Event Handlers
    const handleSwipe = (direction: string) => {
        if (direction === "right") return handleYes();
        if (direction === "left") return handleNo();
    };

    return (
        <div className="w-full flex flex-wrap md:flex-nowrap flex-row justify-around items-center gap-5 my-5">
            {showButtons && (
                <button className="flex justify-center md:w-1/4" onClick={() => handleNo()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </button>
            )}

            <div className="flex flex-col justify-center items-center max-w-xl -order-1 md:order-none w-full md:w-2/4 gap-3">
                {card.imageUrl ? (
                    // For Image
                    <SwipeableCard onSwipe={handleSwipe} preventSwipe={["up", "down", ...(!activeControls ? ["left", "right"] : [])]} flickOnSwipe={false}>
                        <div className="h-full w-full aspect-square min-w-[20rem] min-h-[20rem]">
                            <img src={card.imageUrl} alt="card-image" className="w-full h-full object-contain" />
                        </div>
                    </SwipeableCard>
                ) : (
                    // For Text
                    <SwipeableCard onSwipe={handleSwipe} preventSwipe={["up", "down", ...(!activeControls ? ["left", "right"] : [])]} flickOnSwipe={false}>
                        <div className="h-full w-full min-w-[20rem] min-h-[20rem] aspect-square bg-black" style={{ backgroundColor: card.bgColor && card.bgColor }}>
                            <Textfit mode="multi" style={{ height: "100%", width: "100%" }} className="m-auto text-center text-white leading-normal p-5">
                                {card.description}
                            </Textfit>
                        </div>
                    </SwipeableCard>
                )}

                {showTitle && <h2 className="text-center text-3xl font-bold">{card.title}</h2>}

                {showHashtags && (
                    <div className="flex justify-center flex-nowrap md:flex-wrap w-full overflow-x-scroll gap-5">
                        {card.hashtagRefs.map((hashtag, index) => (
                            <span key={index} className="w-max bg-blue-600 rounded p-2 text-white text-sm font-medium">
                                #{hashtag.title}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {showButtons && (
                <button className="flex justify-center md:w-1/4" onClick={() => handleYes()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SingleCard;
