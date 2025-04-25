/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'headless-wp.local',
      'secure.gravatar.com',
      'www.gravatar.com',
      'i0.wp.com',
      'i1.wp.com',
      'i2.wp.com',
      'localhost',
      'placehold.it',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'headless-wp.local',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.wp.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'http://headless-wp.local/graphql', // Wijzig dit naar jouw WordPress URL
      },
    ];
  },
};

module.exports = nextConfig;