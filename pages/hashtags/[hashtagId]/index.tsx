import React from "react";
import Head from "next/head";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../utils";
import { hashtagGetOne } from "../../api";
import { LoadingComponent, NavigationBarComponent, SingleCard } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const SingleHashtagPage: NextPage = () => {
    const router: NextRouter = useRouter();

    const { hashtagId } = router.query;
    const [hashtag, setHashtag] = React.useState<null | any>(null);

    const { isLoading } = useQuery(["hashtag", hashtagId], () => hashtagGetOne(hashtagId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtag(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message, {
                onClose: () => router.push("/dashboard")
            });
        },
        enabled: !!hashtagId
    });

    return (
        <>
            <Head>
                <title>Single Hashtag - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoading && !hashtag && <LoadingComponent />}

                    {!isLoading && hashtag && (
                        <div className="items-center justify-center">
                            <div className="mb-4">
                                <h1 className="text-center text-xl md:text-3xl">{hashtag.title}</h1>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(SingleHashtagPage);
