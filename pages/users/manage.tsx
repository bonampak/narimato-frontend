import React from "react";
import Head from "next/head";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import { withAuth } from "../../utils";
import { userDelete, userGetAll, userUpdateRole } from "../../api";
import { LoadingComponent, NavigationBarComponent } from "../../components";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const ManageUser: NextPage = () => {
    const router = useRouter();

    const [users, setUsers] = React.useState<null | any[]>(null);

    const { isLoading: isLoadingUsers } = useQuery("users", userGetAll, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setUsers(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message, {
                onClose: () => router.push("/dashboard")
            });
        }
    });

    const { mutate: deleteUser } = useMutation(userDelete, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setUsers((users as any).filter((user: any) => user._id !== data._id));
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const { mutate: upgradeUser } = useMutation((context: any) => userUpdateRole(context.userId, context.data), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            const updatedUsers = (users as any[]).map((user) => {
                if (user._id === data._id) user.role = "admin";
                return user;
            });
            setUsers(updatedUsers);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    async function handleDeleteUser(userId: string) {
        if (confirm("Are you sure you want to delete this user?")) deleteUser(userId);
    }

    async function handleUpgradeUser(userId: string) {
        if (confirm("Are you sure you want to make user admin?")) upgradeUser({ userId, data: { role: "admin" } });
    }

    return (
        <>
            <Head>
                <title>All Users - Haikoto</title>
            </Head>

            <div className="relative min-h-screen md:flex">
                <NavigationBarComponent />

                <div className="flex-1 p-10 text-2xl font-bold max-h-screen overflow-y-auto">
                    {!users && isLoadingUsers && <LoadingComponent />}

                    {users && !isLoadingUsers && (
                        <div className="items-center justify-center">
                            <section className="my-4 w-full p-5 rounded bg-gray-200 bg-opacity-90">All Users</section>

                            <div className="mb-10">
                                <div className="overflow-x-auto">
                                    <table className="table-auto w-full">
                                        <thead className="bg-blue-600">
                                            <tr>
                                                <th className="px-4 py-2 text-xs text-white text-left">---</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">User ID - Role</th>
                                                <th className="px-4 py-2 text-xs text-white text-left">CodeName</th>
                                                <th className="px-4 py-2 text-xs text-white text-left" />
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {users.map((user: any, index: number) => (
                                                <tr key={user._id}>
                                                    <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{++index}</td>
                                                    <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{user.role}</td>
                                                    <td className="border px-4 py-2 text-blue-600 border-blue-500 font-medium">{user.codeName}</td>
                                                    <td className="border px-4 py-2 text-yellow-600 border-blue-500 font-medium">
                                                        <div className="divide-x-2 divide-neutral-900 divide-double">
                                                            <button onClick={() => handleUpgradeUser(user._id)}>
                                                                <a className="px-2 text-yellow-600">Promote</a>
                                                            </button>
                                                            <button onClick={() => handleDeleteUser(user._id)}>
                                                                <a className="px-2 text-red-600">Delete</a>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
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

export default withAuth(ManageUser);
