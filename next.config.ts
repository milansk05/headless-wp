/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'http://headless-wp.local/graphql', // Vervang dit door jouw WordPress URL
      },
    ];
  },
};

export default nextConfig;