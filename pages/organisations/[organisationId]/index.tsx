import React from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../../utils";
import { organisationGetOne } from "../../../http";
import { Loading, NavigationBar } from "../../../components";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const ViewOrganisation: NextPage = ({ query }: any) => {
    const router: NextRouter = useRouter();
    const { organisationId } = query;

    const [organisation, setOrganisation] = React.useState<null | any>(null);

    const { isLoading } = useQuery(["organisation", organisationId], () => organisationGetOne(organisationId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setOrganisation(data);
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: !!organisationId
    });

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!organisation && <Loading isParent={false} />}

                    {organisation && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Organisation - {organisation._id}</section>

                            <div className="w-full max-w-lg">
                                <div className="my-5 space-y-3">
                                    <div>
                                        <label htmlFor="name" className="label">
                                            <span className="label-text text-base">Name</span>
                                        </label>
                                        <input type="text" defaultValue={organisation.name} name="name" className="input input-bordered rounded focus:border-primary-300 w-full" disabled />
                                    </div>

                                    <div>
                                        <label htmlFor="slug" className="label">
                                            <span className="label-text text-base">
                                                Slug
                                                <span className="block text-xs font-bold">narimato.com/slug</span>
                                            </span>
                                        </label>
                                        <input type="text" defaultValue={organisation.slug} name="slug" className="input input-bordered rounded focus:border-primary-300 w-full" disabled />
                                    </div>

                                    <div>
                                        <label htmlFor="slug" className="label">
                                            <span className="label-text text-base">Logo</span>
                                        </label>
                                        <img src={organisation.logoUrl} alt="preEdit-image" className="w-full object-contain py-2" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(ViewOrganisation);
