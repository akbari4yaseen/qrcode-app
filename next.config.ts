import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // Allow Cloudinary images
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
