import React from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { withAuth } from "../../utils";
import { userCreate } from "../../http";
import { NavigationBar } from "../../components";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const NewUser: NextPage = () => {
    const { isLoading, mutate } = useMutation(userCreate, {
        onSuccess: (response: AxiosResponse) => {
            toast.success(response.data.message);
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataToJSON = Object.fromEntries(formData);
        mutate(formDataToJSON);
    };

    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">New User</section>

                    <div className="w-full max-w-lg">
                        <form className="my-5 space-y-3" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="codeName" className="label">
                                    <span className="label-text text-base">CodeName</span>
                                </label>
                                <input type="text" name="codeName" className="input input-bordered rounded focus:border-primary-300 w-full" required />
                            </div>

                            <div>
                                <label htmlFor="role" className="label">
                                    <span className="label-text text-base">Role</span>
                                </label>
                                <select name="role" className="select select-bordered rounded focus:border-primary-300 w-full" required>
                                    <option value="admin">admin</option>
                                    <option value="user">user</option>
                                </select>
                            </div>

                            <button type="submit" disabled={isLoading} className={["btn rounded bg-blue-600 hover:bg-blue-700 text-white w-full no-animation", isLoading && "loading"].join(" ")}>
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withAuth(NewUser);
