/* 國小英語群島 — 英文科：年級學期選單（english/index.html）與航線頁（english/{年級-學期}/index.html） */
(function () {
  'use strict';

  var C = window.IslesCore;
  var P = window.Companions;
  var DATA = window.ENGLISH_ISLES_DATA;
  if (!C || !P || !DATA) {
    document.body.innerHTML = '<p style="padding:2rem">資料載入失敗，請確認 assets/ 資料夾裡的 data.js、core.js、companions.js 都在。</p>';
    return;
  }
  C.setSubject('english');
  var $ = C.$, $$ = C.$$, escapeHtml = C.escapeHtml, escapeAttr = C.escapeAttr, shuffle = C.shuffle;
  var GRADE_LABEL = C.GRADE_LABEL;

  C.migrateOldName();
  $$('[data-note]').forEach(function (n) { n.textContent = DATA.meta.note; });

  // ---------- 島嶼插圖：島上站著這座島的小夥伴 ----------
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
    return g <= 2 ? { text: '先修準備', cls: 'warmup' } : g === 6 ? { text: '衔接國中', cls: 'bridge' } : { text: '課綱進度', cls: '' };
  };
  // 每個年級一位帶隊小夥伴
  var GRADE_BUDDY = ['', 'chirp', 'sprout', 'drop', 'ember', 'puff', 'luna'];

  // =====================================================================
  //  年級 × 學期選單（english/index.html）
  // =====================================================================
  function initHub() {
    var legacy = C.legacyHashRoute(location.hash);
    if (legacy) { location.replace(legacy + '/index.html'); return; }

    var grid = $('#grade-grid');
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
        var meta = (rm.newWords || 0) + ' 新字・' + (rm.grammar || 0) + ' 句型';
        if (g === 6) meta = '衔接文法・複習島';
        else if (rm.reviewLessons) meta += '・複習 ' + rm.reviewLessons + ' 關';
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

    var overlay = $('#sail-overlay');
    grid.addEventListener('click', function (e) {
      var a = e.target.closest('a.sem-btn');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      C.sailTo(a.getAttribute('href'), overlay);
    });
  }

  // =====================================================================
  //  航線頁（english/2-1/index.html 等）
  // =====================================================================
  function initRoute(routeStr) {
    var r = C.parseRoute(routeStr);
    if (!r || !DATA.lessonsByRoute[routeStr]) { location.replace('../index.html'); return; }

    var wordById = {}; DATA.words.forEach(function (w) { wordById[w.id] = w; });
    var grammarById = {}; DATA.grammar.forEach(function (g) { grammarById[g.id] = g; });

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
      playerTitleGrade: $('#player-grade')
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
    }

    // ---------- 進入航線 ----------
    C.setLastRoute(state.grade, state.semester);
    state.progress = C.loadProgress(state.grade, state.semester);
    state.player = C.playerNameFor(state.grade);
    document.title = label() + '｜國小英語群島';
    el.gradeBadge.textContent = label();
    if (el.crumbRoute) el.crumbRoute.textContent = label();
    var track = TRACK(state.grade);
    if (el.routeTrack) { el.routeTrack.textContent = track.text; el.routeTrack.className = 'grade-track ' + track.cls; }
    updatePlayerHello();

    function showView(name) {
      Object.keys(views).forEach(function (k) { views[k].hidden = k !== name; });
      state.view = name;
    }

    // ---------- 群島首頁 ----------
    function renderHome() {
      showView('home');
      var islands = visibleIslands();
      el.routeTitle.textContent = label() + '・選一座島去玩';
      var rm = DATA.routeMeta[C.routeKey(state.grade, state.semester)] || {};
      var lead = state.grade === 6
        ? '這學期沒有新的 300 字，練銜接國中的句型，再到複習島溫習。'
        : '本學期新學 ' + (rm.newWords || 0) + ' 個字、' + (rm.grammar || 0) + ' 個句型。選一座島全部逛，或從下面挑一關。';
      if (state.grade <= 2) lead += '（先修準備：正式英語多自三年級起）';
      el.routeLead.textContent = lead;
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
        var icon = L.type === 'grammar' ? '💬' : L.review ? '🔁' : isl.symbol;
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
      el.islandHero.innerHTML =
        '<div class="art">' + islandSVG(isl, 3) + '</div>' +
        '<div class="hero-text">' +
          '<h1>' + escapeHtml(isl.name) + '</h1>' +
          '<p>' + escapeHtml(isl.tagline) + ' · ★ ' + st.got + '/' + st.all + '</p>' +
          '<p class="bubble">' + escapeHtml(buddy.name) + '：「' + escapeHtml(buddy.hi) + '」</p>' +
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

    // ---------- 頁內小路由：#island/hello ----------
    function parseHash() {
      var h = (location.hash || '').replace(/^#/, '');
      if (!h || h === 'home') return { view: 'home' };
      if (h.indexOf('island/') === 0) return { view: 'island', islandId: h.slice(7) };
      var topic = decodeURIComponent(h);
      var map = lessonsForRoute();
      for (var i = 0; i < DATA.islands.length; i++) {
        var isl = DATA.islands[i];
        var les = map[isl.id] || [];
        if (isl.id === topic) return { view: 'island', islandId: isl.id };
        if (les.some(function (L) { return L.topic === topic || L.id === topic || L.name.indexOf(topic) >= 0; })) {
          return { view: 'island', islandId: isl.id };
        }
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

    function sailThen(fn) {
      var sail = $('#sail-overlay');
      if (!sail || C.reducedMotion()) { fn(); return; }
      sail.hidden = false;
      setTimeout(function () { sail.hidden = true; fn(); }, 900);
    }

    // ---------- 挑戰 ----------
    function openChallenge(lessonId, preferredMode) {
      var lesson = findLesson(lessonId);
      if (!lesson) return;
      var modes = modesForLesson(lesson);
      var mode = preferredMode && modes.some(function (m) { return m.id === preferredMode; }) ? preferredMode : modes[0].id;
      state.challenge = { lesson: lesson, mode: mode };
      el.challenge.hidden = false;
      el.chTitle.textContent = lesson.name;
      el.chKicker.textContent = lesson.type === 'grammar' ? '句型挑戰' : '單字挑戰';
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
      C.stopSpeak();
      if (state.view === 'island' && state.islandId) renderIsland(state.islandId);
      else renderHome();
    }
    function lessonWords(lesson) {
      return (lesson.wordIds || []).map(function (id) { return wordById[id]; }).filter(Boolean);
    }
    function refreshTabs(lesson) {
      $$('.mode-tab', el.modeTabs).forEach(function (t) {
        var earned = state.progress[lesson.id] && state.progress[lesson.id].modes && state.progress[lesson.id].modes[t.dataset.mode];
        var m = modesForLesson(lesson).find(function (x) { return x.id === t.dataset.mode; });
        if (m) t.textContent = m.label + (earned ? ' ★' : '');
      });
    }
    function startMode(lesson, mode) {
      state.challenge.mode = mode;
      $$('.mode-tab', el.modeTabs).forEach(function (t) {
        t.setAttribute('aria-selected', t.dataset.mode === mode ? 'true' : 'false');
      });
      el.chFoot.hidden = true;
      el.chBody.innerHTML = '';
      if (lesson.type === 'grammar') runGrammar(lesson);
      else if (mode === 'match') runMatch(lesson);
      else if (mode === 'scramble') runScramble(lesson);
      else runQuiz(lesson, mode);
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

    // ---- 看英選中 / 看中選英 ----
    function runQuiz(lesson, mode) {
      var words = shuffle(lessonWords(lesson));
      var roundN = Math.min(8, Math.max(4, words.length));
      var pool = words.slice(0, roundN);
      var allForChoices = lessonWords(lesson);
      var broader = DATA.words.filter(function (w) { return w.grade <= state.grade; });
      var i = 0, correct = 0, locked = false;

      function finish() {
        var pass = correct / pool.length >= 0.7;
        if (pass) awardModeStar(lesson.id, mode);
        var msgs = pass ? ['太棒了！', '做得好！', '星星亮起來了！'] : ['再試一次會更熟！', '差一點，加油！', '我們再玩一回吧！'];
        el.chBody.innerHTML = resultHtml(pass, msgs[Math.floor(Math.random() * msgs.length)],
          '答對 ' + correct + ' / ' + pool.length + (pass ? ' · 已記下這顆 ★' : ''));
        bindResult(lesson, mode);
      }
      function renderQ() {
        if (i >= pool.length) return finish();
        locked = false;
        var w = pool[i];
        var askEn = mode === 'en2zh';
        var prompt = askEn ? w.en : w.zh;
        var answer = askEn ? w.zh : w.en;
        var choices = shuffle(uniqueChoices(answer,
          allForChoices.map(function (x) { return askEn ? x.zh : x.en; }),
          broader.map(function (x) { return askEn ? x.zh : x.en; }), 4));
        el.chBody.innerHTML =
          '<div class="progress-bar" aria-hidden="true"><span style="width:' + (i / pool.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">第 ' + (i + 1) + ' / ' + pool.length + ' 題</p>' +
            (w.emoji && askEn ? '<div class="q-emoji">' + w.emoji + '</div>' : '') +
            '<div class="q-prompt">' + escapeHtml(prompt) + '</div>' +
            (askEn ? '<button type="button" class="speak-btn" data-speak="' + escapeAttr(w.en) + '">🔊 聽發音</button>' : '') +
            '<div class="choices" role="group" aria-label="選項">' +
              choices.map(function (c) { return '<button type="button" class="choice" data-choice="' + escapeAttr(c) + '">' + escapeHtml(c) + '</button>'; }).join('') +
            '</div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
      }
      el.chBody.onclick = function (e) {
        var sp = e.target.closest('[data-speak]');
        if (sp) { C.speak(sp.dataset.speak); return; }
        var btn = e.target.closest('.choice');
        if (!btn || btn.disabled || locked) return;
        locked = true;
        var w = pool[i];
        var answer = mode === 'en2zh' ? w.zh : w.en;
        var ok = btn.dataset.choice === answer;
        $$('.choice', el.chBody).forEach(function (c) {
          c.disabled = true;
          if (c.dataset.choice === answer) c.classList.add('correct');
          else if (c === btn && !ok) c.classList.add('wrong');
          else c.classList.add('dim');
        });
        var fb = $('#fb', el.chBody);
        if (ok) { correct++; fb.textContent = '答對了！真厲害'; fb.className = 'feedback ok'; }
        else { fb.textContent = '答案是「' + answer + '」'; fb.className = 'feedback no'; }
        setTimeout(function () { i++; renderQ(); }, ok ? 550 : 900);
      };
      renderQ();
    }
    function uniqueChoices(answer, primary, fallback, n) {
      var set = [answer];
      var pool = shuffle(primary.concat(fallback).filter(function (x) { return x && x !== answer; }));
      for (var k = 0; k < pool.length && set.length < n; k++) if (set.indexOf(pool[k]) < 0) set.push(pool[k]);
      return set;
    }

    // ---- 配對 ----
    function runMatch(lesson) {
      var all = lessonWords(lesson);
      var words = shuffle(all).slice(0, Math.min(6, all.length));
      var left = shuffle(words.map(function (w) { return { id: w.id, text: w.en }; }));
      var right = shuffle(words.map(function (w) { return { id: w.id, text: w.zh }; }));
      var selected = null, matched = 0, mistakes = 0;

      function col(list, side) {
        return list.map(function (c) {
          return '<button type="button" class="match-card' + (c.done ? ' matched' : '') + '" data-id="' + c.id + '" data-side="' + side + '"' + (c.done ? ' disabled' : '') + '>' + escapeHtml(c.text) + '</button>';
        }).join('');
      }
      function paint() {
        el.chBody.innerHTML =
          '<p class="q-sub" style="text-align:center">先點英文，再點中文配對 · ' + matched + '/' + words.length + '</p>' +
          '<div class="match-board"><div class="match-col" id="col-en">' + col(left, 'en') + '</div>' +
          '<div class="match-col" id="col-zh">' + col(right, 'zh') + '</div></div>' +
          '<p class="feedback" id="fb" aria-live="polite"></p>';
      }
      function done() {
        if (matched === words.length) awardModeStar(lesson.id, 'match');
        el.chBody.innerHTML = resultHtml(true, '配對完成！',
          matched + ' 組都對上了' + (mistakes ? '（中途點錯 ' + mistakes + ' 次，沒關係）' : ''));
        bindResult(lesson, 'match');
      }
      paint();
      el.chBody.onclick = function (e) {
        var btn = e.target.closest('.match-card');
        if (!btn || btn.disabled || btn.classList.contains('matched')) return;
        var side = btn.dataset.side;
        var id = Number(btn.dataset.id);
        var fb = $('#fb');
        if (!selected) {
          if (side !== 'en') { fb.textContent = '先選左邊的英文喔'; fb.className = 'feedback no'; return; }
          selected = { id: id, btn: btn };
          btn.classList.add('selected');
          C.speak(btn.textContent.trim());
          return;
        }
        if (side === 'en') {
          selected.btn.classList.remove('selected');
          selected = { id: id, btn: btn };
          btn.classList.add('selected');
          C.speak(btn.textContent.trim());
          return;
        }
        if (id === selected.id) {
          btn.classList.add('matched');
          selected.btn.classList.add('matched');
          selected.btn.classList.remove('selected');
          btn.disabled = true;
          selected.btn.disabled = true;
          left.forEach(function (x) { if (x.id === id) x.done = true; });
          right.forEach(function (x) { if (x.id === id) x.done = true; });
          selected = null;
          matched++;
          fb.textContent = '配對成功！'; fb.className = 'feedback ok';
          var sub = $('.q-sub', el.chBody);
          if (sub) sub.textContent = '先點英文，再點中文配對 · ' + matched + '/' + words.length;
          if (matched >= words.length) setTimeout(done, 400);
        } else {
          mistakes++;
          btn.classList.add('shake');
          selected.btn.classList.add('shake');
          fb.textContent = '再想一想～'; fb.className = 'feedback no';
          var prev = selected;
          selected = null;
          setTimeout(function () {
            btn.classList.remove('shake');
            prev.btn.classList.remove('shake', 'selected');
          }, 350);
        }
      };
    }

    // ---- 拼拼看（四年級起）----
    function runScramble(lesson) {
      var lw = lessonWords(lesson);
      var candidates = lw.filter(function (w) {
        var t = w.en.replace(/\s/g, '');
        return /^[A-Za-z]+(?:\s+[A-Za-z]+)?$/.test(w.en) && t.length >= 3 && t.length <= 10;
      });
      var words = shuffle(candidates.length ? candidates : lw).slice(0, Math.min(6, Math.max(3, candidates.length || lw.length)));
      var i = 0, correct = 0;

      function render() {
        if (i >= words.length) return finish();
        var w = words[i];
        var letters = w.en.replace(/\s/g, '').split('');
        var answer = letters.join('');
        var tray = shuffle(letters.map(function (ch) { return { ch: ch, used: false }; }));
        var slots = letters.map(function () { return null; });
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / words.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">第 ' + (i + 1) + ' / ' + words.length + ' 題 · 中文：' + escapeHtml(w.zh) + '</p>' +
            (w.emoji ? '<div class="q-emoji">' + w.emoji + '</div>' : '') +
            '<button type="button" class="speak-btn" data-speak="' + escapeAttr(w.en) + '">🔊 聽發音</button>' +
            '<div class="scramble-slots" id="slots"></div>' +
            '<div class="scramble-tray" id="tray"></div>' +
            '<div class="btn-row" style="margin-top:.5rem">' +
              '<button type="button" class="btn secondary" id="sc-clear">清空</button>' +
              '<button type="button" class="btn primary" id="sc-check">完成</button>' +
            '</div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
        var slotsEl = $('#slots'), trayEl = $('#tray');
        function draw() {
          slotsEl.innerHTML = slots.map(function (s, si) {
            return s ? '<button type="button" class="letter filled" data-slot="' + si + '">' + escapeHtml(s.ch) + '</button>'
                     : '<span class="letter slot" data-slot="' + si + '"></span>';
          }).join('');
          trayEl.innerHTML = tray.map(function (t, ti) {
            return '<button type="button" class="letter tray" data-tray="' + ti + '"' + (t.used ? ' disabled' : '') + '>' + escapeHtml(t.ch) + '</button>';
          }).join('');
        }
        draw();
        var answered = false;
        el.chBody.onclick = function (e) {
          if (e.target.closest('[data-speak]')) { C.speak(w.en); return; }
          if (answered) return;
          var tbtn = e.target.closest('[data-tray]');
          if (tbtn && !tbtn.disabled) {
            var ti = Number(tbtn.dataset.tray);
            var empty = slots.findIndex(function (s) { return !s; });
            if (empty < 0) return;
            slots[empty] = tray[ti];
            tray[ti].used = true;
            draw();
            return;
          }
          var sbtn = e.target.closest('.letter.filled[data-slot]');
          if (sbtn) {
            var si = Number(sbtn.dataset.slot);
            var item = slots[si];
            if (!item) return;
            item.used = false;
            slots[si] = null;
            draw();
            return;
          }
          if (e.target.id === 'sc-clear') {
            for (var k = 0; k < slots.length; k++) slots[k] = null;
            tray.forEach(function (t) { t.used = false; });
            draw();
            return;
          }
          if (e.target.id === 'sc-check') {
            var built = slots.map(function (s) { return s ? s.ch : ''; }).join('');
            var fb = $('#fb');
            answered = true;
            if (built.toLowerCase() === answer.toLowerCase()) {
              correct++;
              fb.textContent = '拼對了！'; fb.className = 'feedback ok';
              setTimeout(function () { i++; render(); }, 600);
            } else {
              fb.textContent = '再排一次，答案是 ' + w.en; fb.className = 'feedback no';
              setTimeout(function () { i++; render(); }, 1100);
            }
          }
        };
      }
      function finish() {
        var pass = correct / words.length >= 0.7;
        if (pass) awardModeStar(lesson.id, 'scramble');
        el.chBody.innerHTML = resultHtml(pass, pass ? '拼字高手！' : '再練一次會更熟', '答對 ' + correct + ' / ' + words.length);
        bindResult(lesson, 'scramble');
      }
      render();
    }

    // ---- 句型 ----
    function runGrammar(lesson) {
      var g = grammarById[lesson.grammarId];
      if (!g) { el.chBody.innerHTML = '<p>找不到這個句型資料。</p>'; return; }
      var items = buildGrammarItems(g);
      var i = 0, correct = 0;
      el.chBody.onclick = null;

      function showIntro() {
        el.chBody.innerHTML =
          '<div class="grammar-intro">' +
            '<h3>' + escapeHtml(g.name_zh) + '</h3>' +
            '<p>' + escapeHtml(g.zh) + '</p>' +
            '<ul class="pattern-list">' + (g.patterns || []).slice(0, 4).map(function (p) { return '<li>' + escapeHtml(p) + '</li>'; }).join('') + '</ul>' +
          '</div>' +
          '<p class="q-sub" style="text-align:center">來看幾個例子，再玩玩看！</p>' +
          '<ul class="pattern-list" style="margin-bottom:1rem">' + (g.examples || []).slice(0, 3).map(function (ex) {
            return '<li><button type="button" class="ex-speak" data-speak="' + escapeAttr(ex) + '" aria-label="聽例句">🔊</button> ' + escapeHtml(ex) + '</li>';
          }).join('') + '</ul>' +
          '<div class="btn-row"><button type="button" class="btn primary" id="start-gq">開始練習</button></div>';
        el.chBody.onclick = function (e) {
          var sp = e.target.closest('[data-speak]');
          if (sp) C.speak(sp.dataset.speak);
        };
        $('#start-gq').onclick = function () { renderQ(); };
      }
      function renderQ() {
        if (i >= items.length) return finish();
        var item = items[i];
        el.chBody.innerHTML =
          '<div class="progress-bar"><span style="width:' + (i / items.length) * 100 + '%"></span></div>' +
          '<div class="q-card">' +
            '<p class="q-sub">第 ' + (i + 1) + ' / ' + items.length + ' 題</p>' +
            '<div class="q-prompt" style="font-size:1.25rem">' + escapeHtml(item.prompt) + '</div>' +
            '<div class="choices" style="margin-top:1rem">' +
              item.choices.map(function (c) { return '<button type="button" class="choice" data-c="' + escapeAttr(c) + '">' + escapeHtml(c) + '</button>'; }).join('') +
            '</div>' +
            '<p class="feedback" id="fb" aria-live="polite"></p>' +
          '</div>';
        el.chBody.onclick = function (e) {
          var btn = e.target.closest('.choice');
          if (!btn || btn.disabled) return;
          var ok = btn.dataset.c === item.answer;
          $$('.choice', el.chBody).forEach(function (c) {
            c.disabled = true;
            if (c.dataset.c === item.answer) c.classList.add('correct');
            else if (c === btn && !ok) c.classList.add('wrong');
            else c.classList.add('dim');
          });
          var fb = $('#fb');
          if (ok) { correct++; fb.textContent = '答對了！'; fb.className = 'feedback ok'; }
          else { fb.textContent = '正確是「' + item.answer + '」'; fb.className = 'feedback no'; }
          setTimeout(function () { i++; renderQ(); }, ok ? 550 : 950);
        };
      }
      function finish() {
        var pass = correct / items.length >= 0.7;
        if (pass) awardModeStar(lesson.id, 'grammar');
        el.chBody.innerHTML = resultHtml(pass, pass ? '句型學會了！' : '再看一次說明吧', '答對 ' + correct + ' / ' + items.length);
        bindResult(lesson, 'grammar');
      }
      showIntro();
    }

    function unique(arr) {
      var out = [];
      arr.forEach(function (x) { if (x && out.indexOf(x) < 0) out.push(x); });
      return out;
    }
    function mutateSentence(s, variant) {
      if (!s) return '';
      var parts = s.replace(/[.?!~]$/, '').split(/\s+/);
      if (parts.length < 2) return s + (variant ? '!!' : '?');
      var copy = parts.slice();
      if (variant === 2) { copy.splice(1, 1); return copy.join(' ') + '.'; }
      var t = copy[0]; copy[0] = copy[1]; copy[1] = t;
      return copy.join(' ') + '.';
    }
    function soften(s) {
      return s.replace(/\bis\b/i, 'are').replace(/\bare\b/i, 'is').replace(/\bam\b/i, 'is');
    }
    function buildGrammarItems(g) {
      var items = [];
      var examples = (g.examples || []).filter(Boolean);
      var otherPatterns = [];
      DATA.grammar.forEach(function (x) { if (x.id !== g.id) (x.patterns || []).forEach(function (p) { if (p) otherPatterns.push(p); }); });
      examples.forEach(function (ex) {
        var wrongs = [mutateSentence(ex), mutateSentence(ex, 2), soften(ex)].filter(function (w) { return w && w !== ex; });
        var choices = unique([ex].concat(wrongs)).slice(0, 4);
        while (choices.length < 2) choices.push(ex + '?');
        items.push({ prompt: '哪一句才對？', choices: shuffle(choices), answer: ex });
      });
      (g.patterns || []).slice(0, 3).forEach(function (pat) {
        var distractors = shuffle(otherPatterns.filter(function (p) { return p !== pat; })).slice(0, 3);
        var choices = unique([pat].concat(distractors)).slice(0, 4);
        if (choices.length >= 2) items.push({ prompt: '「' + g.name_zh + '」常用哪一種？', choices: shuffle(choices), answer: pat });
      });
      while (items.length < 4 && examples.length) {
        var ex = examples[items.length % examples.length];
        var pool = unique([ex].concat(examples.map(soften), examples.map(function (e) { return mutateSentence(e); })));
        var ch = shuffle(pool).slice(0, 4);
        if (ch.indexOf(ex) < 0) ch[0] = ex;
        items.push({ prompt: '選出正確的例句', choices: shuffle(ch), answer: ex });
      }
      return shuffle(items).slice(0, 6);
    }

    // ---------- 事件 ----------
    $('#btn-back-home').addEventListener('click', function () { setHash(''); });
    $('#btn-close-ch').addEventListener('click', closeChallenge);
    $('#btn-player').addEventListener('click', openPlayerModal);
    $('#btn-close-player').addEventListener('click', function () { el.playerModal.hidden = true; });

    el.islandGrid.addEventListener('click', function (e) {
      var card = e.target.closest('[data-island]');
      if (!card) return;
      var id = card.dataset.island;
      sailThen(function () { setHash('island/' + id); });
    });
    el.unitList.addEventListener('click', function (e) {
      var row = e.target.closest('[data-lesson]');
      if (!row) return;
      var lesson = row.dataset.lesson;
      setHash('island/' + row.dataset.island);
      setTimeout(function () { openChallenge(lesson); }, 50);
    });
    el.lessonMap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lesson]');
      if (btn) openChallenge(btn.dataset.lesson);
    });
    el.modeTabs.addEventListener('click', function (e) {
      var tab = e.target.closest('[data-mode]');
      if (tab && state.challenge) startMode(state.challenge.lesson, tab.dataset.mode);
    });

    function openPlayerModal() {
      el.playerName.value = C.playerNameFor(state.grade) || '';
      if (el.playerTitleGrade) el.playerTitleGrade.textContent = GRADE_LABEL[state.grade] + '年級';
      el.playerModal.hidden = false;
      el.playerName.focus();
    }
    $('#btn-save-player').addEventListener('click', function () {
      var name = el.playerName.value.trim().slice(0, 12);
      state.player = name;
      C.savePlayerName(state.grade, name);
      updatePlayerHello();
      el.playerModal.hidden = true;
    });
    $('#btn-reset-progress').addEventListener('click', function () {
      if (confirm('確定要清除「' + label() + '」的星星進度嗎？')) {
        state.progress = {};
        saveProgress();
        updateStarPill();
        if (state.view === 'island') renderIsland(state.islandId); else renderHome();
        alert('已重置「' + label() + '」進度。');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!el.challenge.hidden) closeChallenge();
      else if (!el.playerModal.hidden) el.playerModal.hidden = true;
    });

    // 第一次來、還沒取名字：小小提醒
    if (!state.player) {
      var hint = $('#name-hint');
      if (hint) hint.hidden = false;
    }

    onRoute();
  }

  // ---------- 啟動 ----------
  if (window.ISLES_ROUTE) initRoute(String(window.ISLES_ROUTE));
  else if (document.getElementById('grade-grid')) initHub();
})();
