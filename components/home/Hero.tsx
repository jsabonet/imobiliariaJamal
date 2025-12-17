'use client';

import React, { useState } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const Hero = () => {
  const [searchType, setSearchType] = useState('comprar');

  const propertyTypes = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'casa', label: 'Casa' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'condominio', label: 'Condomínio' },
  ];

  const locations = [
    { value: 'all', label: 'Todas as Localizações' },
    { value: 'maputo', label: 'Maputo' },
    { value: 'matola', label: 'Matola' },
    { value: 'beira', label: 'Beira' },
    { value: 'nampula', label: 'Nampula' },
    { value: 'tete', label: 'Tete' },
  ];

  const priceRanges = [
    { value: 'all', label: 'Qualquer Preço' },
    { value: '0-1000000', label: 'Até 1.000.000 MZN' },
    { value: '1000000-5000000', label: '1M - 5M MZN' },
    { value: '5000000-10000000', label: '5M - 10M MZN' },
    { value: '10000000-20000000', label: '10M - 20M MZN' },
    { value: '20000000+', label: 'Mais de 20M MZN' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-secondary via-secondary-600 to-secondary-700 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Encontre o Imóvel dos{' '}
            <span className="text-primary">Seus Sonhos</span>
            {' '}em Moçambique
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Compra, venda, arrendamento e avaliação de propriedades com confiança e transparência
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            {/* Search Type Tabs */}
            <div className="flex gap-2 md:gap-4 mb-6 overflow-x-auto pb-2">
              {[
                { id: 'comprar', label: 'Comprar' },
                { id: 'arrendar', label: 'Arrendar' },
                { id: 'vender', label: 'Vender' },
                { id: 'avaliar', label: 'Avaliar' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSearchType(tab.id)}
                  className={`
                    px-6 py-3 rounded-lg font-semibold text-sm md:text-base whitespace-nowrap
                    transition-all duration-200
                    ${searchType === tab.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-secondary hover:bg-gray-200'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Form */}
            {(searchType === 'comprar' || searchType === 'arrendar') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <Input
                    placeholder="Pesquisar por localização ou palavra-chave..."
                    icon={<FiSearch size={20} />}
                  />
                </div>
                <Select options={propertyTypes} />
                <Select options={priceRanges} />
                <div className="md:col-span-2 lg:col-span-4">
                  <Button fullWidth size="lg">
                    <div className="flex items-center justify-center gap-2">
                      <FiSearch size={20} />
                      Pesquisar Propriedades
                    </div>
                  </Button>
                </div>
              </div>
            )}

            {searchType === 'vender' && (
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold text-secondary mb-4">
                  Quer Vender o Seu Imóvel?
                </h3>
                <p className="text-gray-600 mb-6">
                  Anuncie gratuitamente e alcance milhares de potenciais compradores
                </p>
                <Button size="lg">Anunciar Propriedade</Button>
              </div>
            )}

            {searchType === 'avaliar' && (
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold text-secondary mb-4">
                  Avalie o Seu Imóvel
                </h3>
                <p className="text-gray-600 mb-6">
                  Obtenha uma avaliação profissional do valor do seu imóvel no mercado atual
                </p>
                <Button size="lg">Solicitar Avaliação</Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
          {[
            { number: '500+', label: 'Propriedades' },
            { number: '300+', label: 'Clientes Satisfeitos' },
            { number: '50+', label: 'Avaliações Realizadas' },
            { number: '10+', label: 'Anos de Experiência' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
