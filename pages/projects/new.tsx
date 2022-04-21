import React from "react";
import Head from "next/head";
import Select from "react-select";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "react-query";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../utils";
import { NavigationBarComponent } from "../../components";
import { hashtagGetAllWithParents, organisationGetAll, projectCreate } from "../../api";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const CreateProject: NextPage = () => {
    const router: NextRouter = useRouter();

    const [hashtags, setHashtags] = React.useState<any[]>([]);
    const [organisations, setOrganisations] = React.useState<any[]>([]);
    const [selectedHashtags, setSelectedHashtags] = React.useState<any[]>([]);

    const {} = useQuery("hashtags", hashtagGetAllWithParents, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtags(data.filter((hashtag: any) => hashtag.parentHashtag === null));
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    const {} = useQuery("organisations", organisationGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setOrganisations(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    const { isLoading: isCreatingProject, mutate: createProject } = useMutation(projectCreate, {
        onSuccess: (response: AxiosResponse) => {
            const { message } = response.data;
            toast.success(message);
            router.push("/projects/manage");
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataToJSON: any = Object.fromEntries(formData);

        formDataToJSON["hashtags"] = selectedHashtags.map((hashtag) => hashtag.value);

        createProject(formDataToJSON);
    };

    return (
        <>
            <Head>
                <title>Create Project - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">Create an Project</section>

                    <div className="flex flex-col items-center justify-center">
                        <div className="mt-2 md:py-10 max-w-lg">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-8">
                                    <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Project Name</h1>
                                    <input name="name" type="text" className="border-black border-2 my-2 w-full p-2" required />

                                    <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Hashtags (Parent Cards)</h1>
                                    <Select
                                        isMulti
                                        className="border-black border-2 my-2 w-full"
                                        options={hashtags.map((hashtag: any) => {
                                            return { value: hashtag._id, label: hashtag.title };
                                        })}
                                        onChange={(selectedHashtags: any) => setSelectedHashtags(selectedHashtags)}
                                    />

                                    <h1 className="font-bold text-xl md:text-3xl text-center mt-4 md:mt-10">Organisation</h1>
                                    <Select
                                        name="organisation"
                                        className="border-black border-2 my-2 w-full"
                                        options={organisations.map((organisation: any) => {
                                            return { value: organisation._id, label: organisation.name };
                                        })}
                                    />

                                    <div className="flex justify-center mt-8">
                                        <button
                                            disabled={isCreatingProject}
                                            type="submit"
                                            className={["bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg p-2 mt-8 w-full", isCreatingProject ? "opacity-50" : "opacity-100"].join(" ")}
                                        >
                                            Create
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withAuth(CreateProject);