// MindMirror · Service Worker
// 策略：HTML 走网络优先，JS/CSS 带 hash 走缓存优先，其他资源缓存优先
// 关键：所有路径使用 self.location基准，确保 GitHub Pages 子路径下正确

const CACHE = 'mindmirror-v3';

// 清除旧版缓存
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // 只拦截同源请求
  if (url.origin !== location.origin) return;

  // HTML：永远走网络，保证拿到最新
  if (e.request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(e.request)
        .then((resp) => {
          if (resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return resp;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // JS/CSS 带 hash：缓存优先（hash 变化 = 新文件 = 新 URL）
  if (/\.[a-f0-9]{8,}\.(js|css)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((resp) => {
          if (resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return resp;
        });
      })
    );
    return;
  }

  // 其他资源：缓存优先
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request);
    })
  );
});
