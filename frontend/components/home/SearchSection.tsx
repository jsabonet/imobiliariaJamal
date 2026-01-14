'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const SearchSection = () => {
  const router = useRouter();
  const [searchType, setSearchType] = useState('venda');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');

  const searchTypes = [
    { value: 'venda', label: 'Comprar' },
    { value: 'arrendamento', label: 'Arrendar' },
  ];

  const propertyTypes = [
    { value: 'all', label: 'Tipo de Imóvel' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'casa', label: 'Casa' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'condominio', label: 'Condomínio' },
  ];

  const priceRanges = [
    { value: 'all', label: 'Faixa de Preço' },
    { value: '0-1000000', label: 'Até 1M' },
    { value: '1000000-5000000', label: '1M - 5M' },
    { value: '5000000-10000000', label: '5M - 10M' },
    { value: '10000000-20000000', label: '10M - 20M' },
    { value: '20000000-40000000', label: '20M - 40M' },
    { value: '40000000+', label: '40M+' },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedType !== 'all') params.set('type', selectedType);
    if (selectedPrice !== 'all') params.set('priceRange', selectedPrice);
    params.set('status', searchType);
    
    router.push(`/propriedades?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative -mt-10 sm:-mt-12 md:-mt-14 lg:-mt-16 z-20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 max-w-7xl mx-auto">
          
          {/* Mobile (< 640px): Stack vertical */}
          <div className="sm:hidden space-y-3">
            <Input
              placeholder="Ex: Polana, Sommerschield..."
              icon={<FiSearch size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex gap-2">
              <Button 
                fullWidth
                onClick={handleSearch}
              >
                Buscar
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/propriedades')}
                className="whitespace-nowrap px-4"
              >
                Filtros
              </Button>
            </div>
          </div>

          {/* Tablet (640px - 1024px): 2 rows */}
          <div className="hidden sm:block lg:hidden space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Select 
                options={searchTypes} 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              />
              <Input
                placeholder="Ex: Polana, Costa do Sol..."
                icon={<FiSearch size={18} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Select 
                options={propertyTypes} 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              />
              <Select 
                options={priceRanges}
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              />
              <Button 
                fullWidth
                onClick={handleSearch}
              >
                <FiSearch size={18} className="mr-2" />
                Buscar
              </Button>
            </div>
          </div>

          {/* Desktop (>= 1024px): Single row */}
          <div className="hidden lg:flex items-center gap-3">
            <Select 
              options={searchTypes} 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-36 xl:w-40"
            />
            <Input
              placeholder="Localização ou palavra-chave..."
              icon={<FiSearch size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 min-w-0"
            />
            <Select 
              options={propertyTypes} 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-44 xl:w-48"
            />
            <Select 
              options={priceRanges}
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="w-40 xl:w-44"
            />
            <Button 
              onClick={handleSearch}
              className="px-6 xl:px-8 whitespace-nowrap"
            >
              <FiSearch size={18} className="mr-2" />
              Buscar
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SearchSection;
