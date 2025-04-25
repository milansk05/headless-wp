/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['headless-wp.local'], // Voeg hier je WordPress domein toe
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'headless-wp.local',
        port: '',
        pathname: '/**',
      },
      // Voeg extra patronen toe indien nodig, bijvoorbeeld voor staging of productie
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