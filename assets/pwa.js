/* 國小英語群島 — 註冊 Service Worker（自動推算 /kid-game/ 基底） */
(function () {
  'use strict';

  /** 由目前路徑推算應用根（GitHub Pages 為 /kid-game/；本機根路徑為 /） */
  function appBase() {
    var p = location.pathname || '/';
    var markers = ['/english/', '/math/', '/assets/', '/legacy-kid-game/'];
    for (var i = 0; i < markers.length; i++) {
      var j = p.indexOf(markers[i]);
      if (j >= 0) return p.slice(0, j + 1);
    }
    if (/\/index\.html$/i.test(p)) return p.replace(/index\.html$/i, '');
    if (p.endsWith('/')) return p;
    return p.replace(/[^/]+$/, '');
  }

  if (!('serviceWorker' in navigator)) return;

  var base = appBase();
  var swUrl = base + 'sw.js';

  window.addEventListener('load', function () {
    navigator.serviceWorker.register(swUrl, { scope: base }).then(function (reg) {
      // 有新版時盡快接管（搭配 sw 內 CACHE_VERSION）
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      reg.addEventListener('updatefound', function () {
        var worker = reg.installing;
        if (!worker) return;
        worker.addEventListener('statechange', function () {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            worker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }).catch(function (err) {
      console.warn('[pwa] SW register failed', err);
    });
  });
})();
