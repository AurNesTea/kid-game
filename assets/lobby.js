/* 國小學習群島 — 大廳（index.html） */
(function () {
  'use strict';
  var C = window.IslesCore, P = window.Companions, UI = window.IslesUI;
  if (!C || !P) return;

  // 舊版書籤（index.html#2-1、#grade、#island/…）導到新路徑
  var h = (location.hash || '').replace(/^#/, '');
  var legacy = C.legacyHashRoute(h);
  if (legacy) { location.replace('english/' + legacy + '/index.html'); return; }
  if (h === 'grade' || h === 'picker') { location.replace('english/index.html'); return; }
  if (h.indexOf('island/') === 0 && C.lastRoute()) { location.replace('english/' + C.lastRoute() + '/index.html#' + h); return; }

  C.migrateOldName();

  // 封面：海上小島 + 一排小夥伴
  var cover = document.getElementById('cover-art');
  if (cover) {
    var ids = P.list.map(function (c) { return c.id; });
    var w = 900, step = w / (ids.length + 1);
    var buddies = ids.map(function (id, i) {
      var x = step * (i + 1) - 45;
      var y = 70 + (i % 2 ? 18 : 0);
      return P.companionAt(id, x, y, 0.9, i % 3 === 0 ? 'happy' : 'normal');
    }).join('');
    cover.innerHTML =
      '<svg viewBox="0 0 900 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="九隻探險小夥伴站在小島上">' +
        '<defs><linearGradient id="cv-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ec8e3"/><stop offset="1" stop-color="#4a9fc2"/></linearGradient></defs>' +
        '<rect x="0" y="150" width="900" height="80" fill="url(#cv-sea)" opacity=".7"/>' +
        '<path d="M30 190 C120 120 300 110 450 112 C600 110 780 120 870 190 Z" fill="#f2d5b0"/>' +
        '<path d="M80 190 C180 140 320 136 450 138 C580 136 720 140 820 190 Z" fill="#7bd389" opacity=".9"/>' +
        '<circle cx="790" cy="40" r="26" fill="#ffd23f" opacity=".9"/>' +
        buddies +
      '</svg>';
  }

  // 隨機一位小夥伴當主持人；點一下換一位並說 Hello
  var host = document.getElementById('host');
  var hostLine = document.getElementById('host-line');
  var current = null;
  function pickHost() {
    var next;
    do { next = P.random(); } while (current && next.id === current.id && P.list.length > 1);
    current = next;
    host.innerHTML = P.companionSvg(next.id, { size: 110, mood: 'happy', decorative: false });
    hostLine.innerHTML = '我是<strong>' + C.escapeHtml(next.name) + '</strong>（' + C.escapeHtml(next.type) + '屬性）！' + C.escapeHtml(next.hi);
  }
  if (host && hostLine) {
    pickHost();
    host.addEventListener('click', function () {
      C.speak('Hello!');
      setTimeout(pickHost, 320);
    });
  }

  // 上次的航線（英文或數學）— 換人後也要跟著改
  var cont = document.getElementById('continue');
  function refreshContinue() {
    if (!cont || !C.continueTarget) return;
    var target = C.continueTarget();
    if (!(target && target.parsed)) {
      cont.hidden = true;
      return;
    }
    var r = target.parsed;
    var name = C.playerNameFor(r.grade);
    C.setSubject(target.subject);
    var st = C.starsForRoute(r.grade, r.semester);
    C.setSubject('english');
    var subLabel = target.subject === 'math' ? '數學' : '英文';
    cont.hidden = false;
    cont.href = target.subject + '/' + target.route + '/index.html';
    cont.querySelector('.continue-text').textContent =
      '繼續上次：' + (name ? name + '・' : '') + subLabel + '・' + C.routeLabel(r.grade, r.semester) +
      (st.all ? '（★ ' + st.got + '/' + st.all + '）' : '');
  }
  refreshContinue();

  // 名字打招呼
  var hello = document.getElementById('lobby-hello');
  if (hello) {
    var names = C.loadPlayers();
    var list = Object.keys(names).sort().map(function (g) { return names[g]; }).filter(Boolean);
    hello.textContent = list.length ? '歡迎回來，' + list.join('、') + '！' : '歡迎來到學習群島！';
  }

  // 右上角永遠可見的探險家控制（大廳）：點卡片即可換人
  if (UI && UI.mountPlayerChrome) {
    UI.mountPlayerChrome({
      note: '英文／數學上下學期皆為建議進度切分，非教育部官方學期表。',
      onSwitch: function () { refreshContinue(); },
      onSave: function () { refreshContinue(); }
    });
  }
})();
