'use client';

import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'ijps_favorites';

export interface FavoriteProperty {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  image: string;
  addedAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar favoritos do localStorage na montagem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch (e) {
          console.error('Erro ao carregar favoritos:', e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Salvar favoritos no localStorage quando mudar
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = (property: FavoriteProperty) => {
    setFavorites(prev => {
      // Verificar se já existe
      if (prev.some(fav => fav.id === property.id)) {
        return prev;
      }
      return [...prev, { ...property, addedAt: new Date().toISOString() }];
    });
  };

  const removeFavorite = (propertyId: number) => {
    setFavorites(prev => prev.filter(fav => fav.id !== propertyId));
  };

  const toggleFavorite = (property: FavoriteProperty) => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  const isFavorite = (propertyId: number): boolean => {
    return favorites.some(fav => fav.id === propertyId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
    isLoaded,
  };
}
