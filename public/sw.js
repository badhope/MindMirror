// MindMirror · Service Worker (v5 - 极简策略)
// 核心原则：JS/CSS 带内容 hash，浏览器自身缓存即可，SW 不干预
// 只缓存静态资源（图片、字体等），避免 SW 缓存旧 JS 导致白屏

const CACHE = 'mindmirror-v5';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    Promise.all([
      // 清理所有旧缓存（v1/v2/v3/v4 全部清除）
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      ),
      self.clients.claim(),
    ])
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (e.request.method !== 'GET') return;

  // JS/CSS/HTML：完全不拦截，让浏览器自己处理
  // 带 hash 的 JS/CSS 浏览器会永久缓存，不带 hash 的 HTML 每次请求最新
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.html')) {
    return;
  }

  // 其他资源（图片、字体、SVG 等）：网络优先，离线降级缓存
  e.respondWith(
    fetch(e.request)
      .then((resp) => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone)).catch(() => {});
        }
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
