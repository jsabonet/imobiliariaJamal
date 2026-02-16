const CACHE_NAME = 'ijps-v1';
const RUNTIME_CACHE = 'ijps-runtime-v1';
const IMAGE_CACHE = 'ijps-images-v1';

// Assets to cache on install - only manifest initially to avoid failures
const PRECACHE_ASSETS = [
  '/manifest.json',
];

// Install event - cache initial assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching app shell');
        // Cache assets individually to avoid complete failure if one asset fails
        return Promise.allSettled(
          PRECACHE_ASSETS.map(url => 
            cache.add(new Request(url, { cache: 'reload' }))
              .then(() => console.log('[Service Worker] ✅ Cached:', url))
              .catch(err => console.warn('[Service Worker] ⚠️ Failed to cache:', url, err.message))
          )
        );
      })
      .then(() => {
        console.log('[Service Worker] ✅ Install complete, skipping waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] ❌ Install error:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== IMAGE_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
      .then(() => {
        console.log('[Service Worker] ✅ Activation complete!');
      })
      .catch((error) => {
        console.error('[Service Worker] ❌ Activation error:', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    // Cache images from external sources
    if (request.destination === 'image') {
      event.respondWith(
        caches.open(IMAGE_CACHE).then((cache) => {
          return cache.match(request).then((response) => {
            return response || fetch(request).then((response) => {
              cache.put(request, response.clone());
              return response;
            });
          });
        })
      );
    }
    return;
  }

  // Handle API requests - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    // Only cache GET requests, not POST/PUT/DELETE
    if (request.method === 'GET') {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
    } else {
      // For POST/PUT/DELETE, just fetch without caching
      event.respondWith(fetch(request));
    }
    return;
  }

  // Handle navigation requests - Network first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || caches.match('/');
          });
        })
    );
    return;
  }

  // Default strategy - Cache first, fallback to network
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request).then((response) => {
        return caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, response.clone());
          return response;
        });
      });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push notification event handler
self.addEventListener('push', (event) => {
  console.log('');
  console.log('[ServiceWorker] ========================================');
  console.log('[ServiceWorker] PUSH EVENT RECEBIDO');
  console.log('[ServiceWorker] ========================================');
  
  console.log('[ServiceWorker] Push event:', event);
  console.log('[ServiceWorker] Tem dados?', !!event.data);
  
  let notificationData = {
    title: 'Nova Notificação',
    body: 'Você tem uma nova atualização!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    url: '/'
  };
  
  // Parse notification data
  if (event.data) {
    console.log('[ServiceWorker] Parseando dados do push...');
    try {
      notificationData = event.data.json();
      console.log('[ServiceWorker] -> Dados parseados com sucesso:');
      console.log('[ServiceWorker]   - Titulo:', notificationData.title);
      console.log('[ServiceWorker]   - Corpo:', notificationData.body);
      console.log('[ServiceWorker]   - URL:', notificationData.url);
    } catch (e) {
      console.error('[ServiceWorker] -> ERRO ao parsear dados do push:', e);
      console.log('[ServiceWorker] Usando dados padrao');
    }
  } else {
    console.log('[ServiceWorker] -> Sem dados no push, usando padrao');
  }
  
  const { title, body, icon, badge, url } = notificationData;
  
  const options = {
    body: body,
    icon: icon || '/icon-192x192.png',
    badge: badge || '/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'notification-' + Date.now(),
    requireInteraction: false,
    data: {
      url: url || '/',
      dateOfArrival: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'Ver Agora',
        icon: '/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icon-72x72.png'
      }
    ]
  };
  
  console.log('[ServiceWorker] Configuracao da notificacao:', {
    title,
    bodyLength: body.length,
    icon: icon || 'padrao',
    tag: options.tag
  });
  
  console.log('[ServiceWorker] Exibindo notificacao...');
  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        console.log('[ServiceWorker] -> Notificacao exibida com sucesso!');
        console.log('[ServiceWorker] ========================================');
      })
      .catch((error) => {
        console.error('[ServiceWorker] -> ERRO ao exibir notificacao:', error);
        console.log('[ServiceWorker] ========================================');
      })
  );
});

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  console.log('');
  console.log('[ServiceWorker] ========================================');
  console.log('[ServiceWorker] NOTIFICACAO CLICADA');
  console.log('[ServiceWorker] ========================================');
  
  console.log('[ServiceWorker] Acao:', event.action || 'abertura padrao');
  console.log('[ServiceWorker] Notification data:', event.notification.data);
  
  event.notification.close();
  console.log('[ServiceWorker] Notificacao fechada');
  
  if (event.action === 'close') {
    console.log('[ServiceWorker] Usuario clicou em "Fechar"');
    console.log('[ServiceWorker] ========================================');
    return;
  }
  
  // Get the URL from notification data
  const urlToOpen = event.notification.data?.url || '/';
  console.log('[ServiceWorker] URL para abrir:', urlToOpen);
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        console.log('[ServiceWorker]', clientList.length, 'janela(s) encontrada(s)');
        
        // Check if there's already a window open with this URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            console.log('[ServiceWorker] -> Focando janela existente');
            console.log('[ServiceWorker] ========================================');
            return client.focus();
          }
        }
        
        // If not, open a new window
        if (clients.openWindow) {
          console.log('[ServiceWorker] -> Abrindo nova janela');
          console.log('[ServiceWorker] ========================================');
          return clients.openWindow(urlToOpen);
        }
      })
      .catch((error) => {
        console.error('[ServiceWorker] -> ERRO ao abrir janela:', error);
        console.log('[ServiceWorker] ========================================');
      })
  );
});

// Notification close event handler
self.addEventListener('notificationclose', (event) => {
  console.log('');
  console.log('[ServiceWorker] ========================================');
  console.log('[ServiceWorker] NOTIFICACAO FECHADA');
  console.log('[ServiceWorker] ========================================');
  
  console.log('[ServiceWorker] Tag:', event.notification.tag);
  console.log('[ServiceWorker] Data:', event.notification.data);
  console.log('[ServiceWorker] Titulo:', event.notification.title);
  
  console.log('[ServiceWorker] ========================================');
});
