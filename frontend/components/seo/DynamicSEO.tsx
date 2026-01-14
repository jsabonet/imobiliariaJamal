'use client';

import { useEffect } from 'react';

interface DynamicSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
}

export default function DynamicSEO({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
}: DynamicSEOProps) {
  useEffect(() => {
    const siteName = 'IJPS - Imobiliária Jamal & Prestação de Serviços';
    const fullTitle = `${title} | ${siteName}`;
    
    // Set title
    document.title = fullTitle;
    
    // Set meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    // Basic meta tags
    setMetaTag('description', description);
    if (keywords.length > 0) {
      setMetaTag('keywords', keywords.join(', '));
    }
    
    // Open Graph
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:site_name', siteName, true);
    setMetaTag('og:locale', 'pt_MZ', true);
    if (ogImage) {
      setMetaTag('og:image', ogImage, true);
    }
    if (canonical) {
      setMetaTag('og:url', canonical, true);
    }
    
    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    if (ogImage) {
      setMetaTag('twitter:image', ogImage);
    }
    
    // Canonical link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, keywords, canonical, ogImage]);
  
  return null;
}
