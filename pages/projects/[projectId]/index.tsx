import React from "react";
import Head from "next/head";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../../utils";
import { projectGetOne } from "../../../api";
import { LoadingComponent, NavigationBarComponent } from "../../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const SingleProject: NextPage = () => {
    const router: NextRouter = useRouter();

    const { projectId } = router.query;
    const [project, setProject] = React.useState<null | any>(null);

    const { isLoading } = useQuery(["project", projectId], () => projectGetOne(projectId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setProject(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message, {
                onClose: () => router.push("/dashboard")
            });
        },
        enabled: !!projectId
    });

    return (
        <>
            <Head>
                <title>Single Project - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoading && !project && <LoadingComponent />}

                    {!isLoading && project && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">Project - {project.name}</section>

                            <div className="mb-10">
                                <section className="my-4 w-full p-5 rounded bg-gray-200">
                                    <p className="text-2xl border-b-2 border-black mb-4">
                                        Name: <br /> {project.name}
                                    </p>
                                    <p className="text-2xl border-b-2 border-black mb-4">
                                        Hashtags: <br />
                                        {project.hashtags.map((hashtag: any) => (
                                            <span key={hashtag._id} className="bg-green-500 px-2 mr-2 rounded text-lg">
                                                #{hashtag.title}
                                            </span>
                                        ))}
                                    </p>
                                    <p className="text-2xl border-b-2 border-black mb-4">
                                        Organisation: <br />
                                        {project.organisation.name}
                                    </p>
                                </section>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(SingleProject);
