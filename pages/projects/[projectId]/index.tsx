import React from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { NextRouter, useRouter } from "next/router";

import { dateMethods, withAuth } from "../../../utils";
import { projectGetOne } from "../../../http";
import { Loading, NavigationBar } from "../../../components";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const ViewProject: NextPage = ({ query }: any) => {
    const router: NextRouter = useRouter();
    const { projectId } = query;

    const [project, setProject] = React.useState<null | any>(null);

    const { isLoading } = useQuery(["project", projectId], () => projectGetOne(projectId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setProject(data);
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: !!projectId
    });

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!project && <Loading isParent={false} />}

                    {project && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Project - {project._id}</section>

                            <div className="w-full max-w-lg">
                                <div className="my-5 space-y-3">
                                    <div>
                                        <label htmlFor="name" className="label">
                                            <span className="label-text text-base">Name</span>
                                        </label>
                                        <input type="text" defaultValue={project.name} name="name" className="input input-bordered rounded focus:border-primary-300 w-full" disabled />
                                    </div>

                                    <div>
                                        <label htmlFor="deadline" className="label">
                                            <span className="label-text text-base">Deadline</span>
                                        </label>
                                        <input type="text" defaultValue={project.deadline ? dateMethods.parseDateDayMonthYear(project.deadline) : "--None--"} name="deadline" className="input input-bordered rounded focus:border-primary-300 w-full" disabled />
                                    </div>

                                    <div>
                                        <label htmlFor="hashtagRefs" className="label">
                                            <span className="label-text text-base">Hashtags</span>
                                        </label>
                                        <Select isMulti instanceId="hashtags" defaultValue={project.hashtagRefs.map((hashtag: any) => ({ value: hashtag._id, label: hashtag.title }))} classNamePrefix="react-select" isClearable isDisabled />
                                    </div>

                                    <div>
                                        <label htmlFor="organisationRef" className="label">
                                            <span className="label-text text-base">Organisation</span>
                                        </label>
                                        <input type="text" defaultValue={project.organisationRef?.name || "--DEFAULT--"} name="name" className="input input-bordered rounded focus:border-primary-300 w-full" disabled />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(ViewProject);
