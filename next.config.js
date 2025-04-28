/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Domains voor externe afbeeldingen toestaan
    domains: [
      // WordPress gerelateerde domeinen
      'headless-wp.local',
      'localhost',
      'secure.gravatar.com',
      'www.gravatar.com',

      // WordPress.com / Jetpack domeinen
      'i0.wp.com',
      'i1.wp.com',
      'i2.wp.com',
      'i3.wp.com',
      'i4.wp.com',
      's0.wp.com',
      's1.wp.com',
      's2.wp.com',

      // WordPress media subdomeinen - voeg je eigen WordPress domein toe
      'http://headless-wp.local/', // vervang met je eigen domein
      'http://headless-wp.local/wp-admin/upload.php/', // vervang met je eigen media subdomein

      // Placeholder afbeeldingsdiensten
      'placehold.it',
      'via.placeholder.com',
      'placekitten.com',
      'picsum.photos',
      'source.unsplash.com',
    ],

    // Meer gedetailleerde remote patterns voor betere veiligheid
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
      // Voeg je eigen WordPress site toe
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

    // Kwaliteitsniveau voor afbeeldingsoptimalisatie (0-100)
    // Lagere waarde = kleinere bestanden, minder kwaliteit
    // Hogere waarde = grotere bestanden, betere kwaliteit
    quality: 80,

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