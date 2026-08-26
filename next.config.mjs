/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Uploaded project images (Supabase Storage public URLs)
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        // Seed/placeholder imagery
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
