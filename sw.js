const CACHE_NAME = "tawon-shell-v4";
const APP_SHELL = ["/", "/index.html", "/artikel.html", "/manifest.webmanifest", "/assets/tawon-logo.svg"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname === "/admin.html" || url.pathname === "/frontend-settings.js") { event.respondWith(fetch(req)); return; }
  if (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname === "/" || url.pathname === "/sitemap.xml" || url.pathname === "/robots.txt") {
    event.respondWith(fetch(req).then(res => {
      if (res && res.ok && !url.searchParams.has("slug")) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then(cached => cached || caches.match("/index.html"))));
    return;
  }
  if (url.searchParams.has("slug")) {
    event.respondWith(fetch(req).catch(() => caches.match("/artikel.html")));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
    }
    return res;
  }).catch(() => caches.match("/index.html"))));
});

