'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiBellOff } from 'react-icons/fi';
import {
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isSubscribed,
  isPushNotificationSupported,
  getNotificationPermission,
  showTestNotification
} from '@/lib/notifications';

export default function NotificationButton() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Verificar suporte e estado inicial
    const checkStatus = async () => {
      const isSupported = isPushNotificationSupported();
      setSupported(isSupported);

      if (isSupported) {
        const currentlySubscribed = await isSubscribed();
        setSubscribed(currentlySubscribed);
      }
    };

    checkStatus();
  }, []);

  const handleToggleNotifications = async () => {
    setLoading(true);
    
    try {
      if (subscribed) {
        // Desativar notificações
        const success = await unsubscribeFromPushNotifications();
        if (success) {
          setSubscribed(false);
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 3000);
        }
      } else {
        // Ativar notificações
        const permission = getNotificationPermission();
        
        if (permission === 'denied') {
          alert(
            'Você bloqueou as notificações. ' +
            'Para ativar, vá nas configurações do navegador e permita notificações para este site.'
          );
          setLoading(false);
          return;
        }

        const subscription = await subscribeToPushNotifications();
        
        if (subscription) {
          setSubscribed(true);
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 3000);
          
          // Mostrar notificação de teste
          setTimeout(() => {
            showTestNotification().catch(console.error);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Erro ao gerenciar notificações:', error);
      alert('Erro ao processar sua solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Não mostrar botão se notificações não são suportadas
  if (!supported) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggleNotifications}
        disabled={loading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${subscribed 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={subscribed ? 'Desativar notificações' : 'Ativar notificações'}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
        ) : subscribed ? (
          <FiBell className="text-xl" />
        ) : (
          <FiBellOff className="text-xl" />
        )}
        
        <span className="hidden sm:inline">
          {loading 
            ? 'Processando...' 
            : subscribed 
              ? 'Notificações Ativas' 
              : 'Ativar Notificações'
          }
        </span>
      </button>

      {/* Tooltip de confirmação */}
      {showTooltip && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50">
          {subscribed 
            ? '✅ Notificações ativadas! Você receberá alertas de novas propriedades.'
            : '❌ Notificações desativadas.'
          }
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
        </div>
      )}
    </div>
  );
}
