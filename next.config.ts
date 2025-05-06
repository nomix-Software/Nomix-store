import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "cdn.sanity.io",
      "picsum.photos",
      "resource.logitech.com",
      "media.kingston.com",
      "www.kingston.com",
      "cdn.shopify.com",
      "www.immortalpc.com.ar",
      "www.immortalpc.com",
      "redragon.es",
      "res.cloudinary.com",
    ],
  },
  experimental:{
    serverActions:{
      bodySizeLimit:'10mb'
    }
  }
  /* config options here */
};

export default nextConfig;
