import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useQuery } from "react-query";

import { surveyCheckIfNewCard } from "../../api";
import { useUser, withAuth } from "../../utils";
import { NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse } from "axios";

const Dashboard: NextPage = () => {
    const { user } = useUser();

    const [showPlayButton, setShowPlayButton] = React.useState<boolean>(false);

    const {} = useQuery("check-for-new-card", surveyCheckIfNewCard, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setShowPlayButton(data);
        }
    });

    return (
        <>
            <Head>
                <title>My Dashboard - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    <section className="my-4 w-full p-5 rounded bg-blue-600">
                        <span className="text-white">
                            Hi there, <b>@{user?.codeName}</b> 👋
                        </span>
                    </section>

                    {user?.organisation && (
                        <section className="my-4 w-full p-5 rounded bg-blue-200 bg-opacity-90">
                            <p className="text-lg">You are currently signed in with organisation &rsquo;{user.organisation.name}&rsquo;</p>
                        </section>
                    )}

                    {!user?.organisation && (
                        <section className="my-4 w-full p-5 rounded bg-blue-200 bg-opacity-90">
                            <p className="text-lg">You are not signed in with any organisation</p>
                        </section>
                    )}

                    {showPlayButton ? (
                        <section className="my-4 w-max p-5 rounded bg-blue-600">
                            <Link href="/play">
                                <a className="text-white">Start / Continue Survey</a>
                            </Link>
                        </section>
                    ) : (
                        <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">
                            <h2 className="text-2xl font-bold">Nothing here yet</h2>
                            <p className="text-lg">This is the dashboard :)</p>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(Dashboard);
