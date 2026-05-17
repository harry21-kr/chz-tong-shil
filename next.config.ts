import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "livecloud-thumb.akamaized.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
