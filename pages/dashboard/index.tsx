import React from "react";
import Head from "next/head";
import Link from "next/link";

import { useUser, withAuth } from "../../utils";
import { NavigationBarComponent } from "../../components";

import type { NextPage } from "next";

const Dashboard: NextPage = () => {
    const { user } = useUser();

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

                    <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">
                        <ul className="list-inside list-disc">
                            <li>
                                <Link href="/survey">
                                    <a className="text- underline">Start A Survey</a>
                                </Link>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </>
    );
};

export default withAuth(Dashboard);
