import React from 'react';

interface PropertySchemaProps {
  property: {
    id: number;
    title: string;
    description: string;
    price: number;
    currency: string;
    address?: string;
    city?: string;
    province?: string;
    country: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
    latitude?: number;
    longitude?: number;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function PropertySchema({ property }: PropertySchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `https://imobiliariajamal.com/propriedades/${property.id}`,
    image: property.images[0] || '',
    datePosted: property.createdAt,
    dateModified: property.updatedAt,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency,
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address || '',
      addressLocality: property.city || '',
      addressRegion: property.province || '',
      addressCountry: property.country,
    },
    ...(property.latitude && property.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: property.latitude,
        longitude: property.longitude,
      },
    }),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Número de Quartos',
        value: property.bedrooms,
      },
      {
        '@type': 'PropertyValue',
        name: 'Número de Casas de Banho',
        value: property.bathrooms,
      },
      {
        '@type': 'PropertyValue',
        name: 'Área',
        value: property.area,
        unitCode: 'MTK',
      },
      {
        '@type': 'PropertyValue',
        name: 'Tipo de Propriedade',
        value: property.type,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
