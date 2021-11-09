import React from "react";
import Head from "next/head";
import Link from "next/link";

import { cardService } from "../../app/services";
import { currentUser, withAuth } from "../../app/utils";

function Index() {
    const user = currentUser().userData;

    async function fetchCards() {
        const Allcards = await cardService.getAll();
        const Mycards = await cardService.getAllByMe();
    }

    React.useEffect(() => {
        fetchCards();
    }, []);

    return (
        <>
            <Head>
                <title>{user.codeName.toUpperCase()} - Haikoto</title>
            </Head>

            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <main className="flex flex-col items-center justify-center w-full flex-1 px-1 lg:px-20 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                        Hello <b className="text-blue-600">{user.codeName}</b>
                    </h1>

                    <p className="text-lg md:text-xl lg:text-2xl">
                        You are logged in!
                    </p>

                    <div className="my-5" />

                    {/* Login | Signup Buttons */}
                    <div className="flex flex-col items-center justify-center w-full">
                        <Link href="/user/create-card">
                            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 my-2 min-w-max w-2/4 rounded-full">
                                Create Card
                            </a>
                        </Link>
                        {/* <Link href="/user/play-cards">
                            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 my-2 min-w-max w-2/4 rounded-full">
                                Play Cards
                            </a>
                        </Link> */}
                        {/* <Link href="/user/my-cards">
                            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 my-2 min-w-max w-2/4 rounded-full">
                                My Cards
                            </a>
                        </Link> */}
                        <Link href="/user/about-me">
                            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 my-2 min-w-max w-2/4 rounded-full">
                                About Me
                            </a>
                        </Link>
                        <Link href="/logout">
                            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 my-2 min-w-max w-2/4 rounded-full">
                                Logout
                            </a>
                        </Link>
                        {/* 
                        <Link href="/user/my-card">
                            <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 ryounded-full min-w-max w-2/4">
                                My Cards
                            </a>
                        </Link> */}
                    </div>
                </main>
            </div>
        </>
    );
}

export default withAuth(Index);
