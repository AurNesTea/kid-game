/* 國小英語群島 — 原創探險小夥伴（自製 SVG，非官方角色） */
(function () {
  'use strict';

  // 每隻小夥伴：屬性色、名字、招呼語。外型都是自己設計的圓滾滾造型。
  var LIST = [
    { id: 'chirp',  name: '啾啾星', type: '電', color: '#ffd23f', dark: '#e0a800', hi: 'Hello! 一起說英文吧！' },
    { id: 'pebble', name: '叮叮石', type: '岩', color: '#a8a29e', dark: '#78716c', hi: 'One, two, three! 來數數！' },
    { id: 'ember',  name: '焰糰子', type: '火', color: '#ff8c42', dark: '#e0601a', hi: 'Hi! 我最愛我的家人！' },
    { id: 'sprout', name: '芽芽豆', type: '草', color: '#7bd389', dark: '#3f9f55', hi: 'Yummy! 去吃好吃的！' },
    { id: 'drop',   name: '波波滴', type: '水', color: '#5ab0f0', dark: '#2b7cc4', hi: 'Let\u2019s go to school!' },
    { id: 'puff',   name: '咻咻雲', type: '飛', color: '#8be3f0', dark: '#3fb6c9', hi: 'It\u2019s sunny today!' },
    { id: 'boing',  name: '蹦蹦彈', type: '妖', color: '#ff8fc8', dark: '#e0559c', hi: 'Jump! Run! 動起來！' },
    { id: 'luna',   name: '夢夢月', type: '超', color: '#b18cf2', dark: '#7c4fd6', hi: 'I can say it! 說成句子！' },
    { id: 'swirl',  name: '咕咕螺', type: '地', color: '#c9a46a', dark: '#8f6b35', hi: '再複習一次，更厲害！' }
  ];
  var BY_ID = {};
  LIST.forEach(function (c) { BY_ID[c.id] = c; });

  // 島嶼 → 小夥伴（英文島 + 數學島共用原創角色）
  var ISLAND = {
    hello: 'chirp', numbers: 'pebble', family: 'ember', food: 'sprout',
    school: 'drop', weather: 'puff', verbs: 'boing', patterns: 'luna', review: 'swirl',
    // 數學群島
    count: 'pebble', calc: 'chirp', apply: 'ember', shape: 'sprout',
    measure: 'drop', frac: 'luna'
  };

  function eyes(mood, y, gap, cx) {
    cx = cx || 50; gap = gap || 12; y = y || 52;
    var L = cx - gap, R = cx + gap;
    if (mood === 'happy') {
      return '<path d="M' + (L - 5) + ' ' + y + ' Q' + L + ' ' + (y - 6) + ' ' + (L + 5) + ' ' + y + '" stroke="#2b2320" stroke-width="3" fill="none" stroke-linecap="round"/>' +
             '<path d="M' + (R - 5) + ' ' + y + ' Q' + R + ' ' + (y - 6) + ' ' + (R + 5) + ' ' + y + '" stroke="#2b2320" stroke-width="3" fill="none" stroke-linecap="round"/>';
    }
    return '<ellipse cx="' + L + '" cy="' + y + '" rx="4.2" ry="5.4" fill="#2b2320"/>' +
           '<ellipse cx="' + R + '" cy="' + y + '" rx="4.2" ry="5.4" fill="#2b2320"/>' +
           '<circle cx="' + (L + 1.5) + '" cy="' + (y - 2) + '" r="1.6" fill="#fff"/>' +
           '<circle cx="' + (R + 1.5) + '" cy="' + (y - 2) + '" r="1.6" fill="#fff"/>';
  }
  function smile(y, cx, w) {
    cx = cx || 50; w = w || 6; y = y || 62;
    return '<path d="M' + (cx - w) + ' ' + y + ' Q' + cx + ' ' + (y + w) + ' ' + (cx + w) + ' ' + y + '" stroke="#2b2320" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
  }
  function blush(y, cx, gap, col) {
    cx = cx || 50; gap = gap || 21; y = y || 60;
    col = col || '#ffffff';
    return '<ellipse cx="' + (cx - gap) + '" cy="' + y + '" rx="4.5" ry="2.6" fill="' + col + '" opacity=".55"/>' +
           '<ellipse cx="' + (cx + gap) + '" cy="' + y + '" rx="4.5" ry="2.6" fill="' + col + '" opacity=".55"/>';
  }
  function feet(c, y) {
    y = y || 90;
    return '<ellipse cx="38" cy="' + y + '" rx="8" ry="4.5" fill="' + c + '"/>' +
           '<ellipse cx="62" cy="' + y + '" rx="8" ry="4.5" fill="' + c + '"/>';
  }
  function shadow() {
    return '<ellipse cx="50" cy="95" rx="26" ry="3.5" fill="#000" opacity=".12"/>';
  }
  function star(cx, cy, r, fill) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5;
      var rr = i % 2 ? r * 0.45 : r;
      pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return '<polygon points="' + pts.join(' ') + '" fill="' + fill + '" stroke="#2b2320" stroke-width="1.5" stroke-linejoin="round"/>';
  }

  // 0–100 方格內的身體
  var BODY = {
    // 電：圓滾小雞，頭頂一根星星天線、小翅膀、橘色小嘴
    chirp: function (c, m) {
      return shadow() + feet('#f08a24') +
        '<path d="M50 30 Q47 18 52 10" stroke="#2b2320" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        star(53, 9, 7, '#fff3a0') +
        '<circle cx="50" cy="58" r="32" fill="' + c.color + '" stroke="' + c.dark + '" stroke-width="2.5"/>' +
        '<ellipse cx="50" cy="70" rx="17" ry="13" fill="#fff6c9"/>' +
        '<path d="M19 58 Q10 62 16 72 Q22 70 24 64 Z" fill="' + c.dark + '"/>' +
        '<path d="M81 58 Q90 62 84 72 Q78 70 76 64 Z" fill="' + c.dark + '"/>' +
        eyes(m, 50) + '<path d="M45 59 L55 59 L50 65 Z" fill="#f08a24" stroke="#c2620f" stroke-width="1.2" stroke-linejoin="round"/>';
    },
    // 岩：方圓石頭，頭上兩顆水晶，身上有數點刻痕
    pebble: function (c, m) {
      return shadow() + feet(c.dark) +
        '<polygon points="38,30 44,12 50,30" fill="#9be7ff" stroke="#2b7cc4" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<polygon points="52,30 60,16 64,30" fill="#c9b8ff" stroke="#7c4fd6" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<rect x="18" y="28" width="64" height="62" rx="24" fill="' + c.color + '" stroke="' + c.dark + '" stroke-width="2.5"/>' +
        '<circle cx="28" cy="78" r="2.4" fill="' + c.dark + '"/><circle cx="35" cy="82" r="2.4" fill="' + c.dark + '"/><circle cx="72" cy="78" r="2.4" fill="' + c.dark + '"/>' +
        eyes(m, 54) + smile(66) + blush(64, 50, 22, '#ffd1dc');
    },
    // 火：麻糬糰子，頭頂三撮小火苗
    ember: function (c, m) {
      return shadow() + feet(c.dark) +
        '<path d="M36 34 Q30 20 38 12 Q40 22 44 26 Q46 12 54 6 Q54 20 58 26 Q62 16 68 16 Q68 28 62 36 Z" fill="#ffd23f" stroke="#e0601a" stroke-width="2" stroke-linejoin="round"/>' +
        '<ellipse cx="50" cy="62" rx="35" ry="29" fill="' + c.color + '" stroke="' + c.dark + '" stroke-width="2.5"/>' +
        '<ellipse cx="50" cy="72" rx="20" ry="11" fill="#ffe0c2"/>' +
        eyes(m, 56) + smile(66) + blush(64, 50, 24, '#fff0a8');
    },
    // 草：豆子形，頭頂兩片嫩芽葉子當耳朵
    sprout: function (c, m) {
      return shadow() + feet(c.dark) +
        '<path d="M50 30 Q50 20 50 16" stroke="' + c.dark + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M50 18 Q34 4 26 16 Q38 26 50 18 Z" fill="#a7e86b" stroke="' + c.dark + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M50 18 Q66 4 74 16 Q62 26 50 18 Z" fill="#a7e86b" stroke="' + c.dark + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M50 28 C76 28 84 50 80 66 C76 84 62 92 50 92 C38 92 24 84 20 66 C16 50 24 28 50 28 Z" fill="' + c.color + '" stroke="' + c.dark + '" stroke-width="2.5"/>' +
        '<ellipse cx="38" cy="44" rx="6" ry="3.5" fill="#fff" opacity=".45"/>' +
        eyes(m, 56) + smile(67) + blush(65, 50, 21, '#ffd1dc');
    },
    // 水：水滴身體，兩側小鰭，頭頂捲浪
    drop: function (c, m) {
      return shadow() + feet(c.dark) +
        '<path d="M50 12 C58 30 82 44 82 64 C82 82 68 92 50 92 C32 92 18 82 18 64 C18 44 42 30 50 12 Z" fill="' + c.color + '" stroke="' + c.dark + '" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M44 28 Q52 22 56 30 Q50 30 48 36" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M18 66 Q6 62 8 74 Q14 74 20 72 Z" fill="' + c.dark + '"/><path d="M82 66 Q94 62 92 74 Q86 74 80 72 Z" fill="' + c.dark + '"/>' +
        '<ellipse cx="50" cy="76" rx="16" ry="9" fill="#d9f0ff"/>' +
        eyes(m, 58) + smile(68) + blush(66, 50, 22, '#ffd1dc');
    },
    // 飛：蓬蓬雲朵，小翅膀，一條彩虹尾巴
    puff: function (c, m) {
      return shadow() +
        '<path d="M80 74 Q94 70 96 58" stroke="#ff8c42" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M80 78 Q96 76 99 62" stroke="#ffd23f" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<path d="M78 82 Q96 82 100 68" stroke="#7bd389" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<g fill="#ffffff" stroke="' + c.dark + '" stroke-width="2.5">' +
        '<circle cx="34" cy="56" r="18"/><circle cx="52" cy="44" r="20"/><circle cx="68" cy="58" r="17"/><rect x="22" y="56" width="58" height="28" rx="14"/></g>' +
        '<g fill="#ffffff"><circle cx="34" cy="56" r="15.5"/><circle cx="52" cy="44" r="17.5"/><circle cx="68" cy="58" r="14.5"/><rect x="24" y="58" width="54" height="24" rx="12"/></g>' +
        '<path d="M22 60 Q8 50 10 66 Q16 66 22 66 Z" fill="' + c.color + '"/>' +
        '<path d="M80 50 Q90 40 92 54 Q86 56 80 58 Z" fill="' + c.color + '"/>' +
        eyes(m, 60, 11) + smile(69, 50, 5) + blush(67, 50, 19, '#ffb3d1');
    },
    // 妖：站在彈簧上的圓球，頭頂愛心
    boing: function (c, m) {
      return shadow() +
        '<path d="M40 92 L60 88 L40 84 L60 80 L40 76" stroke="#8a8f98" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<ellipse cx="50" cy="93" rx="13" ry="3" fill="#8a8f98"/>' +
        '<path d="M50 22 C46 14 36 16 40 24 L50 32 L60 24 C64 16 54 14 50 22 Z" fill="#ff4f8b" stroke="#c22a63" stroke-width="1.6"/>' +
        '<circle cx="50" cy="52" r="27" fill="' + c.color + '" stroke="' + c.dark + '" stroke-width="2.5"/>' +
        '<path d="M24 52 Q14 46 16 38" stroke="' + c.dark + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M76 52 Q86 46 84 38" stroke="' + c.dark + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        eyes(m, 50, 10) + smile(60, 50, 5) + blush(58, 50, 18, '#ffffff');
    },
    // 超：漂浮小球，彎月角、額頭小寶石、尾巴是一顆小星
    luna: function (c, m) {
      return '<ellipse cx="50" cy="96" rx="20" ry="3" fill="#000" opacity=".10"/>' +
        '<path d="M30 30 Q22 14 36 8 Q30 18 40 28 Z" fill="#ffe48a" stroke="#d6a400" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<circle cx="50" cy="54" r="30" fill="' + c.color + '" stroke="' + c.dark + '" stroke-width="2.5"/>' +
        '<polygon points="50,30 55,36 50,42 45,36" fill="#7df0d6" stroke="#2a9d8f" stroke-width="1.4"/>' +
        '<path d="M50 84 Q50 90 44 92" stroke="' + c.dark + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        star(42, 92, 5, '#ffe48a') +
        eyes(m, 54, 11) + smile(65, 50, 5) + blush(62, 50, 20, '#ffd1f0');
    },
    // 地：背著螺旋殼的小蝸牛（螺旋＝一圈圈複習）
    swirl: function (c, m) {
      return shadow() +
        '<path d="M14 88 Q12 64 30 58 L78 58 Q90 60 90 76 Q90 90 76 90 Z" fill="#ffe0b0" stroke="' + c.dark + '" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<circle cx="56" cy="52" r="28" fill="' + c.color + '" stroke="' + c.dark + '" stroke-width="2.5"/>' +
        '<path d="M56 52 m-4 0 a4 4 0 1 1 8 0 a9 9 0 1 1 -18 0 a14 14 0 1 1 28 0 a19 19 0 1 1 -38 0" stroke="' + c.dark + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<path d="M20 64 Q16 46 12 40" stroke="' + c.dark + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<path d="M26 62 Q26 46 24 38" stroke="' + c.dark + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
        '<circle cx="12" cy="38" r="3.5" fill="#ffd23f" stroke="' + c.dark + '" stroke-width="1.4"/>' +
        '<circle cx="24" cy="36" r="3.5" fill="#ffd23f" stroke="' + c.dark + '" stroke-width="1.4"/>' +
        eyes(m, 76, 7, 26) + smile(83, 26, 3.5);
    }
  };

  function get(id) { return BY_ID[id] || BY_ID.chirp; }

  function body(id, mood) {
    var c = get(id);
    return (BODY[c.id] || BODY.chirp)(c, mood || 'normal');
  }

  // 放進另一張 SVG 裡（像貼紙一樣），x,y 為左上角
  function companionAt(id, x, y, scale, mood) {
    var s = scale || 1;
    return '<g class="buddy-g" data-buddy="' + get(id).id + '" transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + body(id, mood) + '</g>';
  }

  // 獨立 SVG
  function companionSvg(id, opts) {
    opts = opts || {};
    var c = get(id);
    var size = opts.size || 72;
    var cls = 'buddy' + (opts.className ? ' ' + opts.className : '');
    var label = opts.decorative === false ? ' role="img" aria-label="' + c.name + '"' : ' aria-hidden="true"';
    return '<svg class="' + cls + '" data-buddy="' + c.id + '" viewBox="0 0 100 100" width="' + size + '" height="' + size + '"' + label + ' xmlns="http://www.w3.org/2000/svg">' + body(id, opts.mood) + '</svg>';
  }

  // 雙色「夥伴球」：上綠下米、波浪中線、中間一顆星（自製圖樣）
  function partnerBall(size, filled) {
    size = size || 22;
    var top = filled === false ? '#cfd8dc' : '#2a9d8f';
    return '<svg class="partner-ball" viewBox="0 0 40 40" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<path d="M3 20 A17 17 0 0 1 37 20 Q32 17 28 20 Q24 23 20 20 Q16 17 12 20 Q8 23 3 20 Z" fill="' + top + '"/>' +
      '<path d="M3 20 Q8 23 12 20 Q16 17 20 20 Q24 23 28 20 Q32 17 37 20 A17 17 0 0 1 3 20 Z" fill="#fff3e0"/>' +
      '<circle cx="20" cy="20" r="17" fill="none" stroke="#3a2f2a" stroke-width="2.2"/>' +
      star(20, 20.5, 7, '#ffd23f') + '</svg>';
  }

  function forIsland(islandId) { return get(ISLAND[islandId] || 'chirp'); }

  // 點一下小夥伴就會跳
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.buddy, .buddy-g');
    if (!t) return;
    t.classList.remove('boing');
    // reflow 讓動畫重播
    void (t.getBoundingClientRect && t.getBoundingClientRect());
    t.classList.add('boing');
    setTimeout(function () { t.classList.remove('boing'); }, 650);
  });

  window.Companions = {
    list: LIST,
    get: get,
    forIsland: forIsland,
    islandMap: ISLAND,
    companionSvg: companionSvg,
    companionAt: companionAt,
    partnerBall: partnerBall,
    random: function () { return LIST[Math.floor(Math.random() * LIST.length)]; }
  };
})();
