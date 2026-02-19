'use client';

import React, { useState, useEffect } from 'react';
import { FiMapPin, FiExternalLink, FiInfo } from 'react-icons/fi';

type MapPlaceholderProps = {
  latitude?: number | null;
  longitude?: number | null;
  approximateLatitude?: number | null;
  approximateLongitude?: number | null;
  isApproximateLocation?: boolean;
  height?: number;
  className?: string;
};

export default function MapPlaceholder({ 
  latitude, 
  longitude, 
  approximateLatitude, 
  approximateLongitude, 
  isApproximateLocation = false,
  height = 256, 
  className = '' 
}: MapPlaceholderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determinar qual conjunto de coordenadas usar
  const exactCoords = typeof latitude === 'number' && typeof longitude === 'number';
  const approxCoords = typeof approximateLatitude === 'number' && typeof approximateLongitude === 'number';
  
  const hasCoords = exactCoords || approxCoords;
  const lat = exactCoords ? (latitude as number) : (approximateLatitude as number);
  const lon = exactCoords ? (longitude as number) : (approximateLongitude as number);
  const isApprox = !exactCoords && approxCoords;

  // Não renderizar iframe até estar montado no cliente
  if (!isMounted) {
    return (
      <div className={`w-full rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center ${className}`} style={{ height }}>
        <div className="animate-pulse flex flex-col items-center">
          <FiMapPin size={48} className="mb-3 text-gray-400" />
          <p className="text-sm text-gray-500">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (hasCoords) {
    // Ajustar zoom baseado no tipo de localização
    const zoom = isApprox ? 14 : 15; // Zoom menor para localização aproximada
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01}%2C${lat - 0.01}%2C${lon + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lon}`;
    const link = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;
    
    return (
      <div className={`w-full ${className}`}>
        {/* Aviso de localização aproximada */}
        {isApprox && (
          <div className="mb-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <FiInfo className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Localização Aproximada</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Este mapa mostra a localização geral do bairro. Entre em contacto para obter o endereço exato do imóvel.
              </p>
            </div>
          </div>
        )}
        
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
            <FiMapPin size={16} className={isApprox ? "text-amber-500" : "text-primary"} />
            <span>
              <span className="font-medium">
                {isApprox ? 'Área aproximada' : 'Coordenadas'}:
              </span> {lat.toFixed(6)}, {lon.toFixed(6)}
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

