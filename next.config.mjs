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
};

export default nextConfig;
