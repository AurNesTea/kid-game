/* 國小英語群島 — 共用核心：儲存、星星、名字、發音、小工具 */
(function () {
  'use strict';

  var PREFIX = 'english-isles';
  var KEY_PLAYER = PREFIX + '-player';   // 舊版單一名字
  var KEY_PLAYERS = PREFIX + '-players'; // { "2": "小明", "4": "小華" }
  var KEY_GRADE = PREFIX + '-grade';     // 舊版
  var KEY_ROUTE = PREFIX + '-route';     // "2-1"
  var GRADE_LABEL = ['', '一', '二', '三', '四', '五', '六'];
  var ROUTES = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '5-1', '5-2', '6-1', '6-2'];

  function progressKey(g, s) { return PREFIX + '-g' + g + 's' + s; }
  function legacyProgressKey(g) { return PREFIX + '-g' + g; }
  function routeKey(g, s) { return g + '-' + s; }
  function routeLabel(g, s) { return GRADE_LABEL[g] + '年級' + (s === 1 ? '上' : '下') + '學期'; }
  function parseRoute(str) {
    var m = String(str || '').match(/^(\d)-([12])$/);
    if (!m) return null;
    var g = Number(m[1]);
    if (g < 1 || g > 6) return null;
    return { grade: g, semester: Number(m[2]) };
  }

  // localStorage 在部分 file:// 環境可能被擋：失敗時靜默
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    remove: function (k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };

  function data() { return window.ENGLISH_ISLES_DATA || null; }

  function loadProgress(grade, sem) {
    try {
      var key = progressKey(grade, sem);
      var raw = store.get(key);
      var D = data();
      if ((!raw || raw === '{}') && (grade === 2 || grade === 4) && D) {
        // 舊版 english-isles-g2 / g4 累積進度：新鍵是空的時候搬一次
        var legacy = store.get(legacyProgressKey(grade));
        if (legacy && legacy !== '{}') {
          try {
            var oldProg = JSON.parse(legacy);
            var map = D.lessonsByRoute[routeKey(grade, sem)] || {};
            var ids = {};
            Object.keys(map).forEach(function (iid) { map[iid].forEach(function (L) { ids[L.id] = true; }); });
            var migrated = {};
            Object.keys(oldProg).forEach(function (id) { if (ids[id]) migrated[id] = oldProg[id]; });
            if (Object.keys(migrated).length) {
              raw = JSON.stringify(migrated);
              store.set(key, raw);
            }
          } catch (e) { /* ignore */ }
        }
      }
      return JSON.parse(raw || '{}') || {};
    } catch (e) {
      return {};
    }
  }
  function saveProgress(grade, sem, progress) {
    store.set(progressKey(grade, sem), JSON.stringify(progress || {}));
  }

  function modesForLessonAtGrade(lesson, grade) {
    if (lesson.type === 'grammar') return [{ id: 'grammar', label: '句型練習' }];
    var modes = [
      { id: 'en2zh', label: '看英選中' },
      { id: 'zh2en', label: '看中選英' },
      { id: 'match', label: '配對' }
    ];
    if (grade >= 4) modes.push({ id: 'scramble', label: '拼拼看' });
    return modes;
  }

  function starsForRoute(grade, sem) {
    var D = data();
    var map = (D && D.lessonsByRoute[routeKey(grade, sem)]) || {};
    var progress = loadProgress(grade, sem);
    var got = 0, all = 0;
    Object.keys(map).forEach(function (iid) {
      (map[iid] || []).forEach(function (L) {
        var max = modesForLessonAtGrade(L, grade).length;
        all += max;
        var rec = progress[L.id];
        got += Math.min((rec && rec.stars) || 0, max);
      });
    });
    return { got: got, all: all };
  }

  function loadPlayers() {
    try { return JSON.parse(store.get(KEY_PLAYERS) || '{}') || {}; } catch (e) { return {}; }
  }
  function playerNameFor(grade) { return (loadPlayers()[String(grade)] || '').trim(); }
  function savePlayerName(grade, name) {
    var players = loadPlayers();
    if (name) players[String(grade)] = name; else delete players[String(grade)];
    store.set(KEY_PLAYERS, JSON.stringify(players));
    if (name) store.set(KEY_PLAYER, name); else store.remove(KEY_PLAYER);
  }
  // 舊版只有一個名字時，搬到當時的年級
  function migrateOldName() {
    var oldName = (store.get(KEY_PLAYER) || '').trim();
    var g = Number(store.get(KEY_GRADE) || 0);
    if (oldName && !Object.keys(loadPlayers()).length && g >= 1 && g <= 6) {
      var players = {}; players[String(g)] = oldName;
      store.set(KEY_PLAYERS, JSON.stringify(players));
    }
  }

  function lastRoute() { return parseRoute(store.get(KEY_ROUTE)) ? store.get(KEY_ROUTE) : ''; }
  function setLastRoute(g, s) {
    store.set(KEY_ROUTE, routeKey(g, s));
    store.set(KEY_GRADE, String(g));
  }

  // 舊版網址（#2-1、#g2s1、#g2…）轉成新路徑上的航線
  function legacyHashRoute(hash) {
    var h = String(hash || '').replace(/^#/, '');
    var m = h.match(/^(\d)-([12])$/) || h.match(/^g(\d)s([12])$/i);
    if (m && parseRoute(m[1] + '-' + m[2])) return m[1] + '-' + m[2];
    if (h === 'g2' || h === 'grade2') return '2-1';
    if (h === 'g4' || h === 'grade4') return '4-1';
    return '';
  }

  // 發音：en-US，失敗就安靜略過
  function speak(text) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    } catch (e) { /* fail silently */ }
  }
  function stopSpeak() {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, '&#39;'); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function reducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  function shade(hex, pct) {
    var n = hex.replace('#', '');
    var num = parseInt(n.length === 3 ? n.split('').map(function (c) { return c + c; }).join('') : n, 16);
    var r = Math.max(0, Math.min(255, (num >> 16) + pct));
    var g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + pct));
    var b = Math.max(0, Math.min(255, (num & 0xff) + pct));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // 「開船囉」轉場後再換頁
  function sailTo(href, overlay) {
    if (!overlay || reducedMotion()) { location.href = href; return; }
    overlay.hidden = false;
    setTimeout(function () { location.href = href; }, 850);
  }
  // 從別頁按「上一頁」回來時把轉場收起來
  window.addEventListener('pageshow', function () {
    var o = document.getElementById('sail-overlay');
    if (o) o.hidden = true;
  });

  window.IslesCore = {
    KEYS: { PLAYER: KEY_PLAYER, PLAYERS: KEY_PLAYERS, GRADE: KEY_GRADE, ROUTE: KEY_ROUTE },
    GRADE_LABEL: GRADE_LABEL,
    ROUTES: ROUTES,
    store: store,
    progressKey: progressKey,
    routeKey: routeKey,
    routeLabel: routeLabel,
    parseRoute: parseRoute,
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    modesForLessonAtGrade: modesForLessonAtGrade,
    starsForRoute: starsForRoute,
    loadPlayers: loadPlayers,
    playerNameFor: playerNameFor,
    savePlayerName: savePlayerName,
    migrateOldName: migrateOldName,
    lastRoute: lastRoute,
    setLastRoute: setLastRoute,
    legacyHashRoute: legacyHashRoute,
    speak: speak,
    stopSpeak: stopSpeak,
    shuffle: shuffle,
    escapeHtml: escapeHtml,
    escapeAttr: escapeAttr,
    wait: wait,
    reducedMotion: reducedMotion,
    shade: shade,
    sailTo: sailTo,
    $: function (sel, el) { return (el || document).querySelector(sel); },
    $$: function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  };
})();
