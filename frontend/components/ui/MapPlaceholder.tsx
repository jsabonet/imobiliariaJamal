'use client';

import React from 'react';
import { FiMapPin, FiExternalLink } from 'react-icons/fi';

type MapPlaceholderProps = {
  latitude?: number | null;
  longitude?: number | null;
  height?: number;
  className?: string;
};

export default function MapPlaceholder({ latitude, longitude, height = 256, className = '' }: MapPlaceholderProps) {
  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number';

  if (hasCoords) {
    const lat = latitude as number;
    const lon = longitude as number;
    // OpenStreetMap embed with better zoom and view
    const zoom = 15;
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01}%2C${lat - 0.01}%2C${lon + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lon}`;
    const link = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;
    
    return (
      <div className={`w-full ${className}`}>
        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm" style={{ height }}>
          <iframe
            title="Mapa da Propriedade"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={src}
            className="w-full h-full"
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FiMapPin size={16} className="text-primary" />
            <span>
              <span className="font-medium">Coordenadas:</span> {lat.toFixed(6)}, {lon.toFixed(6)}
            </span>
          </div>
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-primary hover:text-primary-600 font-medium transition"
          >
            Ver no mapa completo
            <FiExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-lg bg-gray-100 border border-gray-200 flex flex-col items-center justify-center text-gray-500 ${className}`} style={{ height }}>
      <FiMapPin size={48} className="mb-3 text-gray-400" />
      <p className="text-sm font-medium">Localização não disponível</p>
      <p className="text-xs text-gray-400 mt-1">Coordenadas não fornecidas</p>
    </div>
  );
}
