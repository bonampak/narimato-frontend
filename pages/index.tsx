import Link from "next/link";

import { LandingPageFooter, LandingPageTopNavigationBar } from "../components";

import type { NextPage } from "next";

const Home: NextPage = () => {
    return (
        <>
            <LandingPageTopNavigationBar />

            <main className="flex flex-col items-center">
                <div className="flex flex-col w-full items-center space-y-10 bg-gray-100 p-10 md:py-24">
                    <h2 className="max-w-4xl text-center text-3xl md:text-6xl font-bold">
                        <span className="text-blue-600">Know More</span> about your soft skills and get ready for your next <span className="text-blue-600">JOB</span>
                    </h2>

                    <p className="max-w-3xl text-center text-sm md:text-xl font-normal">We are creating a unique workspace culture! We help you to build your SKILL MAP! Choose the cards that best suit you!</p>

                    <Link className="btn btn-lg btn-wide bg-blue-600 hover:bg-blue-700 border-none" href={"/auth/login"}>
                        Get Started
                    </Link>
                </div>

                <div className="flex flex-col w-full max-w-7xl items-center p-10 md:py-24">
                    <h2 className="lg:text-6xl text-4xl font-black leading-10 text-center text-gray-800">How It Works!</h2>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-5 mt-10">
                        <div className="shadow border bg-white p-10">
                            <h2 className="text-left text-2xl font-semibold">Create an Account</h2>
                            <p className=" text-left text-base font-normal mt-2">Click get started to create an account by simply choosing a codeName</p>
                        </div>

                        <div className="shadow border bg-white p-10">
                            <h2 className="text-left text-2xl font-semibold">Play Cards</h2>
                            <p className=" text-left text-base font-normal mt-2">After you get logged in, you can play cards. Simply Swipe left or right according to your preference</p>
                        </div>

                        <div className="shadow border bg-white p-10">
                            <h2 className="text-left text-2xl font-semibold">Edit Results</h2>
                            <p className=" text-left text-base font-normal mt-2">Edit Results after you have played cards, using a complex algorithm we rank your matches.</p>
                        </div>
                    </div>
                </div>
            </main>

            <LandingPageFooter />
        </>
    );
};

export default Home;
