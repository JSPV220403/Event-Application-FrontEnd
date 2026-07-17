import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//    reactStrictMode: false,
// };

const nextConfig: NextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/eventImages/**",
      },
    ],
  },
};



export default nextConfig;
