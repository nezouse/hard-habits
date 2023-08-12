/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        'hostname': 'uploadthing.com'
      }
    ]
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
