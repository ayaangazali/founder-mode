// sw.js — OPTIONAL enhancement (the game itself stays one file and runs without
// this). Network-first with cache fallback: deploys propagate immediately, and
// the game keeps working underground on Muni. /api/ is never intercepted —
// the leaderboard and share cards stay live-only.
const C = 'sfspeedrun-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['/', '/apple-touch-icon.png', '/icon-512.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const cp = r.clone();
      caches.open(C).then(c => c.put(e.request, cp));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: u.pathname === '/' }))
  );
});
