const CACHE_NAME = 'room-calc-dynamic';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Bij installatie: sla de basisbestanden op
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Zorg dat een nieuwe SW direct actief wordt
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Slimme afhandeling: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  // Alleen GET-verzoeken verwerken
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Haal altijd de nieuwste versie op van het netwerk op de achtergrond
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Als de respons geldig is, werk de cache bij voor de volgende keer
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline? Geen probleem, we gebruiken de cache
          });

        // Geef direct de gecachete versie als die er is, anders wacht op het netwerk
        return cachedResponse || fetchPromise;
      });
    })
  );
});
