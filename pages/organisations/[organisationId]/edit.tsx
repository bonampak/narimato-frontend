import React from "react";
import Head from "next/head";
import Select from "react-select";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { NextRouter, useRouter } from "next/router";

import { withAuth, uploadImage } from "../../../utils";
import { LoadingComponent, NavigationBarComponent } from "../../../components";
import { hashtagGetAllWithParents, organisationGetOne, organisationUpdate } from "../../../api";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const UpdateOrganisation: NextPage = () => {
    const router: NextRouter = useRouter();

    const { organisationId } = router.query;
    const [organisation, setOrganisation] = React.useState<null | any>(null);

    const [logoUrl, setLogoUrl] = React.useState<null | string>(null);
    const [previewImage, setPreviewImage] = React.useState<null | any>(null);

    const [hashtags, setHashtags] = React.useState<any[]>([]);
    const [selectedHashtags, setSelectedHashtags] = React.useState<any[]>([]);

    const { isLoading: isLoadingOrganisation } = useQuery(["organisation", organisationId], () => organisationGetOne(organisationId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setLogoUrl(data.logoUrl);
            setSelectedHashtags(data.hashtags.map((hashtag: any) => hashtag._id));
            setOrganisation(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message, {
                onClose: () => router.push("/dashboard")
            });
        },
        enabled: !!organisationId
    });

    const { isLoading: isLoadingHashtag } = useQuery("hashtags", hashtagGetAllWithParents, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            // setHashtags(data);
            setHashtags(data.filter((hashtag: any) => hashtag.parentHashtag === null));
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    const { isLoading: isUpdatingOrganisation, mutate: updateOrganisation } = useMutation((context) => organisationUpdate(organisationId as string, context), {
        onSuccess: (response: AxiosResponse) => {
            const { message } = response.data;
            toast.success(message);
            router.push(`/organisations/manage`);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataToJSON: any = Object.fromEntries(formData);

        formDataToJSON["logoUrl"] = logoUrl;
        formDataToJSON["hashtags"] = selectedHashtags.map((hashtag) => hashtag.value || hashtag);

        updateOrganisation(formDataToJSON);
    };

    return (
        <>
            <Head>
                <title>Update Organisation - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoadingOrganisation || isLoadingHashtag || (!organisation && <LoadingComponent />)}

                    {!isLoadingOrganisation && !isLoadingHashtag && organisation && (
                        <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">Update Organisation - {organisation.name}</section>

                            <div className="flex flex-col items-center justify-center">
                                <div className="mt-2 md:py-10 max-w-lg">
                                    <form onSubmit={handleSubmit}>
                                        <label htmlFor="upload-button">
                                            <div className="flex justify-center relative">
                                                <img src={previewImage || logoUrl} width={500} height={500} alt="organisation-image" />
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
                                                if (uploadImg.success) setLogoUrl(uploadImg.url);

                                                if (!uploadImg.success) {
                                                    toast.error("Image Upload Failed. Please try again.");
                                                    setPreviewImage(null);
                                                }
                                            }}
                                        />

                                        <div className="mt-4 mb-8">
                                            <h1 className="md:text-3xl text-center">Choose Company Logo</h1>

                                            <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Organisation Name</h1>
                                            <input name="name" defaultValue={organisation.name} type="text" className="border-black border-2 my-2 w-full p-2" required />

                                            <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Organisation Slug Url</h1>
                                            <input
                                                name="slugUrl"
                                                type="text"
                                                defaultValue={organisation.slugUrl}
                                                className="border-black border-2 my-2 w-full p-2"
                                                placeholder="haikoto.com/{slug}"
                                                required
                                            />

                                            <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Hashtags (Parent Cards)</h1>
                                            <Select
                                                isMulti
                                                className="border-black border-2 my-2 w-full"
                                                options={hashtags.map((hashtag: any) => {
                                                    return { value: hashtag._id, label: hashtag.title };
                                                })}
                                                defaultValue={organisation.hashtags.map((hashtag: any) => ({ value: hashtag._id, label: hashtag.title }))}
                                                onChange={(selectedHashtags: any) => setSelectedHashtags(selectedHashtags)}
                                            />

                                            <div className="flex justify-center mt-8">
                                                <button
                                                    disabled={isUpdatingOrganisation}
                                                    type="submit"
                                                    className={[
                                                        "bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg p-2 mt-8 w-full",
                                                        isUpdatingOrganisation ? "opacity-50" : "opacity-100"
                                                    ].join(" ")}
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

export default withAuth(UpdateOrganisation);
