self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  return self.clients.claim();
});

// Optional: Cache static files for offline
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
