/**
 * Biblioteca para gerenciamento de notificações push
 */

// Chave pública VAPID - deve ser gerada no backend e adicionada aqui
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

/**
 * Converte uma chave VAPID base64 para Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Verifica se o navegador suporta notificações push
 */
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Solicita permissão para enviar notificações
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications não são suportadas neste navegador');
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Verifica o status atual da permissão de notificações
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isPushNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Registra uma nova subscription de push
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  try {
    // Verificar suporte
    if (!isPushNotificationSupported()) {
      throw new Error('Push notifications não são suportadas');
    }

    // Solicitar permissão
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('Permissão de notificação negada');
      return null;
    }

    // Obter service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Verificar se já existe uma subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Criar nova subscription
      if (!VAPID_PUBLIC_KEY) {
        throw new Error('VAPID_PUBLIC_KEY não configurada');
      }

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource
      });

      console.log('Nova push subscription criada:', subscription);
    } else {
      console.log('Push subscription já existe:', subscription);
    }

    // Enviar subscription para o backend
    await sendSubscriptionToBackend(subscription);

    return subscription;
  } catch (error) {
    console.error('Erro ao criar push subscription:', error);
    throw error;
  }
}

/**
 * Remove a subscription de push
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log('Nenhuma subscription encontrada');
      return false;
    }

    // Remover do backend primeiro
    await removeSubscriptionFromBackend(subscription);

    // Depois desinscrever localmente
    const successful = await subscription.unsubscribe();
    console.log('Unsubscribe successful:', successful);

    return successful;
  } catch (error) {
    console.error('Erro ao remover push subscription:', error);
    return false;
  }
}

/**
 * Verifica se o usuário está inscrito para notificações
 */
export async function isSubscribed(): Promise<boolean> {
  try {
    if (!isPushNotificationSupported()) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    return subscription !== null;
  } catch (error) {
    console.error('Erro ao verificar subscription:', error);
    return false;
  }
}

/**
 * Envia a subscription para o backend
 */
async function sendSubscriptionToBackend(subscription: PushSubscription): Promise<void> {
  try {
    const subscriptionJSON = subscription.toJSON();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/subscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subscriptionJSON.endpoint,
        p256dh: subscriptionJSON.keys?.p256dh,
        auth: subscriptionJSON.keys?.auth,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao registrar subscription no backend');
    }

    const data = await response.json();
    console.log('Subscription registrada no backend:', data);
  } catch (error) {
    console.error('Erro ao enviar subscription para backend:', error);
    throw error;
  }
}

/**
 * Remove a subscription do backend
 */
async function removeSubscriptionFromBackend(subscription: PushSubscription): Promise<void> {
  try {
    const subscriptionJSON = subscription.toJSON();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/unsubscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subscriptionJSON.endpoint,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha ao remover subscription no backend');
    }

    console.log('Subscription removida do backend');
  } catch (error) {
    console.error('Erro ao remover subscription do backend:', error);
    throw error;
  }
}

/**
 * Mostra uma notificação de teste
 */
export async function showTestNotification(): Promise<void> {
  if (!isPushNotificationSupported()) {
    throw new Error('Notificações não suportadas');
  }

  const permission = getNotificationPermission();
  if (permission !== 'granted') {
    throw new Error('Permissão de notificação não concedida');
  }

  const registration = await navigator.serviceWorker.ready;
  
  await registration.showNotification('🏠 IJPS - Imobiliária Jamal', {
    body: 'As notificações estão funcionando! Você receberá alertas quando novas propriedades forem publicadas.',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'test-notification',
    data: {
      url: '/',
    },
  });
}
