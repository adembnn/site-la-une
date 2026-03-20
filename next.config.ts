/**
 * Configuration Next.js
 *
 * remotePatterns : on autorise Next.js à charger des images depuis
 * le CDN de Sanity (cdn.sanity.io). Sans ça, le composant <Image>
 * de Next.js bloquera les images externes pour raisons de sécurité.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
