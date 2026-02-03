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
  async headers() {
    // Use environment variable for allowed origin, with fallback to localhost for development
    // For production deployment, this should be set in Vercel environment variables
    const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:6020';

    return [
      {
        // Apply CORS headers to other API routes, excluding the content API which handles CORS internally
        source: '/api/((?!content/).*)', // Match all API routes except content/*
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: websiteUrl, // Allow requests from the specified website URL
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Accept, Authorization, Range',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Vary',
            value: 'Origin',
          },
        ],
      },
    ];
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001'; // Fallback URL
    return [
      {
        source: "/v1/:path*",
        destination: `${backendUrl}/v1/:path*`,
      },
    ];
  },

};

module.exports = nextConfig;