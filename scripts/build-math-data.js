#!/usr/bin/env node
/**
 * Build assets/math-data.js — Taiwan 國小數學 suggested semester progression
 * (common textbook-style, not an official MoE timetable).
 */
'use strict';

var fs = require('fs');
var path = require('path');

var ISLANDS = [
  { id: 'count', name: '數與量島', tagline: '數一數、位值、比大小', symbol: '🔢', color: '#e9c46a', topics: ['數', '位值'] },
  { id: 'calc', name: '計算島', tagline: '加減乘除一步一步算', symbol: '➕', color: '#f4a261', topics: ['計算'] },
  { id: 'apply', name: '應用題島', tagline: '先讀懂再算', symbol: '📖', color: '#e76f51', topics: ['應用題'] },
  { id: 'shape', name: '圖形島', tagline: '形狀、周長、面積', symbol: '⬡', color: '#2a9d8f', topics: ['圖形'] },
  { id: 'measure', name: '量測島', tagline: '長度、時間、錢、容量', symbol: '📏', color: '#457b9d', topics: ['量測'] },
  { id: 'frac', name: '分數小數島', tagline: '分數、小數、百分率', symbol: '½', color: '#9b5de5', topics: ['分數', '小數'] },
  { id: 'review', name: '複習島', tagline: '小小複習，記得更牢', symbol: '🔁', color: '#6c757d', topics: [], review: true }
];

function L(id, name, tagline, island, modes, problems, extra) {
  var o = {
    id: id,
    name: name,
    tagline: tagline,
    island: island,
    type: 'math',
    modes: modes,
    problems: problems,
    review: !!(extra && extra.review)
  };
  if (extra && extra.topic) o.topic = extra.topic;
  return o;
}

function scaffold(opts) {
  return Object.assign({ kind: 'scaffold' }, opts);
}
function word(opts) {
  return Object.assign({ kind: 'word' }, opts);
}
function errorP(opts) {
  return Object.assign({ kind: 'error' }, opts);
}
function visual(opts) {
  return Object.assign({ kind: 'visual' }, opts);
}
function recap(opts) {
  return Object.assign({ kind: 'recap' }, opts);
}

function choiceWhat(correct, wrongs) {
  return [{ text: correct, correct: true }].concat(wrongs.map(function (t) {
    return { text: t, correct: false };
  }));
}

var BANK_HELPERS = {
  L: L,
  scaffold: scaffold,
  word: word,
  errorP: errorP,
  visual: visual,
  recap: recap,
  choiceWhat: choiceWhat
};

/** Curriculum: 12 routes with playable lessons */
var ROUTES = {};

// ---- 1-1 ----
ROUTES['1-1'] = {
  meta: { label: '一年級上學期', track: '課綱進度', focus: '10 以內數與加減、分與合、形狀認識', units: 4 },
  lessons: [
    L('m11-count1', '數到 10', '具體物 → 數字', 'count', ['visual', 'scaffold'], [
      visual({
        id: 'v1', prompt: '數一數有幾顆蘋果？', items: ['🍎', '🍎', '🍎', '🍎', '🍎'],
        answer: '5', answers: ['5', '五'],
        hints: ['一根手指對一顆蘋果，數過去。', '一二三四五——一共 5 顆。', '可以寫成數字 5。', '答案是 5。'],
        companionAsk: '一顆一顆數，不要跳喔！'
      }),
      visual({
        id: 'v2', prompt: '數一數有幾顆星星？', items: ['⭐', '⭐', '⭐', '⭐', '⭐', '⭐', '⭐'],
        answer: '7', answers: ['7', '七'],
        hints: ['從左邊數到右邊。', '數到 7 顆了。', '寫成數字 7。', '答案是 7。'],
        companionAsk: '比 5 多一點點，是幾？'
      }),
      scaffold({
        id: 's1', prompt: '哪個數字比較大？', expression: '比較 3 和 8',
        answer: '8', answers: ['8', '八'],
        ask: '3 和 8，哪個比較大？',
        hints: ['想想哪一邊比較多。', '8 比 3 大。', '可以畫 8 個圓、3 個圓來比。', '答案是 8。'],
        pitfall: 'compare'
      }),
      scaffold({
        id: 's2', prompt: '7 的前面是幾？', expression: '7 的前一個數',
        answer: '6', answers: ['6', '六'],
        hints: ['數一數：…5、6、7…', '7 再少 1 就是前面。', '答案是 6。', '答案是 6。'],
        companionAsk: '往前倒退一格是幾？'
      })
    ]),
    L('m11-calc1', '10 以內加法', '合起來有多少', 'calc', ['scaffold', 'error'], [
      scaffold({
        id: 's1', prompt: '算算看：3 + 4 = ?', expression: '3 + 4', answer: '7', answers: ['7'],
        visuals: ['🔵🔵🔵', '＋', '🟢🟢🟢🟢'],
        steps: [
          { ask: '左邊有幾個？', answer: '3', tip: '先數左邊' },
          { ask: '右邊有幾個？', answer: '4', tip: '再數右邊' },
          { ask: '合起來呢？', answer: '7', tip: '全部數一次' }
        ],
        hints: ['把兩堆合在一起數。', '3 再往後數 4 個：4、5、6、7。', '3+4=7。', '答案是 7。'],
        companionAsk: '先數這一堆，再數那一堆～'
      }),
      scaffold({
        id: 's2', prompt: '算算看：5 + 2 = ?', expression: '5 + 2', answer: '7', answers: ['7'],
        hints: ['從 5 再往後數兩下。', '5、6、7。', '5+2=7。', '答案是 7。']
      }),
      scaffold({
        id: 's3', prompt: '算算看：6 + 3 = ?', expression: '6 + 3', answer: '9', answers: ['9'],
        hints: ['從 6 往後數 3 下。', '7、8、9。', '6+3=9。', '答案是 9。']
      }),
      errorP({
        id: 'e1', title: '哪一步算錯了？', expression: '2 + 5',
        correctAnswer: '7',
        lines: [
          { text: '先寫 2', ok: true },
          { text: '再加 5', ok: true },
          { text: '從 2 往後數：3、4、5、6 → 說答案是 6', ok: false, why: '往後數 5 下應該數到 7，這裡只數了 4 下。' },
          { text: '寫下 6', ok: false, why: '因為上一步數錯，答案跟著錯。' }
        ],
        wrongIndex: 2,
        why: '從 2 往後數 5 下：3、4、5、6、7，答案是 7。'
      })
    ]),
    L('m11-calc2', '10 以內減法', '拿走剩下多少', 'calc', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '算算看：8 − 3 = ?', expression: '8 − 3', answer: '5', answers: ['5'],
        visuals: ['🍎🍎🍎🍎🍎🍎🍎🍎', '拿走 3 顆'],
        hints: ['從 8 往前倒退 3 下。', '7、6、5。', '8−3=5。', '答案是 5。'],
        companionAsk: '拿走以後，還剩幾顆？'
      }),
      scaffold({
        id: 's2', prompt: '算算看：9 − 4 = ?', expression: '9 − 4', answer: '5', answers: ['5'],
        hints: ['從 9 倒退 4 下。', '8、7、6、5。', '9−4=5。', '答案是 5。']
      }),
      word({
        id: 'w1',
        story: '桌上有 7 顆糖，小華吃掉 2 顆。還剩幾顆？',
        askWhat: '題目要我們求什麼？',
        whatOptions: choiceWhat('還剩幾顆糖', ['小華吃了幾顆', '原本有幾顆糖']),
        askOp: '該怎麼算？',
        opOptions: choiceWhat('7 − 2', ['7 + 2', '2 − 7']),
        answer: '5', answers: ['5'],
        hints: ['「還剩」通常用減法。', '7 減掉 2。', '7−2=5。', '還剩 5 顆。'],
        explain: '求剩下的 → 7−2=5。'
      })
    ]),
    L('m11-shape1', '認識形狀', '圓、三角、方形', 'shape', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '三個角、三條邊的是什麼形？', expression: '形狀',
        answer: '三角形', answers: ['三角形', '三角'],
        hints: ['數一數有幾個尖尖的角。', '三個角就是三角形。', '像屋頂、三明治的形狀。', '答案是三角形。']
      }),
      scaffold({
        id: 's2', prompt: '像球、像輪子的形狀叫？', expression: '形狀',
        answer: '圓形', answers: ['圓形', '圓'],
        hints: ['沒有角、邊是彎彎的。', '圓形。', '答案是圓形。', '答案是圓形。']
      }),
      word({
        id: 'w1',
        story: '時鐘的臉、硬幣正面，看起來最像哪一種形狀？',
        askWhat: '題目在問什麼？',
        whatOptions: choiceWhat('它們像什麼形狀', ['時鐘幾點', '硬幣值多少錢']),
        askOp: '你覺得是？',
        opOptions: choiceWhat('圓形', ['三角形', '正方形']),
        answer: '圓形', answers: ['圓形', '圓'],
        hints: ['摸看看有沒有尖角。', '邊是圓圓的。', '是圓形。', '答案是圓形。'],
        explain: '時鐘和硬幣都是圓形。'
      })
    ]),
    L('m11-review1', '小小複習', '今天學到什麼？', 'review', ['recap'], [
      recap({
        id: 'r1', title: '一年級上・小小複習',
        questions: [
          { q: '4 + 5 = ?', a: '9', answers: ['9'], tip: '合起來數' },
          { q: '10 − 6 = ?', a: '4', answers: ['4'], tip: '拿走 6 還剩？' },
          { q: '比 2 大的是？ 1 或 5', a: '5', answers: ['5'], tip: '哪個比較多' }
        ]
      })
    ], { review: true })
  ]
};

