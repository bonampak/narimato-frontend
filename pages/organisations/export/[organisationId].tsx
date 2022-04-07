import React from "react";
import Head from "next/head";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";
// @ts-ignore
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import { withAuth } from "../../../utils";
import { LoadingComponent, NavigationBarComponent } from "../../../components";
import { organisationGetOne, organisationGetOneExportData } from "../../../api";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const ExportOrganisation: NextPage = () => {
    const router: NextRouter = useRouter();

    const { organisationId } = router.query;
    const [organisation, setOrganisation] = React.useState<null | any>(null);
    const [organisationExportData, setOrganisationExportData] = React.useState<null | any>(null);

    const { isLoading } = useQuery(["organisation", organisationId], () => organisationGetOne(organisationId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setOrganisation(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message, {
                onClose: () => router.push("/dashboard")
            });
        },
        enabled: !!organisationId
    });

    const { isLoading: isLoadingExport } = useQuery(["organisation-export", organisationId], () => organisationGetOneExportData(organisationId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setOrganisationExportData(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message, {
                onClose: () => router.push("/dashboard")
            });
        },
        enabled: !!organisationId
    });

    return (
        <>
            <Head>
                <title>Export Organisation Data - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {(isLoading || isLoadingExport) && !organisation && !organisationExportData && <LoadingComponent />}

                    {!isLoading && !isLoadingExport && organisation && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">Organisation - {organisation.name}</section>

                            <div className="flex justify-end">
                                <ReactHTMLTableToExcel
                                    id="organisation-data-export-button"
                                    className="my-3 py-1 px-2 rounded-lg bg-blue-600 text-white text-lg"
                                    table="organisation-data-export"
                                    filename={`${organisation.name}-data-export`}
                                    sheet="page 1"
                                    buttonText="Export as Excel Sheet"
                                />
                            </div>

                            <div className="mb-10">
                                <div className="overflow-x-auto">
                                    <table className="table-auto w-full" id="organisation-data-export">
                                        <thead className="bg-blue-600">
                                            <tr>
                                                <th className="px-4 py-2 text-xs text-white text-left">User </th>
                                                <th className="px-4 py-2 text-xs text-white text-left" />
                                                <th className="px-4 py-2 text-xs text-white text-left" />
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {organisationExportData.users.map((user: any, index: number) => (
                                                <React.Fragment key={user._id}>
                                                    <tr className="bg">
                                                        <td colSpan={3} className="px-4 py-2 " />
                                                    </tr>

                                                    <tr className="bg-green-300">
                                                        <td colSpan={3} className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">
                                                            {++index} &mdash; {user.codeName}
                                                        </td>
                                                    </tr>

                                                    {(() => {
                                                        const myGame = organisationExportData.games.find((game: any) => game.user === user._id);

                                                        if (!myGame) return <></>;

                                                        const allCards = myGame.rightSwipedCards.concat(myGame.leftSwipedCards);
                                                        const allHashtags = myGame.rightSwipedHashtags.concat(myGame.leftSwipedHashtags);

                                                        return allHashtags.map((hashtag: any, mapIndex: number) => (
                                                            <React.Fragment key={mapIndex}>
                                                                <tr className="bg-gray-500">
                                                                    <td colSpan={3} className="text-xl px-4 py-2 text-white font-medium">
                                                                        {hashtag.title} - {myGame.rightSwipedHashtags.map((hashtag: any) => hashtag._id).includes(hashtag._id) ? "✅" : "❌"}
                                                                    </td>
                                                                </tr>

                                                                {allCards.map((card: any, index: number) => (
                                                                    <tr key={card._id}>
                                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{++index}</td>
                                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{card.title}</td>
                                                                        <td className="border px-4 py-2 border-blue-500 text-center font-medium">
                                                                            {myGame.rightSwipedCards.map((card: any) => card._id).includes(card._id) ? "✅" : "❌"}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </React.Fragment>
                                                        ));
                                                    })()}
                                                </React.Fragment>
                                            ))}
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

export default withAuth(ExportOrganisation);
