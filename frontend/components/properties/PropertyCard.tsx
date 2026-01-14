'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMaximize2, FiMapPin, FiHeart, FiShare2, FiEye, FiCamera } from 'react-icons/fi';
import { useFavorites } from '@/lib/useFavorites';
import { IoBed, IoWater } from 'react-icons/io5';
import { FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

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
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(property.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
    }).format(price).replace(/MT/g, 'MZN');
  };

  const getPricePerSqm = () => {
    if (property.area > 0) {
      const pricePerSqm = property.price / property.area;
      return new Intl.NumberFormat('pt-PT', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(pricePerSqm);
    }
    return null;
  };

  const isNew = () => {
    if (!property.createdAt) return false;
    const created = new Date(property.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const getTimeAgo = () => {
    if (!property.createdAt) return '';
    const created = new Date(property.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Há 1 dia';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    return `Há ${Math.floor(diffDays / 30)} meses`;
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      type: property.type,
      image: property.image,
      addedAt: new Date().toISOString(),
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `${property.title} - ${formatPrice(property.price)}`,
        url: `${window.location.origin}/propriedades/${property.id}`,
      });
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Olá! Tenho interesse nesta propriedade: ${property.title} - ${formatPrice(property.price)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Card 
      hover 
      className="group overflow-hidden"
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
    >
      <Link href={`/propriedades/${property.id}`}>
        {/* Image Container */}
        <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-200">
          {/* Skeleton loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}
          
          {/* Gradient overlay for better badge visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-10" />
          
          <Image
            src={property.image}
            alt={property.title}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {isNew() && (
              <Badge variant="success" className="backdrop-blur-sm bg-opacity-95 shadow-md">
                Novo
              </Badge>
            )}
            {property.featured && (
              <Badge variant="warning" className="backdrop-blur-sm bg-opacity-95 shadow-md">
                Destaque
              </Badge>
            )}
            {property.status && (
              <Badge 
                variant={property.status === 'venda' ? 'primary' : 'secondary'}
                className="backdrop-blur-sm bg-opacity-95 shadow-md"
              >
                {property.status === 'venda' ? 'Venda' : 'Arrendamento'}
              </Badge>
            )}
            <Badge className="backdrop-blur-sm bg-opacity-95 shadow-md">
              {property.type}
            </Badge>
          </div>

          {/* Image count */}
          {property.imageCount && property.imageCount > 1 && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg text-xs font-medium">
              <FiCamera size={14} />
              <span>{property.imageCount}</span>
            </div>
          )}

          {/* Quick Actions - Desktop */}
          <div 
            className={`absolute inset-x-0 bottom-0 z-20 p-4 transform transition-all duration-300 ${
              showQuickActions ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            } hidden sm:block`}
          >
            <div className="flex gap-2">
              <button
                onClick={handleFavoriteClick}
                className={`flex-1 py-2 rounded-lg shadow-lg transition-all backdrop-blur-md ${
                  favorited 
                    ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
                    : 'bg-white/90 text-gray-700 hover:bg-primary hover:text-white'
                }`}
                title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <FiHeart size={18} fill={favorited ? 'currentColor' : 'none'} className="mx-auto" />
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-2 bg-white/90 backdrop-blur-md text-gray-700 rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all"
                title="Compartilhar"
              >
                <FiShare2 size={18} className="mx-auto" />
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 py-2 bg-green-500/90 backdrop-blur-md text-white rounded-lg shadow-lg hover:bg-green-600/90 transition-all"
                title="WhatsApp"
              >
                <FaWhatsapp size={18} className="mx-auto" />
              </button>
            </div>
          </div>

          {/* Favorite Button - Mobile */}
          <button
            className={`sm:hidden absolute top-3 right-3 z-20 p-2 rounded-full shadow-lg transition-all backdrop-blur-sm ${
              favorited 
                ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
                : 'bg-white/90 text-gray-700 hover:bg-primary hover:text-white'
            }`}
            onClick={handleFavoriteClick}
            title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <FiHeart size={18} fill={favorited ? 'currentColor' : 'none'} />
          </button>

          {/* Verified Badge */}
          {property.verified && (
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 bg-accent/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg">
              <FaCheckCircle size={14} />
              <span className="hidden sm:inline">Verificado</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Location & Time */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-gray-600 flex-1 min-w-0">
              <FiMapPin size={14} className="flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">{property.location}</span>
            </div>
            {property.createdAt && (
              <span className="text-xs text-gray-500 whitespace-nowrap">{getTimeAgo()}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-secondary mb-3 sm:mb-4 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
            {property.title}
          </h3>

          {/* Features */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-gray-600">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <IoBed size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-xs sm:text-sm font-medium">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <IoWater size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="text-xs sm:text-sm font-medium">{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <FiMaximize2 size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="text-xs sm:text-sm font-medium">{property.area}m²</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-3 sm:my-4"></div>

          {/* Price */}
          <div className="flex items-end justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Preço</p>
              <p className="text-xl sm:text-2xl font-bold text-primary truncate">
                {formatPrice(property.price)}
              </p>
              {getPricePerSqm() && (
                <p className="text-xs text-gray-500 mt-1">
                  {getPricePerSqm()} MZN/m²
                </p>
              )}
              {property.negotiable && (
                <p className="text-xs text-accent font-medium mt-1">Negociável</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <button className="text-sm sm:text-base text-primary font-semibold hover:underline flex items-center gap-1">
                <span className="hidden sm:inline">Ver Detalhes</span>
                <span className="sm:hidden">Ver</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default PropertyCard;
