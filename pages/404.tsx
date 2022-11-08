import Head from "next/head";
import Link from "next/link";

import { NextPage } from "next";

const Custom404: NextPage = () => {
    return (
        <>
            <Head>
                <title>404 - Haikoto</title>
            </Head>

            <div className="flex items-center justify-center min-h-screen bg-blue-700">
                <div className="container">
                    <div className="text-white text-center">
                        <div className="relative">
                            <h1 className="relative text-9xl font-sans font-bold">
                                <span>4</span>
                                <span>0</span>
                                <span>4</span>
                            </h1>
                        </div>

                        <h5 className="text-gray-300 font-semibold mt-5">Page not found</h5>

                        <p className="text-gray-100 mt-3">We are sorry, but the page you requested was not found</p>

                        <Link href="/" className="btn btn-wide rounded bg-white hover:bg-white text-black border-none mt-5">
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Custom404;
