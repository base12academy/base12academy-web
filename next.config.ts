import type { NextConfig } from "next";

const TRAINING_HOST = "training.base12academy.es";
const trainingHost = [{ type: "host" as const, value: TRAINING_HOST }];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: trainingHost,
          destination: "/apps/base12-training",
        },
        {
          source: "/manifest.webmanifest",
          has: trainingHost,
          destination: "/apps/base12-training/manifest.webmanifest",
        },
        {
          source: "/favicon.ico",
          has: trainingHost,
          destination: "/icons/base12-training.ico",
        },
        {
          source: "/sw.js",
          has: trainingHost,
          destination: "/training-sw.js",
        },
        {
          source: "/login",
          has: trainingHost,
          destination: "/apps/base12-training/login",
        },
        {
          source: "/register",
          has: trainingHost,
          destination: "/apps/base12-training/register",
        },
        {
          source: "/reset-password",
          has: trainingHost,
          destination: "/apps/base12-training/reset-password",
        },
        {
          source: "/icons/base12-192.png",
          has: trainingHost,
          destination: "/images/training/base12-training-192.png",
        },
        {
          source: "/icons/base12-512.png",
          has: trainingHost,
          destination: "/apps/base12-training/icon-512.png",
        },
        {
          source: "/icons/apple-touch-icon.png",
          has: trainingHost,
          destination: "/images/training/base12-training-180.png",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    return [
      {
        source: "/dashboard/:path*",
        has: trainingHost,
        destination: `https://${TRAINING_HOST}/`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
