/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  
  // Proxy API requests para o backend Django
  async rewrites() {
    // NEXT_PUBLIC_API_URL pode incluir /api (ex: http://localhost:8000/api)
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');
    // URL base sem /api para media e static
    const backendBaseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    return [
      // Endpoints de marca d'água precisam SEMPRE chegar com barra final no Django
      {
        source: '/api/admin/watermark/upload',
        destination: `${apiUrl}/admin/watermark/upload/`,
      },
      {
        source: '/api/admin/watermark/upload/',
        destination: `${apiUrl}/admin/watermark/upload/`,
      },
      {
        source: '/api/admin/watermark/list',
        destination: `${apiUrl}/admin/watermark/list/`,
      },
      {
        source: '/api/admin/watermark/list/',
        destination: `${apiUrl}/admin/watermark/list/`,
      },
      {
        source: '/api/admin/watermark/:id/delete',
        destination: `${apiUrl}/admin/watermark/:id/delete/`,
      },
      {
        source: '/api/admin/watermark/:id/delete/',
        destination: `${apiUrl}/admin/watermark/:id/delete/`,
      },
      // Regra geral para o restante da API
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${backendBaseUrl}/media/:path*`,
      },
      {
        source: '/static/:path*',
        destination: `${backendBaseUrl}/static/:path*`,
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
