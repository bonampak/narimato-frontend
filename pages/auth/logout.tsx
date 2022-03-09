import React from "react";
import { removeCookies } from "cookies-next";
import { NextRouter, useRouter } from "next/router";

import { withAuth } from "../../utils";
import { LoadingComponent } from "../../components";

import type { NextPage } from "next";

const Logout: NextPage = () => {
    const router: NextRouter = useRouter();

    React.useEffect(() => {
        // Delete auth-token cookie
        removeCookies("auth-token");

        // Redirect to login page
        setTimeout(() => router.replace("/"), 2000);
    }, []);

    return <LoadingComponent text="Logging out.." description="You will be redirected to the homepage in a few seconds." />;
};

export default withAuth(Logout);
