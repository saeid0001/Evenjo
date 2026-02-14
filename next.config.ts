import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
      // {
      //   protocol: "https",
      //   hostname: "images.unsplash.com",
      // },
      // {
      //   protocol: "https",
      //   hostname: "graziamagazine.com",
      // },
      // {
      //   protocol: "https",
      //   hostname: "i.dawn.com",
      // },
      // {
      //   protocol: "https",
      //   hostname: "upload.wikimedia.org",
      // },
      // {
      //   protocol: "https",
      //   hostname: "lh3.googleusercontent.com",
      // },
    ],
  },
};

export default nextConfig;