// ---- 1-2 ----
ROUTES['1-2'] = {
  meta: { label: '一年級下學期', track: '課綱進度', focus: '20 以內加減、順序、長度比較、整點時間', units: 5 },
  lessons: [
    L('m12-count1', '數到 20', '十幾的數', 'count', ['scaffold', 'visual'], [
      visual({
        id: 'v1', prompt: '數一數一共幾個？', items: Array(13).fill('🔵'),
        answer: '13', answers: ['13', '十三'],
        hints: ['先數 10 個，再數剩下的。', '10 再加 3 是 13。', '寫成 13。', '答案是 13。'],
        companionAsk: '十個一組會比較好數喔！'
      }),
      scaffold({
        id: 's1', prompt: '15 裡面有幾個十？幾個一？', expression: '15 的位值',
        answer: '1個十和5個一', answers: ['1個十和5個一', '1十5一', '1個十5個一', '十五'],
        acceptAny: ['1', '十', '5'],
        freeAnswer: true,
        check: 'place15',
        hints: ['十位上的數字是幾個十。', '15＝1 個十 + 5 個一。', '可以寫：1個十和5個一。', '答案：1 個十和 5 個一。'],
        companionAsk: '十五，十位是幾？'
      }),
      scaffold({
        id: 's2', prompt: '18 和 12，哪個比較大？', expression: '比較',
        answer: '18', answers: ['18'],
        hints: ['先比十位。', '都是 1 個十，再比個位：8>2。', '18 比較大。', '答案是 18。']
      })
    ]),
    L('m12-calc1', '20 以內進位加法', '滿十進位', 'calc', ['scaffold', 'error'], [
      scaffold({
        id: 's1', prompt: '8 + 5 = ?', expression: '8 + 5', answer: '13', answers: ['13'],
        steps: [
          { ask: '8 再加幾會滿 10？', answer: '2', tip: '湊十' },
          { ask: '5 拿掉 2 還剩？', answer: '3', tip: '剩下的' },
          { ask: '10 + 3 = ?', answer: '13', tip: '合起來' }
        ],
        hints: ['先把 8 湊成 10（需要 2）。', '5 裡拿出 2，剩 3。', '10+3=13。', '答案是 13。'],
        pitfall: 'regroup',
        companionAsk: '先湊成十會比較好算！'
      }),
      scaffold({
        id: 's2', prompt: '9 + 7 = ?', expression: '9 + 7', answer: '16', answers: ['16'],
        hints: ['9 湊十需要 1，7 剩 6。', '10+6=16。', '9+7=16。', '答案是 16。'],
        pitfall: 'regroup'
      }),
      errorP({
        id: 'e1', title: '哪一行想錯了？', expression: '7 + 6',
        correctAnswer: '13',
        lines: [
          { text: '7 湊成 10 需要再加 3', ok: true },
          { text: '6 拿出 3，還剩 3', ok: true },
          { text: '所以 10 + 3 = 12（寫錯了）', ok: false, why: '10+3 應該是 13，不是 12。' },
          { text: '答案寫 12', ok: false, why: '上一步加法算錯。' }
        ],
        wrongIndex: 2,
        why: '湊十之後是 10+3=13。'
      })
    ]),
    L('m12-calc2', '20 以內退位減法', '不夠就向十位借', 'calc', ['scaffold', 'error', 'word'], [
      scaffold({
        id: 's1', prompt: '14 − 6 = ?', expression: '14 − 6', answer: '8', answers: ['8'],
        steps: [
          { ask: '個位 4 夠不夠減 6？', answer: '不夠', tip: '4<6' },
          { ask: '向十位借 1 後，個位變成？', answer: '14', tip: '變成 14 再減' },
          { ask: '14 − 6 = ?', answer: '8', tip: '算個位' }
        ],
        hints: ['個位不夠減，要借十。', '14 就是 1 個十和 4；借完用 14−6。', '14−6=8。', '答案是 8。'],
        pitfall: 'borrow',
        companionAsk: '個位不夠減時，要記得借喔！'
      }),
      scaffold({
        id: 's2', prompt: '15 − 8 = ?', expression: '15 − 8', answer: '7', answers: ['7'],
        hints: ['個位不夠，把 15 想成 15−8。', '15−8=7。', '也可以：8+(?=15) → 7。', '答案是 7。'],
        pitfall: 'borrow'
      }),
      errorP({
        id: 'e1', title: '直式哪一步錯了？', expression: '13 − 5',
        correctAnswer: '8',
        lines: [
          { text: '個位 3 − 5 不夠，向十位借 1', ok: true },
          { text: '個位變成 13，13 − 5 = 8', ok: true },
          { text: '十位原來是 1，借走後變成 0', ok: true },
          { text: '所以答案寫成 18', ok: false, why: '十位已借光是 0，答案應是 8，不是 18。' }
        ],
        wrongIndex: 3,
        why: '借位後十位是 0，個位 8，答案是 8。'
      }),
      word({
        id: 'w1',
        story: '小美有 16 張貼紙，送同學 9 張。她還剩幾張？',
        askWhat: '要求什麼？',
        whatOptions: choiceWhat('還剩幾張貼紙', ['送了幾張', '原本有幾張']),
        askOp: '算式選哪個？',
        opOptions: choiceWhat('16 − 9', ['16 + 9', '9 − 16']),
        answer: '7', answers: ['7'],
        hints: ['「還剩」→ 減法。', '個位不夠要退位。', '16−9=7。', '還剩 7 張。'],
        explain: '16−9=7。'
      })
    ]),
    L('m12-measure1', '長度與整點', '比長短、幾點整', 'measure', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '鉛筆比橡皮長。誰比較長？', expression: '比較長度',
        answer: '鉛筆', answers: ['鉛筆'],
        hints: ['題目說鉛筆比橡皮長。', '所以鉛筆比較長。', '答案是鉛筆。', '答案是鉛筆。']
      }),
      scaffold({
        id: 's2', prompt: '時針指 3，分針指 12，現在幾點？', expression: '整點',
        answer: '3點', answers: ['3點', '3', '三點', '3:00', '3點整'],
        hints: ['分針在 12 是整點。', '時針指幾就是幾點。', '現在是 3 點。', '答案是 3 點。']
      }),
      word({
        id: 'w1',
        story: '媽媽說「現在 7 點整，該起床了」。分針應該指在哪裡？',
        askWhat: '在問什麼？',
        whatOptions: choiceWhat('分針指在哪個數字', ['現在幾點', '該不該起床']),
        askOp: '整點時分針指？',
        opOptions: choiceWhat('12', ['6', '7']),
        answer: '12', answers: ['12'],
        hints: ['整點時分針在正上方。', '正上方是 12。', '答案是 12。', '答案是 12。'],
        explain: '整點時分針指著 12。'
      })
    ]),
    L('m12-review1', '小小複習', '下學期重點回顧', 'review', ['recap'], [
      recap({
        id: 'r1', title: '一年級下・小小複習',
        questions: [
          { q: '9 + 6 = ?', a: '15', answers: ['15'], tip: '湊十' },
          { q: '14 − 7 = ?', a: '7', answers: ['7'], tip: '退位減' },
          { q: '12 和 15 哪個大？', a: '15', answers: ['15'], tip: '比個位' }
        ]
      })
    ], { review: true })
  ]
};

