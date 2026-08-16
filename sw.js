const CACHE_NAME = 'room-calc-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    // Forceer de browser om bij de server (GitHub) te checken en de browser-cache te negeren
    fetch(new Request(event.request, { cache: 'reload' }))
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Geen internet? Gebruik dan de opgeslagen versie uit de cache
        return caches.match(event.request);
      })
  );
});
