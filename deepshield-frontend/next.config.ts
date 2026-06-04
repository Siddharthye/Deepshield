import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.BACKEND_URL?.replace(/\/$/, "") ||
  "https://deepshield-xi.vercel.app";

/** API routes implemented on the backend app — do not proxy /api/auth/* (OAuth lives here). */
const BACKEND_API_ROUTES = [
  "scan-image",
  "scan-video-frame",
  "explain",
  "asha-chat",
  "rights-explainer",
  "translate",
  "moderate-post",
  "reverse-trace",
  "trace-upload",
  "trace-image-proxy",
] as const;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return BACKEND_API_ROUTES.map((route) => ({
      source: `/api/${route}`,
      destination: `${BACKEND_URL}/api/${route}`,
    }));
  },
};

export default nextConfig;
