import React from "react";
import { useQuery } from "@tanstack/react-query";

import { userDelete, userGetAll } from "../../http";
import { dateMethods, withAuth } from "../../utils";
import { Loading, NavigationBar } from "../../components";

import type { NextPage } from "next";
import type { AxiosResponse } from "axios";

const Users: NextPage = () => {
    const [orginalData, setOriginalData] = React.useState<null | any[]>(null);
    const [users, setUsers] = React.useState<null | any>(null);

    const { refetch: refetchUsers } = useQuery(["users"], userGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setUsers(data);
            setOriginalData(data);
        }
    });

    const handleSearch = (event: any) => {
        const value = event.target.value.toLowerCase();
        const result = orginalData?.filter((data) => JSON.stringify(data).toLowerCase().includes(value));
        setUsers(result as any[]);
    };

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    {!users && <Loading isParent={false} />}

                    {users && (
                        <>
                            <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">Users</section>

                            <input type="search" placeholder="Search..." className="input input-bordered w-full" onChange={handleSearch} />

                            <div className="overflow-x-auto pt-3">
                                <table className="table table-compact table-zebra w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-sm">#</th>
                                            <th className="text-sm">Role</th>
                                            <th className="text-sm">Code Name</th>
                                            <th className="text-sm">Organisation</th>
                                            <th className="text-sm">Last Active</th>
                                            <th className="text-sm">Date Joined</th>
                                            <th className="text-sm" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user: any, index: number) => (
                                            <tr key={user._id}>
                                                <th>{++index}</th>
                                                <td>{user.role}</td>
                                                <td>{user.codeName}</td>
                                                <td>{user.organisationRef?.name || "---"}</td>
                                                <td>{dateMethods.parseHumanReadable(user.lastActive)}</td>
                                                <td>{dateMethods.parseMonthDateYearTime(user.createdAt)}</td>
                                                <td>
                                                    <div className="flex flex-row gap-4">
                                                        {/* <Link href={`/users/${user._id}`} className="text-blue-500">
                                                            View
                                                        </Link> */}
                                                        {/* <Link href={`/users/${user._id}/edit`} className="text-yellow-500">
                                                            Edit
                                                        </Link> */}
                                                        <button
                                                            onClick={async () => {
                                                                if (!window.confirm("Are you sure you want to delete this user, this cannot be undone")) return;
                                                                await userDelete(user._id);
                                                                refetchUsers();
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

export default withAuth(Users);
