/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BACKEND_BASE_URL: process.env.BACKEND_BASE_URL || "http://localhost:4000"
    },
    images: {
        domains: ["i.ibb.co"]
    },
    async redirects() {
        return [
            {
                source: "/login",
                destination: "/auth/login",
                permanent: true
            },
            {
                source: "/logout",
                destination: "/auth/logout",
                permanent: true
            }
        ];
    }
};

module.exports = nextConfig;
