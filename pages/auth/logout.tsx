import React from "react";
import { removeCookies } from "cookies-next";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../utils";
import { Loading } from "../../components";

import type { NextPage } from "next";

const Logout: NextPage = () => {
    const router: NextRouter = useRouter();

    React.useEffect(() => {
        // Delete auth-token cookie
        removeCookies("auth-token");

        // Clear local storage
        localStorage.clear();

        // Redirect to login page
        setTimeout(() => router.push("/auth/login"), 1500);
    }, []);

    return <Loading text="Logging out.." description="You will be redirected to the homepage in a few seconds." isParent={true} />;
};

export default withAuth(Logout);
