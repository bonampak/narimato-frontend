import React from "react";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { NextRouter, useRouter } from "next/router";

import { projectGetAllByOrganisation, projectGetDefaults } from "../../api";
import { useUser, withAuth } from "../../utils";
import { NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const StartASurvey: NextPage = () => {
    const { user } = useUser();
    const router: NextRouter = useRouter();

    const [projects, setProjects] = React.useState<null | any[]>(null);

    const { isLoading: isLoadingOrganisationProjects } = useQuery(["projects", user?.organisation?._id], () => projectGetAllByOrganisation(user.organisation?._id as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setProjects(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: user && typeof user.organisation !== "undefined" ? true : false
    });

    const { isLoading: isLoadingDefaultProjects } = useQuery(["projects", "default"], projectGetDefaults, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setProjects(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: user && typeof user.organisation === "undefined" ? true : false
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

                        {!isLoadingOrganisationProjects && !isLoadingDefaultProjects && projects ? (
                            <>
                                {projects.length === 0 && user.organisation && <p className="p-5 bg-red-200">Your organisation has no survey project yet.</p>}

                                {/* <div className="my-2 w-full p-5 rounded bg-blue-200">
                                    <Link href={`/survey/play`}>
                                        <a className="w-full">Start: Default Survey</a>
                                    </Link>
                                </div> */}

                                {projects.map((project: any, index: number) => (
                                    <div key={project._id} className="my-2 w-full p-5 rounded bg-blue-200">
                                        <Link href={`/survey/play?projectId=${project._id}`}>
                                            <a className="w-full">
                                                {++index}.&nbsp; {project.name}
                                            </a>
                                        </Link>
                                    </div>
                                ))}
                            </>
                        ) : (
                            "Loading..."
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default withAuth(StartASurvey);
