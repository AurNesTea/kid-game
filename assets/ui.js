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

  /** 目前顯示的探險家：航線固定年級 → 主動焦點 → 繼續航線 → 第一位有名字 */
  function resolvePlayerFocus(fixedGrade) {
    if (!C) return { grade: 0, name: '' };
    var g = Number(fixedGrade || 0);
    if (g >= 1 && g <= 6) {
      return { grade: g, name: C.playerNameFor(g) };
    }
    var active = C.getActiveGrade ? C.getActiveGrade() : 0;
    if (active) return { grade: active, name: C.playerNameFor(active) };
    var target = C.continueTarget && C.continueTarget();
    if (target && target.parsed) {
      g = target.parsed.grade;
      var n = C.playerNameFor(g);
      if (n) return { grade: g, name: n };
    }
    var explorers = C.listExplorers ? C.listExplorers() : [];
    if (explorers.length) return explorers[0];
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

  function switcherModalHtml(opts) {
    var note = (opts && opts.note) || '';
    return (
      '<div class="modal-sheet player-switcher-sheet">' +
        '<h2 id="player-title">誰要來玩？</h2>' +
        '<p class="switch-hint">點大卡片就能換人。名字跟年級綁在一起，星星還是各科分開記。</p>' +
        '<div class="player-roster" id="player-roster" aria-live="polite"></div>' +
        '<div class="player-secondary">' +
          '<button type="button" class="btn secondary" id="btn-add-explorer">＋ 新增探險家</button>' +
          '<button type="button" class="btn ghost" id="btn-edit-explorer">改名字</button>' +
        '</div>' +
        '<div class="player-editor" id="player-editor" hidden>' +
          '<p class="editor-title" id="player-editor-title">新增探險家</p>' +
          '<label class="field" id="player-grade-field">' +
            '<span>年級</span>' +
            '<select id="player-grade-select" aria-label="選擇年級"></select>' +
          '</label>' +
          '<label class="field">' +
            '<span><span id="player-grade">一年級</span>的名字</span>' +
            '<input type="text" id="player-name" maxlength="12" placeholder="例如：小明" autocomplete="nickname" />' +
          '</label>' +
          '<div class="btn-row editor-actions">' +
            '<button type="button" class="btn primary" id="btn-save-player">儲存</button>' +
            '<button type="button" class="btn secondary" id="btn-cancel-editor">取消</button>' +
          '</div>' +
        '</div>' +
        '<div class="modal-actions">' +
          '<button type="button" class="btn secondary" id="btn-close-player">關閉</button>' +
          '<button type="button" class="btn ghost" id="btn-reset-progress" hidden>重置進度</button>' +
        '</div>' +
        '<p class="fineprint" data-note>' + C.escapeHtml(note) + '</p>' +
      '</div>'
    );
  }

  function ensurePlayerModal(opts) {
    var modal = document.getElementById('player-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'player-modal';
      document.body.appendChild(modal);
    }
    modal.className = 'modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'player-title');
    modal.innerHTML = switcherModalHtml(opts || {});
    return modal;
  }

  /**
   * 右上角永遠可見的「誰在玩」；點開以大卡片換人（設定為次要）。
   * opts.grade — 航線頁固定年級；省略＝大廳／hub 可自由換人
   * opts.onSave(grade, name) — 新增／改名後
   * opts.onSwitch(grade, name) — 點卡片換人之後（大廳／hub）
   * opts.reset — 航線頁重置本學期
   * opts.note — 小字說明
   */
  function mountPlayerChrome(opts) {
    opts = opts || {};
    if (!C) return null;
    C.migrateOldName();

    var right = ensureTopbarRight();
    if (!right) return null;

    var modal = ensurePlayerModal(opts);
    var fixedGrade = opts.grade ? Number(opts.grade) : 0;
    var flexible = !(fixedGrade >= 1 && fixedGrade <= 6);
    var GRADE_LABEL = C.GRADE_LABEL;
    var editorMode = 'add'; // add | edit

    var legacyBtn = document.getElementById('btn-player');
    if (legacyBtn) {
      legacyBtn.hidden = true;
      legacyBtn.setAttribute('aria-hidden', 'true');
      legacyBtn.tabIndex = -1;
    }

    var switcherHint = document.querySelector('.switcher-hint');
    if (switcherHint && /換人/.test(switcherHint.textContent || '')) {
      switcherHint.textContent = '換學期';
    }
    var switcher = document.querySelector('a.switcher');
    if (switcher) switcher.setAttribute('aria-label', '更換年級或學期');

    // 航線舊 modal 裡「換另一個孩子」連結改標，避免跟卡片換人打架
    var oldSwap = modal.querySelector('a.btn.secondary[href$="index.html"]');
    // 已重建 sheet，不會有

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
    var roster = document.getElementById('player-roster');
    var editor = document.getElementById('player-editor');
    var editorTitle = document.getElementById('player-editor-title');
    var gradeSelect = document.getElementById('player-grade-select');
    var gradeField = document.getElementById('player-grade-field');
    var gradeLabel = document.getElementById('player-grade');
    var nameInput = document.getElementById('player-name');
    var resetBtn = document.getElementById('btn-reset-progress');

    function refreshChip(preferGrade) {
      var focus;
      var pref = Number(preferGrade || 0);
      if (pref >= 1 && pref <= 6 && C.playerNameFor(pref)) {
        focus = { grade: pref, name: C.playerNameFor(pref) };
      } else {
        focus = resolvePlayerFocus(flexible ? 0 : fixedGrade);
      }
      if (nameEl) nameEl.textContent = focus.name || '誰在玩？';
      if (hintEl) hintEl.textContent = focus.name ? '點我換人' : '點我設定';
      chip.setAttribute('aria-label',
        focus.name
          ? ('目前是 ' + focus.name + '，點開換人')
          : '設定探險家或換人玩');
    }

    function updateLobbyHello() {
      var hello = document.getElementById('lobby-hello');
      if (!hello) return;
      var list = (C.listExplorers() || []).map(function (e) { return e.name; });
      hello.textContent = list.length ? '歡迎回來，' + list.join('、') + '！' : '歡迎來到學習群島！';
    }

    function hideEditor() {
      if (editor) editor.hidden = true;
      editorMode = 'add';
    }

    function fillGradeSelectForAdd() {
      if (!gradeSelect) return;
      var used = {};
      (C.listExplorers() || []).forEach(function (e) { used[e.grade] = true; });
      var options = [];
      for (var g = 1; g <= 6; g++) {
        if (used[g]) continue;
        options.push('<option value="' + g + '">' + GRADE_LABEL[g] + '年級</option>');
      }
      gradeSelect.innerHTML = options.length
        ? options.join('')
        : '<option value="">年級都有人了</option>';
      gradeSelect.disabled = !options.length;
      if (gradeField) gradeField.hidden = false;
      syncEditorGradeLabel();
    }

    function fillGradeSelectForEdit(selected) {
      if (!gradeSelect) return;
      var explorers = C.listExplorers() || [];
      gradeSelect.innerHTML = explorers.map(function (e) {
        return '<option value="' + e.grade + '"' + (e.grade === selected ? ' selected' : '') + '>' +
          C.escapeHtml(GRADE_LABEL[e.grade] + '年級・' + e.name) + '</option>';
      }).join('');
      gradeSelect.disabled = !explorers.length;
      if (gradeField) gradeField.hidden = false;
      syncEditorGradeLabel();
      if (nameInput) nameInput.value = C.playerNameFor(selected) || '';
    }

    function syncEditorGradeLabel() {
      var g = Number(gradeSelect && gradeSelect.value) || 0;
      if (gradeLabel && g) gradeLabel.textContent = GRADE_LABEL[g] + '年級';
      else if (gradeLabel) gradeLabel.textContent = '探險家';
    }

    function showEditor(mode) {
      editorMode = mode;
      if (!editor) return;
      if (editorTitle) editorTitle.textContent = mode === 'edit' ? '改名字' : '新增探險家';
      if (!flexible && mode === 'edit') {
        // 航線頁改名只改這一頁的年級，避免動到另一個孩子
        if (gradeSelect) {
          gradeSelect.innerHTML = '<option value="' + fixedGrade + '">' + GRADE_LABEL[fixedGrade] + '年級</option>';
          gradeSelect.disabled = false;
        }
        if (gradeField) gradeField.hidden = true;
        if (gradeLabel) gradeLabel.textContent = GRADE_LABEL[fixedGrade] + '年級';
        if (nameInput) nameInput.value = C.playerNameFor(fixedGrade) || '';
      } else if (mode === 'edit') {
        var focus = resolvePlayerFocus(flexible ? 0 : fixedGrade);
        fillGradeSelectForEdit(focus.grade || ((C.listExplorers()[0] || {}).grade));
      } else {
        fillGradeSelectForAdd();
        if (nameInput) nameInput.value = '';
      }
      editor.hidden = false;
      if (nameInput && !(gradeSelect && gradeSelect.disabled)) nameInput.focus();
    }

    function renderRoster() {
      if (!roster) return;
      var explorers = C.listExplorers() || [];
      var focus = resolvePlayerFocus(flexible ? 0 : fixedGrade);
      if (!explorers.length) {
        roster.innerHTML = '<p class="roster-empty">還沒有探險家。先按下面「新增探險家」，兩個孩子就不會搶同一個名字。</p>';
        return;
      }
      roster.innerHTML =
        '<div class="profile-grid" role="list">' +
        explorers.map(function (e) {
          var current = focus.grade === e.grade;
          return '<button type="button" class="profile-card' + (current ? ' is-current' : '') + '" role="listitem" data-grade="' + e.grade + '">' +
            '<span class="profile-avatar" aria-hidden="true">👤</span>' +
            '<span class="profile-meta">' +
              '<strong>' + C.escapeHtml(e.name) + '</strong>' +
              '<small>' + GRADE_LABEL[e.grade] + '年級</small>' +
            '</span>' +
            (current ? '<span class="profile-badge">正在玩</span>' : '<span class="profile-badge ghost">點一下換人</span>') +
          '</button>';
        }).join('') +
        '</div>';
    }

    function switchToExplorer(grade) {
      var g = Number(grade);
      var name = C.playerNameFor(g);
      if (!(g >= 1 && g <= 6) || !name) return;

      // 航線頁：同年級只關閉；不同年級 → 去科目 hub 選學期（不覆蓋別人名字）
      if (!flexible) {
        if (g === fixedGrade) {
          C.setActiveGrade(g);
          refreshChip(g);
          closeModal();
          return;
        }
        C.setActiveGrade(g);
        closeModal();
        location.assign('../index.html');
        return;
      }

      C.setActiveGrade(g);
      refreshChip(g);
      updateLobbyHello();
      closeModal();
      if (typeof opts.onSwitch === 'function') opts.onSwitch(g, name);
      else if (typeof opts.onSave === 'function') opts.onSave(g, name);
    }

    function openModal() {
      hideEditor();
      renderRoster();
      if (resetBtn) {
        if (!flexible && opts.reset) {
          resetBtn.hidden = false;
          if (opts.reset.buttonLabel) resetBtn.textContent = opts.reset.buttonLabel();
        } else {
          resetBtn.hidden = true;
        }
      }
      // 沒有探險家時直接展開新增（必要設定）；有人時不搶焦點
      var explorers = C.listExplorers() || [];
      modal.hidden = false;
      if (!explorers.length) showEditor('add');
      else {
        var firstCard = roster && roster.querySelector('.profile-card');
        if (firstCard) firstCard.focus();
      }
    }

    function closeModal() {
      hideEditor();
      modal.hidden = true;
    }

    function saveEditor() {
      var g = Number(gradeSelect && gradeSelect.value) || (!flexible ? fixedGrade : 0);
      if (!(g >= 1 && g <= 6)) return;
      var name = ((nameInput && nameInput.value) || '').trim().slice(0, 12);
      if (!name) {
        if (nameInput) nameInput.focus();
        return;
      }
      // 新增時若該年級已有人，不覆蓋（改名字流程才改）
      if (editorMode === 'add' && C.playerNameFor(g)) {
        alert('這個年級已經有探險家了，請改選別的年級，或用「改名字」。');
        return;
      }
      C.savePlayerName(g, name);
      C.setActiveGrade(g);
      updateLobbyHello();
      // 航線頁新增了「別的年級」的孩子 → 去 hub 換學期，不改寫本頁年級存檔以外的進度鍵
      if (!flexible && g !== fixedGrade) {
        closeModal();
        location.assign('../index.html');
        return;
      }
      refreshChip(g);
      hideEditor();
      renderRoster();
      if (typeof opts.onSave === 'function') opts.onSave(g, name);
    }

    chip.onclick = openModal;
    if (legacyBtn) legacyBtn.onclick = openModal;

    if (roster) {
      roster.onclick = function (e) {
        var card = e.target.closest('.profile-card[data-grade]');
        if (!card) return;
        switchToExplorer(card.getAttribute('data-grade'));
      };
    }

    var btnAdd = document.getElementById('btn-add-explorer');
    var btnEdit = document.getElementById('btn-edit-explorer');
    var btnCancel = document.getElementById('btn-cancel-editor');
    var btnClose = document.getElementById('btn-close-player');
    var btnSave = document.getElementById('btn-save-player');
    if (btnAdd) btnAdd.onclick = function () { showEditor('add'); };
    if (btnEdit) btnEdit.onclick = function () {
      if (!(C.listExplorers() || []).length) showEditor('add');
      else showEditor('edit');
    };
    if (btnCancel) btnCancel.onclick = hideEditor;
    if (btnClose) btnClose.onclick = closeModal;
    if (btnSave) btnSave.onclick = saveEditor;
    if (gradeSelect) gradeSelect.onchange = function () {
      syncEditorGradeLabel();
      if (editorMode === 'edit' && nameInput) nameInput.value = C.playerNameFor(Number(gradeSelect.value)) || '';
    };
    if (resetBtn && opts.reset && typeof opts.reset.onReset === 'function') {
      resetBtn.onclick = function () {
        var msg = opts.reset.confirm ? opts.reset.confirm() : '確定要重置進度嗎？';
        if (!confirm(msg)) return;
        opts.reset.onReset();
        closeModal();
      };
    }

    if (!modal._islesEscapeBound) {
      modal._islesEscapeBound = true;
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && !modal.hidden) {
          if (editor && !editor.hidden) hideEditor();
          else closeModal();
        }
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
