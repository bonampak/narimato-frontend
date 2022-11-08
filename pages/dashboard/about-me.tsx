import React from "react";

import { withAuth } from "../../utils";
import { NavigationBar } from "../../components";

import type { NextPage } from "next";

const AboutMe: NextPage = () => {
    return (
        <>
            <div className="relative min-h-screen lg:flex">
                <NavigationBar />

                <div className="flex-1 p-5 md:pt-10 max-h-screen overflow-y-auto">
                    <section className="w-full bg-gray-200 rounded text-xl md:text-3xl text-black font-bold my-4 p-5">About Me</section>
                </div>
            </div>
        </>
    );
};

export default withAuth(AboutMe);
