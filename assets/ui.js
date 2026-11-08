/* 國小學習群島 — 共用 UI：島嶼插圖、結果卡、轉場、路徑正規化 */
(function () {
  'use strict';

  var C = window.IslesCore;
  var P = window.Companions;

  function islandSVG(isl, seed) {
    if (!C || !P) return '';
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
    if (!C || !P) return '';
    var c = isl.color || '#2a9d8f';
    return '<svg class="mini-art" viewBox="0 0 80 56" aria-hidden="true">' +
      '<ellipse cx="40" cy="50" rx="30" ry="5" fill="#7ec8e3" opacity=".4"/>' +
      '<path d="M12 48 C20 36 28 30 40 28 C52 30 60 36 68 48 Z" fill="' + c + '"/>' +
      P.companionAt(P.forIsland(isl.id).id, 24 + (i % 3) * 2, -2, 0.33, i % 2 ? 'happy' : 'normal') +
      '</svg>';
  }

  /** /math 或 /english 無尾斜線時補上，避免相對連結指到錯路徑 */
  function canonicalizeHubPath() {
    try {
      var path = location.pathname || '';
      if (path && !/\/$/i.test(path) && !/index\.html$/i.test(path)) {
        history.replaceState(null, '', path + '/' + (location.search || '') + (location.hash || ''));
      }
    } catch (e) { /* ignore */ }
  }

  /** 同頁轉場：短暫開船遮罩後執行 fn（可點遮罩跳過；逾時保底） */
  function sailThen(fn) {
    if (!C) { fn(); return; }
    var sail = C.$('#sail-overlay');
    if (!sail || C.reducedMotion()) { fn(); return; }
    sail.hidden = false;
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      if (C.hideSailOverlay) C.hideSailOverlay(sail); else sail.hidden = true;
      fn();
    }
    sail.onclick = finish;
    setTimeout(finish, 500);
    setTimeout(function () { if (!done) finish(); }, 1400);
  }

  function resultHtml(buddyId, pass, title, line) {
    if (!P) return '';
    var buddy = buddyId || 'chirp';
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

  function routeEls($) {
    return {
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
      playerTitleGrade: $('#player-title-grade') || $('#player-grade'),
      nameHint: $('#name-hint')
    };
  }

  function assetPrefix() {
    var link = document.querySelector('link[href*="assets/site.css"]');
    if (link) {
      var href = link.getAttribute('href') || '';
      return href.replace(/assets\/site\.css.*$/i, '');
    }
    return '';
  }

  /** 目前顯示的探險家：優先固定年級，否則上次航線年級，再否則第一個有名字的年級 */
  function resolvePlayerFocus(fixedGrade) {
    if (!C) return { grade: 0, name: '' };
    var g = Number(fixedGrade || 0);
    if (g >= 1 && g <= 6) {
      return { grade: g, name: C.playerNameFor(g) };
    }
    var target = C.continueTarget && C.continueTarget();
    if (target && target.parsed) {
      g = target.parsed.grade;
      return { grade: g, name: C.playerNameFor(g) };
    }
    var players = C.loadPlayers();
    for (g = 1; g <= 6; g++) {
      if ((players[String(g)] || '').trim()) {
        return { grade: g, name: players[String(g)].trim() };
      }
    }
    return { grade: 0, name: '' };
  }

  function ensureTopbarRight() {
    var topbar = document.querySelector('.topbar');
    if (!topbar) return null;
    var right = topbar.querySelector('.topbar-right');
    if (!right) {
      right = document.createElement('div');
      right.className = 'topbar-right';
      topbar.appendChild(right);
    }
    return right;
  }

  function ensurePlayerModal(opts) {
    var existing = document.getElementById('player-modal');
    if (existing) return existing;
    var prefix = assetPrefix();
    var englishHref = prefix + 'english/index.html';
    var mathHref = prefix + 'math/index.html';
    var wrap = document.createElement('div');
    wrap.id = 'player-modal';
    wrap.className = 'modal';
    wrap.hidden = true;
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'player-title');
    wrap.innerHTML =
      '<div class="modal-sheet">' +
        '<h2 id="player-title">探險家設定</h2>' +
        '<p class="switch-hint">兩個孩子可各選年級＋學期；名字依年級共用（英文／數學同名），星星依科目與學期分開。</p>' +
        '<div class="player-roster" id="player-roster" aria-live="polite"></div>' +
        '<label class="field" id="player-grade-field">' +
          '<span>為哪一年級取名／換人？</span>' +
          '<select id="player-grade-select" aria-label="選擇年級"></select>' +
        '</label>' +
        '<label class="field">' +
          '<span><span id="player-grade">一年級</span>的名字</span>' +
          '<input type="text" id="player-name" maxlength="12" placeholder="例如：小明" autocomplete="nickname" />' +
        '</label>' +
        '<div class="modal-actions">' +
          '<button type="button" class="btn primary" id="btn-save-player">儲存</button>' +
          '<a class="btn secondary" id="player-link-english" href="' + englishHref + '">去英文選航線</a>' +
          '<a class="btn secondary" id="player-link-math" href="' + mathHref + '">去數學選航線</a>' +
          '<button type="button" class="btn secondary" id="btn-close-player">先不改</button>' +
          '<button type="button" class="btn ghost" id="btn-reset-progress" hidden>重置進度</button>' +
        '</div>' +
        '<p class="fineprint" data-note></p>' +
      '</div>';
    document.body.appendChild(wrap);
    if (opts && opts.note) {
      var note = wrap.querySelector('[data-note]');
      if (note) note.textContent = opts.note;
    }
    return wrap;
  }

  function fillGradeSelect(select, selected) {
    if (!select || !C) return;
    var GRADE_LABEL = C.GRADE_LABEL;
    select.innerHTML = [1, 2, 3, 4, 5, 6].map(function (g) {
      var name = C.playerNameFor(g);
      var label = GRADE_LABEL[g] + '年級' + (name ? '・' + name : '・還沒取名');
      return '<option value="' + g + '"' + (g === selected ? ' selected' : '') + '>' + C.escapeHtml(label) + '</option>';
    }).join('');
  }

  function renderRoster(el) {
    if (!el || !C) return;
    var players = C.loadPlayers();
    var rows = [];
    for (var g = 1; g <= 6; g++) {
      var name = (players[String(g)] || '').trim();
      if (name) rows.push('<li><strong>' + C.escapeHtml(C.GRADE_LABEL[g] + '年級') + '</strong> ' + C.escapeHtml(name) + '</li>');
    }
    if (!rows.length) {
      el.innerHTML = '<p class="roster-empty">還沒有探險家名字。先選年級、寫上名字，星星就不會跟兄弟姊妹搞混。</p>';
      return;
    }
    el.innerHTML = '<p class="roster-title">這台裝置上的探險家</p><ul class="roster-list">' + rows.join('') + '</ul>';
  }

  /**
   * 右上角永遠可見的「誰在玩」控制；點開既有探險家設定 modal。
   * opts.grade — 航線頁固定年級；省略則可選年級（大廳／科目 hub）
   * opts.onSave(grade, name) — 儲存後回呼
   * opts.reset — { confirm(label), buttonLabel(label), onReset() } 僅航線頁
   * opts.hubLinks — { english, math } 覆蓋預設相對連結
   * opts.note — footer note
   */
  function mountPlayerChrome(opts) {
    opts = opts || {};
    if (!C) return null;
    C.migrateOldName();

    var right = ensureTopbarRight();
    if (!right) return null;

    var modal = document.getElementById('player-modal') || ensurePlayerModal(opts);
    var fixedGrade = opts.grade ? Number(opts.grade) : 0;
    var flexible = !(fixedGrade >= 1 && fixedGrade <= 6);

    // 航線頁舊的小 👤 改由 chip 取代，避免兩個入口
    var legacyBtn = document.getElementById('btn-player');
    if (legacyBtn && legacyBtn.id === 'btn-player') {
      legacyBtn.hidden = true;
      legacyBtn.setAttribute('aria-hidden', 'true');
      legacyBtn.tabIndex = -1;
    }

    // 航線「換人玩」改標成換學期，避免跟玩家 chip 搶焦點
    var switcherHint = document.querySelector('.switcher-hint');
    if (switcherHint && /換人/.test(switcherHint.textContent || '')) {
      switcherHint.textContent = '換學期';
    }
    var switcher = document.querySelector('a.switcher');
    if (switcher) {
      switcher.setAttribute('aria-label', '更換年級或學期');
    }

    var chip = document.getElementById('btn-site-player');
    if (!chip) {
      chip = document.createElement('button');
      chip.type = 'button';
      chip.id = 'btn-site-player';
      chip.className = 'player-chip';
      chip.innerHTML =
        '<span class="player-chip-icon" aria-hidden="true">👤</span>' +
        '<span class="player-chip-text">' +
          '<strong id="site-player-name">誰在玩？</strong>' +
          '<small id="site-player-hint">點我換人</small>' +
        '</span>';
      right.appendChild(chip);
    }

    var nameEl = document.getElementById('site-player-name');
    var hintEl = document.getElementById('site-player-hint');
    var gradeSelect = document.getElementById('player-grade-select');
    var gradeField = document.getElementById('player-grade-field');
    var gradeLabel = document.getElementById('player-grade') || document.getElementById('player-title-grade');
    var nameInput = document.getElementById('player-name');
    var roster = document.getElementById('player-roster');
    var resetBtn = document.getElementById('btn-reset-progress');
    var GRADE_LABEL = C.GRADE_LABEL;

    if (flexible) {
      if (gradeField) gradeField.hidden = false;
      if (resetBtn) resetBtn.hidden = true;
      var prefix = assetPrefix();
      var enLink = document.getElementById('player-link-english');
      var maLink = document.getElementById('player-link-math');
      if (opts.hubLinks) {
        if (enLink && opts.hubLinks.english) enLink.href = opts.hubLinks.english;
        if (maLink && opts.hubLinks.math) maLink.href = opts.hubLinks.math;
      } else {
        if (enLink) enLink.href = prefix + 'english/index.html';
        if (maLink) maLink.href = prefix + 'math/index.html';
      }
    } else {
      if (gradeField) gradeField.hidden = true;
      if (resetBtn) {
        resetBtn.hidden = !opts.reset;
        if (opts.reset && opts.reset.buttonLabel) {
          resetBtn.textContent = opts.reset.buttonLabel();
        }
      }
    }
    function selectedGrade() {
      if (!flexible) return fixedGrade;
      if (gradeSelect) return Number(gradeSelect.value) || 0;
      return resolvePlayerFocus(0).grade || 1;
    }

    function refreshChip(preferGrade) {
      var focus;
      var pref = Number(preferGrade || 0);
      if (pref >= 1 && pref <= 6) {
        focus = { grade: pref, name: C.playerNameFor(pref) };
        if (!focus.name) focus = resolvePlayerFocus(flexible ? 0 : fixedGrade);
      } else {
        focus = resolvePlayerFocus(flexible ? 0 : fixedGrade);
      }
      if (nameEl) {
        nameEl.textContent = focus.name || '誰在玩？';
      }
      if (hintEl) {
        hintEl.textContent = focus.name ? '點我換人' : '點我設定';
      }
      chip.setAttribute('aria-label',
        focus.name
          ? ('目前探險家：' + focus.name + '，點開換人或改名字')
          : '設定探險家名字或換人玩');
    }

    function syncGradeLabel() {
      var g = selectedGrade();
      if (gradeLabel && g) gradeLabel.textContent = GRADE_LABEL[g] + '年級';
      if (nameInput && g) nameInput.value = C.playerNameFor(g) || '';
    }

    function openModal() {
      var focus = resolvePlayerFocus(flexible ? 0 : fixedGrade);
      var g = flexible ? (focus.grade || 1) : fixedGrade;
      if (roster) renderRoster(roster);
      if (flexible && gradeSelect) fillGradeSelect(gradeSelect, g);
      syncGradeLabel();
      if (nameInput) nameInput.value = C.playerNameFor(g) || '';
      if (gradeLabel) gradeLabel.textContent = GRADE_LABEL[g] + '年級';
      if (resetBtn && opts.reset && opts.reset.buttonLabel) {
        resetBtn.textContent = opts.reset.buttonLabel();
        resetBtn.hidden = false;
      }
      modal.hidden = false;
      if (nameInput) nameInput.focus();
    }

    function closeModal() { modal.hidden = true; }

    function save() {
      var g = selectedGrade();
      if (!(g >= 1 && g <= 6)) return;
      var name = ((nameInput && nameInput.value) || '').trim().slice(0, 12);
      C.savePlayerName(g, name);
      refreshChip(g);
      closeModal();
      if (typeof opts.onSave === 'function') opts.onSave(g, name);
      // 大廳打招呼若存在就更新
      var hello = document.getElementById('lobby-hello');
      if (hello) {
        var names = C.loadPlayers();
        var list = Object.keys(names).sort().map(function (k) { return names[k]; }).filter(Boolean);
        hello.textContent = list.length ? '歡迎回來，' + list.join('、') + '！' : '歡迎來到學習群島！';
      }
    }

    chip.onclick = openModal;
    var btnClose = document.getElementById('btn-close-player');
    var btnSave = document.getElementById('btn-save-player');
    if (btnClose) btnClose.onclick = closeModal;
    if (btnSave) btnSave.onclick = save;
    if (gradeSelect) {
      gradeSelect.onchange = function () { syncGradeLabel(); };
    }
    if (resetBtn && opts.reset && typeof opts.reset.onReset === 'function') {
      resetBtn.onclick = function () {
        var msg = opts.reset.confirm ? opts.reset.confirm() : '確定要重置進度嗎？';
        if (!confirm(msg)) return;
        opts.reset.onReset();
        closeModal();
      };
    }
    if (legacyBtn) {
      legacyBtn.onclick = openModal;
    }

    if (!modal._islesEscapeBound) {
      modal._islesEscapeBound = true;
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
      });
    }

    refreshChip();
    return {
      open: openModal,
      close: closeModal,
      refresh: refreshChip,
      chip: chip
    };
  }

  window.IslesUI = {
    islandSVG: islandSVG,
    miniIsleSVG: miniIsleSVG,
    canonicalizeHubPath: canonicalizeHubPath,
    sailThen: sailThen,
    resultHtml: resultHtml,
    routeEls: routeEls,
    mountPlayerChrome: mountPlayerChrome,
    resolvePlayerFocus: resolvePlayerFocus
  };
})();
