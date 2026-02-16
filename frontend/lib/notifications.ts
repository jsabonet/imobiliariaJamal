/**
 * Biblioteca para gerenciamento de notificações push
 */

// Chave pública VAPID - deve ser gerada no backend e adicionada aqui
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

/**
 * Converte uma chave VAPID base64 para Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  console.log('🔐 [VAPID] Convertendo chave VAPID de base64 para Uint8Array...');
  console.log(`🔐 [VAPID] Comprimento da chave: ${base64String.length} caracteres`);
  
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  console.log(`🔐 [VAPID] ✅ Conversão completa: ${outputArray.length} bytes`);
  return outputArray;
}

/**
 * Verifica se o navegador suporta notificações push
 */
export function isPushNotificationSupported(): boolean {
  const hasServiceWorker = 'serviceWorker' in navigator;
  const hasPushManager = 'PushManager' in window;
  const hasNotification = 'Notification' in window;
  
  console.log('🔍 [Suporte] Verificando APIs disponíveis:');
  console.log(`   - Service Worker: ${hasServiceWorker ? '✅' : '❌'}`);
  console.log(`   - Push Manager: ${hasPushManager ? '✅' : '❌'}`);
  console.log(`   - Notification: ${hasNotification ? '✅' : '❌'}`);
  
  return hasServiceWorker && hasPushManager && hasNotification;
}

