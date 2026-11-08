/* 國小英語群島 — 共用 UI：島嶼插圖、結果卡、轉場、路徑正規化 */
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

  window.IslesUI = {
    islandSVG: islandSVG,
    miniIsleSVG: miniIsleSVG,
    canonicalizeHubPath: canonicalizeHubPath,
    sailThen: sailThen,
    resultHtml: resultHtml,
    routeEls: routeEls
  };
})();
