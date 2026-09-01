/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*.preview.same-app.com"],
  async redirects() {
    return [
      {
        source: "/service",
        destination: "/leistungen",
        permanent: true,
      },
      {
        source: "/abfluss/amberg",
        destination: "/service/abflussreinigung",
        permanent: true,
      },
      {
        source: "/amberg/notdienst",
        destination: "/service/rohrreinigung-notdienst",
        permanent: true,
      },
      {
        source: "/kanal/kamera",
        destination: "/service/kamera-inspektion",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
