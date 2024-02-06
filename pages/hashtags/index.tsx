import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { hashtagDelete, hashtagGetAll } from "../../http";
import { dateMethods, withAuth } from "../../utils";
import { Loading, NavigationBar } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse } from "axios";

const Hashtags: NextPage = () => {
    const [hashtags, setHashtags] = React.useState<null | any>(null);
    const [orginalData, setOriginalData] = React.useState<null | any[]>(null);

    const { refetch: refetchHashtags } = useQuery(["hashtags"], hashtagGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtags(data);
            setOriginalData(data);
        }
    });

    const handleSearch = (event: any) => {
        const value = event.target.value.toLowerCase();
        const result = orginalData?.filter((data) => JSON.stringify(data).toLowerCase().includes(value));
        setHashtags(result as any[]);
    };

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!hashtags && <Loading isParent={false} />}

                    {hashtags && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Hashtags</section>

                            <input type="search" placeholder="Search..." className="input input-bordered w-full" onChange={handleSearch} />

                            <div className="overflow-x-auto pt-3">
                                <table className="table table-compact table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-sm">#</th>
                                            <th className="text-sm">Title</th>
                                            <th className="text-sm">Description</th>
                                            <th className="text-sm">Parent Hashtag</th>
                                            <th className="text-sm">Thumbnail</th>
                                            <th className="text-sm">Date Created</th>
                                            <th className="text-sm" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hashtags.map((hashtag: any, index: number) => (
                                            <tr key={hashtag._id}>
                                                <th>{++index}</th>
                                                <td>{hashtag.title}</td>
                                                <td>{hashtag.description}</td>
                                                <td>{hashtag.parentHashtagRef ? hashtag.parentHashtagRef.title : "---"}</td>
                                                <td>{hashtag.imageUrl ? <Image src={hashtag.imageUrl} alt={hashtag.title} width={50} height={50} quality={5} /> : "---"}</td>
                                                <td>{dateMethods.parseMonthDateYearTime(hashtag.createdAt)}</td>
                                                <td>
                                                    <div className="flex flex-row gap-4">
                                                        <Link href={`/hashtags/${hashtag._id}`} className="text-red-500">
                                                            View
                                                        </Link>
                                                        <Link href={`/hashtags/${hashtag._id}/edit`} className="text-yellow-500">
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={async () => {
                                                                if (!window.confirm("Are you sure you want to delete this hashtag, this cannot be undone")) return;
                                                                await hashtagDelete(hashtag._id);
                                                                refetchHashtags();
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

export default withAuth(Hashtags);