// ---- 2-1 ----
ROUTES['2-1'] = require('./math-banks/route-2-1')(BANK_HELPERS);

// ---- 2-2 ----
ROUTES['2-2'] = require('./math-banks/route-2-2')(BANK_HELPERS);

// ---- 3-1 ----
ROUTES['3-1'] = {
  meta: { label: '三年級上學期', track: '課綱進度', focus: '多位數乘除、分數初步、周長', units: 5 },
  lessons: [
    L('m31-calc1', '兩位數×一位數', '直式乘法', 'calc', ['scaffold', 'error'], [
      scaffold({
        id: 's1', prompt: '23 × 4 = ?', expression: '23 × 4', answer: '92', answers: ['92'],
        steps: [
          { ask: '個位 3×4=？', answer: '12', tip: '先乘個位' },
          { ask: '寫下 2，進位 1。十位 2×4=8，再加進位？', answer: '9', tip: '8+1' }
        ],
        hints: ['個位 3×4=12，寫 2 進 1。', '十位 2×4=8，加進位 1 得 9。', '答案 92。', '答案是 92。'],
        pitfall: 'regroup'
      }),
      errorP({
        id: 'e1', title: '乘法直式錯在哪？', expression: '15 × 6',
        correctAnswer: '90',
        lines: [
          { text: '個位 5×6=30，寫 0 進 3', ok: true },
          { text: '十位 1×6=6，忘記加進位，寫 6', ok: false, why: '要加進位：6+3=9，答案應是 90。' },
          { text: '寫成 60', ok: false, why: '漏加進位。' }
        ],
        wrongIndex: 1,
        why: '乘法進位常被忘掉；15×6=90。'
      })
    ]),
    L('m31-calc2', '除法（無餘數）', '想想乘法反過來', 'calc', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '36 ÷ 4 = ?', expression: '36 ÷ 4', answer: '9', answers: ['9'],
        hints: ['4 的幾倍是 36？', '4×9=36。', '答案 9。', '答案是 9。']
      }),
      word({
        id: 'w1',
        story: '48 本故事書，每層書架放 6 本，需要幾層？',
        askWhat: '求什麼？',
        whatOptions: choiceWhat('需要幾層書架', ['一共幾本書', '每層幾本']),
        askOp: '算式？',
        opOptions: choiceWhat('48 ÷ 6', ['48 − 6', '48 × 6']),
        answer: '8', answers: ['8'],
        hints: ['總數÷每層＝層數。', '6×8=48。', '需要 8 層。', '答案 8。'],
        explain: '48÷6=8。'
      })
    ]),
    L('m31-frac1', '分數初步', '一份一份的', 'frac', ['visual', 'scaffold', 'word'], [
      visual({
        id: 'v1', prompt: '披薩切成 4 等份，吃了 1 份，吃了全部的幾分之幾？',
        items: ['🍕¹⁄₄'],
        answer: '1/4', answers: ['1/4', '¼', '四分之一', '1／4'],
        hints: ['全部是 4 等份。', '吃了其中 1 份。', '寫成 1/4。', '答案是 1/4。'],
        companionAsk: '分母是全部幾份？分子是吃了幾份？'
      }),
      scaffold({
        id: 's1', prompt: '把一條绳子分成 3 等份，每份是全長的？', expression: '單位分數',
        answer: '1/3', answers: ['1/3', '⅓', '三分之一', '1／3'],
        hints: ['等分成 3 份，一份就是 1/3。', '答案 1/3。', '答案是 1/3。', '答案是 1/3。']
      }),
      word({
        id: 'w1',
        story: '蛋糕切成 8 等份，小華吃 3 份。他吃了蛋糕的幾分之幾？',
        askWhat: '求什麼？',
        whatOptions: choiceWhat('吃了幾分之幾', ['切成幾份', '還剩幾份']),
        askOp: '怎麼寫？',
        opOptions: choiceWhat('3/8', ['8/3', '3/5']),
        answer: '3/8', answers: ['3/8', '⅜', '3／8'],
        hints: ['分母＝全部等份，分子＝吃的份數。', '全部 8，吃 3 → 3/8。', '答案 3/8。', '答案是 3/8。'],
        explain: '3/8。'
      })
    ]),
    L('m31-shape1', '周長', '繞一圈有多長', 'shape', ['scaffold', 'word', 'error'], [
      scaffold({
        id: 's1', prompt: '長方形長 8 公分、寬 3 公分，周長？', expression: '(8+3)×2',
        answer: '22', answers: ['22', '22公分'],
        hints: ['周長＝(長+寬)×2。', '8+3=11，11×2=22。', '也可以 8+3+8+3。', '答案 22 公分。'],
        pitfall: 'unit'
      }),
      errorP({
        id: 'e1', title: '周長哪步錯？', expression: '正方形邊長 5',
        correctAnswer: '20',
        lines: [
          { text: '正方形四邊一樣長', ok: true },
          { text: '周長 = 5 × 4', ok: true },
          { text: '算成 5 + 4 = 9', ok: false, why: '四邊是相乘（或加四次），不是 5+4。' }
        ],
        wrongIndex: 2,
        why: '正方形周長＝邊長×4＝20。'
      }),
      word({
        id: 'w1',
        story: '正方形花園一邊 6 公尺，圍籬要多長？',
        askWhat: '求什麼？',
        whatOptions: choiceWhat('圍籬長度（周長）', ['花園面積', '一邊多長']),
        askOp: '算式？',
        opOptions: choiceWhat('6 × 4', ['6 × 6', '6 + 4']),
        answer: '24', answers: ['24', '24公尺'],
        hints: ['圍一圈＝周長。', '6×4=24。', '注意單位是公尺。', '答案 24 公尺。'],
        explain: '6×4=24 公尺。',
        pitfall: 'unit'
      })
    ]),
    L('m31-review1', '小小複習', '乘除・分數・周長', 'review', ['recap'], [
      recap({
        id: 'r1', title: '三年級上・小小複習',
        questions: [
          { q: '14 × 5 = ?', a: '70', answers: ['70'], tip: '直式' },
          { q: '把蛋糕分 5 等份，一份是？', a: '1/5', answers: ['1/5', '⅕', '五分之一'], tip: '單位分數' },
          { q: '長 5、寬 2 的長方形周長？', a: '14', answers: ['14'], tip: '(5+2)×2' }
        ]
      })
    ], { review: true })
  ]
};

