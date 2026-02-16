'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiBellOff, FiSettings } from 'react-icons/fi';
import {
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isSubscribed,
  isPushNotificationSupported,
  getNotificationPermission,
  showTestNotification
} from '@/lib/notifications';
import FirstTimeNotificationModal from './FirstTimeNotificationModal';
import NotificationPreferences from './NotificationPreferences';

export default function NotificationButton() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null);

  useEffect(() => {
    // Verificar suporte e estado inicial
    const checkStatus = async () => {
      console.log('🔔 [NotificationButton] Verificando suporte a notificações...');
      const isSupported = isPushNotificationSupported();
      console.log(`🔔 [NotificationButton] Suporte: ${isSupported ? '✅ Suportado' : '❌ Não suportado'}`);
      setSupported(isSupported);

      if (isSupported) {
        console.log('🔔 [NotificationButton] Verificando status de subscription...');
        const currentlySubscribed = await isSubscribed();
        console.log(`🔔 [NotificationButton] Status inicial: ${currentlySubscribed ? '✅ Inscrito' : '❌ Não inscrito'}`);
        setSubscribed(currentlySubscribed);
      }
    };

    checkStatus();
  }, []);

  const handleToggleNotifications = async () => {
    console.log('\n🔔 ═══════════════════════════════════════════════════════');
    console.log('🔔 [NotificationButton] BOTÃO CLICADO');
    console.log(`🔔 [NotificationButton] Ação: ${subscribed ? 'DESATIVAR' : 'ATIVAR'} notificações`);
    console.log('🔔 ═══════════════════════════════════════════════════════\n');
    
    setLoading(true);
    
    try {
      if (subscribed) {
        // Desativar notificações
        console.log('🔔 [NotificationButton] Iniciando processo de DESATIVAÇÃO...');
        const success = await unsubscribeFromPushNotifications();
        if (success) {
          console.log('🔔 [NotificationButton] ✅ Desativação concluída com sucesso!');
          setSubscribed(false);
          setCurrentEndpoint(null);
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 3000);
        } else {
          console.log('🔔 [NotificationButton] ❌ Falha na desativação');
        }
      } else {
        // Ativar notificações
        console.log('🔔 [NotificationButton] Iniciando processo de ATIVAÇÃO...');
        const permission = getNotificationPermission();
        console.log(`🔔 [NotificationButton] Permissão atual: ${permission}`);
        
        if (permission === 'denied') {
          console.log('🔔 [NotificationButton] ❌ Permissão NEGADA pelo usuário anteriormente');
          alert(
            'Você bloqueou as notificações. ' +
            'Para ativar, vá nas configurações do navegador e permita notificações para este site.'
          );
          setLoading(false);
          return;
        }

        console.log('🔔 [NotificationButton] Chamando subscribeToPushNotifications()...');
        const subscription = await subscribeToPushNotifications();
        
        if (subscription) {
          console.log('🔔 [NotificationButton] ✅ Ativação concluída com sucesso!');
          console.log('🔔 [NotificationButton] Subscription:', subscription);
          
          // Salvar endpoint para uso posterior
          setCurrentEndpoint(subscription.endpoint);
          
          // Verificar se é primeira vez (pode ser melhorado com localStorage)
          const isFirstTime = !localStorage.getItem('notification_preferences_set');
          
          setSubscribed(true);
          setLoading(false);
          
          // Mostrar modal de configuração na primeira vez
          if (isFirstTime) {
            setShowFirstTimeModal(true);
          } else {
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
            
            // Mostrar notificação de teste
            setTimeout(() => {
              showTestNotification()
                .then(() => console.log('🔔 [NotificationButton] ✅ Notificação de teste exibida!'))
                .catch((err) => console.error('🔔 [NotificationButton] ❌ Erro na notificação de teste:', err));
            }, 1000);
          }
          return; // Retornar aqui para não executar o setLoading(false) abaixo
        } else {
          console.log('🔔 [NotificationButton] ❌ Subscription retornou null');
        }
      }
    } catch (error) {
      console.error('🔔 [NotificationButton] ❌ ERRO CRÍTICO:', error);
      alert('Erro ao processar sua solicitação. Tente novamente.');
    } finally {
      setLoading(false);
      console.log('🔔 [NotificationButton] Processo finalizado.\n');
    }
  };

  const handleFirstTimeComplete = async (selectedCategories: string[]) => {
    if (!currentEndpoint) return;

    try {
      // Preparar preferências baseadas nas categorias selecionadas
      const preferences: any = {
        endpoint: currentEndpoint,
        notify_new_properties: selectedCategories.includes('notify_new_properties'),
        notify_price_changes: selectedCategories.includes('notify_price_changes'),
        notify_status_changes: selectedCategories.includes('notify_status_changes'),
        notify_recommendations: selectedCategories.includes('notify_recommendations'),
      };

      // Enviar preferências para o backend
      const response = await fetch('http://localhost:8000/api/notifications/preferences/update/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('notification_preferences_set', 'true');
        setShowFirstTimeModal(false);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);

        // Mostrar notificação de teste
        setTimeout(() => {
          showTestNotification()
            .then(() => console.log('🔔 [NotificationButton] ✅ Notificação de teste exibida!'))
            .catch((err) => console.error('🔔 [NotificationButton] ❌ Erro na notificação de teste:', err));
        }, 500);
      }
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };

  const handleOpenPreferences = () => {
    setShowPreferences(true);
  };

  // Não mostrar botão se notificações não são suportadas
  if (!supported) {
    return null;
  }

  return (
    <>
      <div className="relative flex items-center gap-2">
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

        {/* Botão de Configurações (só aparece quando subscribed) */}
        {subscribed && currentEndpoint && (
          <button
            onClick={handleOpenPreferences}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Configurar preferências de notificação"
          >
            <FiSettings className="text-xl" />
          </button>
        )}

        {/* Tooltip de confirmação */}
        {showTooltip && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50">
            {subscribed 
              ? '✅ Notificações ativadas! Configure suas preferências.'
              : '❌ Notificações desativadas.'
            }
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
          </div>
        )}
      </div>

      {/* Modal de Primeira Ativação */}
      <FirstTimeNotificationModal
        isOpen={showFirstTimeModal}
        onClose={() => {
          setShowFirstTimeModal(false);
          localStorage.setItem('notification_preferences_set', 'true');
        }}
        onComplete={handleFirstTimeComplete}
      />

      {/* Modal de Preferências */}
      {showPreferences && currentEndpoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Preferências de Notificação</h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <NotificationPreferences
                endpoint={currentEndpoint}
                onClose={() => setShowPreferences(false)}
                onSave={() => {
                  setShowPreferences(false);
                  setShowTooltip(true);
                  setTimeout(() => setShowTooltip(false), 3000);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
