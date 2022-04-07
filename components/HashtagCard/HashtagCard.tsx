import React from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import TinderCard from "react-tinder-card";
import { useKeyPressEvent } from "react-use";

import { LoadingImagePlacepholder } from "../../assets";
import { CardYesButton, CardNoButton, LoadingComponent } from "../../components";
import { gameAddLeftSwipedHashtag, gameAddRightSwipedHashtag, gameNewHashtag } from "../../api";

import type { AxiosResponse, AxiosError } from "axios";

type HashtagCardProps = {
    playState: any;
    setPlayState: any;
};

function HashtagCard({ playState, setPlayState }: HashtagCardProps) {
    const router = useRouter();
    const tinderCardRef = React.createRef<any>();

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [hashtag, setHashtag] = React.useState<null | any>(null);

    const { mutateAsync: addNewHashtag } = useMutation(gameNewHashtag, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtag(data);
        },
        onError: (error: AxiosError) => {
            setPlayState({ isLoading: true, gameMode: "swipe", finalHashTagSwipeMode: true });
        }
    });

    const { mutateAsync: addRightSwipedHashtag } = useMutation((context: any) => gameAddRightSwipedHashtag(playState.gameId as string, context), {
        onSuccess: (response: AxiosResponse) => {
            setPlayState({ isLoading: true, gameMode: "swipe" });
        },
        onError: (error: AxiosError) => {
            toast.error("Something went wrong, please try again.");
        }
    });

    const { mutateAsync: addLeftSwipedHashtag } = useMutation((context: any) => gameAddLeftSwipedHashtag(playState.gameId as string, context), {
        onSuccess: (response: AxiosResponse) => {
            setHashtag(null);
        },
        onError: (error: AxiosError) => {
            toast.error("Something went wrong, please try again.");
        }
    });

    // Key Press Event Handlers
    useKeyPressEvent("ArrowRight", () => tinderCardRef.current.swipe("right"));
    useKeyPressEvent("ArrowLeft", () => tinderCardRef.current.swipe("left"));

    // Swipe Event Handlers
    const handleSwipe = (direction: string) => {
        if (!setPlayState || isLoading) return;
        if (direction === "right") handleHashtagClick(true);
        if (direction === "left") handleHashtagClick(false);
    };

    const handleHashtagClick = async (answer: boolean) => {
        // If loading something, don't do anything
        if (isLoading) return;

        // Start Loading
        setIsLoading(true);

        // Based on answer, add to right or left
        if (answer) await addRightSwipedHashtag({ hashtagId: hashtag._id });
        if (!answer) await addLeftSwipedHashtag({ hashtagId: hashtag._id });

        // Stop Loading
        setIsLoading(false);
    };

    // @ts-ignore
    React.useEffect(async () => {
        // Generate a new hashtag if one doesn't exist and the finalHashtagSwipe mode is not set
        if (!hashtag && !playState.finalHashTagSwipeMode) {
            await addNewHashtag(playState.gameId);

            // Stop Loading
            setIsLoading(false);
        }
    }, [hashtag]);

    React.useEffect(() => {
        // All hashtags played flag detected
        if (playState.finalHashTagSwipeMode === true) {
            // Update Loading State
            setPlayState({ isLoading: true });

            // Take a while before redirecting to about-me (result)
            toast.success("Generating result...", {
                onClose: () => router.push(`/dashboard/about-me`),
                autoClose: 1500
            });
        }
    }, []);

    return (
        <>
            {isLoading && <LoadingComponent />}

            {!isLoading && hashtag && (
                <>
                    {/* Potrait */}
                    <div className="mt-2 mb-5 p-4 hidden portrait:block">
                        <TinderCard ref={tinderCardRef} onSwipe={handleSwipe} preventSwipe={["up", "down", setPlayState ? "" : "right", setPlayState ? "" : "left"]}>
                            <div className="h-52 w-52 lg:h-96 lg:w-96 relative mx-auto">
                                <Image src={hashtag.imageUrl} alt="hashtag-image" layout="fill" objectFit="cover" placeholder="blur" blurDataURL={LoadingImagePlacepholder} />
                            </div>

                            <div className="mt-4 mb-8">
                                <h1 className="font-bold md:max-w-xs text-[5vh] mx-auto text-center">{hashtag.title}</h1>
                                <p className="font-bold md:max-w-xs text-[2vh] mx-auto text-center">{hashtag.description}</p>
                            </div>
                        </TinderCard>

                        {setPlayState && (
                            <div className="flex justify-center mb-4">
                                <CardNoButton onClickHandler={() => handleHashtagClick(false)} />
                                <CardYesButton onClickHandler={() => handleHashtagClick(true)} />
                            </div>
                        )}
                    </div>

                    {/* Landscape View */}
                    <div className="p-4 hidden landscape:block">
                        <div className="grid grid-cols-4">
                            {setPlayState && (
                                <div className="flex justify-center my-auto">
                                    <CardNoButton onClickHandler={() => handleHashtagClick(false)} />
                                </div>
                            )}
                            <div className={setPlayState ? "col-span-2" : "col-span-full"}>
                                <TinderCard ref={tinderCardRef} onSwipe={handleSwipe} preventSwipe={["up", "down", setPlayState ? "" : "right", setPlayState ? "" : "left"]}>
                                    <div className="h-52 w-52 lg:h-96 lg:w-96 relative mx-auto">
                                        <Image src={hashtag.imageUrl} layout="fill" objectFit="cover" placeholder="blur" blurDataURL={LoadingImagePlacepholder} alt="hashtag" />
                                    </div>

                                    <div className="mt-4 w-full">
                                        <h1 className="font-bold md:max-w-xs text-[5vh] mx-auto text-center">{hashtag.title}</h1>
                                        <p className="font-bold md:max-w-xs text-[2vh] mx-auto text-center">{hashtag.description}</p>
                                    </div>
                                </TinderCard>
                            </div>
                            {setPlayState && (
                                <div className="flex justify-center my-auto">
                                    <CardYesButton onClickHandler={() => handleHashtagClick(true)} />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default HashtagCard;
