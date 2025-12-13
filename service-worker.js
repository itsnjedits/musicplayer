const CACHE_NAME = "musicplayer-cache-v7"; // 🔥 bump version

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// 🧩 INSTALL
self.addEventListener("install", event => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// 🌀 ACTIVATE
self.addEventListener("activate", event => {
  console.log("[SW] Activated");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => k !== CACHE_NAME && caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 🌐 FETCH
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // ❌ NEVER cache JS / CSS / JSON (DEV SAFE)
  if (
    req.destination === "script" ||
    req.destination === "style" ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".json")
  ) {
    return event.respondWith(fetch(req));
  }

  // ❌ NEVER cache audio
  if (req.destination === "audio") {
    return event.respondWith(fetch(req));
  }

  // ✅ Cache-first only for static assets
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return res;
      });
    })
  );
});
