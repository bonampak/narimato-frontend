import React from "react";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { NextRouter, useRouter } from "next/router";

import { projectGetAllByOrganisation } from "../../api";
import { useUser, withAuth } from "../../utils";
import { NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const StartASurvey: NextPage = () => {
    const { user } = useUser();
    const router: NextRouter = useRouter();

    const [projects, setProjects] = React.useState<null | any[]>(null);

    const { isLoading } = useQuery(["projects", user?.organisation?._id], () => projectGetAllByOrganisation(user.organisation?._id as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setProjects(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: !!user?.organisation
    });

    return (
        <>
            <Head>
                <title>Start A Survey - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    <div className="items-center justify-center">
                        <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">Available Projects</section>

                        {!user?.organisation && (
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">
                                <ul className="list-inside list-disc">
                                    <li>
                                        <Link href="/survey/play">
                                            <a className="text- underline">Start: Default Survey</a>
                                        </Link>
                                    </li>
                                </ul>
                            </section>
                        )}

                        {user?.organisation && (
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">
                                {!isLoading && projects ? (
                                    <ul className="list-inside list-disc">
                                        {projects.length === 0 && <p>Your organisation has no survey project yet.</p>}

                                        {projects.map((project: any, index: number) => (
                                            <li className="mb-2" key={project._id}>
                                                <Link href={`/survey/play?projectId=${project._id}`}>
                                                    <a className="text- underline">Start: {project.name}</a>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    "Loading..."
                                )}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default withAuth(StartASurvey);
