const CACHE_NAME = "musicplayer-cache-v6"; // updated version

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
  // NOTE: script.js & style.css will be network-first
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

// 🌐 FETCH HANDLER
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // ❌ Do NOT cache audio files
  if (request.destination === "audio") {
    return event.respondWith(fetch(request));
  }

  // ❌ Always fetch fresh for songs.json, script.js & style.css
  if (
    request.url.endsWith("songs.json") ||
    request.url.endsWith("script.js?v=5") ||
    request.url.endsWith("style.css?v=5")
  ) {
    return event.respondWith(fetch(request));
  }

  // ✅ Cache-first strategy for everything else
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
        .catch(() => caches.match("./index.html")) // fallback for offline
    })
  );
});
