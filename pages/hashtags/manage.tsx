import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";

import { withAuth } from "../../utils";
import { hashtagDelete, hashtagGetAllWithParents } from "../../api";
import { LoadingComponent, NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const AllHashtag: NextPage = () => {
    const router = useRouter();

    const [hashtags, setHashtags] = React.useState<null | any[]>(null);

    const { isLoading } = useQuery("hashtags", hashtagGetAllWithParents, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtags(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    const { mutate: deleteHashtag } = useMutation(hashtagDelete, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setHashtags((hashtags as any[]).filter((hashtag: any) => hashtag._id !== data._id));
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    async function handleDeleteHashtag(hashtagId: string) {
        if (confirm("Are you sure you want to delete this hashtag?")) deleteHashtag(hashtagId);
    }

    return (
        <>
            <Head>
                <title>All Hashtags - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoading && !hashtags && <LoadingComponent />}

                    {!isLoading && hashtags && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">All Hashtags</section>

                            <div className="mb-10">
                                <div className="overflow-x-auto">
                                    <table className="table-auto w-full">
                                        <thead className="bg-blue-600">
                                            <tr>
                                                <th className="px-4 py-2 text-xs text-white text-left">---</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Thumbnail</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Title</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Parent</th>
                                                <th className="px-4 py-2 text-xs text-white text-left" />
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {hashtags.map((hashtag: any, index: number) => {
                                                return (
                                                    <tr key={hashtag._id}>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{++index}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">
                                                            <Image src={hashtag.imageUrl} alt={hashtag.title} width={50} height={50} quality={5} />
                                                        </td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{hashtag.title}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{hashtag.parentHashtag ? hashtag.parentHashtag.title : "---"}</td>
                                                        <td className="border px-4 py-2 text-yellow-600 border-blue-500 font-medium">
                                                            <div className="divide-x-2 divide-neutral-900 divide-double">
                                                                {/* <Link href={`/hashtags/${hashtag._id}`}>
                                                                    <a className="text-green-600 px-2">View</a>
                                                                </Link> */}
                                                                <Link href={`/hashtags/${hashtag._id}/edit`}>
                                                                    <a className="px-2">Edit</a>
                                                                </Link>
                                                                <button onClick={() => handleDeleteHashtag(hashtag._id)} className="px-2">
                                                                    <a className="text-red-600">Delete</a>
                                                                </button>
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

export default withAuth(AllHashtag);
