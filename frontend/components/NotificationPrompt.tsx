'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiX, FiCheck } from 'react-icons/fi';
import { subscribeToPushNotifications, isPushNotificationSupported, getNotificationPermission } from '@/lib/notifications';

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
      <div className="fixed bottom-2 left-2 right-2 sm:bottom-4 sm:left-auto sm:right-4 z-50 sm:max-w-md animate-slide-up">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-primary/20 p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <FiBell className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                Não perca nenhuma oportunidade!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Receba alertas instantâneos sobre novas propriedades que correspondem ao seu interesse.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleActivate}
                  disabled={isActivating}
                  className="flex-1 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 text-xs sm:text-sm"
                >
                  {isActivating ? 'Ativando...' : 'Ativar Alertas'}
                </button>
                <button
                  onClick={handleMaybeLater}
                  className="px-3 sm:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                >
                  Mais Tarde
                </button>
              </div>
            </div>
            <button
              onClick={handleNotNow}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors -mt-1"
            >
              <FiX size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modal variant
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full animate-scale-in max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header com ilustração */}
        <div className="relative bg-gradient-to-br from-primary to-primary-dark p-6 sm:p-8 rounded-t-xl sm:rounded-t-2xl text-white">
          <button
            onClick={handleNotNow}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white transition-colors"
          >
            <FiX size={22} className="sm:w-6 sm:h-6" />
          </button>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
              <FiBell size={28} className="sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
              Fique por Dentro!
            </h2>
            <p className="text-white/90 text-xs sm:text-sm">
              Encontre seu imóvel ideal mais rápido
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheck className="text-green-600" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Alertas Instantâneos</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Seja o primeiro a saber sobre novas propriedades
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiCheck className="text-blue-600" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Reduções de Preço</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Não perca oportunidades de economia
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiCheck className="text-purple-600" size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">100% Personalizável</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Configure exatamente o que deseja receber
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 sm:space-y-3">
            <button
              onClick={handleActivate}
              disabled={isActivating}
              className="w-full px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-lg sm:rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isActivating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  Ativando...
                </span>
              ) : (
                'Ativar Notificações'
              )}
            </button>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleMaybeLater}
                className="flex-1 px-3 sm:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors text-xs sm:text-sm"
              >
                Mais Tarde
              </button>
              <button
                onClick={handleNotNow}
                className="flex-1 px-3 sm:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors text-xs sm:text-sm"
              >
                Não, Obrigado
              </button>
            </div>
          </div>

          <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4">
            Você pode desativar a qualquer momento
          </p>
        </div>
      </div>
    </div>
  );
}
