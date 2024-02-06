import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { setCookies } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
import { NextRouter, useRouter } from "next/router";

import { authLogin, organisationGetOneBySlug } from "../http";

import type { AxiosError } from "axios";
import type { NextPage, NextPageContext } from "next";

const CompanyLogin: NextPage = ({ organisation }: any) => {
    const router: NextRouter = useRouter();

    const { isLoading, mutate } = useMutation(authLogin, {
        onSuccess: (response: any) => {
            const { token } = response.data.data;
            setCookies("auth-token", token, { maxAge: 60 * 60 });
            toast.success("Login successful, redirecting...");
            setTimeout(() => router.push("/dashboard"), 1500);
        },
        onError: (error: AxiosError<any>) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataToJSON = Object.fromEntries(formData);

        formDataToJSON["organisationRef"] = organisation._id;

        mutate(formDataToJSON);
    };

    return (
        <>
            <div className="w-full flex flex-wrap">
                <div className="w-full md:w-1/2 flex flex-col my-auto">
                    <div className="flex justify-center pt-12">
                        <img src={organisation.logoUrl} className="h-32 aspect-video object-contain" alt="logo" />
                    </div>

                    <div className="flex flex-col justify-center pt-8 md:pt-5 px-8 md:px-24 lg:px-32">
                        <h2 className="block text-center text-2xl font-bold">{organisation.name}</h2>

                        <form className="my-5 space-y-3" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="codeName" className="label">
                                    <span className="label-text text-base">Email</span>
                                </label>
                                <input type="text" name="codeName" className="input input-bordered rounded w-full" required />
                            </div>

                            <button type="submit" disabled={isLoading} className={["btn btn-block rounded bg-red-600 hover:bg-red-700 border-none no-animation", isLoading && "loading"].join(" ")}>
                                Get Started
                            </button>
                        </form>
                    </div>
                </div>

                <div className="w-1/2 hidden md:block">
                    <img src="/assets/images/loginOrSignupBanner.png" className="object-cover w-full h-screen" alt="login-banner" />
                </div>
            </div>
        </>
    );
};

// This gets called on every request
export async function getServerSideProps(context: NextPageContext) {
    const { company } = context.query;

    try {
        // Run Axios check
        const { data: response } = await organisationGetOneBySlug(company as string);

        // Pass data to the page via props
        return { props: { organisation: response.data } };
    } catch (error) {
        // If not found, throw 404 page
        return { notFound: true };
    }
}

export default CompanyLogin;
