const CACHE_VERSION = 'healthtwin-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html',
];

const API_HOSTS = ['supabase.co', 'supabase.in'];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: strategy based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache oauth routes
  if (url.pathname.startsWith('/~oauth')) return;

  // API requests: network-first with cache fallback
  if (API_HOSTS.some((h) => url.hostname.includes(h))) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Static assets (js, css, images, fonts): cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // HTML navigation: network-first, fallback to offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // Everything else: network-first
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Background sync for prescription uploads
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-prescriptions') {
    event.waitUntil(syncPrescriptions());
  }
});

// Push notifications for medicine reminders
self.addEventListener('push', (event) => {
  let data = { title: 'HealthTwin Reminder', body: 'Time to take your medicine!' };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    // use defaults
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      tag: data.tag || 'medicine-reminder',
      renotify: true,
      actions: [
        { action: 'taken', title: '✅ Taken' },
        { action: 'snooze', title: '⏰ Snooze 10min' },
      ],
    })
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'snooze') {
    // Re-notify in 10 minutes
    setTimeout(() => {
      self.registration.showNotification('HealthTwin Reminder', {
        body: event.notification.body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        tag: 'medicine-reminder-snooze',
      });
    }, 10 * 60 * 1000);
    return;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      if (clients.length > 0) {
        clients[0].focus();
        clients[0].navigate('/reminders');
      } else {
        self.clients.openWindow('/reminders');
      }
    })
  );
});

// --- Caching Strategies ---

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

function isStaticAsset(pathname) {
  return /\.(js|css|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|eot|ico)(\?.*)?$/.test(pathname);
}

// --- Background Sync ---

async function syncPrescriptions() {
  // Open IndexedDB and process pending uploads
  try {
    const db = await openDB();
    const tx = db.transaction('pending-uploads', 'readonly');
    const store = tx.objectStore('pending-uploads');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = async () => {
        const items = request.result || [];
        for (const item of items) {
          try {
            await fetch(item.url, {
              method: 'POST',
              headers: item.headers,
              body: item.body,
            });
            // Remove from pending
            const delTx = db.transaction('pending-uploads', 'readwrite');
            delTx.objectStore('pending-uploads').delete(item.id);
          } catch {
            // Will retry on next sync
          }
        }
        resolve();
      };
      request.onerror = reject;
    });
  } catch {
    // IndexedDB not available
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('healthtwin-offline', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('pending-uploads')) {
        db.createObjectStore('pending-uploads', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('offline-data')) {
        db.createObjectStore('offline-data', { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
