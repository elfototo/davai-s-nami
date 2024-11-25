/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*', // Все запросы, начинающиеся с /api/
  //       destination: 'http://159.223.239.75:8005/api/:path*', // Перенаправить на API-сервер
  //     },
  //   ];
  // },
};

export default nextConfig;