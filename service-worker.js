// Satay Supply Dashboard - service worker
// Bump CACHE_VERSION whenever you change index.html or other cached files so installed apps update.
const CACHE_VERSION = 'v2';
const CACHE = 'satay-dashboard-' + CACHE_VERSION;
const ASSETS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'users.json', 'data.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(ASSETS.map(a => cache.add(a).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('satay-dashboard-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const cacheable = res => res && (res.ok || res.type === 'opaque');

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (cacheable(res)) { const c = await caches.open(CACHE); c.put(req, res.clone()); }
    return res;
  } catch (err) {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') {
      const page = (await caches.match('index.html')) || (await caches.match('./'));
      if (page) return page;
    }
    return Response.error();
  }
}

async function cacheFirst(req) {
  const hit = await caches.match(req, { ignoreSearch: true });
  if (hit) return hit;
  const res = await fetch(req);
  if (cacheable(res)) { const c = await caches.open(CACHE); c.put(req, res.clone()); }
  return res;
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const refresh = fetch(req).then(res => { if (cacheable(res)) cache.put(req, res.clone()); return res; }).catch(() => null);
  return hit || (await refresh) || Response.error();
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    // users.json / data.json and page loads: try the network first so changes show up, fall back to cache offline
    if (req.mode === 'navigate' || /\/(users|data)\.json$/.test(url.pathname)) {
      event.respondWith(networkFirst(req));
    } else {
      event.respondWith(cacheFirst(req));
    }
  } else {
    // Tailwind CDN etc.: serve cached copy instantly and refresh in the background (keeps the app working offline)
    event.respondWith(staleWhileRevalidate(req));
  }
});
