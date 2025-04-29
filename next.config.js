/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // More detailed remote patterns for better security
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
      // Placeholder image services
      {
        protocol: 'https',
        hostname: 'placehold.it',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Add any other domains you need here
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   port: '',
      //   pathname: '/wp-content/uploads/**',
      // },
    ],

    // Afbeeldingsformaten configureren
    formats: ['image/avif', 'image/webp'],

    // Configureer de plaatsvervanger voor afbeeldingen tijdens het laden
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Schakel automatische minimization in (in productie)
    minimumCacheTTL: 60, // Caching in seconden
    dangerouslyAllowSVG: false, // SVG's alleen toestaan als je ze vertrouwt
  },

  // Proxying van WordPress API requests voor betere CORS support
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://headless-wp.local/graphql',
      },
    ];
  },

  // Experimentele functies
  experimental: {
    // Content Security Policy - Uncomment als je dit wilt instellen
    // contentSecurityPolicy: {
    //   directives: {
    //     'img-src': ["'self'", 'data:', '*.wp.com', 'secure.gravatar.com', 'headless-wp.local'],
    //   },
    // },
  },
};

module.exports = nextConfig;