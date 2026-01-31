/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    BACKEND_API_URL: process.env.BACKEND_API_URL,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'], // Add any image domains you'll use
  },
};

module.exports = nextConfig;