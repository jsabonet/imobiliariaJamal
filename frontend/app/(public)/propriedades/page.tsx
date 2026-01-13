'use client';

import React, { useEffect, useMemo, useState } from 'react';
import PropertyCard from '@/components/properties/PropertyCard';
import { FiSearch, FiSliders } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { fetchProperties, PaginatedResponse, Property as ApiProperty } from '@/lib/api';

export default function PropriedadesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState<PaginatedResponse<ApiProperty> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    location: 'all',
    priceRange: 'all',
    bedrooms: '',
    bathrooms: '',
    ordering: 'recent',
  });

  const API_BASE = useMemo(() => (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/?api\/?$/, ''), []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        
        // Build query params from filters
        const params: Record<string, string> = {};
        if (filters.search) params.search = filters.search;
        if (filters.type !== 'all') params.type = filters.type;
        if (filters.location !== 'all') params.location = filters.location;
        if (filters.bedrooms) params.bedrooms = filters.bedrooms;
        if (filters.bathrooms) params.bathrooms = filters.bathrooms;
        
        // Handle ordering
        if (filters.ordering === 'price-low') params.ordering = 'price';
        else if (filters.ordering === 'price-high') params.ordering = '-price';
        else if (filters.ordering === 'area') params.ordering = '-area';
        else params.ordering = '-created_at';
        
        const data = await fetchProperties(params);
        if (mounted) setResults(data);
      } catch (e: any) {
        if (mounted) setError(e.message || 'Falha ao carregar propriedades');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [filters]);

  const propertyTypes = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'casa', label: 'Casa' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'comercial', label: 'Comercial' },
  ];

  const locations = [
    { value: 'all', label: 'Todas as Localizações' },
    { value: 'maputo', label: 'Maputo' },
    { value: 'matola', label: 'Matola' },
    { value: 'beira', label: 'Beira' },
    { value: 'nampula', label: 'Nampula' },
  ];

  const priceRanges = [
    { value: 'all', label: 'Qualquer Preço' },
    { value: '0-5000000', label: 'Até 5M MZN' },
    { value: '5000000-10000000', label: '5M - 10M MZN' },
    { value: '10000000-20000000', label: '10M - 20M MZN' },
    { value: '20000000+', label: 'Mais de 20M MZN' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Mais Recentes' },
    { value: 'price-low', label: 'Preço: Menor para Maior' },
    { value: 'price-high', label: 'Preço: Maior para Menor' },
    { value: 'area', label: 'Área' },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleBedroomClick = (num: string) => {
    const value = num === '4+' ? '4' : num;
    setFilters(prev => ({ ...prev, bedrooms: prev.bedrooms === value ? '' : value }));
  };

  const handleBathroomClick = (num: string) => {
    const value = num === '4+' ? '4' : num;
    setFilters(prev => ({ ...prev, bathrooms: prev.bathrooms === value ? '' : value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      location: 'all',
      priceRange: 'all',
      bedrooms: '',
      bathrooms: '',
      ordering: 'recent',
    });
  };

  const loadPage = async (url: string) => {
    try {
      setLoading(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Falha ao carregar página');
      const data = await res.json();
      setResults(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const properties = useMemo(() => {
    if (!results) return [] as Array<{
      id: number; title: string; location: string; price: number; type: string; bedrooms: number; bathrooms: number; area: number; image: string; verified?: boolean; featured?: boolean;
    }>;
    return (results.results || []).map((p) => {
      const images = Array.isArray(p.images) ? p.images : [];
      const primary = images.find((img: any) => (img as any).is_primary) || images[0];
      const imageUrl: string = primary?.image
        ? ((String(primary.image).startsWith('http') ? String(primary.image) : `${API_BASE}${primary.image}`))
        : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop';
      return {
        id: p.id,
        title: p.title,
        location: (p as any).location || [(p as any).neighborhood, (p as any).city].filter(Boolean).join(', '),
        price: Number(p.price || 0),
        type: (p as any).type || 'Propriedade',
        bedrooms: p.bedrooms || 0,
        bathrooms: p.bathrooms || 0,
        area: (p as any).area || (p as any).useful_area || 0,
        image: imageUrl,
        verified: !!(p as any).is_verified,
        featured: !!p.is_featured,
      };
    });
  }, [results, API_BASE]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-secondary to-secondary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Propriedades Disponíveis
          </h1>
          <p className="text-lg text-gray-200">
            {loading ? 'A carregar…' : `${properties.length} propriedades encontradas`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className={`
            lg:block lg:col-span-1
            ${showFilters ? 'block' : 'hidden'}
          `}>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-secondary">Filtros</h2>
                <button
                  className="lg:hidden text-primary"
                  onClick={() => setShowFilters(false)}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <Input
                    placeholder="Pesquisar..."
                    icon={<FiSearch size={18} />}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Tipo de Propriedade
                  </label>
                  <Select 
                    options={propertyTypes} 
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Localização
                  </label>
                  <Select 
                    options={locations} 
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Faixa de Preço
                  </label>
                  <Select 
                    options={priceRanges} 
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Quartos
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2', '3', '4+'].map((num) => {
                      const value = num === '4+' ? '4' : num;
                      const isActive = filters.bedrooms === value;
                      return (
                        <button
                          key={num}
                          onClick={() => handleBedroomClick(num)}
                          className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                            isActive 
                              ? 'border-primary bg-primary text-white' 
                              : 'border-gray-200 hover:border-primary hover:text-primary'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Casas de Banho
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2', '3', '4+'].map((num) => {
                      const value = num === '4+' ? '4' : num;
                      const isActive = filters.bathrooms === value;
                      return (
                        <button
                          key={num}
                          onClick={() => handleBathroomClick(num)}
                          className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                            isActive 
                              ? 'border-primary bg-primary text-white' 
                              : 'border-gray-200 hover:border-primary hover:text-primary'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clear Filters */}
                <button 
                  onClick={clearFilters}
                  className="w-full text-primary hover:underline text-sm"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Mobile Filters Toggle & Sort */}
            <div className="flex gap-4 mb-6">
              <Button
                variant="outline"
                className="lg:hidden flex-1"
                onClick={() => setShowFilters(true)}
              >
                <FiSliders className="mr-2" />
                Filtros
              </Button>
              <div className="flex-1">
                <Select 
                  options={sortOptions} 
                  value={filters.ordering}
                  onChange={(e) => handleFilterChange('ordering', e.target.value)}
                />
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {loading && (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              )}
              {!loading && !error && properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
              {!loading && error && (
                <div className="col-span-full text-center text-red-600">{error}</div>
              )}
            </div>

            {/* Pagination */}
            {results && (results.previous || results.next) && (
              <div className="flex justify-center gap-2 items-center">
                <Button 
                  variant="outline" 
                  onClick={() => results.previous && loadPage(results.previous)}
                  disabled={!results.previous || loading}
                >
                  Anterior
                </Button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  {properties.length} de {results.count} resultados
                </span>
                <Button 
                  variant="outline"
                  onClick={() => results.next && loadPage(results.next)}
                  disabled={!results.next || loading}
                >
                  Próximo
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
