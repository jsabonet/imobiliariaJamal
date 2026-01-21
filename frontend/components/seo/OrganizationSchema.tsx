import React from 'react';

export default function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'IJPS - Imobiliária Jamal & Prestação de Serviços',
    alternateName: 'IJPS Imobiliária',
    url: 'https://imobiliariajamal.com',
    logo: 'https://imobiliariajamal.com/logo.png',
    description: 'Imobiliária líder em Moçambique especializada em compra, venda, arrendamento e avaliação de propriedades em Maputo e arredores.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Julius Nyerere',
      addressLocality: 'Maputo',
      addressCountry: 'MZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -25.9655,
      longitude: 32.5832,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+258-84-000-0000',
      contactType: 'customer service',
      email: 'anilton.jm13@gmail.com',
      availableLanguage: ['pt', 'en'],
      areaServed: 'MZ',
    },
    sameAs: [
      'https://www.facebook.com/ijpsimobiliaria',
      'https://www.instagram.com/ijpsimobiliaria',
      'https://www.linkedin.com/company/ijpsimobiliaria',
    ],
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
    areaServed: {
      '@type': 'City',
      name: 'Maputo',
      '@id': 'https://www.wikidata.org/wiki/Q3889',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
