import React from "react";
import Link from "next/link";

const LandingPageTopNavigationBar = () => {
    const [isMobileNavExpanded, setIsMobileNavExpanded] = React.useState<boolean>(false);

    return (
        <nav className="flex flex-col md:flex-row w-full max-w-7xl justify-between md:items-center gap-5 m-auto p-5">
            <div className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-black text-blue-600 md:text-3xl">
                    Narimato
                </Link>

                <div className="flex md:hidden">
                    <button type="button" className="text-black focus:outline-none" onClick={() => setIsMobileNavExpanded(!isMobileNavExpanded)}>
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                            <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div className={["flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-10 md:block", isMobileNavExpanded ? "block" : "hidden"].join(" ")}>
                <Link href="/" className="text-black text-base hover:text-blue-600">
                    Home
                </Link>
                <Link href={`mailto:hello@narimato.com`} className="text-black text-base hover:text-blue-600">
                    Contact us
                </Link>
            </div>

            <Link href="/auth/login" className={["btn bg-blue-600 hover:bg-blue-700 border-none rounded no-animation md:flex", isMobileNavExpanded ? "flex" : "hidden"].join(" ")}>
                Get Started
            </Link>
        </nav>
    );
};

export default LandingPageTopNavigationBar;
