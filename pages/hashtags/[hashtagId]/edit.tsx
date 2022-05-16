import React from "react";
import Head from "next/head";
import Image from "next/image";
import Select from "react-select";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { NextRouter, useRouter } from "next/router";

import { withAuth, uploadImage } from "../../../utils";
import { hashtagGetAll, hashtagGetOne, hashtagUpdate } from "../../../api";
import { LoadingComponent, NavigationBarComponent } from "../../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const UpdateHashtag: NextPage = () => {
    const router: NextRouter = useRouter();

    const { hashtagId } = router.query;
    const [hashtag, setHashtag] = React.useState<null | any>(null);

    const [imageUrl, setImageUrl] = React.useState<null | string>(null);
    const [previewImage, setPreviewImage] = React.useState<null | any>(null);

    const [hashtags, setHashtags] = React.useState<any[]>([]);

    const { isLoading: isLoadingHashtag } = useQuery(["hashtag", hashtagId], () => hashtagGetOne(hashtagId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setImageUrl(data.imageUrl);
            setHashtag(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message, {
                onClose: () => router.push("/dashboard")
            });
        },
        enabled: !!hashtagId
    });

    const { isLoading: isLoadingHashtags } = useQuery("hashtags", hashtagGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtags(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    const { isLoading: isUpdatingHashtag, mutate: updateHashtag } = useMutation((context) => hashtagUpdate(hashtagId as string, context), {
        onSuccess: (response: AxiosResponse) => {
            const { message } = response.data;
            toast.success(message);
            router.push(`/hashtags/manage`);
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

        updateHashtag(formDataToJSON);
    };

    return (
        <>
            <Head>
                <title>Update Hashtag - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoadingHashtag || isLoadingHashtags || (!hashtag && <LoadingComponent />)}

                    {!isLoadingHashtag && !isLoadingHashtags && hashtag && (
                        <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">Update Hashtag - {hashtag.title}</section>

                            <div className="flex flex-col md:max-w-xl">
                                <form onSubmit={handleSubmit}>
                                    <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Hashtag Image</h1>
                                    <div>
                                        <input
                                            type="file"
                                            className="border-black border-2 my-2 w-full p-2"
                                            onChange={async (e: any) => {
                                                // Set the Preview Image
                                                const file = e.target.files[0];

                                                if (!file) {
                                                    setPreviewImage(null);
                                                    setImageUrl(null);
                                                    return;
                                                }

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

                                        {previewImage && <img src={previewImage} alt="card-image" className="w-full md:w-1/2 aspect-square" />}

                                        {!previewImage && imageUrl && <img src={imageUrl} alt="card-image" className="w-full md:w-1/2 aspect-square" />}
                                    </div>

                                    <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Hashtag Name</h1>
                                    <input name="title" defaultValue={hashtag.title} type="text" className="border-black border-2 my-2 w-full p-2" required />

                                    <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Hashtag Description</h1>
                                    <input name="description" defaultValue={hashtag.description} type="text" className="border-black border-2 my-2 w-full p-2" />

                                    <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Hashtag BG Color</h1>
                                    <input name="bgColor" type="color" defaultValue={hashtag.bgColor} className="border-black border-2 w-full" />

                                    <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Parent Hashtags (If Any)</h1>
                                    <Select
                                        isClearable
                                        name="parentHashtag"
                                        className="border-black border-2 my-2 w-full"
                                        options={hashtags.map((hashtag: any) => {
                                            return { value: hashtag._id, label: hashtag.title };
                                        })}
                                        defaultValue={{ value: hashtag.parentHashtag?._id, label: hashtag.parentHashtag?.title }}
                                    />

                                    <div className="flex justify-center mt-8">
                                        <button
                                            disabled={isUpdatingHashtag}
                                            type="submit"
                                            className={["bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg p-2 mt-8 w-full", isUpdatingHashtag ? "opacity-50" : "opacity-100"].join(" ")}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(UpdateHashtag);
