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
