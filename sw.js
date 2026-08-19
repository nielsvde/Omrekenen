const CACHE_NAME = 'product-correctie-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './logotekst.png',
  './icon.png'
];

// Installatie en cachen van bestanden
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activeren en oude caches opruimen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Netwerkverzoeken afhandelen (Cache First strategie)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Optioneel dynamisch cachen kan hier, indien gewenst
          return fetchResponse;
        });
      });
    }).catch(() => {
      // Eventuele offline fallback kan hier
    })
  );
});