'use client';

import React from 'react';

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
    // Simple OpenStreetMap embed highlighting the coordinates
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01}%2C${lat - 0.01}%2C${lon + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lon}`;
    const link = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
    return (
      <div className={`w-full rounded-lg overflow-hidden border border-gray-200 ${className}`} style={{ height }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <iframe
          title="Mapa da Propriedade"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src={src}
        />
        <div className="px-3 py-2 bg-white border-t text-xs text-gray-600 flex items-center justify-between">
          <div>
            Lat: {lat.toFixed(6)} | Long: {lon.toFixed(6)}
          </div>
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Abrir no OSM →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 ${className}`} style={{ height }}>
      Mapa indisponível
    </div>
  );
}
