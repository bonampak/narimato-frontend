import React from "react";
import Link from "next/link";

import { useUser, withAuth } from "../../utils";
import { NavigationBar } from "../../components";

import type { NextPage } from "next";

const Dashboard: NextPage = () => {
    const { user } = useUser();

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    <section className="w-full bg-red-600 rounded text-xl md:text-3xl text-white font-bold my-4 p-5">
                        Hi there, <b>{user?.codeName}</b> 👋
                    </section>

                    {user?.organisationRef && <section className="w-full bg-red-200 rounded text-lg text-black font-medium my-4 p-5">You are currently signed in with organisation &rsquo;{user.organisationRef.name}&rsquo;</section>}

                    {!user?.organisationRef && <section className="w-full bg-red-200 rounded text-lg text-black font-medium my-4 p-5">You are not signed in with any organisation</section>}

                    <section className="w-full bg-gray-200 rounded text-xl text-black font-medium my-4 p-5">
                        <ul className="list-inside list-disc space-y-5">
                            <Link href="/survey" className="list-item underline">
                                Start A Survey
                            </Link>
                        </ul>
                    </section>
                </div>
            </div>
        </>
    );
};

export default withAuth(Dashboard);
