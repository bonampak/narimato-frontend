import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useRouter, NextRouter } from "next/router";

import { withAuth } from "../../utils";
import { gameGetAllByMe } from "../../api";
import { LoadingComponent, NavigationBarComponent } from "../../components";

import type { AxiosResponse, AxiosError } from "axios";

const AboutMe = () => {
    const router: NextRouter = useRouter();

    const [myGame, setMyGame] = React.useState<null | any>(null);

    const { isLoading } = useQuery(["game-result", "user"], gameGetAllByMe, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setMyGame(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message, {
                onClose: () => router.push("/dashboard")
            });
        }
    });

    return (
        <>
            <Head>
                <title>About Me - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {!myGame && isLoading && <LoadingComponent />}

                    {!isLoading && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">About Me</section>

                            {!myGame && (
                                <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">
                                    <h2 className="text-2xl font-bold">You haven&rsquo;t built up a rank yet :(</h2>
                                    <p className="text-lg">Go and play with some cards!</p>
                                </section>
                            )}

                            {myGame &&
                                (() => {
                                    const allCards = myGame.rightSwipedCards.concat(myGame.leftSwipedCards);
                                    const allHashtags = myGame.rightSwipedHashtags.concat(myGame.leftSwipedHashtags);

                                    return (
                                        <div className="overflow-x-auto">
                                            <table className="table-auto w-full">
                                                <thead className="bg-blue-600">
                                                    <tr>
                                                        <th className="px-4 py-2 text-xs text-white text-left">RankID</th>
                                                        <th className="px-4 py-2 text-xs text-white text-left">Title</th>
                                                        <th className="px-4 py-2 text-xs text-white text-left">Your Answer</th>
                                                        <th className="px-4 py-2 text-xs text-white text-left" />
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    {allHashtags.map((hashtag: any, mapIndex: number) => {
                                                        return (
                                                            <React.Fragment key={mapIndex}>
                                                                <tr className="bg-gray-500">
                                                                    <td colSpan={4} className="text-xl px-4 py-2 text-white font-medium">
                                                                        {hashtag.title} - {myGame.rightSwipedHashtags.map((hashtag: any) => hashtag._id).includes(hashtag._id) ? "✅" : "❌"}
                                                                    </td>
                                                                </tr>

                                                                {allCards
                                                                    .filter((card: any) => card.hashtags.map((h: any) => h._id).includes(hashtag._id))
                                                                    .map((card: any, index: number) => (
                                                                        <tr key={card._id}>
                                                                            <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{++index}</td>
                                                                            <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{card.title}</td>
                                                                            <td className="border px-4 py-2 border-blue-500 text-center font-medium">
                                                                                {myGame.rightSwipedCards.map((card: any) => card._id).includes(card._id) ? "✅" : "❌"}
                                                                            </td>
                                                                            <td className="border px-4 py-2 text-yellow-600 border-blue-500 font-medium">
                                                                                <Link href={`/card/${card._id}`}>
                                                                                    <a>View Card</a>
                                                                                </Link>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(AboutMe);
