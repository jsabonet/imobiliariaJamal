/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      // Backend Django - Media files
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  // Desabilitar cache em desenvolvimento
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config) => {
      config.cache = false;
      return config;
    },
  }),
  // PWA Configuration (to be added later)
};

export default nextConfig;
