import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",

        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
