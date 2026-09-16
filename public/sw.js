const CACHE_NAME = "base12-shell-v3";
const SHELL = ["/", "/manifest.webmanifest", "/images/base12-logo.png", "/images/tabla-periodica-icon.png", "/icons/base12-192.png?v=2", "/icons/base12-512.png?v=2", "/icons/apple-touch-icon.png?v=2", "/icons/tabla-periodica-192.png", "/icons/tabla-periodica-512.png", "/icons/tabla-periodica-apple.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("/")));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
