import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { dateMethods, withAuth } from "../../utils";
import { cardDelete, cardGetAll } from "../../http";
import { Loading, NavigationBar } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse } from "axios";

const Cards: NextPage = () => {
    const [cards, setCards] = React.useState<null | any>(null);
    const [orginalData, setOriginalData] = React.useState<null | any[]>(null);

    const { refetch: refetchCards } = useQuery(["cards"], cardGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setCards(data);
            setOriginalData(data);
        }
    });

    const handleSearch = (event: any) => {
        const value = event.target.value.toLowerCase();
        const result = orginalData?.filter((data) => JSON.stringify(data).toLowerCase().includes(value));
        setCards(result as any[]);
    };

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!cards && <Loading isParent={false} />}

                    {cards && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Cards</section>

                            <input type="search" placeholder="Search..." className="input input-bordered w-full" onChange={handleSearch} />

                            <div className="overflow-x-auto pt-3">
                                <table className="table table-compact w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-sm">#</th>
                                            <th className="text-sm">Title</th>
                                            {/* <th className="text-sm">Description</th> */}
                                            <th className="text-sm">Hashtags</th>
                                            <th className="text-sm">Thumbnail</th>
                                            <th className="text-sm">Date Created</th>
                                            <th className="text-sm" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cards.map((card: any, index: number) => (
                                            <tr key={card._id}>
                                                <th>{++index}</th>
                                                <td>{card.title}</td>
                                                {/* <td>{card.description}</td> */}
                                                <td>{card.hashtagRefs.length > 0 ? card.hashtagRefs.map((hashtag: any) => `${hashtag.title}, `) : "---"}</td>
                                                <td>{card.imageUrl ? <Image src={card.imageUrl} alt={card.title} width={50} height={50} quality={5} /> : "---"}</td>
                                                <td>{dateMethods.parseMonthDateYearTime(card.createdAt)}</td>
                                                <td>
                                                    <div className="flex flex-row gap-4">
                                                        <Link href={`/cards/${card._id}`} className="text-blue-500">
                                                            View
                                                        </Link>
                                                        <Link href={`/cards/${card._id}/edit`} className="text-yellow-500">
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={async () => {
                                                                if (!window.confirm("Are you sure you want to delete this card, this cannot be undone")) return;
                                                                await cardDelete(card._id);
                                                                refetchCards();
                                                            }}
                                                            className="text-red-500"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default withAuth(Cards);
