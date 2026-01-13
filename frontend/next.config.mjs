/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Proxy API requests para o backend Django
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${backendUrl}/media/:path*`,
      },
      {
        source: '/static/:path*',
        destination: `${backendUrl}/static/:path*`,
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
