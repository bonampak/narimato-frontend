import React from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";

import { withAuth } from "../../utils";
import { NavigationBar } from "../../components";
import { hashtagCreate, hashtagGetAllTitles } from "../../http";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const NewHashtag: NextPage = () => {
    const [base64Image, setBase64Image] = React.useState<null | string>(null);

    const [hashtags, setHashtags] = React.useState<any[]>([]);

    const { isLoading: isLoadingHashtagTitles } = useQuery(["hashtags", "titles"], hashtagGetAllTitles, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtags(data);
        }
    });

    const { isLoading, mutate } = useMutation(hashtagCreate, {
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
                    <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">New Hashtag</section>

                    <div className="w-full max-w-lg">
                        <form className="my-5 space-y-3" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="title" className="label">
                                    <span className="label-text text-base">Title</span>
                                </label>
                                <input type="text" name="title" className="input input-bordered rounded focus:border-primary-300 w-full" required />
                            </div>

                            <div>
                                <label htmlFor="description" className="label">
                                    <span className="label-text text-base">Description</span>
                                </label>
                                <textarea name="description" className="textarea textarea-bordered rounded focus:border-primary-300 w-full" />
                            </div>

                            <div>
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
                            </div>

                            <div>
                                <label htmlFor="bgColor" className="label">
                                    <span className="label-text text-base">Background Color</span>
                                </label>
                                <input type="color" name="bgColor" className="input input-bordered rounded focus:border-primary-300 w-full" />
                            </div>

                            <div>
                                <label htmlFor="parentHashtagRef" className="label">
                                    <span className="label-text text-base">Parent Hashtags (If Any)</span>
                                </label>
                                <Select instanceId="hashtags" name="parentHashtagRef" options={hashtags ? hashtags.map((hashtag) => ({ value: hashtag._id, label: hashtag.title })) : []} isLoading={isLoadingHashtagTitles} classNamePrefix="react-select" isClearable />
                            </div>

                            <button type="submit" disabled={isLoading} className={["btn rounded bg-blue-600 hover:bg-blue-700 text-white w-full no-animation", isLoading && "loading"].join(" ")}>
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withAuth(NewHashtag);
