import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid `next dev` regenerating AGENTS.md/CLAUDE.md on every run — this
  // repo's own AI-assistant guidance lives in the README instead.
  agentRules: false,
  images: {
    // Must match STEAM_CDN_HOSTNAME in src/lib/steam/media.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.akamai.steamstatic.com",
        pathname: "/steam/apps/**",
      },
    ],
  },
};

export default nextConfig;
