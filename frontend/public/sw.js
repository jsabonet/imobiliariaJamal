const CACHE_NAME = 'ijps-v1';
const RUNTIME_CACHE = 'ijps-runtime-v1';
const IMAGE_CACHE = 'ijps-images-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/propriedades',
  '/servicos',
  '/sobre',
  '/contacto',
  '/manifest.json',
];

// Install event - cache initial assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching app shell');
      return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).then(() => {
      console.log('[Service Worker] Skip waiting on install');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== IMAGE_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
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
  console.log('[Service Worker] Push received:', event);
  
  let notificationData = {
    title: 'Nova Notificação',
    body: 'Você tem uma nova atualização!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    url: '/'
  };
  
  // Parse notification data
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      console.error('[Service Worker] Error parsing push data:', e);
    }
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
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // Get the URL from notification data
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open with this URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Notification close event handler
self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] Notification closed:', event);
});
