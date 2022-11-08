import Head from "next/head";
import Link from "next/link";

import { NextPage } from "next";

const Custom500: NextPage = () => {
    return (
        <>
            <Head>
                <title>500 - Haikoto</title>
            </Head>

            <div className="flex items-center justify-center min-h-screen bg-blue-700">
                <div className="container">
                    <div className="text-white text-center">
                        <div className="relative">
                            <h1 className="relative text-9xl font-sans font-bold">
                                <span>5</span>
                                <span>0</span>
                                <span>0</span>
                            </h1>
                        </div>

                        <h5 className="text-gray-300 font-semibold mt-5">Internal Server Error.</h5>

                        <Link href="/" className="btn btn-wide rounded bg-white hover:bg-white text-black border-none mt-5">
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Custom500;
