import React from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";

import { dateMethods, withAuth } from "../../../utils";
import { Loading, NavigationBar } from "../../../components";
import { hashtagGetAllTitles, organisationGetAll, projectGetOne, projectUpdate } from "../../../http";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const EditProject: NextPage = ({ query }: any) => {
    const router: NextRouter = useRouter();
    const { projectId } = query;

    const [project, setProject] = React.useState<null | any>(null);

    const [organisations, setOrganisation] = React.useState<any[]>([]);

    const [hashtags, setHashtags] = React.useState<any[]>([]);
    const [selectedHashtags, setSelectedHashtags] = React.useState<any>([]);

    const {} = useQuery(["project", projectId], () => projectGetOne(projectId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setProject(data);
            setSelectedHashtags(data.hashtagRefs.map((hashtag: any) => ({ label: hashtag.title, value: hashtag._id })));
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: !!projectId
    });

    const { isLoading: isLoadingOrganisations } = useQuery(["organisations"], organisationGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setOrganisation(data);
        }
    });

    const { isLoading: isLoadingHashtagTitles } = useQuery(["hashtags", "titles"], hashtagGetAllTitles, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtags(data);
        }
    });

    const { isLoading, mutate } = useMutation((context: any) => projectUpdate(projectId as string, context), {
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

        if (formDataToJSON.organisationRef === "") formDataToJSON["organisationRef"] = null;

        mutate(formDataToJSON);
    };

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!project && <Loading isParent={false} />}

                    {project && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">New Project</section>

                            <div className="w-full max-w-lg">
                                <form className="my-5 space-y-3" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="name" className="label">
                                            <span className="label-text text-base">Name</span>
                                        </label>
                                        <input type="text" defaultValue={project.name} name="name" className="input input-bordered rounded focus:border-primary-300 w-full" required />
                                    </div>

                                    <div>
                                        <label htmlFor="deadline" className="label">
                                            <span className="label-text text-base">Deadline</span>
                                        </label>
                                        <input type="date" defaultValue={dateMethods.parseYearMonthDateNumeric(project.deadline)} name="deadline" className="input input-bordered rounded focus:border-primary-300 w-full" />
                                    </div>

                                    <div>
                                        <label htmlFor="hashtagRefs" className="label">
                                            <span className="label-text text-base">Hashtag (Parent Cards)</span>
                                        </label>
                                        <Select isMulti instanceId="hashtags" defaultValue={selectedHashtags} options={hashtags ? hashtags.map((hashtag) => ({ value: hashtag._id, label: hashtag.title })) : []} isLoading={isLoadingHashtagTitles} onChange={(selectedHashtags) => setSelectedHashtags(selectedHashtags)} classNamePrefix="react-select" isClearable />
                                    </div>

                                    <div>
                                        <label htmlFor="organisationRef" className="label">
                                            <span className="label-text text-base">Organisation</span>
                                        </label>
                                        <Select
                                            instanceId="organisations"
                                            defaultValue={project.organisationRef ? { label: project.organisationRef.name, value: project.organisationRef._id } : {}}
                                            name="organisationRef"
                                            options={organisations ? organisations.map((organisation) => ({ value: organisation._id, label: organisation.name })) : []}
                                            isLoading={isLoadingOrganisations}
                                            classNamePrefix="react-select"
                                            isClearable
                                        />
                                    </div>

                                    <button type="submit" disabled={isLoading} className={["btn rounded bg-blue-600 hover:bg-blue-700 text-white w-full no-animation", isLoading && "loading"].join(" ")}>
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

export default withAuth(EditProject);
