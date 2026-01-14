'use client';

import { Suspense } from 'react';
import SkeletonCard from '@/components/ui/SkeletonCard';

export default function PropriedadesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <div className="bg-gradient-to-r from-secondary to-secondary-700 text-white py-12">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Propriedades Disponíveis
              </h1>
              <p className="text-lg text-gray-200">A carregar…</p>
            </div>
          </div>
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard type="property" count={6} />
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
