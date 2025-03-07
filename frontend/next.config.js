/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://backend:3001/api/:path*', // Proxy dans Docker
            },
        ];
    },
};

module.exports = nextConfig;