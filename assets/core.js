/* 國小英語群島 — 共用核心：儲存、星星、名字、發音、小工具 */
(function () {
  'use strict';

  // 科目前綴：英文維持 english-isles-*（相容舊存檔）；數學用 math-isles-*，互不覆蓋。
  var SUBJECT = 'english';
  var SUBJECT_PREFIX = { english: 'english-isles', math: 'math-isles' };
  var KEY_PLAYERS = 'english-isles-players'; // 名字依年級共用（兩科同一孩子）
  var KEY_PLAYER = 'english-isles-player';   // 舊版單一名字
  var KEY_GRADE = 'english-isles-grade';     // 舊版英文年級
  var KEY_LAST_SUBJECT = 'isles-last-subject';
  var GRADE_LABEL = ['', '一', '二', '三', '四', '五', '六'];
  var ROUTES = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '5-1', '5-2', '6-1', '6-2'];

  var MATH_MODE_LABELS = {
    scaffold: '一步一步算',
    word: '應用題',
    error: '找出錯哪',
    visual: '數一數',
    recap: '小小複習'
  };

  function prefix() { return SUBJECT_PREFIX[SUBJECT] || SUBJECT_PREFIX.english; }
  function setSubject(id) {
    SUBJECT = (id === 'math') ? 'math' : 'english';
    return SUBJECT;
  }
  function getSubject() { return SUBJECT; }
  function progressKey(g, s) { return prefix() + '-g' + g + 's' + s; }
  function legacyProgressKey(g) { return 'english-isles-g' + g; }
  function routeStorageKey() { return prefix() + '-route'; }
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

  function englishData() { return window.ENGLISH_ISLES_DATA || null; }
  function mathData() { return window.MATH_ISLES_DATA || null; }
  function data() { return SUBJECT === 'math' ? mathData() : englishData(); }

  function loadProgress(grade, sem) {
    try {
      var key = progressKey(grade, sem);
      var raw = store.get(key);
      var D = englishData();
      // 英文舊版遷移；數學不碰 english-isles-g*
      if (SUBJECT === 'english' && (!raw || raw === '{}') && (grade === 2 || grade === 4) && D) {
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
    if (lesson && lesson.type === 'math' && lesson.modes) {
      return lesson.modes.map(function (id) {
        return { id: id, label: MATH_MODE_LABELS[id] || id };
      });
    }
    if (lesson && lesson.type === 'grammar') return [{ id: 'grammar', label: '句型練習' }];
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

  function lastRoute() {
    var r = store.get(routeStorageKey());
    return parseRoute(r) ? r : '';
  }
  function setLastRoute(g, s) {
    store.set(routeStorageKey(), routeKey(g, s));
    store.set(KEY_LAST_SUBJECT, SUBJECT);
    if (SUBJECT === 'english') store.set(KEY_GRADE, String(g));
  }
  function lastSubject() {
    var s = store.get(KEY_LAST_SUBJECT);
    return s === 'math' ? 'math' : 'english';
  }
  /** 大廳「繼續上次」：依最後科目取對應航線 */
  function continueTarget() {
    var sub = lastSubject();
    var prev = SUBJECT;
    setSubject(sub);
    var route = lastRoute();
    SUBJECT = prev;
    if (!route) {
      // 若該科沒航線，試另一科
      var other = sub === 'math' ? 'english' : 'math';
      setSubject(other);
      route = lastRoute();
      SUBJECT = prev;
      if (!route) return null;
      sub = other;
    }
    return { subject: sub, route: route, parsed: parseRoute(route) };
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

  // 「開船囉」轉場後再換頁。
  // 部分 Android／內建瀏覽器在 preventDefault 後延遲改 location 會失敗，
  // 全螢幕遮罩就卡住。對策：絕對網址、盡快 assign、可點遮罩重試、逾時掀開。
  function hideSailOverlay(overlay) {
    var o = overlay || document.getElementById('sail-overlay');
    if (!o) return;
    o.hidden = true;
    o.onclick = null;
    o.onkeydown = null;
    o.removeAttribute('role');
    o.removeAttribute('tabindex');
    o.removeAttribute('aria-label');
  }
  function sailTo(href, overlay) {
    var url = href;
    if (!url) return;
    var started = Date.now();
    function go() {
      try { location.assign(url); } catch (e1) {
        try { window.location.href = url; } catch (e2) { /* ignore */ }
      }
    }
    if (!overlay || reducedMotion()) { go(); return; }
    overlay.hidden = false;
    overlay.setAttribute('role', 'button');
    overlay.setAttribute('tabindex', '0');
    overlay.setAttribute('aria-label', '點一下繼續開船');
    var navigated = false;
    function finish() {
      if (navigated) return;
      navigated = true;
      go();
    }
    overlay.onclick = function (e) {
      if (e) e.preventDefault();
      finish();
    };
    overlay.onkeydown = function (e) {
      if (e && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); finish(); }
    };
    // 短延遲讓動畫露一下；不要拖到 850ms（手機上較容易被擋）
    setTimeout(finish, 280);
    // 保底：若還停在原頁，再試一次並掀開遮罩
    setTimeout(function () {
      if (document.hidden) return;
      finish();
      hideSailOverlay(overlay);
    }, 1200);
    // 最後手段：用 <a> 程式觸發原生導向
    setTimeout(function () {
      if (document.hidden) return;
      if (Date.now() - started < 2500 && location.href.indexOf(url) === -1) {
        hideSailOverlay(overlay);
        var probe = document.createElement('a');
        probe.href = url;
        probe.style.display = 'none';
        document.body.appendChild(probe);
        try { probe.click(); } catch (e3) { go(); }
        setTimeout(function () { if (probe.parentNode) probe.parentNode.removeChild(probe); }, 0);
      }
    }, 1600);
  }
  function clearStuckSail() { hideSailOverlay(); }
  window.addEventListener('pageshow', clearStuckSail);
  window.addEventListener('pagehide', clearStuckSail);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) clearStuckSail();
  });

  function normalizeAnswer(s) {
    return String(s == null ? '' : s).trim().replace(/\s+/g, '').replace(/／/g, '/').replace(/：/g, ':');
  }
  function answersMatch(input, answers) {
    var a = normalizeAnswer(input).toLowerCase();
    if (!a) return false;
    var list = answers || [];
    for (var i = 0; i < list.length; i++) {
      if (normalizeAnswer(list[i]).toLowerCase() === a) return true;
    }
    return false;
  }

  window.IslesCore = {
    KEYS: {
      PLAYER: KEY_PLAYER,
      PLAYERS: KEY_PLAYERS,
      GRADE: KEY_GRADE,
      LAST_SUBJECT: KEY_LAST_SUBJECT
    },
    MATH_MODE_LABELS: MATH_MODE_LABELS,
    GRADE_LABEL: GRADE_LABEL,
    ROUTES: ROUTES,
    store: store,
    setSubject: setSubject,
    getSubject: getSubject,
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
    lastSubject: lastSubject,
    continueTarget: continueTarget,
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
    hideSailOverlay: hideSailOverlay,
    normalizeAnswer: normalizeAnswer,
    answersMatch: answersMatch,
    $: function (sel, el) { return (el || document).querySelector(sel); },
    $$: function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  };
})();
