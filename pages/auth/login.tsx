import React from "react";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import { setCookies } from "cookies-next";
import { useMutation } from "react-query";
import { NextRouter, useRouter } from "next/router";

import { authLogin } from "../../api";
import { withoutAuth } from "../../utils";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const LoginOrSignup: NextPage = () => {
    const router: NextRouter = useRouter();

    const { isLoading: isLoadingLogin, mutate: mutateLogin } = useMutation(authLogin, {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setCookies("auth-token", data.token, { maxAge: 60 * 60 });
            toast.success("Login successful, redirecting...", {
                onClose: () => router.reload()
            });
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataToJSON = Object.fromEntries(formData);
        mutateLogin(formDataToJSON);
    };

    return (
        <>
            <Head>
                <title>Login | Signup - Haikoto</title>
            </Head>

            <div className="w-full flex flex-wrap">
                <div className="w-1/2 hidden md:block">
                    <img src="/assets/loginOrSignupBanner.png" className="object-cover w-full h-screen" alt="login-banner" />
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
                        <Link href="/">
                            <a className="bg-blue-600 text-white font-bold text-xl p-4">Haikoto</a>
                        </Link>
                    </div>
                    <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
                        <p className="text-center text-3xl">Get Started</p>
                        <form className="flex flex-col pt-3 md:pt-8" onSubmit={handleSubmit}>
                            <div className="flex flex-col pt-4">
                                <label className="text-lg">Code Name</label>
                                <input
                                    type="text"
                                    name="codeName"
                                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <button
                                disabled={isLoadingLogin}
                                type="submit"
                                className={["bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 p-2 mt-8", isLoadingLogin ? "opacity-50" : "opacity-100"].join(" ")}
                            >
                                Proceed
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withoutAuth(LoginOrSignup);
