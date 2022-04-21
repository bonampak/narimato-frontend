import React from "react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";

import { withAuth } from "../../utils";
import { surveyDelete, surveyGetAll } from "../../api";
import { LoadingComponent, NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const ManageSurvey: NextPage = () => {
    const router = useRouter();

    const [surveys, setSurveys] = React.useState<null | any[]>(null);

    const { isLoading } = useQuery("surveys", surveyGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setSurveys(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    const { mutate: deleteSurvey } = useMutation(surveyDelete, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setSurveys((surveys as any[]).filter((survey: any) => survey._id !== data._id));
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    async function handleDeleteSurvey(surveyId: string) {
        if (confirm("Are you sure you want to delete this survey?")) deleteSurvey(surveyId);
    }

    return (
        <>
            <Head>
                <title>All Surveys - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoading && !surveys && <LoadingComponent />}

                    {!isLoading && surveys && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">All Surveys</section>

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
                                                                <button onClick={() => handleDeleteSurvey(survey._id)} className="px-2">
                                                                    <a className="text-red-600">Delete</a>
                                                                </button>
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

export default withAuth(ManageSurvey);
