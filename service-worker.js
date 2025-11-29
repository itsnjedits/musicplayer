const CACHE_NAME = "musicplayer-cache-v5"; // updated version

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css?v=5",
  "./script.js?v=5",
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

// 🌐 FETCH HANDLER — fully fixed
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // ❌ Do NOT cache audio files
  if (request.destination === "audio") {
    return event.respondWith(fetch(request));
  }

  // ❌ Do NOT cache songs.json — ALWAYS fetch fresh
  if (request.url.endsWith("songs.json")) {
    return event.respondWith(fetch(request));
  }

  // For all other requests → cache-first strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));

          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
