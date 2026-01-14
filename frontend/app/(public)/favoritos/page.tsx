'use client';

import React from 'react';
import Link from 'next/link';
import { FiHeart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import PropertyCard from '@/components/properties/PropertyCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useFavorites } from '@/lib/useFavorites';

export default function FavoritosPage() {
  const { favorites, clearFavorites, count, isLoaded } = useFavorites();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando favoritos..." centered />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-secondary to-secondary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/propriedades"
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              <FiArrowLeft size={24} />
            </Link>
            <div className="flex items-center gap-3">
              <FiHeart size={32} />
              <h1 className="text-3xl md:text-4xl font-bold">
                Meus Favoritos
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-200">
            {count === 0 ? 'Nenhuma propriedade salva' : `${count} ${count === 1 ? 'propriedade salva' : 'propriedades salvas'}`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {count === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart size={40} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-3">
                Nenhum favorito ainda
              </h2>
              <p className="text-gray-600 mb-6">
                Explore nossas propriedades e clique no ícone de coração para salvar seus imóveis favoritos.
              </p>
              <Link href="/propriedades">
                <Button>Explorar Propriedades</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Actions Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Suas propriedades favoritas são salvas no seu navegador
              </p>
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja remover todos os favoritos?')) {
                    clearFavorites();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <FiTrash2 size={18} />
                Limpar Todos
              </button>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={{
                    ...property,
                    bedrooms: 0,
                    bathrooms: 0,
                    area: 0,
                  }} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
