import React from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";

import { withAuth } from "../../../utils";
import { Loading, NavigationBar } from "../../../components";
import { hashtagGetOne, hashtagUpdate, hashtagGetAllTitles } from "../../../http";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const EditHashtag: NextPage = ({ query }: any) => {
    const router: NextRouter = useRouter();
    const { hashtagId } = query;

    const [hashtag, setHashtag] = React.useState<null | any>(null);

    const [hashtags, setHashtags] = React.useState<any[]>([]);
    const [base64Image, setBase64Image] = React.useState<null | string>(null);

    const {} = useQuery(["hashtag", hashtagId], () => hashtagGetOne(hashtagId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtag(data);
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: !!hashtagId
    });

    const { isLoading: isLoadingHashtagTitles } = useQuery(["hashtags", "titles"], hashtagGetAllTitles, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtags(data);
        }
    });

    const { isLoading, mutate } = useMutation((context: any) => hashtagUpdate(hashtagId as string, context), {
        onSuccess: (response: AxiosResponse) => {
            toast.success(response.data.message);
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataToJSON: any = Object.fromEntries(formData);

        // Append Image
        if (base64Image) Object.assign(formDataToJSON, { base64: base64Image.split(",")[1] });

        if (formDataToJSON.parentHashtagRef === "") formDataToJSON["parentHashtagRef"] = null;

        mutate(formDataToJSON);
    };

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!hashtag && <Loading isParent={false} />}

                    {hashtag && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Edit Hashtag</section>

                            <div className="w-full max-w-lg">
                                <form className="my-5 space-y-3" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="title" className="label">
                                            <span className="label-text text-base">Title</span>
                                        </label>
                                        <input type="text" defaultValue={hashtag.title} name="title" className="input input-bordered rounded focus:border-primary-300 w-full" required />
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="label">
                                            <span className="label-text text-base">Description</span>
                                        </label>
                                        <textarea defaultValue={hashtag.description} name="description" className="textarea textarea-bordered rounded focus:border-primary-300 w-full" />
                                    </div>

                                    {/* Image update disabled for now */}
                                    {/* <div>
                                        <label htmlFor="imageUrl" className="label">
                                            <span className="label-text text-base">Image</span>
                                        </label>
                                        <input
                                            type="file"
                                            className="file-input file-input-bordered rounded focus:border-primary-300 w-full"
                                            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                                setBase64Image(null);
                                                const file = e.target.files![0];

                                                // If no file was uploaded return
                                                if (!file) return;

                                                // check file size
                                                if (file.size / 1024 / 1024 > 5) return window.alert("file is too large: > 5mb");

                                                // convert to base64
                                                const reader = new FileReader();
                                                reader.onloadend = () => setBase64Image(reader.result as string);
                                                reader.readAsDataURL(file);
                                            }}
                                        />
                                        {base64Image && <img src={base64Image} alt="preEdit-image" className="w-full object-contain py-2" />}
                                    </div> */}

                                    <div>
                                        <label htmlFor="bgColor" className="label">
                                            <span className="label-text text-base">Background Color</span>
                                        </label>
                                        <input type="color" defaultValue={hashtag.bgColor} name="bgColor" className="input input-bordered rounded focus:border-primary-300 w-full" />
                                    </div>

                                    <div>
                                        <label htmlFor="parentHashtagRef" className="label">
                                            <span className="label-text text-base">Parent Hashtags (If Any)</span>
                                        </label>
                                        <Select instanceId="hashtags" defaultValue={hashtag.parentHashtagRef ? { label: hashtag.parentHashtagRef.title, value: hashtag.parentHashtagRef._id } : {}} name="parentHashtagRef" options={hashtags ? hashtags.map((hashtag) => ({ value: hashtag._id, label: hashtag.title })) : []} isLoading={isLoadingHashtagTitles} classNamePrefix="react-select" isClearable />
                                    </div>

                                    <button type="submit" disabled={isLoading} className={["btn rounded bg-red-600 hover:bg-red-700 text-white w-full no-animation", isLoading && "loading"].join(" ")}>
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(EditHashtag);
