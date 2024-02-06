import React from "react";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";

import { withAuth } from "../../../utils";
import { Loading, NavigationBar } from "../../../components";
import { organisationGetOne, organisationUpdate } from "../../../http";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const EditOrganisation: NextPage = ({ query }: any) => {
    const router: NextRouter = useRouter();
    const { organisationId } = query;

    const [organisation, setOrganisation] = React.useState<null | any>(null);
    const [base64Image, setBase64Image] = React.useState<null | string>(null);

    const {} = useQuery(["organisation", organisationId], () => organisationGetOne(organisationId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setOrganisation(data);
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: !!organisationId
    });

    const { isLoading, mutate } = useMutation((context: any) => organisationUpdate(organisationId as string, context), {
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
        const formDataToJSON = Object.fromEntries(formData);

        // Append Image
        if (base64Image) Object.assign(formDataToJSON, { base64: base64Image.split(",")[1] });

        mutate(formDataToJSON);
    };

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!organisation && <Loading isParent={false} />}

                    {organisation && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">New Organisation</section>

                            <div className="w-full max-w-lg">
                                <form className="my-5 space-y-3" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="name" className="label">
                                            <span className="label-text text-base">Name</span>
                                        </label>
                                        <input type="text" defaultValue={organisation.name} name="name" className="input input-bordered rounded focus:border-primary-300 w-full" required />
                                    </div>

                                    <div>
                                        <label htmlFor="slug" className="label">
                                            <span className="label-text text-base">
                                                Slug
                                                <span className="block text-xs font-bold">narimato.com/slug</span>
                                            </span>
                                        </label>
                                        <input type="text" defaultValue={organisation.slug} name="slug" className="input input-bordered rounded focus:border-primary-300 w-full" required />
                                    </div>

                                    {/* Image update disabled for now */}
                                    {/* <div>
                                        <label htmlFor="logoUrl" className="label">
                                            <span className="label-text text-base">Logo</span>
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
                                            required
                                        />
                                        {base64Image && <img src={base64Image} alt="preEdit-image" className="w-full object-contain py-2" />}
                                    </div> */}

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

export default withAuth(EditOrganisation);
