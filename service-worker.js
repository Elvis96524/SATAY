// Satay Supply Dashboard - service worker
// Bump CACHE_VERSION whenever you change index.html or other cached files so installed apps update.
const CACHE_VERSION = 'gh1';
const CACHE = 'satay-dashboard-' + CACHE_VERSION;
const ASSETS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
const CDN_HOSTS = ['cdn.tailwindcss.com'];

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

// Try the network first (skipping the browser's 10-minute page cache) and fall back to the saved copy when offline
async function networkFirst(req) {
  try {
    const res = await fetch(req, { cache: 'no-cache' });
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
    // pages and the small settings files must always be fresh (a changed password or user list should apply at once)
    if (req.mode === 'navigate' || /\/(users|config|data)\.json$/.test(url.pathname)) {
      event.respondWith(networkFirst(req));
    } else {
      event.respondWith(cacheFirst(req));
    }
  } else if (CDN_HOSTS.includes(url.hostname)) {
    // Tailwind: serve the saved copy instantly and refresh it in the background (keeps the app working offline)
    event.respondWith(staleWhileRevalidate(req));
  }
  // Anything else - above all api.github.com, where the shared data lives - goes straight to the network and is never cached.
});
