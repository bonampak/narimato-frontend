import React from "react";
import Link from "next/link";
import { useUser } from "../utils";

const TopNavigationBar = () => {
    const { user } = useUser();

    const [isMobileNavExpanded, setIsMobileNavExpanded] = React.useState<boolean>(false);

    return (
        <>
            <div>
                {/* Top Nav, Hidden on PC */}
                <nav className="w-full flex flex-row justify-between items-center bg-blue-800 sticky lg:hidden px-5">
                    <img className="h-7 w-auto" src="/assets/logo/icon.svg" alt="narimato-logo-icon" />

                    <Link href="/dashboard" className="block p-4 text-white font-bold">
                        Narimato
                    </Link>

                    <button className="p-2" onClick={() => setIsMobileNavExpanded(!isMobileNavExpanded)}>
                        <svg className="h-5 w-5 stroke-white lg:stroke-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </nav>

                {/* Side Nav, Hidden on Mobile */}
                <div className={["w-64 h-screen lg:max-h-screen shadow fixed lg:relative inset-y-0 left-0 overflow-y-auto transform lg:translate-x-0 transition duration-200 bg-blue-800 py-5 px-4 z-50", !isMobileNavExpanded && "-translate-x-full"].join(" ")}>
                    <div className="flex text-white text-3xl font-bold p-1 py-2 mb-5 gap-4">
                        <img src="/assets/logo/icon.svg" className="w-8 h-8" alt="Logo" />
                        Narimato
                    </div>

                    <div className="space-y-3">
                        <Link href="/dashboard" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                            dashboard
                        </Link>

                        <Link href="/survey" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                            Start a Survey
                            <span className="block text-xs">Play cards to build up your rank</span>
                        </Link>
                    </div>

                    {/* {user && !user.organisation && (
                        <Link href="/dashboard/about-me" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                            About Me
                        </Link>
                    )} */}

                    {user && user.role === "admin" && (
                        <>
                            <span className="block py-2.5 px-4 text-white opacity-40 text-xs uppercase border-y-[0.5px] my-2">Admin</span>

                            <Link href="/cards/new" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Create new Card
                            </Link>

                            <Link href="/cards" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Manage Cards
                            </Link>

                            <Link href="/users/new" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Create new admin
                            </Link>

                            <Link href="/users" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Manage Users
                            </Link>

                            <Link href="/organisations/new" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Create new Organisation
                            </Link>

                            <Link href="/organisations" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Manage Organisations
                            </Link>

                            <Link href="/hashtags/new" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Create new Hashtag
                            </Link>

                            <Link href="/hashtags" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Manage Hashtags
                            </Link>

                            <Link href="/projects/new" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Create new Project
                            </Link>

                            <Link href="/projects" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Manage Projects
                            </Link>

                            <Link href="/surveys" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Manage Surveys
                            </Link>

                            <span className="block py-2.5 px-4 text-white opacity-40 text-xs uppercase border-y-[0.5px] my-2">In Preview</span>

                            <a href="https://hexa-mypd.herokuapp.com/app.html" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Use Hexa
                            </a>

                            <a href="https://hexa-mypd.herokuapp.com/train.html" className="block rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                                Train Hexa
                            </a>
                        </>
                    )}

                    <span className="block py-2.5 px-4 text-white opacity-40 text-xs uppercase border-y-[0.5px] my-2" />

                    <div className="space-y-3">
                        <Link href="/auth/logout" className="flex rounded transition duration-200 hover:bg-blue-700 text-white capitalize py-2.5 px-4">
                            <span>
                                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.89999 7.55999C9.20999 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.23999 20.08 8.90999 16.54" stroke="#D14343" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15 12H3.62" stroke="#D14343" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5.85 8.64999L2.5 12L5.85 15.35" stroke="#D14343" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span className="ml-2 text-red-500">Logout</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopNavigationBar;