// ---- 3-2 ----
ROUTES['3-2'] = {
  meta: { label: '三年級下學期', track: '課綱進度', focus: '有餘數除法、分數加減、面積、小數初步', units: 5 },
  lessons: [
    L('m32-calc1', '有餘數的除法', '除不盡也沒關係', 'calc', ['scaffold', 'error', 'word'], [
      scaffold({
        id: 's1', prompt: '20 ÷ 6 = ? …… ?（商和餘數）', expression: '20 ÷ 6',
        answer: '3餘2', answers: ['3餘2', '3...2', '3……2', '3 餘 2', '商3餘2'],
        hints: ['6×3=18，還剩 2。', '商 3，餘數 2。', '餘數要比除數小。', '答案：3 餘 2。'],
        companionAsk: '還剩的要比「每次分幾」少喔！'
      }),
      errorP({
        id: 'e1', title: '餘數哪裡不對？', expression: '17 ÷ 5',
        correctAnswer: '3餘2',
        lines: [
          { text: '5×3=15', ok: true },
          { text: '17−15=2，所以餘 2', ok: true },
          { text: '有人寫成 2 餘 3', ok: false, why: '商和餘數寫反了；且餘數 3 雖小於 5，但 5×2+3=13≠17。' }
        ],
        wrongIndex: 2,
        why: '正確是商 3 餘 2。'
      }),
      word({
        id: 'w1',
        story: '23 位同學坐車，每輛車坐 4 人。需要幾輛車？（要全部坐下）',
        askWhat: '求什麼？',
        whatOptions: choiceWhat('至少需要幾輛車', ['每車坐幾人', '餘數是幾']),
        askOp: '怎麼想？',
        opOptions: choiceWhat('23÷4=5餘3，要再多 1 輛 → 6 輛', ['只要 5 輛就好', '23−4=19 輛']),
        answer: '6', answers: ['6', '6輛'],
        hints: ['有餘數時，還要多一輛才裝得下。', '5 輛坐 20 人，剩 3 人仍需一輛。', '共 6 輛。', '答案 6。'],
        explain: '有餘數的生活題：要進位多算 1 輛。'
      })
    ]),
    L('m32-frac1', '同分母分數加減', '分母不變，分子加減', 'frac', ['scaffold', 'error', 'word'], [
      scaffold({
        id: 's1', prompt: '2/5 + 1/5 = ?', expression: '2/5 + 1/5', answer: '3/5', answers: ['3/5', '⅗', '3／5'],
        hints: ['分母相同，分子相加。', '2+1=3，分母仍是 5。', '答案 3/5。', '答案是 3/5。']
      }),
      errorP({
        id: 'e1', title: '分數哪步錯？', expression: '3/8 + 2/8',
        correctAnswer: '5/8',
        lines: [
          { text: '分母都是 8，可以分子相加', ok: true },
          { text: '分子 3+2=5', ok: true },
          { text: '分母也加起來變成 16，寫成 5/16', ok: false, why: '同分母加減時分母不變。' }
        ],
        wrongIndex: 2,
        why: '常見迷思：分母一起加。正確是 5/8。'
      }),
      word({
        id: 'w1',
        story: '媽媽切披薩，哥哥吃 3/8，妹妹吃 2/8。兩人一共吃了幾分之幾？',
        askWhat: '求什麼？',
        whatOptions: choiceWhat('兩人一共吃了幾分之幾', ['誰吃比較多', '還剩幾份']),
        askOp: '算式？',
        opOptions: choiceWhat('3/8 + 2/8', ['3/8 − 2/8', '3/8 × 2/8']),
        answer: '5/8', answers: ['5/8', '⅝', '5／8'],
        hints: ['一共→加起來。', '同分母分子加。', '3+2=5 → 5/8。', '答案 5/8。'],
        explain: '3/8+2/8=5/8。'
      })
    ]),
    L('m32-shape1', '面積（平方公分）', '鋪滿有多少格', 'shape', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '長方形長 6 公分、寬 4 公分，面積？', expression: '6×4',
        answer: '24', answers: ['24', '24平方公分', '24cm²'],
        hints: ['面積＝長×寬。', '6×4=24。', '單位是平方公分。', '答案 24 平方公分。'],
        pitfall: 'unit',
        companionAsk: '周長和面積不一樣喔！'
      }),
      word({
        id: 'w1',
        story: '地磚每塊 1 平方公分。長 5、寬 3 的長方形要鋪幾塊？',
        askWhat: '求什麼？',
        whatOptions: choiceWhat('要鋪幾塊（面積）', ['地磚周長', '一邊多長']),
        askOp: '算式？',
        opOptions: choiceWhat('5 × 3', ['(5+3)×2', '5 + 3']),
        answer: '15', answers: ['15'],
        hints: ['鋪滿＝面積。', '別跟周長搞混。', '5×3=15。', '答案 15。'],
        explain: '面積 15 平方公分＝15 塊。',
        pitfall: 'unit'
      })
    ]),
    L('m32-frac2', '小數初步', '零點幾', 'frac', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '7/10 寫成小數是？', expression: '7/10', answer: '0.7', answers: ['0.7', '.7'],
        hints: ['十分之幾就是小數第一位。', '7/10=0.7。', '答案 0.7。', '答案是 0.7。']
      }),
      scaffold({
        id: 's2', prompt: '0.3 + 0.4 = ?', expression: '0.3+0.4', answer: '0.7', answers: ['0.7'],
        hints: ['對齊小數點後相加。', '3+4=7 → 0.7。', '答案 0.7。', '答案是 0.7。']
      }),
      word({
        id: 'w1',
        story: '一條繩子長 0.5 公尺，又接上 0.2 公尺。現在多長？',
        askWhat: '求什麼？',
        whatOptions: choiceWhat('接起來後的長度', ['原來多長', '接上多長']),
        askOp: '算式？',
        opOptions: choiceWhat('0.5 + 0.2', ['0.5 − 0.2', '0.5 × 0.2']),
        answer: '0.7', answers: ['0.7', '0.7公尺'],
        hints: ['接起來→加法。', '0.5+0.2=0.7。', '答案 0.7 公尺。', '答案是 0.7。'],
        explain: '0.5+0.2=0.7 公尺。'
      })
    ]),
    L('m32-review1', '小小複習', '餘數・分數・面積', 'review', ['recap'], [
      recap({
        id: 'r1', title: '三年級下・小小複習',
        questions: [
          { q: '25 ÷ 4 的餘數是？', a: '1', answers: ['1'], tip: '4×6=24' },
          { q: '4/7 − 1/7 = ?', a: '3/7', answers: ['3/7', '3／7'], tip: '分子減' },
          { q: '長 7 寬 3 面積？', a: '21', answers: ['21'], tip: '長×寬' }
        ]
      })
    ], { review: true })
  ]
};

