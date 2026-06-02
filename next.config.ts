import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Best-effort: increase global request parsing limit for large inputs.
    // Next route handlers don't expose a dedicated per-route body limit.
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
