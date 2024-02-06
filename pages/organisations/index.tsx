import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { organisationDelete, organisationGetAll } from "../../http";
import { dateMethods, withAuth } from "../../utils";
import { Loading, NavigationBar } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse } from "axios";

const Organisations: NextPage = () => {
    const [orginalData, setOriginalData] = React.useState<null | any[]>(null);
    const [organisations, setOrganisations] = React.useState<null | any>(null);

    const { refetch: refetchOrganisations } = useQuery(["organisations"], organisationGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setOrganisations(data);
            setOriginalData(data);
        }
    });

    const handleSearch = (event: any) => {
        const value = event.target.value.toLowerCase();
        const result = orginalData?.filter((data) => JSON.stringify(data).toLowerCase().includes(value));
        setOrganisations(result as any[]);
    };

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!organisations && <Loading isParent={false} />}

                    {organisations && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Organisations</section>

                            <input type="search" placeholder="Search..." className="input input-bordered w-full" onChange={handleSearch} />

                            <div className="overflow-x-auto pt-3">
                                <table className="table table-compact table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-sm">#</th>
                                            <th className="text-sm">Name</th>
                                            <th className="text-sm">Slug</th>
                                            <th className="text-sm">Date Created</th>
                                            <th className="text-sm" />
                                            <th className="text-sm" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {organisations.map((organisation: any, index: number) => (
                                            <tr key={organisation._id}>
                                                <th>{++index}</th>
                                                <td>{organisation.name}</td>
                                                <td>
                                                    <Link href={organisation.slug} target="_blank" className="underline font-bold">
                                                        narimato.com/{organisation.slug}
                                                    </Link>
                                                </td>
                                                <td>{dateMethods.parseMonthDateYearTime(organisation.createdAt)}</td>
                                                <td>
                                                    <div className="flex flex-row gap-2">
                                                        <Link href={`/organisations/${organisation._id}/projects`} className="text-green-500">
                                                            Projects
                                                        </Link>
                                                        ||
                                                        <Link href={`/organisations/${organisation._id}/surveys`} className="text-green-500">
                                                            Surveys
                                                        </Link>
                                                        ||
                                                        <Link href={`/organisations/${organisation._id}/users`} className="text-green-500">
                                                            Users
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex flex-row gap-4">
                                                        <Link href={`/organisations/${organisation._id}`} className="text-blue-500">
                                                            View
                                                        </Link>
                                                        <Link href={`/organisations/${organisation._id}/edit`} className="text-yellow-500">
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={async () => {
                                                                if (!window.confirm("Are you sure you want to delete this organisation, this cannot be undone")) return;
                                                                await organisationDelete(organisation._id);
                                                                refetchOrganisations();
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

export default withAuth(Organisations);
