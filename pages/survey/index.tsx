import React from "react";
import Head from "next/head";
import Link from "next/link";
import moment from "moment";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { NextRouter, useRouter } from "next/router";

import { projectGetAllForUser } from "../../http";
import { Loading, NavigationBar } from "../../components";
import { dateMethods, useUser, withAuth } from "../../utils";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const StartASurvey: NextPage = () => {
    const { user } = useUser();
    const router: NextRouter = useRouter();

    const [projects, setProjects] = React.useState<null | any[]>(null);

    const {} = useQuery(["projects", "default"], projectGetAllForUser, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setProjects(data);
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    return (
        <>
            <Head>
                <title>Start A Survey - Haikoto</title>
            </Head>

            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!projects && <Loading isParent={false} />}

                    {projects && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Available Projects</section>

                            {projects.length === 0 && user?.organisationRef && <p className="p-5 bg-red-200">Your organisationRef has no project yet.</p>}

                            {projects.length > 0 &&
                                projects.map((project: any, index: number) => (
                                    // if today is not > than than the project deadline, show it
                                    <>
                                        {!moment().isAfter(moment(project.deadline)) && (
                                            <Link href={`/survey/play?projectId=${project._id}`}>
                                                <section className="w-full bg-blue-200 rounded text-xl text-black font-medium my-4 p-5">
                                                    {++index}.&nbsp; {project.name}
                                                    {project.deadline && (
                                                        <>
                                                            <br />
                                                            <span className="text-base">Deadline: {dateMethods.parseDayMonthYear(project.deadline)}</span>
                                                        </>
                                                    )}
                                                </section>
                                            </Link>
                                        )}
                                    </>
                                ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(StartASurvey);
