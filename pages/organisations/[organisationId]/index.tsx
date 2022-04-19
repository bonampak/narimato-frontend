import React from "react";
import Head from "next/head";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../../utils";
import { organisationGetOne } from "../../../api";
import { LoadingComponent, NavigationBarComponent } from "../../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const SingleOrganisation: NextPage = () => {
    const router: NextRouter = useRouter();

    const { organisationId } = router.query;
    const [organisation, setOrganisation] = React.useState<null | any>(null);

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

    return (
        <>
            <Head>
                <title>Single Organisation - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoading && !organisation && <LoadingComponent />}

                    {!isLoading && organisation && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">Organisation - {organisation.name}</section>

                            <div className="mb-10"></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(SingleOrganisation);
