import React from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/properties/PropertyCard';
import Button from '@/components/ui/Button';

const FeaturedProperties = () => {
  // Mock data - Will be replaced with API call to Django backend
  const featuredProperties = [
    {
      id: 1,
      title: 'Apartamento T3 Sommerschield',
      location: 'Sommerschield, Maputo',
      price: 12500000,
      type: 'Apartamento',
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      verified: true,
      featured: true,
    },
    {
      id: 2,
      title: 'Casa T4 Polana Cimento',
      location: 'Polana Cimento, Maputo',
      price: 28000000,
      type: 'Casa',
      bedrooms: 4,
      bathrooms: 3,
      area: 350,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      verified: true,
      featured: true,
    },
    {
      id: 3,
      title: 'Apartamento T2 Costa do Sol',
      location: 'Costa do Sol, Maputo',
      price: 8500000,
      type: 'Apartamento',
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      verified: true,
      featured: true,
    },
    {
      id: 4,
      title: 'Villa T5 Matola',
      location: 'Matola Rio, Matola',
      price: 35000000,
      type: 'Casa',
      bedrooms: 5,
      bathrooms: 4,
      area: 450,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      verified: true,
      featured: true,
    },
    {
      id: 5,
      title: 'Escritório Comercial Centro',
      location: 'Baixa, Maputo',
      price: 15000000,
      type: 'Comercial',
      bedrooms: 0,
      bathrooms: 2,
      area: 200,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      verified: true,
      featured: true,
    },
    {
      id: 6,
      title: 'Terreno 1000m² Julius Nyerere',
      location: 'Julius Nyerere, Maputo',
      price: 18000000,
      type: 'Terreno',
      bedrooms: 0,
      bathrooms: 0,
      area: 1000,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      verified: true,
      featured: true,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Propriedades em Destaque
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore as melhores oportunidades imobiliárias em Moçambique
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/propriedades">
            <Button size="lg" variant="outline">
              Ver Todas as Propriedades
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
