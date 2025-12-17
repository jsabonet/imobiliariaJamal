'use client';

import React, { useState } from 'react';
import PropertyCard from '@/components/properties/PropertyCard';
import { FiSearch, FiSliders } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function PropriedadesPage() {
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - Will be replaced with API call to Django backend
  const properties = [
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
      featured: false,
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
      featured: false,
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
      featured: false,
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
      featured: false,
    },
    {
      id: 7,
      title: 'Condomínio T3 Triunfo',
      location: 'Triunfo, Maputo',
      price: 11000000,
      type: 'Apartamento',
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      verified: true,
      featured: false,
    },
    {
      id: 8,
      title: 'Casa T3 Beira',
      location: 'Beira, Sofala',
      price: 9500000,
      type: 'Casa',
      bedrooms: 3,
      bathrooms: 2,
      area: 200,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      verified: true,
      featured: false,
    },
    {
      id: 9,
      title: 'Apartamento T1 Maputo',
      location: 'Cidade de Maputo, Maputo',
      price: 5500000,
      type: 'Apartamento',
      bedrooms: 1,
      bathrooms: 1,
      area: 60,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      verified: true,
      featured: false,
    },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-secondary to-secondary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Propriedades Disponíveis
          </h1>
          <p className="text-lg text-gray-200">
            {properties.length} propriedades encontradas
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
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Tipo de Propriedade
                  </label>
                  <Select options={propertyTypes} />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Localização
                  </label>
                  <Select options={locations} />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Faixa de Preço
                  </label>
                  <Select options={priceRanges} />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Quartos
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2', '3', '4+'].map((num) => (
                      <button
                        key={num}
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Casas de Banho
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2', '3', '4+'].map((num) => (
                      <button
                        key={num}
                        className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Filters */}
                <Button fullWidth>
                  Aplicar Filtros
                </Button>

                {/* Clear Filters */}
                <button className="w-full text-primary hover:underline text-sm">
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
                <Select options={sortOptions} />
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              <Button variant="outline">Anterior</Button>
              <Button>1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Próximo</Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
