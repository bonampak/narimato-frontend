import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { dateMethods, withAuth } from "../../utils";
import { surveyDelete, surveyGetAll } from "../../http";
import { Loading, NavigationBar } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse } from "axios";

const Surveys: NextPage = () => {
    const [surveys, setSurveys] = React.useState<null | any>(null);
    const [orginalData, setOriginalData] = React.useState<null | any[]>(null);

    const { refetch: refetchSurveys } = useQuery(["surveys"], surveyGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setSurveys(data);
            setOriginalData(data);
        }
    });

    const handleSearch = (event: any) => {
        const value = event.target.value.toLowerCase();
        const result = orginalData?.filter((data) => JSON.stringify(data).toLowerCase().includes(value));
        setSurveys(result as any[]);
    };

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!surveys && <Loading isParent={false} />}

                    {surveys && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Surveys</section>

                            <input type="search" placeholder="Search..." className="input input-bordered w-full" onChange={handleSearch} />

                            <div className="overflow-x-auto pt-3">
                                <table className="table table-compact table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-sm">#</th>
                                            <th className="text-sm">unique Id</th>
                                            <th className="text-sm">User</th>
                                            <th className="text-sm">Organisation</th>
                                            <th className="text-sm">Project</th>
                                            <th className="text-sm">Date Started</th>
                                            <th className="text-sm" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {surveys.map((survey: any, index: number) => (
                                            <tr key={survey._id}>
                                                <th>{++index}</th>
                                                <td>{survey.uniqueId}</td>
                                                <td>{survey.userRef.codeName}</td>
                                                <td>{survey.userRef.organisationRef?.name || "---"}</td>
                                                <td>{survey.projectRef.name || "---"}</td>
                                                <td>{dateMethods.parseMonthDateYearTime(survey.createdAt)}</td>
                                                <td>
                                                    <div className="flex flex-row gap-4">
                                                        <Link href={`/surveys/${survey._id}`} className="text-blue-500">
                                                            View
                                                        </Link>
                                                        {/* <Link href={`/surveys/${survey._id}/edit`} className="text-yellow-500">
                                                            Edit
                                                        </Link> */}
                                                        <button
                                                            onClick={async () => {
                                                                if (!window.confirm("Are you sure you want to delete this survey, this cannot be undone")) return;
                                                                await surveyDelete(survey._id);
                                                                refetchSurveys();
                                                            }}
                                                            className="text-red-500"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(Surveys);
