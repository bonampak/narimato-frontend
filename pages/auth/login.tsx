import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { setCookies } from "cookies-next";
import { NextRouter, useRouter } from "next/router";

import { authLogin } from "../../http";
import { withoutAuth } from "../../utils";

import type { NextPage } from "next";
import type { AxiosError } from "axios";

const Login: NextPage = () => {
    const router: NextRouter = useRouter();

    const { isLoading, mutate } = useMutation(authLogin, {
        onSuccess: (response: any) => {
            const { token } = response.data.data;
            setCookies("auth-token", token, { maxAge: 60 * 60 });
            toast.success("Login successful, redirecting...");
            setTimeout(() => router.reload(), 1500);
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
            <div className="w-full flex flex-wrap">
                <div className="w-1/2 hidden md:block">
                    <img src="/assets/images/loginOrSignupBanner.png" className="object-cover w-full h-screen" alt="login-banner" />
                </div>

                <div className="w-full md:w-1/2 flex flex-col my-auto">
                    <div className="flex justify-center pt-12">
                        <img src="/assets/logo/icon.png" className="h-32 aspect-video object-contain" alt="logo" />
                    </div>

                    <div className="flex flex-col justify-center pt-8 md:pt-5 px-8 md:px-24 lg:px-32">
                        <form className="my-5 space-y-3" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="codeName" className="label">
                                    <span className="label-text text-base">CodeName</span>
                                    {/* <span className="label-text text-base">Email Address</span> */}
                                </label>
                                <input type="text" name="codeName" className="input input-bordered rounded w-full" required />
                            </div>

                            <button type="submit" disabled={isLoading} className={["btn btn-block rounded bg-red-600 hover:bg-red-700 border-none no-animation", isLoading && "loading"].join(" ")}>
                                Get Started
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withoutAuth(Login);
