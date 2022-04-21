import React from "react";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";

import { withAuth } from "../../utils";
import { organisationDelete, organisationGetAll } from "../../api";
import { LoadingComponent, NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const ManageOrganisation: NextPage = () => {
    const router = useRouter();

    const [organisations, setOrganisations] = React.useState<null | any[]>(null);

    const { isLoading } = useQuery("organisations", organisationGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setOrganisations(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    const { mutate: deleteOrganisation } = useMutation(organisationDelete, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setOrganisations((organisations as any[]).filter((organisation: any) => organisation._id !== data._id));
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    async function handleDeleteOrganisation(organisationId: string) {
        if (confirm("Are you sure you want to delete this organisation?")) deleteOrganisation(organisationId);
    }

    return (
        <>
            <Head>
                <title>All Organisations - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoading && !organisations && <LoadingComponent />}

                    {!isLoading && organisations && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">All Organisations</section>

                            <div className="mb-10">
                                <div className="overflow-x-auto">
                                    <table className="table-auto w-full">
                                        <thead className="bg-blue-600">
                                            <tr>
                                                <th className="px-4 py-2 text-xs text-white text-left">---</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Name</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">URL</th>
                                                <th className="px-4 py-2 text-xs text-white text-left" />
                                                <th className="px-4 py-2 text-xs text-white text-left" />
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {organisations.map((organisation: any, index: number) => {
                                                const url = window.location.origin + "/" + organisation.slugUrl;
                                                return (
                                                    <tr key={organisation._id}>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{++index}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{organisation.name}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">
                                                            <a href={url} target="_blank" rel="noreferrer">
                                                                {url}
                                                            </a>
                                                        </td>
                                                        <td className="border px-4 py-2 text-yellow-600 border-blue-500 font-medium">
                                                            <div className="divide-x-2 divide-neutral-900 divide-double">
                                                                <Link href={`/projects/org/${organisation._id}`}>
                                                                    <a className="px-2 text-blue-600">Projects</a>
                                                                </Link>
                                                                <Link href={`/surveys/org/${organisation._id}`}>
                                                                    <a className="px-2 text-blue-600">Surveys</a>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                        <td className="border px-4 py-2 text-yellow-600 border-blue-500 font-medium">
                                                            <div className="divide-x-2 divide-neutral-900 divide-double">
                                                                <Link href={`/organisations/${organisation._id}/edit`}>
                                                                    <a className="px-2">Edit</a>
                                                                </Link>
                                                                <Link href={`/organisations/${organisation._id}/export`}>
                                                                    <a className="px-2 text-green-600">Export</a>
                                                                </Link>
                                                                <button onClick={() => handleDeleteOrganisation(organisation._id)} className="px-2">
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

export default withAuth(ManageOrganisation);
