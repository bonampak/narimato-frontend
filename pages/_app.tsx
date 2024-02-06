import React from "react";
import Head from "next/head";
import "../styles/globals.css";
import TagManager from "react-gtm-module";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } }));

    React.useEffect(() => {
        // Google Tag Manager Init
        TagManager.initialize({ gtmId: "GTM-K376DMR" });
    }, []);

    return (
        <>
            <Head>
                <title>Narimato - Creating a unique workplace culture</title>

                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="title" content="Narimato - Creating a unique workplace culture" />
                <meta name="description" content="Creating a unique workspace culture to build your SKILL Map by choosing cards that best suits you!" />

                <link rel="icon" href="https://narimato.com/assets/logo/icon.png" />

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://narimato.com/" />
                <meta property="og:title" content="Narimato - Creating a unique workplace culture" />
                <meta property="og:description" content="Creating a unique workspace culture to build your SKILL Map by choosing cards that best suits you!" />
                <meta property="og:image" content="https://narimato.com/assets/site-metaimage.png" />

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://narimato.com/" />
                <meta property="twitter:title" content="Narimato - Creating a unique workplace culture" />
                <meta property="twitter:description" content="Creating a unique workspace culture to build your SKILL Map by choosing cards that best suits you!" />
                <meta property="twitter:image" content="https://narimato.com/assets/site-metaimage.png" />
            </Head>

            <ToastContainer newestOnTop={true} pauseOnHover={false} autoClose={3000} />

            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />

                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}

export default App;
