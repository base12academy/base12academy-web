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
    ];
  },
};

export default nextConfig;