/**
 * Solicita permissão para enviar notificações
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  console.log('🔔 [Permissão] Solicitando permissão ao usuário...');
  
  if (!isPushNotificationSupported()) {
    console.log('🔔 [Permissão] ❌ Push notifications não suportadas');
    throw new Error('Push notifications não são suportadas neste navegador');
  }

  const permission = await Notification.requestPermission();
  console.log(`🔔 [Permissão] Resposta do usuário: ${permission}`);
  
  if (permission === 'granted') {
    console.log('🔔 [Permissão] ✅ CONCEDIDA');
  } else if (permission === 'denied') {
    console.log('🔔 [Permissão] ❌ NEGADA');
  } else {
    console.log('🔔 [Permissão] ⚠️ IGNORADA (default)');
  }
  
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
  console.log('\n📱 ═══════════════════════════════════════════════════════');
  console.log('📱 [Subscribe] INICIANDO PROCESSO DE SUBSCRIPTION');
  console.log('📱 ═══════════════════════════════════════════════════════\n');
  
  try {
    // Verificar suporte
    console.log('📱 [Subscribe] PASSO 1: Verificar suporte do navegador');
    if (!isPushNotificationSupported()) {
      console.log('📱 [Subscribe] ❌ ABORTADO: Navegador não suporta push notifications');
      throw new Error('Push notifications não são suportadas');
    }
    console.log('📱 [Subscribe] ✅ Navegador suporta push notifications\n');

    // Solicitar permissão
    console.log('📱 [Subscribe] PASSO 2: Solicitar permissão do usuário');
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.log('📱 [Subscribe] ❌ ABORTADO: Permissão não concedida\n');
      return null;
    }
    console.log('📱 [Subscribe] ✅ Permissão concedida\n');

    // Obter service worker registration
    console.log('📱 [Subscribe] PASSO 3: Obter Service Worker registration');
    console.log('📱 [Subscribe] Verificando Service Worker...');
    
    // Verificar se há um Service Worker ativo
    let registration = await navigator.serviceWorker.getRegistration();
    console.log('📱 [Subscribe] Registration atual:', registration);
    
    if (!registration) {
      console.log('📱 [Subscribe] ⚠️ Nenhum Service Worker registrado!');
      console.log('📱 [Subscribe] Tentando registrar /sw.js...');
      
      try {
        registration = await navigator.serviceWorker.register('/sw.js');
        console.log('📱 [Subscribe] ✅ Service Worker registrado:', registration);
        
        // Aguardar ativação
        console.log('📱 [Subscribe] Aguardando Service Worker ficar pronto...');
        await navigator.serviceWorker.ready;
        console.log('📱 [Subscribe] ✅ Service Worker ativado!');
      } catch (error) {
        console.error('📱 [Subscribe] ❌ Erro ao registrar Service Worker:', error);
        throw new Error('Falha ao registrar Service Worker: ' + error);
      }
    } else {
      console.log('📱 [Subscribe] ✅ Service Worker já registrado');
      console.log('📱 [Subscribe] Estado:', registration.active?.state);
      
      // Se não estiver ativo, aguardar
      if (!registration.active || registration.active.state !== 'activated') {
        console.log('📱 [Subscribe] Aguardando Service Worker ficar pronto...');
        await navigator.serviceWorker.ready;
        console.log('📱 [Subscribe] ✅ Service Worker ativado!');
      }
    }
    
    console.log('📱 [Subscribe] ✅ Service Worker pronto:', registration);
    console.log(`📱 [Subscribe] SW Scope: ${registration.scope}\n`);

    // Verificar se já existe uma subscription
    console.log('📱 [Subscribe] PASSO 4: Verificar subscription existente');
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log('📱 [Subscribe] ℹ️  Nenhuma subscription encontrada');
      console.log('📱 [Subscribe] PASSO 5: Criar nova subscription\n');
      
      // Criar nova subscription
      if (!VAPID_PUBLIC_KEY) {
        console.log('📱 [Subscribe] ❌ ERRO: VAPID_PUBLIC_KEY não configurada!');
        throw new Error('VAPID_PUBLIC_KEY não configurada');
      }
      
      console.log('📱 [Subscribe] VAPID Key disponível: ' + VAPID_PUBLIC_KEY.substring(0, 20) + '...');
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource;
      
      console.log('📱 [Subscribe] Chamando pushManager.subscribe()...');
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      console.log('📱 [Subscribe] ✅ Nova push subscription criada!');
      console.log('📱 [Subscribe] Endpoint:', subscription.endpoint.substring(0, 60) + '...');
    } else {
      console.log('📱 [Subscribe] ✅ Subscription já existe (reutilizando)');
      console.log('📱 [Subscribe] Endpoint:', subscription.endpoint.substring(0, 60) + '...');
    }

    // Enviar subscription para o backend
    console.log('\n📱 [Subscribe] PASSO 6: Registrar no backend');
    await sendSubscriptionToBackend(subscription);

    console.log('\n📱 [Subscribe] ✅ PROCESSO COMPLETO!');
    console.log('📱 ═══════════════════════════════════════════════════════\n');
    return subscription;
  } catch (error) {
    console.error('📱 [Subscribe] ❌ ERRO CRÍTICO:', error);
    console.log('📱 ═══════════════════════════════════════════════════════\n');
    throw error;
  }
}

/**
 * Remove a subscription de push
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  console.log('\n🚫 ═══════════════════════════════════════════════════════');
  console.log('🚫 [Unsubscribe] INICIANDO PROCESSO DE DESATIVAÇÃO');
  console.log('🚫 ═══════════════════════════════════════════════════════\n');
  
  try {
    console.log('🚫 [Unsubscribe] Obtendo Service Worker...');
    const registration = await navigator.serviceWorker.ready;
    console.log('🚫 [Unsubscribe] Buscando subscription ativa...');
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log('🚫 [Unsubscribe] ℹ️  Nenhuma subscription encontrada');
      console.log('🚫 ═══════════════════════════════════════════════════════\n');
      return false;
    }

    console.log('🚫 [Unsubscribe] ✅ Subscription encontrada');
    console.log('🚫 [Unsubscribe] Endpoint:', subscription.endpoint.substring(0, 60) + '...');
    
    // Remover do backend primeiro
    console.log('\n🚫 [Unsubscribe] PASSO 1: Remover do backend');
    await removeSubscriptionFromBackend(subscription);

    // Depois desinscrever localmente
    console.log('🚫 [Unsubscribe] PASSO 2: Desinscrever localmente');
    const successful = await subscription.unsubscribe();
    
    if (successful) {
      console.log('🚫 [Unsubscribe] ✅ Desinscrição local bem-sucedida');
    } else {
      console.log('🚫 [Unsubscribe] ⚠️ Desinscrição local falhou');
    }
    
    console.log('\n🚫 [Unsubscribe] ✅ PROCESSO COMPLETO!');
    console.log('🚫 ═══════════════════════════════════════════════════════\n');
    return successful;
  } catch (error) {
    console.error('🚫 [Unsubscribe] ❌ ERRO:', error);
    console.log('🚫 ═══════════════════════════════════════════════════════\n');
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
  console.log('📤 [Backend] Enviando subscription para o backend...');
  
  try {
    const subscriptionJSON = subscription.toJSON();
    console.log('📤 [Backend] Subscription convertida para JSON');
    console.log('📤 [Backend] Dados:', {
      endpoint: subscriptionJSON.endpoint?.substring(0, 50) + '...',
      p256dh: subscriptionJSON.keys?.p256dh?.substring(0, 20) + '...',
      auth: subscriptionJSON.keys?.auth?.substring(0, 20) + '...'
    });

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/subscribe/`;
    console.log(`📤 [Backend] URL: ${apiUrl}`);
    console.log('📤 [Backend] Enviando requisição POST...');
    
    const response = await fetch(apiUrl, {
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

    console.log(`📤 [Backend] Resposta recebida: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.log('📤 [Backend] ❌ Erro na resposta');
      throw new Error('Falha ao registrar subscription no backend');
    }

    const data = await response.json();
    console.log('📤 [Backend] ✅ Subscription registrada com sucesso!');
    console.log('📤 [Backend] Resposta:', data);
  } catch (error) {
    console.error('📤 [Backend] ❌ Erro ao enviar subscription:', error);
    throw error;
  }
}

/**
 * Remove a subscription do backend
 */
