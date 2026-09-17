import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "training.base12academy.es" }],
        destination: "/apps/base12-training",
      },
      {
        source: "/manifest.webmanifest",
        has: [{ type: "host", value: "training.base12academy.es" }],
        destination: "/apps/base12-training/manifest.webmanifest",
      },
      {
        source: "/icons/base12-192.png",
        has: [{ type: "host", value: "training.base12academy.es" }],
        destination: "/images/training/base12-training-192.png",
      },
      {
        source: "/icons/base12-512.png",
        has: [{ type: "host", value: "training.base12academy.es" }],
        destination: "/apps/base12-training/icon-512.png",
      },
      {
        source: "/icons/apple-touch-icon.png",
        has: [{ type: "host", value: "training.base12academy.es" }],
        destination: "/images/training/base12-training-180.png",
      },
      {
        source: "/favicon.ico",
        has: [{ type: "host", value: "training.base12academy.es" }],
        destination: "/images/training/base12-training-192.png",
      },
    ];
  },
};

export default nextConfig;
