import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/blog/happiness-vs-career',
        destination: '/blog/happiness',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
