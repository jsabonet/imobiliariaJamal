'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMaximize2, FiMapPin, FiHeart } from 'react-icons/fi';
import { IoBed, IoWater } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';
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
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card hover className="group">
      <Link href={`/propriedades/${property.id}`}>
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {property.featured && (
              <Badge variant="warning" className="backdrop-blur-sm bg-opacity-90">
                Destaque
              </Badge>
            )}
            <Badge className="backdrop-blur-sm bg-opacity-90">
              {property.type}
            </Badge>
          </div>

          {/* Favorite Button */}
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Handle favorite action
            }}
          >
            <FiHeart size={20} />
          </button>

          {/* Verified Badge */}
          {property.verified && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-accent text-white px-3 py-1.5 rounded-full text-sm font-medium">
              <FaCheckCircle size={16} />
              Verificado
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <FiMapPin size={16} />
            <span className="text-sm">{property.location}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-secondary mb-4 line-clamp-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Features */}
          <div className="flex items-center gap-4 mb-4 text-gray-600">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <IoBed size={18} />
                <span className="text-sm font-medium">{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <IoWater size={18} />
                <span className="text-sm font-medium">{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <FiMaximize2 size={18} />
              <span className="text-sm font-medium">{property.area}m²</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Preço</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(property.price)}
              </p>
            </div>
            <div className="text-right">
              <button className="text-primary font-semibold hover:underline">
                Ver Detalhes →
              </button>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default PropertyCard;
