import React from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import TinderCard from "react-tinder-card";
import { useKeyPressEvent } from "react-use";

import { LoadingImagePlacepholder } from "../../assets";
import { CardYesButton, CardNoButton, LoadingComponent } from "../../components";
import { surveyAddLeftSwipedHashtag, surveyAddRightSwipedHashtag, surveyNewHashtag } from "../../api";

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

    const { mutateAsync: addNewHashtag } = useMutation(surveyNewHashtag, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtag(data);
        },
        onError: (error: AxiosError) => {
            setPlayState({ isLoading: true, surveyMode: "swipe", finalHashTagSwipeMode: true });
        }
    });

    const { mutateAsync: addRightSwipedHashtag } = useMutation((context: any) => surveyAddRightSwipedHashtag(playState.surveyId as string, context), {
        onSuccess: (response: AxiosResponse) => {
            setPlayState({ isLoading: true, surveyMode: "swipe" });
        },
        onError: (error: AxiosError) => {
            toast.error("Something went wrong, please try again.");
        }
    });

    const { mutateAsync: addLeftSwipedHashtag } = useMutation((context: any) => surveyAddLeftSwipedHashtag(playState.surveyId as string, context), {
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
            await addNewHashtag(playState.surveyId);

            // Stop Loading
            setIsLoading(false);
        }
    }, [hashtag]);

    React.useEffect(() => {
        // All hashtags played flag detected
        if (playState.finalHashTagSwipeMode === true) {
            // Update Loading State
            setPlayState({ isLoading: true });

            // Take a while before redirecting to survey-result (result)
            toast.success("Generating result...", {
                onClose: () => router.push(`/surveys/${playState.surveyId}`),
                autoClose: 1500
            });
        }
    }, []);

    return (
        <>
            {isLoading && <LoadingComponent />}

            {!isLoading && hashtag && (
                <div className="p-4 portrait:mt-2 portrait:mb-5">
                    <div className="landscape:grid landscape:grid-cols-4">
                        <div className="hidden landscape:flex justify-center my-auto">{setPlayState && <CardNoButton onClickHandler={() => handleHashtagClick(false)} />}</div>

                        <div className={setPlayState ? "landscape:col-span-2" : "landscape:col-span-full"}>
                            <TinderCard ref={tinderCardRef} onSwipe={handleSwipe} preventSwipe={["up", "down", setPlayState ? "" : "right", setPlayState ? "" : "left"]}>
                                {hashtag.imageUrl ? (
                                    <div className="flex justify-center">
                                        <img
                                            src={hashtag.imageUrl}
                                            alt={hashtag.title}
                                            className={["w-full portrait:md:w-1/3 aspect-square", !setPlayState && "landscape:w-1/3 portrait:md:w-1/2"].join(" ")}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={["flex mx-auto w-full portrait:md:w-1/3 aspect-square p-5 bg-blue-600 overflow-y-auto", !setPlayState && "landscape:w-1/3 portrait:md:w-1/2"].join(
                                            " "
                                        )}
                                    >
                                        <p className="m-auto text-center text-white">{hashtag.description}</p>
                                    </div>
                                )}

                                <div className="mt-4 potrait:mb-8 landscape:w-full">
                                    <h1 className="font-bold md:max-w-sm text-4xl mx-auto text-center">{hashtag.title}</h1>

                                    {hashtag.imageUrl && <p className="font-medium md:max-w-sm text-xl mx-auto text-center">{hashtag.description}</p>}

                                    {!setPlayState && (
                                        <p className="text-center my-3">
                                            {hashtag.hashtags.map((hashtag: any) => (
                                                <span key={hashtag._id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                                    #{hashtag.title}
                                                </span>
                                            ))}
                                        </p>
                                    )}
                                </div>
                            </TinderCard>
                        </div>

                        <div className="hidden landscape:flex justify-center my-auto">{setPlayState && <CardYesButton onClickHandler={() => handleHashtagClick(true)} />}</div>

                        <div className="hidden portrait:block">
                            {setPlayState && (
                                <div className="flex justify-center mb-4">
                                    <CardNoButton onClickHandler={() => handleHashtagClick(false)} />
                                    <CardYesButton onClickHandler={() => handleHashtagClick(true)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default HashtagCard;