// ---- 4-1 ----
ROUTES['4-1'] = require('./math-banks/route-4-1')(BANK_HELPERS);

// ---- 4-2 ----
ROUTES['4-2'] = require('./math-banks/route-4-2')(BANK_HELPERS);

// ---- 5-1 ----
ROUTES['5-1'] = {
  meta: { label: '五年級上學期', track: '課綱進度', focus: '因數倍數、分數乘除、小數乘除、體積', units: 5 },
  lessons: [
    L('m51-calc1', '因數與倍數', '能不能整除', 'calc', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '12 的因數有哪些？（由小到大，用逗號分隔）', expression: '因數',
        answer: '1,2,3,4,6,12', answers: ['1,2,3,4,6,12', '1, 2, 3, 4, 6, 12'],
        hints: ['能整除 12 的正整數。', '成對找：1×12、2×6、3×4。', '答案 1,2,3,4,6,12。', '答案是 1,2,3,4,6,12。']
      }),
      scaffold({
        id: 's2', prompt: '3 的倍數：3,6,9,… 下一個是？', expression: '倍數', answer: '12', answers: ['12'],
        hints: ['每次加 3。', '9 再加 3。', '答案 12。', '答案是 12。']
      }),
      word({
        id: 'w1',
        story: '老師要把 24 位同學平均分組，每組人數相同且大於 1。可以分成幾組？（舉一個可以的組數）',
        askWhat: '在問可行的分組',
        whatOptions: choiceWhat('24 的一個因數（作為組數）', ['24+1', '質數是什麼']),
        askOp: '例如？',
        opOptions: choiceWhat('8 組（每組 3 人）', ['5 組（除不盡）', '7 組（除不盡）']),
        answer: '8', answers: ['8', '8組', '2', '3', '4', '6', '12', '24'],
        hints: ['組數必須是 24 的因數。', '例如 8 組每組 3 人。', '也可以 6 組等。', '一個正確答案例如 8。'],
        explain: '能整除即可，例如 8。'
      })
    ]),
    L('m51-frac1', '分數乘法', '分子乘分子、分母乘分母', 'frac', ['scaffold', 'error', 'word'], [
      scaffold({
        id: 's1', prompt: '2/3 × 3/4 = ?（可約分）', expression: '2/3×3/4', answer: '1/2', answers: ['1/2', '½', '6/12'],
        hints: ['2×3 / 3×4 = 6/12。', '約分成 1/2。', '也可以先約分再乘。', '答案 1/2。']
      }),
      errorP({
        id: 'e1', title: '分數乘法錯哪？', expression: '1/2 × 1/3',
        correctAnswer: '1/6',
        lines: [
          { text: '分子 1×1=1', ok: true },
          { text: '分母 2×3=6', ok: true },
          { text: '有人做成 1/2 + 1/3 = 5/6 卻當乘法答案', ok: false, why: '題目是乘法不是加法；1/2×1/3=1/6。' }
        ],
        wrongIndex: 2,
        why: '乘法和加法要分清。'
      }),
      word({
        id: 'w1',
        story: '一條繩子長 3/4 公尺，用掉其中的 1/3。用掉幾公尺？',
        askWhat: '求用掉的長度',
        whatOptions: choiceWhat('用掉幾公尺', ['還剩幾公尺', '繩子原長']),
        askOp: '算式？',
        opOptions: choiceWhat('3/4 × 1/3', ['3/4 − 1/3', '3/4 ÷ 1/3']),
        answer: '1/4', answers: ['1/4', '¼', '1／4'],
        hints: ['「其中的几分之几」→乘法。', '3/4×1/3=1/4。', '答案 1/4 公尺。', '答案是 1/4。'],
        explain: '3/4×1/3=1/4。'
      })
    ]),
    L('m51-calc2', '小數乘法', '先當整數乘再點小數點', 'calc', ['scaffold', 'error'], [
      scaffold({
        id: 's1', prompt: '1.2 × 0.3 = ?', expression: '1.2×0.3', answer: '0.36', answers: ['0.36'],
        hints: ['12×3=36。', '小數位共 1+1=2 位 → 0.36。', '答案 0.36。', '答案是 0.36。'],
        pitfall: 'place'
      }),
      errorP({
        id: 'e1', title: '小數點點錯了？', expression: '2.5 × 0.4',
        correctAnswer: '1.0',
        lines: [
          { text: '25×4=100', ok: true },
          { text: '小數位共 2 位，應是 1.00', ok: true },
          { text: '有人寫成 10.0（小數點少移）', ok: false, why: '應移 2 位：1.00 或 1。' }
        ],
        wrongIndex: 2,
        why: '2.5×0.4=1。'
      })
    ]),
    L('m51-shape1', '長方體體積', '長×寬×高', 'shape', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '長 5、寬 3、高 2 的長方體體積？', expression: '5×3×2', answer: '30', answers: ['30'],
        hints: ['體積＝長×寬×高。', '5×3×2=30。', '單位是立方單位。', '答案 30。'],
        pitfall: 'unit'
      }),
      word({
        id: 'w1',
        story: '水族箱長 40 公分、寬 20 公分、高 25 公分。最多可裝多少立方公分的水？（裝滿）',
        askWhat: '求體積',
        whatOptions: choiceWhat('水族箱體積（容量）', ['底面積', '高多少']),
        askOp: '算式？',
        opOptions: choiceWhat('40 × 20 × 25', ['40 × 20', '(40+20)×25']),
        answer: '20000', answers: ['20000', '20000立方公分'],
        hints: ['長×寬×高。', '40×20=800，800×25=20000。', '答案 20000。', '答案是 20000。'],
        explain: '40×20×25=20000。',
        pitfall: 'unit'
      })
    ]),
    L('m51-review1', '小小複習', '因數・分數乘・體積', 'review', ['recap'], [
      recap({
        id: 'r1', title: '五年級上・小小複習',
        questions: [
          { q: '18 是 6 的倍數嗎？(是/否)', a: '是', answers: ['是', '對', 'yes'], tip: '18÷6=3' },
          { q: '1/2 × 2/5 = ?', a: '1/5', answers: ['1/5', '⅕'], tip: '相乘約分' },
          { q: '長2寬2高2 正方體體積？', a: '8', answers: ['8'], tip: '2³' }
        ]
      })
    ], { review: true })
  ]
};

