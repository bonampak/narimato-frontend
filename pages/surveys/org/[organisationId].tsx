import React from "react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../../utils";
import { surveyGetAllByOrganisation } from "../../../api";
import { LoadingComponent, NavigationBarComponent } from "../../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const SurveysByOrganisation: NextPage = () => {
    const router: NextRouter = useRouter();

    const { organisationId } = router.query;

    const [surveys, setSurveys] = React.useState<null | any[]>(null);

    const { isLoading } = useQuery(["surveys", organisationId], () => surveyGetAllByOrganisation(organisationId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setSurveys(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: !!organisationId
    });

    return (
        <>
            <Head>
                <title>Organisation Surveys - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoading && !surveys && <LoadingComponent />}

                    {!isLoading && surveys && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">Surveys By Organisation</section>

                            <div className="mb-10">
                                <div className="overflow-x-auto">
                                    <table className="table-auto w-full">
                                        <thead className="bg-blue-600">
                                            <tr>
                                                <th className="px-4 py-2 text-xs text-white text-left">---</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">User</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Organisation</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Project</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Survey Started</th>
                                                <th className="px-4 py-2 text-xs text-white text-left" />
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {surveys.map((survey: any, index: number) => {
                                                return (
                                                    <tr key={survey._id}>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{++index}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{survey.user.codeName}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{survey.user?.organisation?.name || "---"}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{survey.project?.name || "---"}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{moment(survey.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</td>
                                                        <td className="border px-4 py-2 text-yellow-600 border-blue-500 font-medium">
                                                            <div className="divide-x-2 divide-neutral-900 divide-double">
                                                                <Link href={`/surveys/${survey._id}`}>
                                                                    <a className="px-2 text-blue-600">View</a>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(SurveysByOrganisation);
