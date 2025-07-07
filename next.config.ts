import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.chowdeck.com",
      },
      {
        protocol: "https",
        hostname: "menu-images-production.s3.eu-west-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
