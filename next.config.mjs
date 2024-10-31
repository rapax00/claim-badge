/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_NOSTR_BADGE_EMITTER_PRIV: process.env.NOSTR_BADGE_EMITTER_PRIV,
    NEXT_NOSTR_BADGE_EMITTER_PUB: process.env.NOSTR_BADGE_EMITTER_PUB,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Reemplaza "*" con tu dominio si lo necesitas más restringido
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
