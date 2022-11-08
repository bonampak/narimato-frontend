/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        BACKEND_BASE_URL: process.env.BACKEND_BASE_URL || "http://localhost:4000"
    },
    images: {
        domains: ["i.ibb.co", "localhost"]
    },
    async redirects() {
        return [
            {
                source: "/login",
                destination: "/auth/login",
                permanent: false
            },
            {
                source: "/logout",
                destination: "/auth/logout",
                permanent: false
            }
        ];
    }
};

module.exports = nextConfig;
