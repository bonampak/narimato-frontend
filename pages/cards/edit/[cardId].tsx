import React from "react";
import Head from "next/head";
import Image from "next/image";
import Select from "react-select";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { NextRouter, useRouter } from "next/router";

import { withAuth, uploadImage } from "../../../utils";
import { LoadingComponent, NavigationBarComponent } from "../../../components";
import { cardGetAllHashtags, cardGetOne, cardUpdate } from "../../../api";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const UpdateCard: NextPage = () => {
    const router: NextRouter = useRouter();

    const { cardId } = router.query;
    const [card, setCard] = React.useState<null | any>(null);

    const [imageUrl, setImageUrl] = React.useState<null | string>(null);
    const [previewImage, setPreviewImage] = React.useState<null | any>(null);

    const [hashtags, setHashtags] = React.useState<any[]>([]);
    const [selectedHashtags, setSelectedHashtags] = React.useState<any[]>([]);

    const { isLoading: isLoadingCard } = useQuery(["card", cardId], () => cardGetOne(cardId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setImageUrl(data.imageUrl);
            setSelectedHashtags(data.hashtags.map((hashtag: any) => hashtag._id));
            setCard(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message, {
                onClose: () => router.push("/dashboard")
            });
        },
        enabled: !!cardId
    });

    const { isLoading: isLoadingHashtag } = useQuery("hashtags", cardGetAllHashtags, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtags(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    const { isLoading: isUpdatingCard, mutate: updateCard } = useMutation((context) => cardUpdate(cardId as string, context), {
        onSuccess: (response: AxiosResponse) => {
            const { message } = response.data;
            toast.success(message);
            router.push(`/cards/manage`);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataToJSON: any = Object.fromEntries(formData);

        formDataToJSON["imageUrl"] = imageUrl;
        formDataToJSON["hashtags"] = selectedHashtags.map((hashtag) => hashtag.value || hashtag);

        updateCard(formDataToJSON);
    };

    return (
        <>
            <Head>
                <title>Update Card - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoadingCard || isLoadingHashtag || (!card && <LoadingComponent />)}

                    {!isLoadingCard && !isLoadingHashtag && card && (
                        <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">Update Card - {card.title}</section>

                            <div className="flex flex-col items-center justify-center">
                                <div className="mt-2 md:py-10 max-w-lg">
                                    <form onSubmit={handleSubmit}>
                                        <label htmlFor="upload-button">
                                            <div className="flex justify-center relative">
                                                <Image src={previewImage || imageUrl} width={500} height={500} alt="card-image" />
                                                {!previewImage && <div className="absolute w-full py-2.5 bottom-1/3 bg-blue-600 text-white text-xs text-center leading-4">Click here upload</div>}
                                            </div>
                                        </label>
                                        <input
                                            type="file"
                                            id="upload-button"
                                            style={{ display: "none" }}
                                            onChange={async (e: any) => {
                                                // Set the Preview Image
                                                const file = e.target.files[0];
                                                const reader = new FileReader();
                                                reader.onload = (e: any) => setPreviewImage(e.target.result);
                                                reader.readAsDataURL(file);

                                                const uploadImg = await uploadImage(file);
                                                if (uploadImg.success) setImageUrl(uploadImg.url);

                                                if (!uploadImg.success) {
                                                    toast.error("Image Upload Failed. Please try again.");
                                                    setPreviewImage(null);
                                                }
                                            }}
                                        />

                                        <div className="mt-4 mb-8">
                                            <h1 className="md:text-3xl text-center">Choose Card Logo</h1>

                                            <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Card Name</h1>
                                            <input name="title" defaultValue={card.title} type="text" className="border-black border-2 my-2 w-full p-2" required />

                                            <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Hashtags (Parent Cards)</h1>
                                            <Select
                                                isMulti
                                                className="border-black border-2 my-2 w-full"
                                                options={hashtags.map((hashtag: any) => {
                                                    return { value: hashtag._id, label: hashtag.title };
                                                })}
                                                defaultValue={card.hashtags.map((hashtag: any) => ({ value: hashtag._id, label: hashtag.title }))}
                                                onChange={(selectedHashtags: any) => setSelectedHashtags(selectedHashtags)}
                                            />

                                            <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Is Parent Card?</h1>
                                            <Select
                                                name="isParent"
                                                className="border-black border-2 my-2 w-full"
                                                defaultValue={{ value: Boolean(card.isParent), label: card.isParent ? "Yes" : "No" }}
                                                options={[
                                                    { value: true, label: "Yes" },
                                                    { value: false, label: "No" }
                                                ]}
                                            />

                                            <div className="flex justify-center mt-8">
                                                <button
                                                    disabled={isUpdatingCard}
                                                    type="submit"
                                                    className={["bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg p-2 mt-8 w-full", isUpdatingCard ? "opacity-50" : "opacity-100"].join(" ")}
                                                >
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(UpdateCard);
