'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/properties/PropertyCard';
import Button from '@/components/ui/Button';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { fetchProperties, Property } from '@/lib/api';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProperties() {
      try {
        // Delay artificial de 2 segundos para visualizar o loading
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const data = await fetchProperties({
          is_featured: 'true',
          ordering: '-created_at',
        });
        setProperties(data.results.slice(0, 6)); // Mostrar apenas 6 propriedades
      } catch (error) {
        console.error('Erro ao carregar propriedades em destaque:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedProperties();
  }, []);

  // Adaptar formato da API para o formato esperado pelo PropertyCard
  const adaptedProperties = properties.map(property => ({
    id: property.id,
    title: property.title,
    location: property.location,
    price: parseFloat(property.price),
    type: property.type.charAt(0).toUpperCase() + property.type.slice(1),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    image: property.images[0]?.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    verified: property.is_verified,
    featured: property.is_featured,
  }));

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Propriedades Mais Procuradas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Imóveis com maior interesse dos nossos clientes
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <SkeletonCard type="property" count={6} />
          </div>
        )}

        {/* Properties Grid */}
        {!loading && adaptedProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {adaptedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && adaptedProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhuma propriedade em destaque no momento.</p>
          </div>
        )}

        {/* View All Button */}
        {!loading && adaptedProperties.length > 0 && (
          <div className="text-center">
            <Link href="/propriedades">
              <Button size="lg" variant="outline">
                Ver Todas as Propriedades
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