async function removeSubscriptionFromBackend(subscription: PushSubscription): Promise<void> {
  console.log('📤 [Backend] Removendo subscription do backend...');
  
  try {
    const subscriptionJSON = subscription.toJSON();
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/unsubscribe/`;
    
    console.log(`📤 [Backend] URL: ${apiUrl}`);
    console.log('📤 [Backend] Endpoint:', subscriptionJSON.endpoint?.substring(0, 50) + '...');
    console.log('📤 [Backend] Enviando requisição POST...');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subscriptionJSON.endpoint,
      }),
    });

    console.log(`📤 [Backend] Resposta: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.log('📤 [Backend] ❌ Erro na resposta');
      throw new Error('Falha ao remover subscription no backend');
    }

    const data = await response.json();
    console.log('📤 [Backend] ✅ Subscription removida com sucesso!');
    console.log('📤 [Backend] Resposta:', data);
  } catch (error) {
    console.error('📤 [Backend] ❌ Erro ao remover subscription:', error);
    throw error;
  }
}

/**
 * Mostra uma notificação de teste
 */
export async function showTestNotification(): Promise<void> {
  console.log('\n🧪 ═══════════════════════════════════════════════════════');
  console.log('🧪 [TestNotification] EXIBINDO NOTIFICAÇÃO DE TESTE');
  console.log('🧪 ═══════════════════════════════════════════════════════\n');
  
  console.log('🧪 [TestNotification] Verificando suporte...');
  if (!isPushNotificationSupported()) {
    console.log('🧪 [TestNotification] ❌ Notificações não suportadas');
    throw new Error('Notificações não suportadas');
  }

  console.log('🧪 [TestNotification] Verificando permissão...');
  const permission = getNotificationPermission();
  console.log(`🧪 [TestNotification] Permissão: ${permission}`);
  
  if (permission !== 'granted') {
    console.log('🧪 [TestNotification] ❌ Permissão não concedida');
    throw new Error('Permissão de notificação não concedida');
  }

  console.log('🧪 [TestNotification] Obtendo Service Worker...');
  const registration = await navigator.serviceWorker.ready;
  console.log('🧪 [TestNotification] ✅ Service Worker pronto');
  
  console.log('🧪 [TestNotification] Exibindo notificação...');
  await registration.showNotification('🏠 IJPS - Imobiliária Jamal', {
    body: 'As notificações estão funcionando! Você receberá alertas quando novas propriedades forem publicadas.',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'test-notification',
    data: {
      url: '/',
    },
  });
  
  console.log('🧪 [TestNotification] ✅ Notificação exibida com sucesso!');
  console.log('🧪 ═══════════════════════════════════════════════════════\n');
}