// ---- 5-2 ----
ROUTES['5-2'] = {
  meta: { label: '五年級下學期', track: '課綱進度', focus: '比與比值、百分率、速率、圓面積', units: 5 },
  lessons: [
    L('m52-apply1', '比與比值', '兩個量的關係', 'apply', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '男生 12 人、女生 8 人。男生：女生 = ?', expression: '比',
        answer: '3:2', answers: ['3:2', '3：2', '12:8'],
        hints: ['12:8 可約分÷4。', '得 3:2。', '答案 3:2。', '答案是 3:2。']
      }),
      word({
        id: 'w1',
        story: '糖和水的質量比是 1:4。糖有 50 公克，水有多少公克？',
        askWhat: '求水的質量',
        whatOptions: choiceWhat('水有多少公克', ['糖水一共', '比值是幾']),
        askOp: '怎麼想？',
        opOptions: choiceWhat('糖×4 = 水 → 50×4', ['50÷4', '50+4']),
        answer: '200', answers: ['200', '200公克'],
        hints: ['1 份糖對 4 份水。', '50 的 4 倍。', '200 公克。', '答案 200。'],
        explain: '50×4=200。'
      })
    ]),
    L('m52-frac1', '百分率', '百分之幾', 'frac', ['scaffold', 'word', 'error'], [
      scaffold({
        id: 's1', prompt: '1/4 = ?%', expression: '百分率', answer: '25', answers: ['25', '25%', '百分之25'],
        hints: ['1/4=0.25。', '0.25＝25%。', '答案 25。', '答案是 25%。']
      }),
      word({
        id: 'w1',
        story: '一本書 200 頁，小華看了 30%。他看了幾頁？',
        askWhat: '求什麼？',
        whatOptions: choiceWhat('看了幾頁', ['書一共幾頁', '百分之多少']),
        askOp: '怎麼算？',
        opOptions: choiceWhat('200 × 30%', ['200 − 30', '200 ÷ 30']),
        answer: '60', answers: ['60', '60頁'],
        hints: ['30%=0.3。', '200×0.3=60。', '答案 60 頁。', '答案是 60。'],
        explain: '200×30%=60。'
      }),
      errorP({
        id: 'e1', title: '百分率哪步錯？', expression: '50 的 10%',
        correctAnswer: '5',
        lines: [
          { text: '10% = 0.1', ok: true },
          { text: '50 × 0.1 = 5', ok: true },
          { text: '有人算成 50 × 10 = 500', ok: false, why: '把 % 當成 10 了；應是 ×0.1。' }
        ],
        wrongIndex: 2,
        why: '50 的 10% 是 5。'
      })
    ]),
    L('m52-measure1', '速率', '距離÷時間', 'measure', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '跑 100 公尺花 20 秒，速率每秒幾公尺？', expression: '100÷20',
        answer: '5', answers: ['5', '5公尺/秒'],
        hints: ['速率＝距離÷時間。', '100÷20=5。', '答案 5。', '答案是 5。'],
        pitfall: 'unit'
      }),
      word({
        id: 'w1',
        story: '腳踏車時速 15 公里，騎 2 小時走多遠？',
        askWhat: '求距離',
        whatOptions: choiceWhat('一共走幾公里', ['時速多少', '騎幾小時']),
        askOp: '算式？',
        opOptions: choiceWhat('15 × 2', ['15 ÷ 2', '15 − 2']),
        answer: '30', answers: ['30', '30公里'],
        hints: ['距離＝速率×時間。', '15×2=30。', '答案 30 公里。', '答案是 30。'],
        explain: '15×2=30。',
        pitfall: 'unit'
      })
    ]),
    L('m52-shape1', '圓的周長與面積', '直徑、半徑', 'shape', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '半徑 5 公分，直徑是？', expression: '直徑', answer: '10', answers: ['10', '10公分'],
        hints: ['直徑＝2×半徑。', '2×5=10。', '答案 10。', '答案是 10。']
      }),
      scaffold({
        id: 's2', prompt: '圓周長約等於直徑×3.14。直徑 10，周長約？', expression: '10×3.14',
        answer: '31.4', answers: ['31.4'],
        hints: ['10×3.14=31.4。', '答案 31.4。', '答案是 31.4。', '答案是 31.4。']
      }),
      word({
        id: 'w1',
        story: '圓形花圃半徑 7 公尺。面積約多少平方公尺？（用 22/7）',
        askWhat: '求圓面積',
        whatOptions: choiceWhat('花圃面積', ['周長', '直徑']),
        askOp: '公式？',
        opOptions: choiceWhat('π × 半徑 × 半徑', ['π × 直徑', '2 × π × 半徑']),
        answer: '154', answers: ['154'],
        hints: ['πr²，π 用 22/7。', '(22/7)×7×7=22×7=154。', '答案 154。', '答案是 154。'],
        explain: 'πr²=154。'
      })
    ]),
    L('m52-review1', '小小複習', '比・百分率・速率', 'review', ['recap'], [
      recap({
        id: 'r1', title: '五年級下・小小複習',
        questions: [
          { q: '8:12 化簡？', a: '2:3', answers: ['2:3', '2：3'], tip: '÷4' },
          { q: '0.5 = ?%', a: '50', answers: ['50', '50%'], tip: '×100' },
          { q: '距離60、時間3，速率？', a: '20', answers: ['20'], tip: '÷' }
        ]
      })
    ], { review: true })
  ]
};

