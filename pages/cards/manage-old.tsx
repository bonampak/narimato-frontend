/* eslint-disable react/jsx-key */
import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSortBy, useTable } from "react-table";
import { useMutation, useQuery } from "react-query";

import { withAuth } from "../../utils";
import { cardDelete, cardGetAllWithHashtags } from "../../api";
import { LoadingComponent, NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse, AxiosError } from "axios";

const AllCard: NextPage = () => {
    const router = useRouter();

    const [cards, setCards] = React.useState<null | any[]>(null);

    const { isLoading } = useQuery(["cards", "with-hashtags"], cardGetAllWithHashtags, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setCards(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/dashboard");
        }
    });

    const { mutate: deleteCard } = useMutation(cardDelete, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setCards((cards as any[]).filter((card: any) => card._id !== data._id));
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    async function handleDeleteCard(cardId: string) {
        if (confirm("Are you sure you want to delete this card?")) deleteCard(cardId);
    }

    // React-Table Setup
    // const columns = React.useMemo(
    //     () => [
    //         { Header: "Column 1", accessor: "col1" },
    //         { Header: "Column 2", accessor: "col2" }
    //     ],
    //     []
    // );
    // const data = React.useMemo(
    //     () => [
    //         { col1: "Hello", col2: "World" },
    //         { col1: "react-table", col2: "rocks" },
    //         { col1: "whatever", col2: "you want" }
    //     ],
    //     []
    // );
    // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useSortBy);

    // return (
    //     // apply the table props
    //     <table className="table-auto w-full" {...getTableProps()}>
    //         <thead className="bg-blue-600">
    //             {/* // Loop over the header rows */}
    //             {headerGroups.map((headerGroup) => (
    //                 // Apply the header row props
    //                 <tr {...headerGroup.getHeaderGroupProps()}>
    //                     {/* // Loop over the headers in each row */}
    //                     {headerGroup.headers.map((column) => (
    //                         // Apply the header cell props
    //                         <th className="px-4 py-2 text-xs text-white text-left" {...column.getHeaderProps(column.getSortByToggleProps())}>
    //                             {/* // Render the header */}
    //                             {column.render("Header")}
    //                             <span className="mx-2">{column.isSorted ? "🔼" : "🔽"}</span>
    //                         </th>
    //                     ))}
    //                 </tr>
    //             ))}
    //         </thead>
    //         {/* Apply the table body props */}
    //         <tbody {...getTableBodyProps()}>
    //             {
    //                 // Loop over the table rows
    //                 rows.map((row) => {
    //                     // Prepare the row for display
    //                     prepareRow(row);
    //                     return (
    //                         // Apply the row props
    //                         <tr {...row.getRowProps()}>
    //                             {/* // Loop over the rows cells */}
    //                             {row.cells.map((cell) => {
    //                                 // Apply the cell props
    //                                 return (
    //                                     <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium" {...cell.getCellProps()}>
    //                                         {/* // Render the cell contents */}
    //                                         {cell.render("Cell")}
    //                                     </td>
    //                                 );
    //                             })}
    //                         </tr>
    //                     );
    //                 })
    //             }
    //         </tbody>
    //     </table>
    // );

    return (
        <>
            <Head>
                <title>All Cards - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {isLoading && !cards && <LoadingComponent />}

                    {!isLoading && cards && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">All Cards</section>

                            <div className="mb-10">
                                <div className="overflow-x-auto">
                                    <input type="search" placeholder="Search..." className="border-black border-2 my-2 w-full p-1" />
                                    <table className="table-auto w-full">
                                        <thead className="bg-blue-600">
                                            <tr>
                                                <th className="px-4 py-2 text-xs text-white text-left">---</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Thumbnail</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Title</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">Hashtags</th>
                                                <th className="px-4 py-2 text-xs text-white text-left" />
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {cards.map((card: any, index: number) => {
                                                return (
                                                    <tr key={card._id}>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{++index}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">
                                                            {card.imageUrl ? <Image src={card.imageUrl} alt={card.title} width={50} height={50} quality={5} /> : "------"}
                                                        </td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{card.title}</td>
                                                        <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">
                                                            {card.hashtags.length > 0 ? card.hashtags.map((hashtag: any) => `${hashtag.title}, `) : "---"}
                                                        </td>
                                                        <td className="border px-4 py-2 text-yellow-600 border-blue-500 font-medium">
                                                            <div className="divide-x-2 divide-neutral-900 divide-double">
                                                                <Link href={`/cards/${card._id}`}>
                                                                    <a className="text-green-600 px-2">View</a>
                                                                </Link>
                                                                <Link href={`/cards/${card._id}/edit/`}>
                                                                    <a className="px-2">Edit</a>
                                                                </Link>
                                                                <button onClick={() => handleDeleteCard(card._id)} className="px-2">
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

export default withAuth(AllCard);