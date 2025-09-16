/** @type {import('next').NextConfig} */
module.exports = {
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.vercel.com',
                port: '',
                pathname: '/image/upload/**',
            },
            {
                protocol: 'https',
                hostname: '**.fbcdn.net',
            },
            {
                protocol: 'https',
                hostname: 'bvzdouqtahdyiaaxywsw.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/post-imgs/**',
            },
            {
                protocol: 'https',
                hostname: 'bvzdouqtahdyiaaxywsw.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/kadra/**',
            },
        ],
    },
};