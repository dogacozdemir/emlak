/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui', 'lib'],
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;