// ---- 6-1 ----
ROUTES['6-1'] = {
  meta: { label: '六年級上學期', track: '課綱進度', focus: '比例、百分率應用、體積表面積、統計', units: 5 },
  lessons: [
    L('m61-apply1', '比例', '對應相同倍率', 'apply', ['scaffold', 'word', 'error'], [
      scaffold({
        id: 's1', prompt: '2:3 = 4:?', expression: '比例', answer: '6', answers: ['6'],
        hints: ['左邊×2，右邊也×2。', '3×2=6。', '答案 6。', '答案是 6。']
      }),
      word({
        id: 'w1',
        story: '地圖比例尺 1:1000。圖上 3 公分，實際多少公分？',
        askWhat: '求實際距離',
        whatOptions: choiceWhat('實際多少公分', ['圖上幾公分', '比例尺是多少']),
        askOp: '怎麼算？',
        opOptions: choiceWhat('3 × 1000', ['3 ÷ 1000', '3 + 1000']),
        answer: '3000', answers: ['3000', '3000公分'],
        hints: ['實際＝圖上×比例。', '3×1000=3000。', '答案 3000 公分。', '答案是 3000。'],
        explain: '3×1000=3000。',
        pitfall: 'unit'
      }),
      errorP({
        id: 'e1', title: '比例哪步錯？', expression: '3:5 = 6:x',
        correctAnswer: '10',
        lines: [
          { text: '3×2=6，所以倍率是 2', ok: true },
          { text: '5 也要×2 → x=10', ok: true },
          { text: '有人算 x=6−3+5=8', ok: false, why: '比例用乘法倍率，不是加減湊。' }
        ],
        wrongIndex: 2,
        why: 'x=10。'
      })
    ]),
    L('m61-frac1', '百分率應用', '折扣、稅、增減', 'frac', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '原價 400 元，打 8 折是多少？', expression: '400×0.8', answer: '320', answers: ['320', '320元'],
        hints: ['8 折＝80%=0.8。', '400×0.8=320。', '答案 320。', '答案是 320。']
      }),
      word({
        id: 'w1',
        story: '班級 40 人，出席率 95%。今天到幾人？',
        askWhat: '求出席人數',
        whatOptions: choiceWhat('今天到幾人', ['缺席幾人', '出席率多少']),
        askOp: '算式？',
        opOptions: choiceWhat('40 × 95%', ['40 − 95', '40 ÷ 95']),
        answer: '38', answers: ['38', '38人'],
        hints: ['95%=0.95。', '40×0.95=38。', '答案 38 人。', '答案是 38。'],
        explain: '40×0.95=38。'
      })
    ]),
    L('m61-shape1', '表面積與體積', '展開圖加總', 'shape', ['scaffold', 'error'], [
      scaffold({
        id: 's1', prompt: '正方體邊長 4，表面積？', expression: '6×4²', answer: '96', answers: ['96'],
        hints: ['6 個面，每面 16。', '6×16=96。', '答案 96。', '答案是 96。']
      }),
      errorP({
        id: 'e1', title: '表面積錯哪？', expression: '長方體 3×2×1 表面積',
        correctAnswer: '22',
        lines: [
          { text: '三組對面：3×2、3×1、2×1', ok: true },
          { text: '各×2：12、6、4', ok: true },
          { text: '加總 12+6+4=22', ok: true },
          { text: '有人只算 3×2×1=6 當表面積', ok: false, why: '那是體積，不是表面積。' }
        ],
        wrongIndex: 3,
        why: '體積與表面積公式不同。'
      })
    ]),
    L('m61-apply2', '統計初探', '讀長條圖概念', 'apply', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '喜好：蘋果 8、香蕉 5、葡萄 7。最多人喜歡？', expression: '統計',
        answer: '蘋果', answers: ['蘋果'],
        hints: ['比數量大小。', '8 最大。', '答案蘋果。', '答案是蘋果。']
      }),
      word({
        id: 'w1',
        story: '上週降雨 3 天共 45 毫米。平均每天降雨幾毫米？（只算有雨的天）',
        askWhat: '求平均降雨',
        whatOptions: choiceWhat('平均每天幾毫米', ['一共幾毫米', '下了幾天']),
        askOp: '算式？',
        opOptions: choiceWhat('45 ÷ 3', ['45 − 3', '45 × 3']),
        answer: '15', answers: ['15', '15毫米'],
        hints: ['平均＝總和÷天數。', '45÷3=15。', '答案 15。', '答案是 15。'],
        explain: '45÷3=15。'
      })
    ]),
    L('m61-review1', '小小複習', '比例・折扣・表面積', 'review', ['recap'], [
      recap({
        id: 'r1', title: '六年級上・小小複習',
        questions: [
          { q: '1:4 = 5:?', a: '20', answers: ['20'], tip: '×5' },
          { q: '200 打 9 折？', a: '180', answers: ['180'], tip: '×0.9' },
          { q: '正方體邊長3 表面積？', a: '54', answers: ['54'], tip: '6×9' }
        ]
      })
    ], { review: true })
  ]
};

