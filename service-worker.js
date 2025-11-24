const CACHE_NAME = "musicplayer-cache-v4"; // <-- UPDATE VERSION

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css?v=4",
  "./script.js?v=4",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// 🧩 INSTALL
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// 🌀 ACTIVATE
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activated");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// 🌐 FETCH (AUDIO SAFE MODE)
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // ❌ Do NOT cache audio files — prevents 206 errors
  if (request.destination === "audio") {
    return event.respondWith(fetch(request)); // direct network
  }

  // Normal caching for all other files
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // serve from cache when available
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then((networkResponse) => {
          // Skip caching non-OK responses
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const cloned = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, cloned);
          });

          return networkResponse;
        })
        .catch(() => caches.match("./index.html")); // fallback
    })
  );
});
