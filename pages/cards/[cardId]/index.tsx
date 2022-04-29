import React from "react";
import Head from "next/head";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../../utils";
import { cardGetOne } from "../../../api";
import { LoadingComponent, NavigationBarComponent, SingleCard } from "../../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const SingleCardPage: NextPage = () => {
    const router: NextRouter = useRouter();

    const { cardId } = router.query;
    const [card, setCard] = React.useState<null | any>(null);

    const { isLoading } = useQuery(["card", cardId], () => cardGetOne(cardId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setCard(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message, {
                onClose: () => router.push("/dashboard")
            });
        },
        enabled: !!cardId
    });

    return (
        <>
            <Head>
                <title>Single Card - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoading && !card && <LoadingComponent />}

                    {!isLoading && card && (
                        <div className="items-center justify-center">
                            <SingleCard card={card} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(SingleCardPage);
