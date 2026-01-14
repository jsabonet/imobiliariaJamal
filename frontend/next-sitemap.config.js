/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://ijps.co.mz',
  generateRobotsTxt: false, // We have custom robots.txt
  generateIndexSitemap: false,
  exclude: ['/dashboard/*', '/admin/*', '/api/*', '/login'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/admin', '/api', '/login'],
      },
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
  transform: async (config, path) => {
    // Custom priority for specific pages
    const customPriorities = {
      '/': 1.0,
      '/propriedades': 0.9,
      '/servicos': 0.8,
      '/sobre': 0.8,
      '/contacto': 0.8,
      '/avaliar': 0.7,
      '/favoritos': 0.6,
    };

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: customPriorities[path] || config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
