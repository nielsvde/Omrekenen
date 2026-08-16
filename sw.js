const CACHE_NAME = 'room-calc-v1';

// 1. Installatie
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 2. Activatie
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 3. Slimme afhandeling per bestandstype
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    // Probeer ALTIJD eerst het netwerk (GitHub) op te halen
    fetch(event.request)
      .then((networkResponse) => {
        // Gelukt? Sla de nieuwste versie direct op in de cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Geen internet/offline? Gebruik de gecachete versie
        return caches.match(event.request);
      })
  );
});
