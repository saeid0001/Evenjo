import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "graziamagazine.com",
      },
      {
        protocol: "https",
        hostname: "i.dawn.com",
      },
    ],
  },
};

export default nextConfig;
