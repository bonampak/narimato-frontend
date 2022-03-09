import React from "react";
import Head from "next/head";
import "../styles/globals.css";
import TagManager from "react-gtm-module";
import { ToastContainer } from "react-toastify";
import { NextRouter, useRouter } from "next/router";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";

import { LoadingComponent } from "../components";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
    const router: NextRouter = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const [queryClient] = React.useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));

    React.useEffect(() => {
        // Google Tag Manager Init
        TagManager.initialize({ gtmId: "GTM-K376DMR" });

        const handleStart = (url: string) => (url !== router.pathname ? setIsLoading(true) : setIsLoading(false));
        const handleComplete = (url: string) => setIsLoading(false);

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);
    }, []);

    return (
        <>
            <Head>
                <title>Haikoto - Creating a unique workplace culture</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ToastContainer newestOnTop={true} pauseOnHover={false} autoClose={3000} />

            {isLoading && <LoadingComponent text="Getting things reading... 🙃" />}

            <QueryClientProvider client={queryClient}>
                {!isLoading && <Component {...pageProps} />}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}

export default MyApp;
