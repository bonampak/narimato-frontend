import React from "react";

const LandingPageFooter = () => {
    return (
        <footer className="mx-auto container xl:px-20 lg:px-12 sm:px-6 px-4 py-8">
            <div className="flex flex-col items-center justify-center">
                <div className="flex items-center mt-6">
                    <p className="text-base leading-4 text-gray-800">
                        {new Date().getFullYear()} &copy; <span className="font-semibold text-blue-600">Haikoto</span>
                    </p>
                    <div className="border-l border-gray-800 pl-2 ml-2">
                        <p className="text-base leading-4 text-gray-800">All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default LandingPageFooter;
