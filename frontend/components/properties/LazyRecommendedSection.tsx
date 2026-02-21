'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import PropertyCard from '@/components/properties/PropertyCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  verified?: boolean;
  featured?: boolean;
  status?: 'venda' | 'arrendamento';
  createdAt?: string;
  imageCount?: number;
  negotiable?: boolean;
  currency?: string;
}

interface LazyRecommendedSectionProps {
  currentProperty: any;
  loadRecommendedProperties: (property: any) => Promise<void>;
  recommendedProperties: Property[];
  loadingRecommended: boolean;
  rootMargin?: string;
}

/**
 * LazyRecommendedSection - Seção "Propriedades Similares" com lazy loading
 * 
 * Carrega propriedades similares apenas quando a seção entra no viewport.
 * Economiza ~450-600KB de largura de banda e API calls desnecessárias.
 * 
 * @param currentProperty - Propriedade atual (para buscar similares)
 * @param loadRecommendedProperties - Função para carregar propriedades
 * @param recommendedProperties - Array de propriedades recomendadas
 * @param loadingRecommended - Estado de carregamento
 * @param rootMargin - Margem para trigger (padrão: 400px)
 */
export default function LazyRecommendedSection({
  currentProperty,
  loadRecommendedProperties,
  recommendedProperties,
  loadingRecommended,
  rootMargin = '400px'
}: LazyRecommendedSectionProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin, // Trigger 400px antes de aparecer
        threshold: 0
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  useEffect(() => {
    // Carrega apenas quando entra no viewport e ainda não carregou
    if (shouldLoad && !loadingRecommended && recommendedProperties.length === 0 && currentProperty) {
      loadRecommendedProperties(currentProperty);
    }
  }, [shouldLoad, loadingRecommended, recommendedProperties.length, currentProperty, loadRecommendedProperties]);

  // Não renderiza se não houver propriedades (após carregar)
  if (!shouldLoad || (!loadingRecommended && recommendedProperties.length === 0)) {
    return (
      <div ref={ref} className="mt-12">
        {/* Placeholder mínimo para Intersection Observer */}
      </div>
    );
  }

  return (
    <div ref={ref} className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary">
          Propriedades Similares
        </h2>
        <Link 
          href="/propriedades" 
          className="text-primary hover:text-primary-dark flex items-center gap-2 font-medium"
        >
          Ver Todas
          <FiArrowRight className="text-lg" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingRecommended ? (
          <SkeletonCard type="property" count={3} />
        ) : (
          recommendedProperties.map((recommendedProp) => (
            <PropertyCard key={recommendedProp.id} property={recommendedProp} />
          ))
        )}
      </div>
      
      {!loadingRecommended && recommendedProperties.length > 0 && (
        <div className="mt-8 text-center">
          <Link href="/propriedades">
            <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors">
              Ver Mais Propriedades
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
