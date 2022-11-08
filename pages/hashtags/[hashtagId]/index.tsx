import React from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../../utils";
import { hashtagGetOne } from "../../../http";
import { Loading, NavigationBar, SingleHashtag } from "../../../components";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const ViewHashtag: NextPage = ({ query }: any) => {
    const router: NextRouter = useRouter();
    const { hashtagId } = query;

    const [hashtag, setHashtag] = React.useState<null | any>(null);

    const { isLoading } = useQuery(["hashtag", hashtagId], () => hashtagGetOne(hashtagId as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtag(data);
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        },
        enabled: !!hashtagId
    });

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!hashtag && <Loading isParent={false} />}

                    {hashtag && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Hashtag - {hashtag._id}</section>

                            <SingleHashtag
                                // breaker
                                hashtag={hashtag}
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

export default withAuth(ViewHashtag);
