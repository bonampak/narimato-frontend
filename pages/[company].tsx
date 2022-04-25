import React from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import Lottie from "react-lottie-player";
import { setCookies } from "cookies-next";
import { NextRouter, useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";

import { withoutAuth } from "../utils";
import { LoadingComponent } from "../components";
import { LottieLoginAnimationData } from "../assets";
import { authLogin, organisationGetOneBySlugUrl } from "../api";

import type { AxiosError, AxiosResponse } from "axios";
import type { NextPage } from "next";

const CompanyLoginOrSignup: NextPage = () => {
    const router: NextRouter = useRouter();

    const { company } = router.query;

    const [organisation, setOrganisation] = React.useState<null | any>(null);

    const { isLoading } = useQuery(["organisation", company], () => organisationGetOneBySlugUrl(company as string), {
        onSuccess: (response: AxiosResponse) => {
            const { data } = response.data;
            setOrganisation(data);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
            router.push("/");
        },
        enabled: !!company
    });

    const { isLoading: isLoadingLogin, mutate: mutateLogin } = useMutation(authLogin, {
        onSuccess: (response: AxiosResponse) => {
            const { data, message } = response.data;
            setCookies("auth-token", data.token, { maxAge: 60 * 60 });
            toast.success(message);
            // setInterval(() => router.reload(), 2000);
            setInterval(() => window.location.replace("/dashboard"), 2000);
        },
        onError: (error: AxiosError) => {
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const formDataToJSON: any = Object.fromEntries(formData);

        formDataToJSON["organisation"] = organisation._id;

        mutateLogin(formDataToJSON);
    };

    return (
        <>
            <Head>
                <title>Login | Signup - Haikoto</title>
            </Head>

            {isLoading && <LoadingComponent text="" description="" />}

            {!isLoading && organisation && (
                <div className="w-full flex flex-wrap">
                    <div className="w-full md:w-1/2 flex flex-col">
                        <div className="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
                            <img src={organisation.logoUrl} className="max-h-20" alt="organisation-logo" />
                        </div>
                        <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
                            <p className="text-center text-3xl">Login | Signup</p>
                            <form className="flex flex-col pt-3 md:pt-8" onSubmit={handleSubmit}>
                                <div className="flex flex-col pt-4">
                                    <label className="text-lg">Email</label>
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

                    <div className="w-1/2 shadow-2xl">
                        <Lottie className="object-cover w-full h-screen hidden md:block" animationData={LottieLoginAnimationData} loop={true} play={true} />
                    </div>
                </div>
            )}
        </>
    );
};

export default withoutAuth(CompanyLoginOrSignup);
