import { config } from "dotenv";
config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ALLOWED_TOKENS: process.env.NEXT_PUBLIC_ALLOWED_TOKENS,
  },
};

export default nextConfig;
