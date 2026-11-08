/* 國小學習群島 — 科目殼層：共用 hub／航線 UI／挑戰表／儲存流程；遊戲模式由各科注入 */
(function () {
  'use strict';

  function boot(cfg) {
    var C = window.IslesCore;
    var P = window.Companions;
    var UI = window.IslesUI;
    var DATA = cfg && cfg.data;
    if (!C || !P || !UI || !DATA) {
      document.body.innerHTML = '<p style="padding:2rem">' +
        ((cfg && cfg.loadError) || '資料載入失敗，請確認 assets/ 腳本都在。') + '</p>';
      return;
    }

    C.setSubject(cfg.subject);
    var $ = C.$, $$ = C.$$, escapeHtml = C.escapeHtml, escapeAttr = C.escapeAttr;
    var GRADE_LABEL = C.GRADE_LABEL;
    var GRADE_BUDDY = cfg.gradeBuddy || ['', 'chirp', 'sprout', 'drop', 'ember', 'puff', 'luna'];
    var TRACK = cfg.track || function () { return { text: '課綱進度', cls: '' }; };

    C.migrateOldName();
    $$('[data-note]').forEach(function (n) { n.textContent = DATA.meta.note; });

    // =====================================================================
    //  年級 × 學期選單
    // =====================================================================
    function renderHubGrid() {
      var grid = $('#grade-grid');
      if (!grid) return;
      var last = C.lastRoute();
      grid.innerHTML = [1, 2, 3, 4, 5, 6].map(function (g) {
        var track = TRACK(g);
        var name = C.playerNameFor(g);
        var isLast = last.indexOf(g + '-') === 0;
        var buttons = [1, 2].map(function (sem) {
          var rk = C.routeKey(g, sem);
          var rm = DATA.routeMeta[rk] || {};
          var st = C.starsForRoute(g, sem);
          var label = sem === 1 ? '上學期' : '下學期';
          var meta = cfg.hubMeta ? cfg.hubMeta(rm, g) : '';
          var pct = st.all ? Math.round((st.got / st.all) * 100) : 0;
          return '<a class="sem-btn' + (last === rk ? ' is-last' : '') + '" href="' + rk + '/index.html" data-route="' + rk + '">' +
            '<strong>' + label + (last === rk ? ' <span class="last-tag">上次玩到這裡</span>' : '') + '</strong>' +
            '<span class="sem-meta">' + meta + '</span>' +
            '<span class="sem-stars">' + P.partnerBall(16, st.got > 0) + ' ★ ' + st.got + '/' + st.all + '</span>' +
            '<span class="sem-bar" aria-hidden="true"><span style="width:' + pct + '%"></span></span>' +
            '</a>';
        }).join('');
        return '<article class="grade-card' + (isLast ? ' is-last' : '') + '">' +
          '<div class="grade-card-head">' +
            P.companionSvg(GRADE_BUDDY[g], { size: 54, className: 'grade-buddy' }) +
            '<h2>' + GRADE_LABEL[g] + '年級' + (name ? '<small>・' + escapeHtml(name) + '</small>' : '') + '</h2>' +
            '<span class="grade-track ' + track.cls + '">' + track.text + '</span>' +
          '</div>' +
          '<div class="sem-row">' + buttons + '</div>' +
          '</article>';
      }).join('');
      // 學期卡是真正的 <a href>：不 preventDefault、不蓋開船遮罩（Android 安全）。
    }

    function initHub() {
      if (cfg.legacyHash) {
        var legacy = C.legacyHashRoute(location.hash);
        if (legacy) { location.replace(legacy + '/index.html'); return; }
      }
      if (!$('#grade-grid')) return;
      UI.canonicalizeHubPath();
      renderHubGrid();

      if (UI.mountPlayerChrome) {
        UI.mountPlayerChrome({
          note: DATA.meta && DATA.meta.note,
          onSave: function () { renderHubGrid(); }
        });
      }
    }

    // =====================================================================
    //  航線頁
    // =====================================================================
    function initRoute(routeStr) {
      var r = C.parseRoute(routeStr);
      if (!r || !DATA.lessonsByRoute[routeStr]) { location.replace('../index.html'); return; }

      var state = {
        grade: r.grade,
        semester: r.semester,
        player: '',
        progress: {},
        view: 'home',
        islandId: null,
        challenge: null
      };

      var views = { home: $('#view-home'), island: $('#view-island') };
      var el = UI.routeEls($);

      function label() { return C.routeLabel(state.grade, state.semester); }
      function lessonsForRoute() { return DATA.lessonsByRoute[C.routeKey(state.grade, state.semester)] || {}; }
      function visibleIslands() {
        var map = lessonsForRoute();
        return DATA.islands.filter(function (isl) { return (map[isl.id] || []).length > 0; });
      }
      function modesForLesson(L) { return C.modesForLessonAtGrade(L, state.grade); }
      function maxStars(L) { return modesForLesson(L).length; }
      function lessonStars(L) { var p = state.progress[L.id]; return (p && p.stars) || 0; }
      function findLesson(id) {
        var map = lessonsForRoute();
        for (var k in map) {
          for (var i = 0; i < map[k].length; i++) if (map[k][i].id === id) return map[k][i];
        }
        return null;
      }
      function islandOfLesson(id) {
        var map = lessonsForRoute();
        for (var k in map) if (map[k].some(function (L) { return L.id === id; })) return k;
        return null;
      }
      function totalStars() {
        var got = 0, all = 0, map = lessonsForRoute();
        visibleIslands().forEach(function (isl) {
          map[isl.id].forEach(function (L) { all += maxStars(L); got += Math.min(lessonStars(L), maxStars(L)); });
        });
        return { got: got, all: all };
      }
      function islandStars(id) {
        var lessons = lessonsForRoute()[id] || [];
        var got = 0, all = 0;
        lessons.forEach(function (L) { all += maxStars(L); got += Math.min(lessonStars(L), maxStars(L)); });
        return { got: got, all: all, count: lessons.length };
      }
      function updateStarPill() {
        var t = totalStars();
        el.starGot.textContent = t.got;
        el.starAll.textContent = t.all;
        if (el.starBall) el.starBall.innerHTML = P.partnerBall(22, t.got > 0);
      }
      function saveProgress() { C.saveProgress(state.grade, state.semester, state.progress); }
      function awardModeStar(lessonId, modeId) {
        var lesson = findLesson(lessonId);
        if (!lesson) return;
        var p = state.progress[lessonId] || { modes: {}, stars: 0 };
        p.modes = p.modes || {};
        if (!p.modes[modeId]) {
          p.modes[modeId] = true;
          p.stars = Object.keys(p.modes).length;
          state.progress[lessonId] = p;
          saveProgress();
        } else {
          state.progress[lessonId] = p;
        }
        updateStarPill();
      }
      function updatePlayerHello() {
        el.playerHello.textContent = state.player ? '你好，' + state.player + '！' : '你好！';
        if (el.nameHint) el.nameHint.hidden = !!state.player;
      }

      C.setLastRoute(state.grade, state.semester);
      state.progress = C.loadProgress(state.grade, state.semester);
      state.player = C.playerNameFor(state.grade);
      document.title = label() + '｜' + (cfg.titleSuffix || '國小學習群島');
      el.gradeBadge.textContent = label();
      if (el.crumbRoute) el.crumbRoute.textContent = label();
      var track = TRACK(state.grade);
      if (el.routeTrack) { el.routeTrack.textContent = track.text; el.routeTrack.className = 'grade-track ' + track.cls; }
      updatePlayerHello();

      function showView(name) {
        Object.keys(views).forEach(function (k) { views[k].hidden = k !== name; });
        state.view = name;
      }

      function renderHome() {
        showView('home');
        var islands = visibleIslands();
        el.routeTitle.textContent = label() + '・選一座島去玩';
        var rm = DATA.routeMeta[C.routeKey(state.grade, state.semester)] || {};
        el.routeLead.textContent = cfg.routeLead
          ? cfg.routeLead(rm, state.grade)
          : ((rm.focus || '') + ' 選一座島，或從下面挑一關。');
        if (el.routeBuddies) {
          el.routeBuddies.innerHTML = islands.slice(0, 6).map(function (isl, i) {
            return P.companionSvg(P.forIsland(isl.id).id, { size: 58, mood: i % 2 ? 'happy' : 'normal', decorative: false });
          }).join('');
        }
        el.islandGrid.innerHTML = islands.map(function (isl, i) {
          var st = islandStars(isl.id);
          var buddy = P.forIsland(isl.id);
          return '<button type="button" class="island-card' + (isl.review ? ' is-review' : '') + '" data-island="' + isl.id + '" style="--accent:' + isl.color + '">' +
            UI.islandSVG(isl, i + 1) +
            '<h3>' + escapeHtml(isl.name) + '</h3>' +
            '<p class="tag">' + escapeHtml(isl.tagline) + '</p>' +
            '<p class="buddy-line">探險夥伴：' + escapeHtml(buddy.name) + '<span class="type-chip" style="--tc:' + buddy.color + '">' + escapeHtml(buddy.type) + '</span></p>' +
            '<div class="meta"><span>' + st.count + ' 關</span><span class="stars">★ ' + st.got + '/' + st.all + '</span></div>' +
            '</button>';
        }).join('');

        var rows = [];
        var map = lessonsForRoute();
        islands.forEach(function (isl) { map[isl.id].forEach(function (L) { rows.push({ isl: isl, L: L }); }); });
        el.unitList.innerHTML = rows.map(function (row) {
          var isl = row.isl, L = row.L;
          var max = maxStars(L);
          var got = Math.min(lessonStars(L), max);
          var icon = cfg.lessonIcon ? cfg.lessonIcon(L, isl) : (L.review ? '🔁' : isl.symbol);
          return '<button type="button" class="unit-row' + (L.review ? ' is-review' : '') + '" data-island="' + isl.id + '" data-lesson="' + escapeAttr(L.id) + '">' +
            '<span class="dot" style="background:' + isl.color + '33">' + icon + '</span>' +
            '<span class="info"><strong>' + escapeHtml(L.name) + '</strong><span>' + escapeHtml(isl.name) + ' · ' + escapeHtml(L.tagline) + '</span></span>' +
            '<span class="row-stars">★ ' + got + '/' + max + '</span>' +
            '</button>';
        }).join('');
        updateStarPill();
      }

      function renderIsland(islandId) {
        var isl = DATA.islands.find(function (x) { return x.id === islandId; });
        var lessons = (isl && lessonsForRoute()[islandId]) || [];
        if (!isl || !lessons.length) { setHash(''); return; }
        state.islandId = islandId;
        showView('island');
        var st = islandStars(islandId);
        var buddy = P.forIsland(islandId);
        var hi = cfg.islandHi ? cfg.islandHi(buddy) : buddy.hi;
        el.islandHero.innerHTML =
          '<div class="art">' + UI.islandSVG(isl, 3) + '</div>' +
          '<div class="hero-text">' +
            '<h1>' + escapeHtml(isl.name) + '</h1>' +
            '<p>' + escapeHtml(isl.tagline) + ' · ★ ' + st.got + '/' + st.all + '</p>' +
            '<p class="bubble">' + escapeHtml(buddy.name) + '：「' + escapeHtml(hi) + '」</p>' +
          '</div>';
        el.lessonMap.innerHTML = lessons.map(function (L, i) {
          var max = maxStars(L);
          var got = Math.min(lessonStars(L), max);
          return '<button type="button" class="lesson-isle' + (L.review ? ' is-review' : '') + '" data-lesson="' + escapeAttr(L.id) + '" style="--accent:' + isl.color + '">' +
            UI.miniIsleSVG(isl, i) +
            '<strong>' + escapeHtml(L.name) + '</strong>' +
            '<span class="ltag">' + escapeHtml(L.tagline) + '</span>' +
            '<span class="lstars">★ ' + got + '/' + max + '</span>' +
            '</button>';
        }).join('');
        updateStarPill();
        window.scrollTo(0, 0);
      }

      function parseHash() {
        var h = (location.hash || '').replace(/^#/, '');
        if (!h || h === 'home') return { view: 'home' };
        if (h.indexOf('island/') === 0) return { view: 'island', islandId: h.slice(7) };
        if (cfg.parseHashExtra) {
          var extra = cfg.parseHashExtra(h, lessonsForRoute(), DATA);
          if (extra) return extra;
        }
        return { view: 'home' };
      }
      function setHash(path) {
        var next = path ? '#' + path : '';
        if ((location.hash || '') === next) { onRoute(); return; }
        if (!path) {
          history.pushState(null, '', location.pathname + location.search);
          onRoute();
        } else {
          location.hash = path;
        }
      }
      function onRoute() {
        var rr = parseHash();
        if (rr.view === 'island') renderIsland(rr.islandId);
        else renderHome();
      }
      window.addEventListener('hashchange', onRoute);
      window.addEventListener('popstate', onRoute);

      function openChallenge(lessonId, preferredMode) {
        var lesson = findLesson(lessonId);
        if (!lesson) return;
        var modes = modesForLesson(lesson);
        var mode = preferredMode && modes.some(function (m) { return m.id === preferredMode; }) ? preferredMode : modes[0].id;
        state.challenge = { lesson: lesson, mode: mode };
        el.challenge.hidden = false;
        el.chTitle.textContent = lesson.name;
        el.chKicker.textContent = cfg.challengeKicker
          ? cfg.challengeKicker(lesson)
          : '挑戰';
        var iid = islandOfLesson(lessonId);
        if (el.chBuddy) el.chBuddy.innerHTML = P.companionSvg(P.forIsland(iid).id, { size: 48 });
        el.modeTabs.innerHTML = modes.map(function (m) {
          var earned = state.progress[lesson.id] && state.progress[lesson.id].modes && state.progress[lesson.id].modes[m.id];
          return '<button type="button" class="mode-tab" role="tab" data-mode="' + m.id + '" aria-selected="' + (m.id === mode) + '">' +
            escapeHtml(m.label) + (earned ? ' ★' : '') + '</button>';
        }).join('');
        el.chFoot.hidden = true;
        startMode(lesson, mode);
        var closeBtn = $('#btn-close-ch');
        if (closeBtn) closeBtn.focus();
      }
      function closeChallenge() {
        state.challenge = null;
        el.challenge.hidden = true;
        if (play && play.onCloseChallenge) play.onCloseChallenge();
        if (state.view === 'island' && state.islandId) renderIsland(state.islandId);
        else renderHome();
      }
      function refreshTabs(lesson) {
        $$('.mode-tab', el.modeTabs).forEach(function (t) {
          var earned = state.progress[lesson.id] && state.progress[lesson.id].modes && state.progress[lesson.id].modes[t.dataset.mode];
          var m = modesForLesson(lesson).find(function (x) { return x.id === t.dataset.mode; });
          if (m) t.textContent = m.label + (earned ? ' ★' : '');
        });
      }

      var api = {
        C: C, P: P, UI: UI, data: DATA,
        $: $, $$: $$,
        escapeHtml: escapeHtml, escapeAttr: escapeAttr,
        state: state, el: el,
        label: label,
        lessonsForRoute: lessonsForRoute,
        modesForLesson: modesForLesson,
        findLesson: findLesson,
        islandOfLesson: islandOfLesson,
        awardModeStar: awardModeStar,
        closeChallenge: closeChallenge,
        resultHtml: function (pass, title, line) {
          var buddy = state.challenge ? P.forIsland(islandOfLesson(state.challenge.lesson.id)).id : 'chirp';
          return UI.resultHtml(buddy, pass, title, line);
        },
        bindResult: function (lesson, mode) {
          refreshTabs(lesson);
          var retry = $('#retry-mode');
          var closeAfter = $('#close-after');
          if (retry) retry.onclick = function () { startMode(lesson, mode); };
          if (closeAfter) closeAfter.onclick = function () { closeChallenge(); };
        },
        renderHome: renderHome,
        renderIsland: renderIsland,
        updateStarPill: updateStarPill,
        updatePlayerHello: updatePlayerHello,
        saveProgress: saveProgress,
        onRoute: onRoute
      };

      var play = cfg.play ? cfg.play(api) : null;

      function startMode(lesson, mode) {
        state.challenge.mode = mode;
        $$('.mode-tab', el.modeTabs).forEach(function (t) {
          t.setAttribute('aria-selected', t.dataset.mode === mode ? 'true' : 'false');
        });
        el.chFoot.hidden = true;
        el.chBody.innerHTML = '';
        el.chBody.onclick = null;
        if (play && play.startMode) play.startMode(lesson, mode);
      }

      // ---------- 事件 ----------
      el.islandGrid.addEventListener('click', function (e) {
        var card = e.target.closest('[data-island]');
        if (!card) return;
        var id = card.dataset.island;
        var go = function () { setHash('island/' + id); };
        if (cfg.sailOnIslandClick) UI.sailThen(go); else go();
      });
      el.unitList.addEventListener('click', function (e) {
        var row = e.target.closest('[data-lesson]');
        if (!row) return;
        if (cfg.unitListUsesHash) {
          setHash('island/' + row.dataset.island);
          setTimeout(function () { openChallenge(row.dataset.lesson); }, 50);
        } else {
          if (row.dataset.island) state.islandId = row.dataset.island;
          openChallenge(row.dataset.lesson);
        }
      });
      el.lessonMap.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-lesson]');
        if (btn) openChallenge(btn.dataset.lesson);
      });
      el.modeTabs.addEventListener('click', function (e) {
        var tab = e.target.closest('[data-mode]');
        if (tab && state.challenge) startMode(state.challenge.lesson, tab.dataset.mode);
      });

      var back = $('#btn-back-home');
      if (back) back.addEventListener('click', function () { setHash(''); });
      var closeCh = $('#btn-close-ch');
      if (closeCh) closeCh.addEventListener('click', closeChallenge);

      var playerChrome = UI.mountPlayerChrome ? UI.mountPlayerChrome({
        grade: state.grade,
        note: DATA.meta && DATA.meta.note,
        onSave: function (g, name) {
          if (g === state.grade) {
            state.player = name;
            updatePlayerHello();
            if (state.view === 'island' && state.islandId) renderIsland(state.islandId);
            else renderHome();
          }
          if (playerChrome) playerChrome.refresh();
        },
        reset: {
          buttonLabel: function () {
            return cfg.resetButtonLabel ? cfg.resetButtonLabel(label()) : ('重置「' + label() + '」進度');
          },
          confirm: function () {
            return cfg.resetConfirm
              ? cfg.resetConfirm(label())
              : ('確定要清除「' + label() + '」的星星進度嗎？');
          },
          onReset: function () {
            state.progress = {};
            saveProgress();
            updateStarPill();
            onRoute();
            if (cfg.resetAlert) alert(cfg.resetAlert(label()));
          }
        }
      }) : null;

      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (el.challenge && !el.challenge.hidden) closeChallenge();
        else if (el.playerModal && !el.playerModal.hidden) el.playerModal.hidden = true;
      });

      if (!state.player && el.nameHint) el.nameHint.hidden = false;

      onRoute();
    }

    if (window.ISLES_ROUTE) initRoute(String(window.ISLES_ROUTE));
    else if (document.getElementById('grade-grid')) initHub();
  }

  window.IslesSubject = { boot: boot };
})();
