/* 國小學習群島 — Service Worker（scope = 本檔所在目錄，GitHub Pages 為 /kid-game/） */
/* 每次部署請遞增 CACHE_VERSION，舊快取會在 activate 時刪除 */
var CACHE_VERSION = 'isles-shell-v2';
var SHELL_CACHE = CACHE_VERSION + '-shell';
var RUNTIME_CACHE = CACHE_VERSION + '-runtime';

var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/site.css',
  './assets/english.css',
  './assets/math.css',
  './assets/core.js',
  './assets/companions.js',
  './assets/ui.js',
  './assets/subject.js',
  './assets/lobby.js',
  './assets/pwa.js',
  './assets/data.js',
  './assets/math-data.js',
  './assets/english.js',
  './assets/math.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon-32.png',
  './english/index.html',
  './math/index.html'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      return cache.addAll(SHELL.map(function (u) {
        return new Request(u, { cache: 'reload' });
      })).catch(function (err) {
        // 個別資源失敗不擋安裝；之後 fetch 再補
        console.warn('[sw] shell precache partial', err);
      });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key.indexOf(CACHE_VERSION) !== 0) return caches.delete(key);
        return null;
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isNav(request) {
  return request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept') &&
      request.headers.get('accept').indexOf('text/html') !== -1);
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;
  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML：網路優先，失敗才用快取（避免部署後卡舊頁）
  if (isNav(request)) {
    event.respondWith(
      fetch(request).then(function (response) {
        var copy = response.clone();
        caches.open(RUNTIME_CACHE).then(function (cache) { cache.put(request, copy); });
        return response;
      }).catch(function () {
        return caches.match(request).then(function (cached) {
          return cached || caches.match('./index.html');
        });
      })
    );
    return;
  }

  // 同站靜態資源：快取優先，背景更新
  event.respondWith(
    caches.match(request).then(function (cached) {
      var fetched = fetch(request).then(function (response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(RUNTIME_CACHE).then(function (cache) { cache.put(request, copy); });
        }
        return response;
      }).catch(function () { return cached; });
      return cached || fetched;
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
