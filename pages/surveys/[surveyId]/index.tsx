import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../../utils";
import { surveyGetOne } from "../../../http";
import { Loading, NavigationBar } from "../../../components";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const EditSurvey: NextPage = ({ query }: any) => {
    const router: NextRouter = useRouter();
    const { surveyId } = query;

    const [survey, setSurvey] = React.useState<null | any>(null);
    const [allCards, setAllCards] = React.useState<null | any>(null);
    const [allHashtags, setAllHashtags] = React.useState<null | any>(null);

    const { isLoading } = useQuery(["survey", surveyId], () => surveyGetOne(surveyId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setSurvey(data);
            setAllCards(data.rightSwipedCardRefs.concat(data.leftSwipedCardRefs));
            setAllHashtags(data.rightSwipedHashtagRefs.concat(data.leftSwipedHashtagRefs));
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: !!surveyId
    });

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!survey && <Loading isParent={false} />}

                    {survey && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Survey Result - {survey?.uniqueId}</section>

                            <div className="overflow-x-auto pt-3">
                                <table className="table table-compact table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-sm">#</th>
                                            <th className="text-sm">Title</th>
                                            <th className="text-sm">Your Answer</th>
                                            <th className="text-sm" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allHashtags.map((hashtag: any) => (
                                            <React.Fragment key={hashtag._id}>
                                                <tr key={hashtag._id}>
                                                    <td colSpan={4} className="text-xl px-4 py-2 text-white font-medium" style={{ backgroundColor: "#2c2f39" }}>
                                                        {hashtag.title} - {survey.rightSwipedHashtagRefs.map((hashtag: any) => hashtag._id).includes(hashtag._id) ? "✅" : "❌"}
                                                    </td>
                                                </tr>

                                                {allCards
                                                    .filter((card: any) => card.hashtagRefs.includes(hashtag._id))
                                                    .map((card: any, index: number) => (
                                                        <tr key={card._id}>
                                                            <td>{++index}</td>
                                                            <td>{card.title}</td>
                                                            <td>{survey.rightSwipedCardRefs.map((card: any) => card._id).includes(card._id) ? "✅" : "❌"}</td>
                                                            <td>
                                                                <Link href={`/cards/${card._id}`} className="text-yellow-600">
                                                                    View Card
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </React.Fragment>
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

export default withAuth(EditSurvey);
