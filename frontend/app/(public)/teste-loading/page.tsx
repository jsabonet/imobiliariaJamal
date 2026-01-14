'use client';

import React, { useState } from 'react';
import PageLoader from '@/components/ui/PageLoader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import SkeletonCard from '@/components/ui/SkeletonCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function TesteLoadingPage() {
  const [showPageLoader, setShowPageLoader] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showSkeletons, setShowSkeletons] = useState(false);

  const triggerPageLoader = () => {
    setShowPageLoader(true);
    setTimeout(() => setShowPageLoader(false), 3000);
  };

  const triggerOverlay = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  const triggerSkeletons = () => {
    setShowSkeletons(true);
    setTimeout(() => setShowSkeletons(false), 3000);
  };

  if (showPageLoader) {
    return <PageLoader message="Teste de PageLoader - aguarde 3s..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <LoadingOverlay isOpen={showOverlay} message="Teste de LoadingOverlay" type="form" />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">🎨 Teste do Sistema de Loading</h1>
          <p className="text-lg text-primary-100">
            Demonstração de todos os componentes de loading da plataforma
          </p>
        </div>

        {/* Demo Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">PageLoader</h3>
              <p className="text-gray-600 text-sm mb-4">
                Loading de página completa com logo animado
              </p>
              <Button onClick={triggerPageLoader} fullWidth>
                Ver PageLoader (3s)
              </Button>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">LoadingOverlay</h3>
              <p className="text-gray-600 text-sm mb-4">
                Overlay com backdrop para operações
              </p>
              <Button onClick={triggerOverlay} fullWidth variant="outline">
                Ver Overlay (3s)
              </Button>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎴</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">SkeletonCard</h3>
              <p className="text-gray-600 text-sm mb-4">
                Placeholders animados para conteúdo
              </p>
              <Button onClick={triggerSkeletons} fullWidth variant="outline">
                Ver Skeletons (3s)
              </Button>
            </div>
          </Card>
        </div>

        {/* LoadingSpinner Examples */}
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-secondary mb-6">LoadingSpinner - Tamanhos e Cores</h2>
            
            <div className="space-y-6">
              {/* Tamanhos */}
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Tamanhos</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <LoadingSpinner size="sm" />
                    <p className="text-xs text-gray-600 mt-2">Small</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <LoadingSpinner size="md" />
                    <p className="text-xs text-gray-600 mt-2">Medium</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <LoadingSpinner size="lg" />
                    <p className="text-xs text-gray-600 mt-2">Large</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <LoadingSpinner size="xl" />
                    <p className="text-xs text-gray-600 mt-2">Extra Large</p>
                  </div>
                </div>
              </div>

              {/* Cores */}
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Cores</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <LoadingSpinner color="primary" />
                    <p className="text-xs text-gray-600 mt-2">Primary</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <LoadingSpinner color="secondary" />
                    <p className="text-xs text-gray-600 mt-2">Secondary</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <LoadingSpinner color="accent" />
                    <p className="text-xs text-gray-600 mt-2">Accent</p>
                  </div>
                  <div className="text-center p-4 bg-gray-900 rounded-lg">
                    <LoadingSpinner color="white" />
                    <p className="text-xs text-gray-300 mt-2">White</p>
                  </div>
                </div>
              </div>

              {/* Com Texto */}
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Com Texto</h3>
                <div className="space-y-3">
                  <LoadingSpinner size="sm" text="Carregando dados..." />
                  <LoadingSpinner size="md" text="Processando informações..." color="accent" />
                  <LoadingSpinner size="lg" text="Aguarde um momento..." color="secondary" />
                </div>
              </div>

              {/* Centralizado */}
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Centralizado</h3>
                <div className="bg-gray-50 rounded-lg p-8">
                  <LoadingSpinner size="lg" text="Loading centralizado" centered />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* SkeletonCard Examples */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-secondary mb-6">SkeletonCard - Tipos</h2>
          
          {showSkeletons ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Property Skeletons</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <SkeletonCard type="property" count={3} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Evaluation Skeletons</h3>
                <div className="grid gap-4">
                  <SkeletonCard type="evaluation" count={2} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Contact Skeletons</h3>
                <div className="grid gap-4">
                  <SkeletonCard type="contact" count={2} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Agent Skeletons</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SkeletonCard type="agent" count={2} />
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <div className="p-12 text-center">
                <p className="text-gray-600 mb-4">Clique no botão "Ver Skeletons" acima para visualizar</p>
                <Button onClick={triggerSkeletons}>
                  Mostrar Skeletons
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Uso nas Páginas */}
        <Card className="mt-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-secondary mb-4">📍 Onde Encontrar os Loaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-secondary mb-2">Páginas Públicas</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✅ <a href="/" className="text-primary hover:underline">Home</a> - SkeletonCard nas propriedades</li>
                  <li>✅ <a href="/propriedades" className="text-primary hover:underline">Propriedades</a> - SkeletonCard na lista</li>
                  <li>✅ <a href="/contacto" className="text-primary hover:underline">Contacto</a> - LoadingOverlay no envio</li>
                  <li>✅ <a href="/avaliar" className="text-primary hover:underline">Avaliar</a> - LoadingOverlay no envio</li>
                  <li>✅ <a href="/favoritos" className="text-primary hover:underline">Favoritos</a> - LoadingSpinner</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-2">Dashboard</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✅ <a href="/dashboard" className="text-primary hover:underline">Dashboard</a> - LoadingSpinner</li>
                  <li>✅ <a href="/dashboard/propriedades" className="text-primary hover:underline">Propriedades</a> - LoadingSpinner</li>
                  <li>✅ <a href="/dashboard/agentes" className="text-primary hover:underline">Agentes</a> - LoadingSpinner</li>
                  <li>✅ <a href="/dashboard/avaliacoes" className="text-primary hover:underline">Avaliações</a> - SkeletonCard</li>
                  <li>✅ <a href="/dashboard/contactos" className="text-primary hover:underline">Contactos</a> - SkeletonCard</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Dica */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 Dica para Ver os Loaders em Ação</h3>
          <p className="text-blue-800 text-sm mb-3">
            Os loaders aparecem durante o carregamento de dados. Para vê-los nas páginas reais:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Abra as ferramentas de desenvolvedor (F12)</li>
            <li>Vá na aba "Network" (Rede)</li>
            <li>Selecione "Slow 3G" ou "Fast 3G" no throttling</li>
            <li>Recarregue a página ou navegue entre as seções</li>
            <li>Você verá todos os loaders em ação!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
