/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Rewrite API calls to Django backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : 'http://127.0.0.1:8000/api/:path*',
      },
      {
        source: '/media/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/media/:path*`
          : 'http://127.0.0.1:8000/media/:path*',
      },
      {
        source: '/static/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/static/:path*`
          : 'http://127.0.0.1:8000/static/:path*',
      },
    ];
  },
  
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
      // Internal Docker network hostname for backend
      {
        protocol: 'http',
        hostname: 'backend',
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
