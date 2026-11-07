/* 國小數學群島 — 年級學期選單與航線遊戲（提示階梯／應用題／找錯） */
(function () {
  'use strict';

  var C = window.IslesCore;
  var P = window.Companions;
  var DATA = window.MATH_ISLES_DATA;
  if (!C || !P || !DATA) {
    document.body.innerHTML = '<p style="padding:2rem">資料載入失敗，請確認 assets/ 裡的 math-data.js、core.js、companions.js 都在。</p>';
    return;
  }
  C.setSubject('math');
  var $ = C.$, $$ = C.$$, escapeHtml = C.escapeHtml, escapeAttr = C.escapeAttr, shuffle = C.shuffle;
  var GRADE_LABEL = C.GRADE_LABEL;

  C.migrateOldName();
  $$('[data-note]').forEach(function (n) { n.textContent = DATA.meta.note; });

  function islandSVG(isl, seed) {
    var c = isl.color || '#2a9d8f';
    var c2 = C.shade(c, 20);
    var s = seed || 1;
    var bump = 8 + (s % 5) * 2;
    var buddy = P.forIsland(isl.id).id;
    return '<svg class="art" viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<ellipse cx="140" cy="108" rx="110" ry="10" fill="#7ec8e3" opacity=".45"/>' +
      '<path d="M40 100 C55 ' + (70 - bump) + ' 90 ' + (35 + (s % 7)) + ' 140 ' + (32 + (s % 5)) + ' C190 ' + (35 + (s % 7)) + ' 225 ' + (70 - bump) + ' 240 100 Z" fill="' + c + '"/>' +
      '<path d="M60 100 C75 ' + (78 - bump / 2) + ' 105 55 140 ' + (52 + (s % 3)) + ' C175 55 205 ' + (78 - bump / 2) + ' 220 100 Z" fill="' + c2 + '"/>' +
      '<circle cx="' + (70 + (s % 30)) + '" cy="' + (72 + (s % 8)) + '" r="8" fill="#ffd6a5" opacity=".85"/>' +
      '<text x="' + (205 - (s % 20)) + '" y="86" text-anchor="middle" font-size="22">' + (isl.symbol || '🏝️') + '</text>' +
      P.companionAt(buddy, 108, 2, 0.64) +
      '</svg>';
  }
  function miniIsleSVG(isl, i) {
    var c = isl.color || '#2a9d8f';
    return '<svg class="mini-art" viewBox="0 0 80 56" aria-hidden="true">' +
      '<ellipse cx="40" cy="50" rx="30" ry="5" fill="#7ec8e3" opacity=".4"/>' +
      '<path d="M12 48 C20 36 28 30 40 28 C52 30 60 36 68 48 Z" fill="' + c + '"/>' +
      P.companionAt(P.forIsland(isl.id).id, 24 + (i % 3) * 2, -2, 0.33, i % 2 ? 'happy' : 'normal') +
      '</svg>';
  }

  var TRACK = function (g) {
    return g === 6 ? { text: '衔接國中', cls: 'bridge' } : { text: '課綱進度', cls: '' };
  };
  var GRADE_BUDDY = ['', 'pebble', 'chirp', 'sprout', 'drop', 'luna', 'ember'];

  // =====================================================================
  //  年級 × 學期選單（math/index.html）
  // =====================================================================
  function initHub() {
    var grid = $('#grade-grid');
    if (!grid) return;
    // /math（無尾斜線）時，相對連結 1-1/ 會指到錯路徑；補上尾斜線
    try {
      var path = location.pathname || '';
      if (path && !/\/$/i.test(path) && !/index\.html$/i.test(path)) {
        history.replaceState(null, '', path + '/' + (location.search || '') + (location.hash || ''));
      }
    } catch (e) { /* ignore */ }
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
        var meta = (rm.focus || '').slice(0, 28) + ((rm.focus || '').length > 28 ? '…' : '');
        var pct = st.all ? Math.round((st.got / st.all) * 100) : 0;
        return '<a class="sem-btn' + (last === rk ? ' is-last' : '') + '" href="' + rk + '/index.html" data-route="' + rk + '">' +
          '<strong>' + label + (last === rk ? ' <span class="last-tag">上次玩到這裡</span>' : '') + '</strong>' +
          '<span class="sem-meta">' + escapeHtml(meta) + '</span>' +
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

    // 學期卡是真正的 <a href>：不 preventDefault、不蓋開船遮罩。
    // 先前用 JS 延遲 location 換頁時，部分 Android 會停在「開船囉」全螢幕遮罩。
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
    var el = {
      gradeBadge: $('#grade-badge'),
      starGot: $('#star-got'),
      starAll: $('#star-all'),
      starBall: $('#star-ball'),
      playerHello: $('#player-hello'),
      routeTitle: $('#route-title'),
      routeLead: $('#route-lead'),
      routeTrack: $('#route-track'),
      routeBuddies: $('#route-buddies'),
      crumbRoute: $('#crumb-route'),
      islandGrid: $('#island-grid'),
      unitList: $('#unit-list'),
      islandHero: $('#island-hero'),
      lessonMap: $('#lesson-map'),
      challenge: $('#challenge'),
      chTitle: $('#ch-title'),
      chKicker: $('#ch-kicker'),
      chBuddy: $('#ch-buddy'),
      modeTabs: $('#mode-tabs'),
      chBody: $('#ch-body'),
      chFoot: $('#ch-foot'),
      playerModal: $('#player-modal'),
      playerName: $('#player-name'),
      playerTitleGrade: $('#player-grade'),
      nameHint: $('#name-hint')
    };

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
    document.title = label() + '｜國小數學群島';
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
      el.routeLead.textContent = (rm.focus || '一步一步想，卡住了還有提示。') + ' 選一座島，或從下面挑一關。';
      if (el.routeBuddies) {
        el.routeBuddies.innerHTML = islands.slice(0, 6).map(function (isl, i) {
          return P.companionSvg(P.forIsland(isl.id).id, { size: 58, mood: i % 2 ? 'happy' : 'normal', decorative: false });
        }).join('');
      }
      el.islandGrid.innerHTML = islands.map(function (isl, i) {
        var st = islandStars(isl.id);
        var buddy = P.forIsland(isl.id);
        return '<button type="button" class="island-card' + (isl.review ? ' is-review' : '') + '" data-island="' + isl.id + '" style="--accent:' + isl.color + '">' +
          islandSVG(isl, i + 1) +
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
        var icon = L.review ? '🔁' : isl.symbol;
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
      var hi = mathHi(buddy);
      el.islandHero.innerHTML =
        '<div class="art">' + islandSVG(isl, 3) + '</div>' +
        '<div class="hero-text">' +
          '<h1>' + escapeHtml(isl.name) + '</h1>' +
          '<p>' + escapeHtml(isl.tagline) + ' · ★ ' + st.got + '/' + st.all + '</p>' +
          '<p class="bubble">' + escapeHtml(buddy.name) + '：「' + escapeHtml(hi) + '」</p>' +
        '</div>';
      el.lessonMap.innerHTML = lessons.map(function (L, i) {
        var max = maxStars(L);
        var got = Math.min(lessonStars(L), max);
        return '<button type="button" class="lesson-isle' + (L.review ? ' is-review' : '') + '" data-lesson="' + escapeAttr(L.id) + '" style="--accent:' + isl.color + '">' +
          miniIsleSVG(isl, i) +
          '<strong>' + escapeHtml(L.name) + '</strong>' +
          '<span class="ltag">' + escapeHtml(L.tagline) + '</span>' +
          '<span class="lstars">★ ' + got + '/' + max + '</span>' +
          '</button>';
      }).join('');
      updateStarPill();
      window.scrollTo(0, 0);
    }

    function mathHi(buddy) {
      var lines = {
        pebble: '先數清楚，再開始算！',
        chirp: '卡住了？我們一步一步來！',
        ember: '題目在問什麼？先說給我聽～',
        sprout: '圖形也有小秘密喔！',
        drop: '單位看清楚了嗎？',
        luna: '分數小數，慢慢想就好。',
        swirl: '複習一下，會更厲害！'
      };
      return lines[buddy.id] || '一起想一想！';
    }

    function parseHash() {
      var h = (location.hash || '').replace(/^#/, '');
      if (!h || h === 'home') return { view: 'home' };
      if (h.indexOf('island/') === 0) return { view: 'island', islandId: h.slice(7) };
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

    // ---------- 挑戰 ----------
    function openChallenge(lessonId, preferredMode) {
      var lesson = findLesson(lessonId);
      if (!lesson) return;
      var modes = modesForLesson(lesson);
      var mode = preferredMode && modes.some(function (m) { return m.id === preferredMode; }) ? preferredMode : modes[0].id;
      state.challenge = { lesson: lesson, mode: mode };
      el.challenge.hidden = false;
      el.chTitle.textContent = lesson.name;
      el.chKicker.textContent = '數學挑戰';
      var iid = islandOfLesson(lessonId);
      if (el.chBuddy) el.chBuddy.innerHTML = P.companionSvg(P.forIsland(iid).id, { size: 48 });
      el.modeTabs.innerHTML = modes.map(function (m) {
        var earned = state.progress[lesson.id] && state.progress[lesson.id].modes && state.progress[lesson.id].modes[m.id];
        return '<button type="button" class="mode-tab" role="tab" data-mode="' + m.id + '" aria-selected="' + (m.id === mode) + '">' +
          escapeHtml(m.label) + (earned ? ' ★' : '') + '</button>';
      }).join('');
      el.chFoot.hidden = true;
      startMode(lesson, mode);
      $('#btn-close-ch').focus();
    }
    function closeChallenge() {
      state.challenge = null;
      el.challenge.hidden = true;
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
    function problemsFor(lesson, mode) {
      return (lesson.problems || []).filter(function (p) { return p.kind === mode; });
    }
    function startMode(lesson, mode) {
      state.challenge.mode = mode;
      $$('.mode-tab', el.modeTabs).forEach(function (t) {
        t.setAttribute('aria-selected', t.dataset.mode === mode ? 'true' : 'false');
      });
      el.chFoot.hidden = true;
      el.chBody.innerHTML = '';
      el.chBody.onclick = null;
      var pool = problemsFor(lesson, mode);
      if (!pool.length) {
        el.chBody.innerHTML = '<p class="feedback no">這一關還沒有題目。</p>';
        return;
      }
      if (mode === 'recap') runRecap(lesson, pool[0]);
      else if (mode === 'error') runError(lesson, pool);
      else if (mode === 'word') runWord(lesson, pool);
      else if (mode === 'visual') runVisual(lesson, pool);
      else runScaffold(lesson, pool);
    }
    function resultHtml(pass, title, line) {
      var buddy = state.challenge ? P.forIsland(islandOfLesson(state.challenge.lesson.id)).id : 'chirp';
      return '<div class="result">' +
        '<div class="result-buddy">' + P.companionSvg(buddy, { size: 96, mood: pass ? 'happy' : 'normal', className: pass ? 'cheer' : '' }) + '</div>' +
        '<div class="big">' + (pass ? '⭐' : '💪') + '</div>' +
        '<h3>' + title + '</h3>' +
        '<p>' + line + '</p>' +
        '<div class="btn-row">' +
          '<button type="button" class="btn primary" id="retry-mode">再玩一次</button>' +
          '<button type="button" class="btn secondary" id="close-after">回到地圖</button>' +
        '</div></div>';
    }
    function bindResult(lesson, mode) {
      refreshTabs(lesson);
      $('#retry-mode').onclick = function () { startMode(lesson, mode); };
      $('#close-after').onclick = function () { closeChallenge(); };
    }
    function coachAsk(text) {
      return '<div class="math-coach"><p class="ask">' + escapeHtml(text) + '</p></div>';
    }
    function hintUi(level, hints) {
      if (level <= 0) return '';
      var idx = Math.min(level, hints.length) - 1;
      var labels = ['小提示', '更清楚一點', '示範一步', '完整說明'];
      return '<div class="hint-box"><div class="hint-level">' + labels[Math.min(idx, 3)] + '</div>' +
        escapeHtml(hints[idx] || '') + '</div>';
    }
    function pitfallNote(p) {
      var map = {
        regroup: '記得檢查「進位」有沒有加進去。',
        borrow: '退位時，十位被借走要少 1。',
        place: '看看數字站在哪個位置（個位／十位……）。',
        unit: '答案的單位對了嗎？',
        compare: '比大小時，先對齊位值。',
        misread: '再讀一次題目，看它到底問什麼。'
      };
      return p && p.pitfall && map[p.pitfall] ? '<p class="why-box">' + escapeHtml(map[p.pitfall]) + '</p>' : '';
    }

    // ---- 一步一步算（提示階梯）----
    function runScaffold(lesson, pool) {
      var list = shuffle(pool).slice(0, Math.min(4, pool.length));
      var i = 0, correct = 0, hintLevel = 0, locked = false;

      function finish() {
        var pass = correct / list.length >= 0.6;
        if (pass) awardModeStar(lesson.id, 'scaffold');
        el.chBody.innerHTML = resultHtml(pass, pass ? '算得真仔細！' : '再練一次會更熟！',
          '過關 ' + correct + ' / ' + list.length + (pass ? ' · 已記下這顆 ★' : ''));
        bindResult(lesson, 'scaffold');
      }
      function render() {
        if (i >= list.length) return finish();
        locked = false;
        hintLevel = 0;
        var p = list[i];
        var visuals = (p.visuals || []).map(function (v) { return '<span>' + escapeHtml(v) + '</span>'; }).join('');
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / list.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">第 ' + (i + 1) + ' / ' + list.length + ' 題</p>' +
            (p.companionAsk ? coachAsk(p.companionAsk) : '') +
            '<p class="q-prompt">' + escapeHtml(p.prompt || p.expression || '') + '</p>' +
            (visuals ? '<div class="math-visual">' + visuals + '</div>' : '') +
            (p.expression ? '<div class="math-expression">' + escapeHtml(p.expression) + '</div>' : '') +
            '<div id="hint-slot"></div>' +
            '<div class="answer-row">' +
              '<input type="text" id="ans" inputmode="text" autocomplete="off" aria-label="你的答案" placeholder="寫答案" />' +
              '<button type="button" class="btn primary" id="check">試試看</button>' +
            '</div>' +
            '<div class="hint-actions">' +
              '<button type="button" class="btn secondary" id="more-hint">我需要提示</button>' +
            '</div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
        $('#ans').focus();
        $('#more-hint').onclick = function () {
          var hints = p.hints || ['再想一想～', '把步驟寫下來。', '先算一部分。', '答案是 ' + (p.answer || '')];
          if (hintLevel < hints.length) hintLevel++;
          $('#hint-slot').innerHTML = hintUi(hintLevel, hints);
        };
        $('#check').onclick = function () { submit(); };
        $('#ans').onkeydown = function (e) { if (e.key === 'Enter') submit(); };
      }
      function submit() {
        if (locked) return;
        var p = list[i];
        var val = $('#ans').value;
        var ok = C.answersMatch(val, p.answers || [p.answer]);
        locked = true;
        var fb = $('#fb');
        if (ok) {
          correct++;
          fb.textContent = '答對了！你有先自己試，真棒！';
          fb.className = 'feedback ok';
          setTimeout(function () { i++; render(); }, 700);
        } else {
          fb.textContent = '還差一點。要不要先看提示，再試一次？';
          fb.className = 'feedback no';
          locked = false;
          if (hintLevel === 0) {
            hintLevel = 1;
            $('#hint-slot').innerHTML = hintUi(hintLevel, p.hints || []) + pitfallNote(p);
          }
        }
      }
      render();
    }

    // ---- 數一數（具體物）----
    function runVisual(lesson, pool) {
      var list = shuffle(pool).slice(0, Math.min(4, pool.length));
      var i = 0, correct = 0, hintLevel = 0, locked = false;
      function finish() {
        var pass = correct / list.length >= 0.6;
        if (pass) awardModeStar(lesson.id, 'visual');
        el.chBody.innerHTML = resultHtml(pass, pass ? '數得很清楚！' : '再數一次會更準！',
          '過關 ' + correct + ' / ' + list.length + (pass ? ' · 已記下這顆 ★' : ''));
        bindResult(lesson, 'visual');
      }
      function render() {
        if (i >= list.length) return finish();
        locked = false; hintLevel = 0;
        var p = list[i];
        var items = (p.items || []).map(function (it) { return '<span>' + escapeHtml(it) + '</span>'; }).join('');
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / list.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            (p.companionAsk ? coachAsk(p.companionAsk) : coachAsk('先用眼睛數，再寫數字～')) +
            '<p class="q-prompt">' + escapeHtml(p.prompt) + '</p>' +
            '<div class="math-visual">' + items + '</div>' +
            '<div id="hint-slot"></div>' +
            '<div class="answer-row">' +
              '<input type="text" id="ans" inputmode="numeric" autocomplete="off" aria-label="你的答案" placeholder="幾個？" />' +
              '<button type="button" class="btn primary" id="check">試試看</button>' +
            '</div>' +
            '<div class="hint-actions"><button type="button" class="btn secondary" id="more-hint">我需要提示</button></div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
        $('#ans').focus();
        $('#more-hint').onclick = function () {
          var hints = p.hints || [];
          if (hintLevel < hints.length) hintLevel++;
          $('#hint-slot').innerHTML = hintUi(hintLevel, hints);
        };
        $('#check').onclick = submit;
        $('#ans').onkeydown = function (e) { if (e.key === 'Enter') submit(); };
      }
      function submit() {
        if (locked) return;
        var p = list[i];
        var ok = C.answersMatch($('#ans').value, p.answers || [p.answer]);
        locked = true;
        var fb = $('#fb');
        if (ok) {
          correct++;
          fb.textContent = '數對了！'; fb.className = 'feedback ok';
          setTimeout(function () { i++; render(); }, 650);
        } else {
          fb.textContent = '再數一次，可以用手指點喔。'; fb.className = 'feedback no';
          locked = false;
          if (hintLevel === 0) { hintLevel = 1; $('#hint-slot').innerHTML = hintUi(1, p.hints || []); }
        }
      }
      render();
    }

    // ---- 應用題：先懂再算 ----
    function runWord(lesson, pool) {
      var list = shuffle(pool).slice(0, Math.min(3, pool.length));
      var i = 0, correct = 0;

      function finish() {
        var pass = correct / list.length >= 0.6;
        if (pass) awardModeStar(lesson.id, 'word');
        el.chBody.innerHTML = resultHtml(pass, pass ? '讀題好厲害！' : '下次先說說「求什麼」～',
          '過關 ' + correct + ' / ' + list.length + (pass ? ' · 已記下這顆 ★' : ''));
        bindResult(lesson, 'word');
      }
      function render() {
        if (i >= list.length) return finish();
        var p = list[i];
        var phase = 0; // 0 what, 1 op, 2 calc
        var hintLevel = 0;
        function paint() {
          var phases = ['① 求什麼', '② 怎麼算', '③ 算出來'];
          var pills = phases.map(function (lab, idx) {
            var cls = idx === phase ? ' is-on' : (idx < phase ? ' is-done' : '');
            return '<span class="phase-pill' + cls + '">' + lab + '</span>';
          }).join('');
          var body = '';
          if (phase === 0) {
            body = '<p class="q-sub">先想：題目要我們求什麼？</p>' +
              coachAsk('先不要急著算數字～') +
              '<div class="choices">' + shuffle(p.whatOptions || []).map(function (o) {
                return '<button type="button" class="choice" data-ok="' + (o.correct ? '1' : '0') + '">' + escapeHtml(o.text) + '</button>';
              }).join('') + '</div>';
          } else if (phase === 1) {
            body = '<p class="q-sub">接下來：該怎麼算？</p>' +
              coachAsk('選一個算式或想法') +
              '<div class="choices">' + shuffle(p.opOptions || []).map(function (o) {
                return '<button type="button" class="choice" data-ok="' + (o.correct ? '1' : '0') + '">' + escapeHtml(o.text) + '</button>';
              }).join('') + '</div>';
          } else {
            body = '<p class="q-sub">最後：算出答案</p>' +
              (p.companionAsk ? coachAsk(p.companionAsk) : '') +
              '<div id="hint-slot"></div>' +
              '<div class="answer-row">' +
                '<input type="text" id="ans" autocomplete="off" aria-label="答案" placeholder="答案" />' +
                '<button type="button" class="btn primary" id="check">試試看</button>' +
              '</div>' +
              '<div class="hint-actions"><button type="button" class="btn secondary" id="more-hint">我需要提示</button></div>';
          }
          el.chBody.innerHTML =
            '<div class="progress-bar"><span style="width:' + (i / list.length) * 100 + '%"></span></div>' +
            '<div class="q-card">' +
              '<p class="q-sub">第 ' + (i + 1) + ' / ' + list.length + ' 題</p>' +
              '<div class="phase-pills">' + pills + '</div>' +
              '<div class="story-box">' + escapeHtml(p.story) + '</div>' +
              body +
              '<p class="feedback" id="fb" aria-live="polite"></p>' +
            '</div>';
          if (phase < 2) {
            el.chBody.onclick = function (e) {
              var btn = e.target.closest('.choice');
              if (!btn || btn.disabled) return;
              var ok = btn.dataset.ok === '1';
              $$('.choice', el.chBody).forEach(function (c) {
                c.disabled = true;
                if (c.dataset.ok === '1') c.classList.add('correct');
                else if (c === btn && !ok) c.classList.add('wrong');
                else c.classList.add('dim');
              });
              var fb = $('#fb');
              if (ok) {
                fb.textContent = phase === 0 ? '對！先搞懂要求什麼。' : '對！接下來自己算算看。';
                fb.className = 'feedback ok';
                setTimeout(function () { phase++; paint(); }, 650);
              } else {
                fb.textContent = phase === 0 ? '再讀一次：它在問什麼？' : '想想是加、減、乘還是除？';
                fb.className = 'feedback no';
                setTimeout(function () {
                  $$('.choice', el.chBody).forEach(function (c) {
                    c.disabled = false; c.classList.remove('correct', 'wrong', 'dim');
                  });
                  fb.textContent = '';
                }, 900);
              }
            };
          } else {
            el.chBody.onclick = null;
            $('#more-hint').onclick = function () {
              var hints = p.hints || [];
              if (hintLevel < hints.length) hintLevel++;
              $('#hint-slot').innerHTML = hintUi(hintLevel, hints);
            };
            function submit() {
              var ok = C.answersMatch($('#ans').value, p.answers || [p.answer]);
              var fb = $('#fb');
              if (ok) {
                correct++;
                fb.textContent = '算出來了！' + (p.explain ? ' ' + p.explain : '');
                fb.className = 'feedback ok';
                setTimeout(function () { i++; render(); }, 800);
              } else {
                fb.textContent = '再試一次；過程對了，答案就會對。';
                fb.className = 'feedback no';
                if (hintLevel === 0) {
                  hintLevel = 1;
                  $('#hint-slot').innerHTML = hintUi(1, p.hints || []) + pitfallNote(p);
                }
              }
            }
            $('#check').onclick = submit;
            $('#ans').onkeydown = function (e) { if (e.key === 'Enter') submit(); };
            $('#ans').focus();
          }
        }
        paint();
      }
      render();
    }

    // ---- 找出錯哪一行 ----
    function runError(lesson, pool) {
      var list = shuffle(pool).slice(0, Math.min(3, pool.length));
      var i = 0, correct = 0;
      function finish() {
        var pass = correct / list.length >= 0.6;
        if (pass) awardModeStar(lesson.id, 'error');
        el.chBody.innerHTML = resultHtml(pass, pass ? '火眼金睛！' : '找錯很不容易，再練練！',
          '過關 ' + correct + ' / ' + list.length + (pass ? ' · 已記下這顆 ★' : ''));
        bindResult(lesson, 'error');
      }
      function render() {
        if (i >= list.length) return finish();
        var p = list[i];
        var locked = false;
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / list.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">第 ' + (i + 1) + ' / ' + list.length + ' 題 · 找過程哪裡錯</p>' +
            coachAsk('正確答案應該是 ' + (p.correctAnswer || '？') + '。哪一步想錯了？') +
            '<div class="math-expression">' + escapeHtml(p.expression || '') + '</div>' +
            '<p class="q-prompt" style="font-size:1.05rem">' + escapeHtml(p.title || '哪一行錯了？') + '</p>' +
            '<div class="math-steps">' + (p.lines || []).map(function (line, idx) {
              return '<div class="math-step" data-idx="' + idx + '">' +
                '<span class="n">' + (idx + 1) + '</span>' +
                '<span>' + escapeHtml(line.text) + '</span>' +
                '<button type="button" class="pick-line" data-idx="' + idx + '">是這裡</button>' +
              '</div>';
            }).join('') + '</div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
            '<div id="why"></div>' +
          '</div>';
        el.chBody.onclick = function (e) {
          var btn = e.target.closest('.pick-line');
          if (!btn || locked) return;
          locked = true;
          var idx = Number(btn.dataset.idx);
          var ok = idx === p.wrongIndex;
          var steps = $$('.math-step', el.chBody);
          steps.forEach(function (s) {
            var si = Number(s.dataset.idx);
            if (si === p.wrongIndex) s.classList.add('is-bad');
            else if (si === idx && !ok) s.classList.add('is-bad');
            else if ((p.lines[si] || {}).ok) s.classList.add('is-ok');
          });
          var fb = $('#fb');
          var why = $('#why');
          var wrongLine = p.lines[p.wrongIndex] || {};
          if (ok) {
            correct++;
            fb.textContent = '找對了！'; fb.className = 'feedback ok';
            why.innerHTML = '<div class="why-box">' + escapeHtml(wrongLine.why || p.why || '') +
              (p.why && wrongLine.why !== p.why ? '<br/>' + escapeHtml(p.why) : '') + '</div>';
            setTimeout(function () { i++; render(); }, 1200);
          } else {
            fb.textContent = '不是這一行。看看標起來的那一步為什麼錯。';
            fb.className = 'feedback no';
            why.innerHTML = '<div class="why-box">' + escapeHtml(wrongLine.why || p.why || '') + '</div>';
            setTimeout(function () { i++; render(); }, 1600);
          }
        };
      }
      render();
    }

    // ---- 小小複習 ----
    function runRecap(lesson, pack) {
      var qs = (pack && pack.questions) || [];
      var i = 0, correct = 0, hintLevel = 0, locked = false;
      function finish() {
        var pass = qs.length && correct / qs.length >= 0.6;
        if (pass) awardModeStar(lesson.id, 'recap');
        el.chBody.innerHTML = resultHtml(pass, pass ? '複習完成！' : '回家再看一眼今天的重點～',
          '答對 ' + correct + ' / ' + qs.length + (pass ? ' · 已記下這顆 ★' : '') +
          '<br/><span style="font-size:.9rem">今天記得：先想過程，再寫答案。</span>');
        bindResult(lesson, 'recap');
      }
      function render() {
        if (i >= qs.length) return finish();
        locked = false; hintLevel = 0;
        var q = qs[i];
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / qs.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">小小複習 ' + (i + 1) + ' / ' + qs.length + '</p>' +
            coachAsk('用一句話跟小夥伴說：你打算怎麼算？') +
            '<p class="q-prompt">' + escapeHtml(q.q) + '</p>' +
            '<div id="hint-slot"></div>' +
            '<div class="answer-row">' +
              '<input type="text" id="ans" autocomplete="off" aria-label="答案" placeholder="答案" />' +
              '<button type="button" class="btn primary" id="check">試試看</button>' +
            '</div>' +
            '<div class="hint-actions"><button type="button" class="btn secondary" id="more-hint">提示一下</button></div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
        $('#more-hint').onclick = function () {
          hintLevel = Math.min(hintLevel + 1, 2);
          var hints = [q.tip || '再想一想', '答案是 ' + q.a];
          $('#hint-slot').innerHTML = hintUi(hintLevel, hints);
        };
        function submit() {
          if (locked) return;
          var ok = C.answersMatch($('#ans').value, q.answers || [q.a]);
          locked = true;
          var fb = $('#fb');
          if (ok) {
            correct++;
            fb.textContent = '記住了！'; fb.className = 'feedback ok';
            setTimeout(function () { i++; render(); }, 600);
          } else {
            fb.textContent = '差一點，看提示再試。'; fb.className = 'feedback no';
            locked = false;
            if (!hintLevel) {
              hintLevel = 1;
              $('#hint-slot').innerHTML = hintUi(1, [q.tip || '再想一想', '答案是 ' + q.a]);
            }
          }
        }
        $('#check').onclick = submit;
        $('#ans').onkeydown = function (e) { if (e.key === 'Enter') submit(); };
        $('#ans').focus();
      }
      render();
    }

    // ---------- 事件 ----------
    el.islandGrid.addEventListener('click', function (e) {
      var card = e.target.closest('[data-island]');
      if (!card) return;
      setHash('island/' + card.dataset.island);
    });
    el.unitList.addEventListener('click', function (e) {
      var row = e.target.closest('[data-lesson]');
      if (!row) return;
      if (row.dataset.island) state.islandId = row.dataset.island;
      openChallenge(row.dataset.lesson);
    });
    el.lessonMap.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lesson]');
      if (b) openChallenge(b.dataset.lesson);
    });
    $('#btn-back-home').onclick = function () { setHash(''); };
    $('#btn-close-ch').onclick = closeChallenge;
    el.modeTabs.addEventListener('click', function (e) {
      var t = e.target.closest('[data-mode]');
      if (!t || !state.challenge) return;
      startMode(state.challenge.lesson, t.dataset.mode);
    });

    // 玩家設定
    function openPlayer() {
      el.playerModal.hidden = false;
      el.playerTitleGrade.textContent = GRADE_LABEL[state.grade] + '年級';
      el.playerName.value = state.player || '';
      var reset = $('#btn-reset-progress');
      if (reset) reset.textContent = '重置「' + label() + '」進度';
    }
    function closePlayer() { el.playerModal.hidden = true; }
    $('#btn-player').onclick = openPlayer;
    $('#btn-close-player').onclick = closePlayer;
    $('#btn-save-player').onclick = function () {
      var name = (el.playerName.value || '').trim().slice(0, 12);
      C.savePlayerName(state.grade, name);
      state.player = name;
      updatePlayerHello();
      closePlayer();
      renderHome();
    };
    $('#btn-reset-progress').onclick = function () {
      if (!confirm('確定要清空「' + label() + '」的星星嗎？（英文進度不會被清掉）')) return;
      state.progress = {};
      saveProgress();
      updateStarPill();
      closePlayer();
      onRoute();
    };

    onRoute();
  }

  // boot
  if ($('#grade-grid') && !window.ISLES_ROUTE) initHub();
  else if (window.ISLES_ROUTE) initRoute(window.ISLES_ROUTE);
})();