// ---- 6-2 ----
ROUTES['6-2'] = {
  meta: { label: '六年級下學期', track: '衔接國中', focus: '綜合應用、速率行程、簡單方程思維、總複習', units: 5 },
  lessons: [
    L('m62-apply1', '綜合應用題', '先讀懂再列式', 'apply', ['word', 'error'], [
      word({
        id: 'w1',
        story: '一本書原價 250 元，先打 8 折再折 20 元。應付多少？',
        askWhat: '求實付金額',
        whatOptions: choiceWhat('最後要付多少元', ['打几折', '原價多少']),
        askOp: '順序？',
        opOptions: choiceWhat('先 250×0.8，再減 20', ['先減 20 再打折', '250−20×0.8']),
        answer: '180', answers: ['180', '180元'],
        hints: ['先打折：250×0.8=200。', '再減 20：180。', '注意運算順序。', '答案 180 元。'],
        explain: '250×0.8−20=180。',
        pitfall: 'misread'
      }),
      word({
        id: 'w2',
        story: '水槽有水 30 公升，每分鐘流入 4 公升、同時漏出 1 公升。幾分鐘後有 45 公升？',
        askWhat: '求經過幾分鐘',
        whatOptions: choiceWhat('幾分鐘後到 45 公升', ['每分鐘淨流入', '最後水量']),
        askOp: '怎麼想？',
        opOptions: choiceWhat('每分淨增 3 公升，還差 15 → 15÷3', ['45÷4', '30+4−1']),
        answer: '5', answers: ['5', '5分鐘'],
        hints: ['淨流入＝4−1=3。', '還要 15 公升。', '15÷3=5 分鐘。', '答案 5。'],
        explain: '15÷3=5。'
      }),
      errorP({
        id: 'e1', title: '行程問題哪步錯？', expression: '時速 60，開 2.5 小時',
        correctAnswer: '150',
        lines: [
          { text: '距離＝速率×時間', ok: true },
          { text: '60 × 2.5', ok: true },
          { text: '有人算 60 × 2 + 5 = 125（把 2.5 拆錯）', ok: false, why: '2.5=2+0.5，應是 120+30=150，不是 +5。' }
        ],
        wrongIndex: 2,
        why: '60×2.5=150 公里。'
      })
    ]),
    L('m62-calc1', '簡單方程思維', '未知數小遊戲', 'calc', ['scaffold', 'word'], [
      scaffold({
        id: 's1', prompt: '□ + 18 = 45，□ 是？', expression: '方程', answer: '27', answers: ['27'],
        hints: ['兩邊減 18。', '45−18=27。', '答案 27。', '答案是 27。'],
        companionAsk: '怎樣讓等式兩邊一樣？'
      }),
      scaffold({
        id: 's2', prompt: '3 × □ = 42，□ 是？', expression: '方程', answer: '14', answers: ['14'],
        hints: ['兩邊除以 3。', '42÷3=14。', '答案 14。', '答案是 14。']
      }),
      word({
        id: 'w1',
        story: '小明想：「我有一些貼紙，再買 12 張就有 40 張。」他現在有幾張？',
        askWhat: '求現在有幾張',
        whatOptions: choiceWhat('現在有幾張貼紙', ['再買幾張', '最後幾張']),
        askOp: '算式？',
        opOptions: choiceWhat('40 − 12', ['40 + 12', '40 ÷ 12']),
        answer: '28', answers: ['28'],
        hints: ['現在＋12=40。', '現在＝40−12。', '答案 28。', '答案是 28。'],
        explain: '40−12=28。'
      })
    ]),
    L('m62-measure1', '複雜單位與速率', '仔細看單位', 'measure', ['scaffold', 'word', 'error'], [
      scaffold({
        id: 's1', prompt: '3 小時 = 幾分鐘？', expression: '換算', answer: '180', answers: ['180', '180分鐘'],
        hints: ['1 小時＝60 分。', '3×60=180。', '答案 180。', '答案是 180。'],
        pitfall: 'unit'
      }),
      word({
        id: 'w1',
        story: '路程 90 公里，用 1.5 小時走完。平均時速？',
        askWhat: '求平均時速',
        whatOptions: choiceWhat('平均每小時幾公里', ['一共幾公里', '花幾小時']),
        askOp: '算式？',
        opOptions: choiceWhat('90 ÷ 1.5', ['90 × 1.5', '90 − 1.5']),
        answer: '60', answers: ['60', '60公里/時'],
        hints: ['速率＝距離÷時間。', '90÷1.5=60。', '答案 60。', '答案是 60。'],
        explain: '90÷1.5=60。',
        pitfall: 'unit'
      }),
      errorP({
        id: 'e1', title: '單位換算錯哪？', expression: '2 公尺 = ? 公分',
        correctAnswer: '200',
        lines: [
          { text: '1 公尺＝100 公分', ok: true },
          { text: '2×100=200', ok: true },
          { text: '有人寫成 2×10=20 公分', ok: false, why: '公尺到公分是 ×100，不是 ×10。' }
        ],
        wrongIndex: 2,
        why: '2 公尺＝200 公分。'
      })
    ]),
    L('m62-apply2', '總複習挑戰', '混合題型', 'apply', ['word', 'scaffold'], [
      word({
        id: 'w1',
        story: '長方形長 12、寬 5。周長與面積哪個數值比較大？',
        askWhat: '比較周長與面積的數值',
        whatOptions: choiceWhat('哪一個數值比較大', ['形狀是什麼', '長寬各多少']),
        askOp: '先算再比',
        opOptions: choiceWhat('周長 34、面積 60 → 面積數值大', ['周長比較大', '一樣大']),
        answer: '面積', answers: ['面積', '面積數值大', '60'],
        hints: ['周長=(12+5)×2=34。', '面積=12×5=60。', '60>34。', '面積的數值較大。'],
        explain: '周長 34，面積 60。'
      }),
      scaffold({
        id: 's1', prompt: '15 的 40% 是？', expression: '15×0.4', answer: '6', answers: ['6'],
        hints: ['40%=0.4。', '15×0.4=6。', '答案 6。', '答案是 6。']
      })
    ]),
    L('m62-review1', '畢業小小複習', '國小數學重點回顧', 'review', ['recap'], [
      recap({
        id: 'r1', title: '六年級下・小小複習',
        questions: [
          { q: '□ × 5 = 60，□？', a: '12', answers: ['12'], tip: '÷5' },
          { q: '打 7 折＝原價的 ?%', a: '70', answers: ['70', '70%'], tip: '折扣' },
          { q: '速度20、時間3，距離？', a: '60', answers: ['60'], tip: '×' }
        ]
      })
    ], { review: true })
  ]
};

function buildLessonsByRoute() {
  var out = {};
  Object.keys(ROUTES).forEach(function (rk) {
    var byIsland = {};
    ROUTES[rk].lessons.forEach(function (lesson) {
      if (!byIsland[lesson.island]) byIsland[lesson.island] = [];
      byIsland[lesson.island].push(lesson);
    });
    out[rk] = byIsland;
  });
  return out;
}

function buildRouteMeta() {
  var out = {};
  Object.keys(ROUTES).forEach(function (rk) {
    var parts = rk.split('-');
    var m = ROUTES[rk].meta;
    var lessons = ROUTES[rk].lessons;
    var modeCount = 0;
    lessons.forEach(function (L) { modeCount += L.modes.length; });
    out[rk] = {
      grade: Number(parts[0]),
      semester: Number(parts[1]),
      label: m.label,
      track: m.track,
      focus: m.focus,
      lessons: lessons.length,
      starsAll: modeCount,
      units: m.units
    };
  });
  return out;
}

var DATA = {
  meta: {
    title: '國小數學群島',
    subtitle: '選年級與學期，一步一步學數學',
    note: '上下學期是依常見教科書（康軒／翰林／南一等）主題拆的建議進度，不是教育部官方學期表。各校實際單元順序可能不同。',
    pedagogy: '先找卡住的地方；請孩子先試下一步；提示由小到大；檢查思考過程；具體→圖示→算式；應用題先讀懂再算；結束前小小複習。',
    routes: ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2', '5-1', '5-2', '6-1', '6-2']
  },
  islands: ISLANDS,
  lessonsByRoute: buildLessonsByRoute(),
  routeMeta: buildRouteMeta()
};

var outPath = path.join(__dirname, '..', 'assets', 'math-data.js');
var body = '/* Auto-generated by scripts/build-math-data.js — Taiwan elementary math isles */\n' +
  'window.MATH_ISLES_DATA = ' + JSON.stringify(DATA) + ';\n';
fs.writeFileSync(outPath, body);
console.log('Wrote', outPath, 'bytes', body.length);
console.log('Routes', Object.keys(DATA.lessonsByRoute).length);
Object.keys(DATA.routeMeta).forEach(function (k) {
  console.log(k, DATA.routeMeta[k].lessons, 'lessons,', DATA.routeMeta[k].starsAll, 'stars');
});
