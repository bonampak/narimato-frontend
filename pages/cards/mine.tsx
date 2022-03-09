import React from "react";
import Head from "next/head";
import Link from "next/link";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import { withAuth } from "../../utils";
import { cardGetAllByMe } from "../../api";
import { LoadingComponent, NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const MyCard: NextPage = () => {
    const router = useRouter();

    const [cards, setCards] = React.useState<null | any[]>(null);

    const { isLoading } = useQuery(["cards", "me"], cardGetAllByMe, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setCards(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    return (
        <>
            <Head>
                <title>My Cards - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoading && !cards && <LoadingComponent />}

                    {!isLoading && cards && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">My Cards</section>

                            <div className="mb-10">
                                <div className="overflow-x-auto">
                                    <table className="table-auto w-full">
                                        <thead className="bg-blue-600">
                                            <tr>
                                                <th className="px-4 py-2 text-xs text-white text-left">S/n</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Parent</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Card Title</th>
                                                <th className="px-4 py-2 text-xs text-white text-left" />
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {cards.map((card: any, index: number) => {
                                                return (
                                                    <tr key={card._id}>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{++index}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{card.isParent ? "Yes" : "No"}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{card.title}</td>
                                                        <td className="border px-4 py-2 text-yellow-600 border-blue-500 font-medium">
                                                            <div className="divide-x-2 divide-neutral-900 divide-double">
                                                                <Link href={`/cards/${card._id}`}>
                                                                    <a className="text-green-600 px-2">View</a>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(MyCard);
