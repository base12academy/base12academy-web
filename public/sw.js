const CACHE_NAME = "base12-shell-v4";
const TRAINING_HOST = "training.base12academy.es";
const IS_TRAINING = self.location.hostname === TRAINING_HOST;

const SHELL = IS_TRAINING
  ? [
      "/",
      "/manifest.webmanifest",
      "/images/training/base12-training-192.png?v=4",
      "/apps/base12-training/icon-512.png?v=4",
      "/images/training/base12-training-180.png?v=4",
    ]
  : [
      "/",
      "/manifest.webmanifest",
      "/images/base12-logo.png",
      "/images/tabla-periodica-icon.png",
      "/icons/base12-192.png?v=2",
      "/icons/base12-512.png?v=2",
      "/icons/apple-touch-icon.png?v=2",
      "/icons/tabla-periodica-192.png",
      "/icons/tabla-periodica-512.png",
      "/icons/tabla-periodica-apple.png",
    ];

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
