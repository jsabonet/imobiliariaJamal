'use client';

import { useState } from 'react';
import { FiBell, FiX } from 'react-icons/fi';
import { subscribeToPushNotifications } from '@/lib/notifications';

interface NotificationPromptProps {
  onActivate: () => void;
  onDismiss: () => void;
  variant?: 'modal' | 'toast';
}

export default function NotificationPrompt({ onActivate, onDismiss, variant = 'modal' }: NotificationPromptProps) {
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      const subscription = await subscribeToPushNotifications();
      if (subscription) {
        onActivate();
      }
    } catch (error) {
      console.error('Erro ao ativar notificações:', error);
    } finally {
      setIsActivating(false);
    }
  };

  const handleMaybeLater = () => {
    localStorage.setItem('notification_prompt_postponed', Date.now().toString());
    onDismiss();
  };

  const handleNotNow = () => {
    localStorage.setItem('notification_prompt_dismissed', 'true');
    onDismiss();
  };

  if (variant === 'toast') {
    return (
      <div className="fixed bottom-2 left-2 right-2 sm:bottom-4 sm:left-auto sm:right-4 z-50 sm:max-w-sm animate-slide-up">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <div className="flex items-start gap-3">
            <FiBell className="text-primary mt-0.5 flex-shrink-0" size={20} />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                Ativar notificações?
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Receba alertas sobre novas propriedades.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleActivate}
                  disabled={isActivating}
                  className="px-3 py-1.5 bg-primary text-white rounded text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {isActivating ? 'Ativando...' : 'Permitir'}
                </button>
                <button
                  onClick={handleNotNow}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded text-xs font-medium transition-colors"
                >
                  Agora não
                </button>
              </div>
            </div>
            <button
              onClick={handleNotNow}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal variant
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full animate-scale-in">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <button
            onClick={handleNotNow}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiBell className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Ativar notificações
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Receba alertas sobre novas propriedades, reduções de preço e atualizações que correspondem ao seu interesse.
          </p>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleActivate}
              disabled={isActivating}
              className="w-full px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 text-sm"
            >
              {isActivating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Ativando...
                </span>
              ) : (
                'Permitir Notificações'
              )}
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={handleMaybeLater}
                className="flex-1 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm border border-gray-200"
              >
                Mais Tarde
              </button>
              <button
                onClick={handleNotNow}
                className="flex-1 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm border border-gray-200"
              >
                Não Permitir
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Você pode alterar isso a qualquer momento
          </p>
        </div>
      </div>
    </div>
  );
}
