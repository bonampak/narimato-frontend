import React from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../../utils";
import { cardGetOne } from "../../../http";
import { Loading, NavigationBar, SingleCard } from "../../../components";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const ViewCard: NextPage = ({ query }: any) => {
    const router: NextRouter = useRouter();
    const { cardId } = query;

    const [card, setCard] = React.useState<null | any>(null);

    const { isLoading } = useQuery(["card", cardId], () => cardGetOne(cardId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setCard(data);
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: !!cardId
    });

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!card && <Loading isParent={false} />}

                    {card && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Card - {card?._id}</section>

                            <SingleCard
                                // breaker
                                card={card}
                                showTitle={true}
                                showButtons={false}
                                showHashtags={true}
                                activeControls={false}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(ViewCard);
