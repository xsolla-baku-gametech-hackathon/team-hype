import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid `next dev` regenerating AGENTS.md/CLAUDE.md on every run — this
  // repo's own AI-assistant guidance lives in the README instead.
  agentRules: false,
};

export default nextConfig;
