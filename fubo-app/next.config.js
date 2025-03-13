/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'example.com',
      'imgx.fubo.tv',
      'gn-imgx.fubo.tv',
      'via.placeholder.com',
      'placehold.co',
      'placeholder.com'
    ],
  },
  // Needed for local development with dev-api.fubo.tv CORS restrictions
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dev-api.fubo.tv/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 