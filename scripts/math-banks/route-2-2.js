'use strict';

/** 二年級下 — thickened practice banks */
module.exports = function (h) {
  var L = h.L, scaffold = h.scaffold, word = h.word, errorP = h.errorP, visual = h.visual, recap = h.recap, choiceWhat = h.choiceWhat;

  return {
    meta: { label: '二年級下學期', track: '課綱進度', focus: '乘法九九、除法初步、錢幣、時間', units: 5 },
    lessons: [
      L('m22-calc1', '乘法九九（2、5、10）', '相同數相加', 'calc', ['scaffold', 'visual'], [
        visual({
          id: 'v1', prompt: '每排 2 顆，有 4 排，一共幾顆？', items: ['🍬🍬', '🍬🍬', '🍬🍬', '🍬🍬'],
          answer: '8', answers: ['8'],
          hints: ['4 個 2。', '2×4=8。', '答案 8。', '答案是 8。'],
          companionAsk: '看看有幾排、每排幾個？'
        }),
        visual({
          id: 'v2', prompt: '每組 5 顆星星，有 3 組，一共幾顆？', items: ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
          answer: '15', answers: ['15'],
          hints: ['3 個 5。', '5×3=15。', '答案 15。', '答案是 15。']
        }),
        visual({
          id: 'v3', prompt: '每排 10 粒豆子，有 2 排，一共幾粒？', items: ['🫘🫘🫘🫘🫘🫘🫘🫘🫘🫘', '🫘🫘🫘🫘🫘🫘🫘🫘🫘🫘'],
          answer: '20', answers: ['20'],
          hints: ['2 個 10。', '10×2=20。', '答案 20。', '答案是 20。']
        }),
        visual({
          id: 'v4', prompt: '每盒 2 枝筆，有 5 盒，一共幾枝？', items: ['✏️✏️', '✏️✏️', '✏️✏️', '✏️✏️', '✏️✏️'],
          answer: '10', answers: ['10'],
          hints: ['5 個 2。', '2×5=10。', '答案 10。', '答案是 10。']
        }),
        visual({
          id: 'v5', prompt: '每盤 5 顆草莓，有 4 盤，一共幾顆？', items: ['🍓🍓🍓🍓🍓', '🍓🍓🍓🍓🍓', '🍓🍓🍓🍓🍓', '🍓🍓🍓🍓🍓'],
          answer: '20', answers: ['20'],
          hints: ['4 個 5。', '5×4=20。', '答案 20。', '答案是 20。']
        }),
        visual({
          id: 'v6', prompt: '每排 2 輛車，有 6 排，一共幾輛？', items: ['🚗🚗', '🚗🚗', '🚗🚗', '🚗🚗', '🚗🚗', '🚗🚗'],
          answer: '12', answers: ['12'],
          hints: ['6 個 2。', '2×6=12。', '答案 12。', '答案是 12。']
        }),
        visual({
          id: 'v7', prompt: '每袋 10 顆彈珠，有 3 袋，一共幾顆？', items: ['🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵', '🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵', '🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵'],
          answer: '30', answers: ['30'],
          hints: ['3 個 10。', '10×3=30。', '答案 30。', '答案是 30。']
        }),
        visual({
          id: 'v8', prompt: '每排 5 個杯子，有 2 排，一共幾個？', items: ['🥛🥛🥛🥛🥛', '🥛🥛🥛🥛🥛'],
          answer: '10', answers: ['10'],
          hints: ['2 個 5。', '5×2=10。', '答案 10。', '答案是 10。']
        }),
        scaffold({
          id: 's1', prompt: '5 × 6 = ?', expression: '5 × 6', answer: '30', answers: ['30'],
          hints: ['5 的倍數：5、10、15、20、25、30。', '5×6=30。', '答案 30。', '答案是 30。']
        }),
        scaffold({
          id: 's2', prompt: '10 × 7 = ?', expression: '10 × 7', answer: '70', answers: ['70'],
          hints: ['×10 只要在後面加一個 0。', '7 後面加 0 → 70。', '答案 70。', '答案是 70。']
        }),
        scaffold({
          id: 's3', prompt: '2 × 8 = ?', expression: '2 × 8', answer: '16', answers: ['16'],
          hints: ['2 的倍數往後數 8 次。', '2、4、6、8、10、12、14、16。', '答案 16。', '答案是 16。']
        }),
        scaffold({
          id: 's4', prompt: '5 × 9 = ?', expression: '5 × 9', answer: '45', answers: ['45'],
          hints: ['5、10、15、20、25、30、35、40、45。', '5×9=45。', '答案 45。', '答案是 45。']
        }),
        scaffold({
          id: 's5', prompt: '10 × 4 = ?', expression: '10 × 4', answer: '40', answers: ['40'],
          hints: ['4 後面加 0。', '10×4=40。', '答案 40。', '答案是 40。']
        }),
        scaffold({
          id: 's6', prompt: '2 × 9 = ?', expression: '2 × 9', answer: '18', answers: ['18'],
          hints: ['雙數往後數。', '2×9=18。', '答案 18。', '答案是 18。']
        }),
        scaffold({
          id: 's7', prompt: '5 × 3 = ?', expression: '5 × 3', answer: '15', answers: ['15'],
          hints: ['5、10、15。', '5×3=15。', '答案 15。', '答案是 15。']
        }),
        scaffold({
          id: 's8', prompt: '10 × 8 = ?', expression: '10 × 8', answer: '80', answers: ['80'],
          hints: ['8 後面加 0。', '10×8=80。', '答案 80。', '答案是 80。']
        })
      ]),

      L('m22-calc2', '除法初步', '平均分一分', 'calc', ['scaffold', 'word', 'error'], [
        scaffold({
          id: 's1', prompt: '12 顆糖分給 3 人，每人幾顆？（剛好分完）', expression: '12 ÷ 3',
          answer: '4', answers: ['4'],
          hints: ['想想 3 的幾倍是 12。', '3×4=12。', '12÷3=4。', '答案是 4。'],
          companionAsk: '每人一樣多，是在做什麼運算？'
        }),
        scaffold({
          id: 's2', prompt: '20 ÷ 5 = ?', expression: '20 ÷ 5', answer: '4', answers: ['4'],
          hints: ['5 的幾倍是 20？', '5×4=20。', '答案 4。', '答案是 4。']
        }),
        scaffold({
          id: 's3', prompt: '18 ÷ 2 = ?', expression: '18 ÷ 2', answer: '9', answers: ['9'],
          hints: ['2 的幾倍是 18？', '2×9=18。', '答案 9。', '答案是 9。']
        }),
        scaffold({
          id: 's4', prompt: '30 ÷ 10 = ?', expression: '30 ÷ 10', answer: '3', answers: ['3'],
          hints: ['10 的幾倍是 30？', '10×3=30。', '答案 3。', '答案是 3。']
        }),
        scaffold({
          id: 's5', prompt: '15 ÷ 5 = ?', expression: '15 ÷ 5', answer: '3', answers: ['3'],
          hints: ['5×3=15。', '15÷5=3。', '答案 3。', '答案是 3。']
        }),
        scaffold({
          id: 's6', prompt: '16 ÷ 2 = ?', expression: '16 ÷ 2', answer: '8', answers: ['8'],
          hints: ['2×8=16。', '對半分。', '答案 8。', '答案是 8。']
        }),
        scaffold({
          id: 's7', prompt: '40 ÷ 5 = ?', expression: '40 ÷ 5', answer: '8', answers: ['8'],
          hints: ['5×8=40。', '答案 8。', '答案是 8。', '答案是 8。']
        }),
        scaffold({
          id: 's8', prompt: '24 ÷ 3 = ?', expression: '24 ÷ 3', answer: '8', answers: ['8'],
          hints: ['3×8=24。', '想想九九。', '答案 8。', '答案是 8。']
        }),
        word({
          id: 'w1',
          story: '老師有 20 枝鉛筆，要平均分給 5 位同學。每位同學幾枝？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('每位同學分到幾枝', ['一共幾枝', '有幾位同學']),
          askOp: '算式？',
          opOptions: choiceWhat('20 ÷ 5', ['20 − 5', '20 × 5']),
          answer: '4', answers: ['4'],
          hints: ['平均分→除法。', '5×4=20。', '每位 4 枝。', '答案 4。'],
          explain: '20÷5=4。'
        }),
        word({
          id: 'w2',
          story: '24 顆橘子平均裝進 4 個袋子，每袋幾顆？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('每袋幾顆橘子', ['一共幾顆', '有幾個袋子']),
          askOp: '算式？',
          opOptions: choiceWhat('24 ÷ 4', ['24 − 4', '24 × 4']),
          answer: '6', answers: ['6'],
          hints: ['平均分→除法。', '4×6=24。', '每袋 6 顆。', '答案 6。'],
          explain: '24÷4=6。'
        }),
        word({
          id: 'w3',
          story: '班級有 30 本故事書，平均分給 10 組。每組幾本？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('每組幾本', ['一共幾本', '有幾組']),
          askOp: '算式？',
          opOptions: choiceWhat('30 ÷ 10', ['30 − 10', '30 × 10']),
          answer: '3', answers: ['3'],
          hints: ['平均分→除法。', '10×3=30。', '每組 3 本。', '答案 3。'],
          explain: '30÷10=3。'
        }),
        word({
          id: 'w4',
          story: '16 塊餅乾平分給 2 人，每人幾塊？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('每人幾塊餅乾', ['一共幾塊', '有幾人']),
          askOp: '算式？',
          opOptions: choiceWhat('16 ÷ 2', ['16 − 2', '16 × 2']),
          answer: '8', answers: ['8'],
          hints: ['對半分。', '2×8=16。', '每人 8 塊。', '答案 8。'],
          explain: '16÷2=8。'
        }),
        word({
          id: 'w5',
          story: '35 張贴纸平均分給 5 位小朋友，每人幾張？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('每人幾張贴纸', ['一共幾張', '有幾位小朋友']),
          askOp: '算式？',
          opOptions: choiceWhat('35 ÷ 5', ['35 − 5', '35 × 5']),
          answer: '7', answers: ['7'],
          hints: ['平均分→除法。', '5×7=35。', '每人 7 張。', '答案 7。'],
          explain: '35÷5=7。'
        }),
        word({
          id: 'w6',
          story: '18 顆彈珠要平均放進 3 個盒子，每盒幾顆？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('每盒幾顆彈珠', ['一共幾顆', '有幾個盒子']),
          askOp: '算式？',
          opOptions: choiceWhat('18 ÷ 3', ['18 − 3', '18 × 3']),
          answer: '6', answers: ['6'],
          hints: ['平均分→除法。', '3×6=18。', '每盒 6 顆。', '答案 6。'],
          explain: '18÷3=6。'
        }),
        errorP({
          id: 'e1', title: '哪裡想錯了？', expression: '18 ÷ 3',
          correctAnswer: '6',
          lines: [
            { text: '這是把 18 平均分成 3 份', ok: true },
            { text: '3 × 5 = 15，還差 3，所以再加 1 份變成 6', ok: true },
            { text: '答案應該是 15（把乘法結果當除法答案）', ok: false, why: '15 是 3×5，不是 18÷3；18÷3=6。' }
          ],
          wrongIndex: 2,
          why: '除法問的是「幾倍」，不是乘法的積本身搞混。'
        }),
        errorP({
          id: 'e2', title: '除法哪步錯？', expression: '20 ÷ 4',
          correctAnswer: '5',
          lines: [
            { text: '要找 4 的幾倍是 20', ok: true },
            { text: '4×5=20，所以商是 5', ok: true },
            { text: '有人做成 20−4=16 當答案', ok: false, why: '平均分要用除法，不是只減一次。' }
          ],
          wrongIndex: 2,
          why: '20÷4=5。'
        }),
        errorP({
          id: 'e3', title: '哪一步錯了？', expression: '14 ÷ 2',
          correctAnswer: '7',
          lines: [
            { text: '對半分，每人一樣多', ok: true },
            { text: '2×7=14', ok: true },
            { text: '有人寫成 2÷14=7（被除數除數對調）', ok: false, why: '是 14÷2，不是 2÷14。' }
          ],
          wrongIndex: 2,
          why: '被除數是總數 14；14÷2=7。'
        }),
        errorP({
          id: 'e4', title: '平均分錯在哪？', expression: '25 ÷ 5',
          correctAnswer: '5',
          lines: [
            { text: '5 的倍數：5、10、15、20、25', ok: true },
            { text: '數到第 5 個就是 25，商是 5', ok: true },
            { text: '有人把「5 的倍數表」長度搞成答案 25', ok: false, why: '25 是被除數；商是「幾個 5」，等於 5。' }
          ],
          wrongIndex: 2,
          why: '25÷5=5。'
        })
      ]),

      L('m22-measure1', '錢幣與時間', '元、角、幾點幾分', 'measure', ['scaffold', 'word'], [
        scaffold({
          id: 's1', prompt: '一枝筆 12 元，買 2 枝要多少元？', expression: '12×2',
          answer: '24', answers: ['24', '24元'],
          hints: ['12+12 或 12×2。', '等於 24 元。', '答案 24。', '答案是 24。'],
          pitfall: 'unit'
        }),
        scaffold({
          id: 's2', prompt: '現在是 2 點 30 分。再過 30 分是幾點？', expression: '時間',
          answer: '3點', answers: ['3點', '3', '3:00', '3點整', '三點'],
          hints: ['2:30 再加 30 分。', '到下一個整點。', '是 3 點。', '答案是 3 點。']
        }),
        scaffold({
          id: 's3', prompt: '一包貼紙 15 元，買 3 包多少元？', expression: '15×3',
          answer: '45', answers: ['45', '45元'],
          hints: ['15+15+15 或 15×3。', '等於 45 元。', '答案 45。', '答案是 45。'],
          pitfall: 'unit'
        }),
        scaffold({
          id: 's4', prompt: '現在是 4 點，再過 1 小時是幾點？', expression: '時間',
          answer: '5點', answers: ['5點', '5', '5:00', '5點整', '五點'],
          hints: ['過 1 小時，時針走一格。', '4 再加 1。', '是 5 點。', '答案是 5 點。']
        }),
        scaffold({
          id: 's5', prompt: '10 元硬幣 4 枚，一共多少元？', expression: '10×4',
          answer: '40', answers: ['40', '40元'],
          hints: ['4 個 10。', '10×4=40。', '答案 40 元。', '答案是 40。'],
          pitfall: 'unit'
        }),
        scaffold({
          id: 's6', prompt: '現在是 1 點 20 分，再過 10 分是幾點幾分？', expression: '時間',
          answer: '1點30分', answers: ['1點30分', '1:30', '一點三十分', '1點30'],
          hints: ['20 分再加 10 分。', '變成 30 分。', '是 1 點 30 分。', '答案是 1 點 30 分。']
        }),
        scaffold({
          id: 's7', prompt: '5 元硬幣 6 枚，一共多少元？', expression: '5×6',
          answer: '30', answers: ['30', '30元'],
          hints: ['6 個 5。', '5×6=30。', '答案 30 元。', '答案是 30。'],
          pitfall: 'unit'
        }),
        scaffold({
          id: 's8', prompt: '從 3 點到 3 點 40 分，過了幾分鐘？', expression: '時間',
          answer: '40', answers: ['40', '40分', '40分鐘'],
          hints: ['看分針走了多少。', '從 0 分到 40 分。', '過了 40 分鐘。', '答案是 40。']
        }),
        word({
          id: 'w1',
          story: '小明帶 50 元，買麵包花 35 元。還能找回幾元？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('找回幾元', ['麵包多少元', '帶了幾元']),
          askOp: '算式？',
          opOptions: choiceWhat('50 − 35', ['50 + 35', '35 − 50']),
          answer: '15', answers: ['15', '15元'],
          hints: ['找回＝付出−價錢。', '50−35=15。', '找回 15 元。', '答案 15 元。'],
          explain: '50−35=15 元。',
          pitfall: 'unit'
        }),
        word({
          id: 'w2',
          story: '姐姐帶 100 元，買文具花 68 元。還剩幾元？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('還剩幾元', ['文具多少元', '帶了幾元']),
          askOp: '算式？',
          opOptions: choiceWhat('100 − 68', ['100 + 68', '68 − 100']),
          answer: '32', answers: ['32', '32元'],
          hints: ['還剩＝帶的錢−花費。', '100−68=32。', '還剩 32 元。', '答案 32。'],
          explain: '100−68=32。',
          pitfall: 'unit'
        }),
        word({
          id: 'w3',
          story: '下課是 10 點，社團活動再過 30 分開始。幾點開始？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('幾點開始社團', ['下課幾點', '過了幾分']),
          askOp: '怎麼想？',
          opOptions: choiceWhat('10點再加30分', ['10點減30分', '30−10']),
          answer: '10點30分', answers: ['10點30分', '10:30', '十點三十分', '10點30'],
          hints: ['10 點加 30 分。', '變成 10 點 30 分。', '答案 10 點 30 分。', '答案是 10 點 30 分。'],
          explain: '10:00+30 分＝10:30。'
        }),
        word({
          id: 'w4',
          story: '一瓶牛奶 25 元，買 2 瓶要多少元？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('兩瓶一共多少元', ['一瓶多少元', '買了幾瓶']),
          askOp: '算式？',
          opOptions: choiceWhat('25 × 2', ['25 + 2', '25 − 2']),
          answer: '50', answers: ['50', '50元'],
          hints: ['每瓶一樣貴→乘法。', '25×2=50。', '要 50 元。', '答案 50。'],
          explain: '25×2=50。',
          pitfall: 'unit'
        }),
        word({
          id: 'w5',
          story: '小華有 3 枚 10 元硬幣，買零食花掉 1 枚。還剩多少元？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('還剩多少元', ['花掉幾枚', '原本幾枚']),
          askOp: '怎麼算？',
          opOptions: choiceWhat('30 − 10', ['3 − 1', '10 − 3']),
          answer: '20', answers: ['20', '20元'],
          hints: ['先想原本 30 元。', '花掉 10 元。', '還剩 20 元。', '答案 20。'],
          explain: '30−10=20。',
          pitfall: 'unit'
        }),
        word({
          id: 'w6',
          story: '現在 7 點 15 分，再過 15 分要出門。出門是幾點幾分？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('出門是幾點幾分', ['現在幾點', '再過幾分']),
          askOp: '怎麼想？',
          opOptions: choiceWhat('7點15分再加15分', ['7點15分減15分', '15−7']),
          answer: '7點30分', answers: ['7點30分', '7:30', '七點三十分', '7點30'],
          hints: ['15 分再加 15 分＝30 分。', '還是 7 點。', '是 7 點 30 分。', '答案是 7 點 30 分。'],
          explain: '7:15+15 分＝7:30。'
        })
      ]),

      L('m22-apply1', '乘法應用', '先看懂再列式', 'apply', ['word', 'scaffold'], [
        word({
          id: 'w1',
          story: '一盒蛋有 6 顆，買 4 盒一共幾顆？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('一共幾顆蛋', ['一盒幾顆', '買了幾盒']),
          askOp: '算式？',
          opOptions: choiceWhat('6 × 4', ['6 + 4', '6 − 4']),
          answer: '24', answers: ['24'],
          hints: ['每盒一樣多→乘法。', '6×4=24。', '一共 24 顆。', '答案 24。'],
          explain: '6×4=24。'
        }),
        word({
          id: 'w2',
          story: '每排座位 8 人，有 5 排。一共可坐幾人？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('一共可坐幾人', ['一排幾人', '有幾排']),
          askOp: '算式？',
          opOptions: choiceWhat('8 × 5', ['8 + 5', '8 − 5']),
          answer: '40', answers: ['40'],
          hints: ['每排一樣多→乘法。', '8×5=40。', '一共 40 人。', '答案 40。'],
          explain: '8×5=40。'
        }),
        word({
          id: 'w3',
          story: '一包棉花糖有 10 顆，買 6 包一共幾顆？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('一共幾顆棉花糖', ['一包幾顆', '買了幾包']),
          askOp: '算式？',
          opOptions: choiceWhat('10 × 6', ['10 + 6', '10 − 6']),
          answer: '60', answers: ['60'],
          hints: ['×10 很好算。', '10×6=60。', '一共 60 顆。', '答案 60。'],
          explain: '10×6=60。'
        }),
        word({
          id: 'w4',
          story: '每天讀 5 頁故事書，讀了 7 天。一共讀了幾頁？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('一共讀了幾頁', ['每天幾頁', '讀了幾天']),
          askOp: '算式？',
          opOptions: choiceWhat('5 × 7', ['5 + 7', '5 − 7']),
          answer: '35', answers: ['35'],
          hints: ['每天一樣多→乘法。', '5×7=35。', '一共 35 頁。', '答案 35。'],
          explain: '5×7=35。'
        }),
        word({
          id: 'w5',
          story: '一籠包子有 9 個，買 2 籠一共幾個？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('一共幾個包子', ['一籠幾個', '買了幾籠']),
          askOp: '算式？',
          opOptions: choiceWhat('9 × 2', ['9 + 2', '9 − 2']),
          answer: '18', answers: ['18'],
          hints: ['每籠一樣多→乘法。', '9×2=18。', '一共 18 個。', '答案 18。'],
          explain: '9×2=18。'
        }),
        word({
          id: 'w6',
          story: '球場上一隊 5 人，來了 4 隊。一共幾人？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('一共幾人', ['一隊幾人', '來了幾隊']),
          askOp: '算式？',
          opOptions: choiceWhat('5 × 4', ['5 + 4', '5 − 4']),
          answer: '20', answers: ['20'],
          hints: ['每隊一樣多→乘法。', '5×4=20。', '一共 20 人。', '答案 20。'],
          explain: '5×4=20。'
        }),
        scaffold({
          id: 's1', prompt: '7 × 5 = ?', expression: '7 × 5', answer: '35', answers: ['35'],
          hints: ['5×7 比較好算：5、10、15、20、25、30、35。', '7×5=35。', '答案 35。', '答案是 35。']
        }),
        scaffold({
          id: 's2', prompt: '6 × 2 = ?', expression: '6 × 2', answer: '12', answers: ['12'],
          hints: ['6+6。', '2×6=12。', '答案 12。', '答案是 12。']
        }),
        scaffold({
          id: 's3', prompt: '9 × 10 = ?', expression: '9 × 10', answer: '90', answers: ['90'],
          hints: ['9 後面加 0。', '9×10=90。', '答案 90。', '答案是 90。']
        }),
        scaffold({
          id: 's4', prompt: '8 × 5 = ?', expression: '8 × 5', answer: '40', answers: ['40'],
          hints: ['5×8：5、10、15、20、25、30、35、40。', '8×5=40。', '答案 40。', '答案是 40。']
        }),
        scaffold({
          id: 's5', prompt: '4 × 10 = ?', expression: '4 × 10', answer: '40', answers: ['40'],
          hints: ['4 後面加 0。', '4×10=40。', '答案 40。', '答案是 40。']
        }),
        scaffold({
          id: 's6', prompt: '3 × 5 = ?', expression: '3 × 5', answer: '15', answers: ['15'],
          hints: ['5+5+5。', '3×5=15。', '答案 15。', '答案是 15。']
        }),
        scaffold({
          id: 's7', prompt: '2 × 7 = ?', expression: '2 × 7', answer: '14', answers: ['14'],
          hints: ['雙數：2、4、6、8、10、12、14。', '2×7=14。', '答案 14。', '答案是 14。']
        }),
        scaffold({
          id: 's8', prompt: '5 × 8 = ?', expression: '5 × 8', answer: '40', answers: ['40'],
          hints: ['5 的倍數數 8 次。', '5×8=40。', '答案 40。', '答案是 40。']
        })
      ]),

      L('m22-review1', '小小複習', '乘除與生活量', 'review', ['recap'], [
        recap({
          id: 'r1', title: '二年級下・小小複習',
          questions: [
            { q: '4 × 8 = ?', a: '32', answers: ['32'], tip: '九九' },
            { q: '24 ÷ 6 = ?', a: '4', answers: ['4'], tip: '想想幾倍' },
            { q: '40 元買 28 元東西，找回？', a: '12', answers: ['12', '12元'], tip: '減法' },
            { q: '5 × 7 = ?', a: '35', answers: ['35'], tip: '九九' },
            { q: '18 ÷ 2 = ?', a: '9', answers: ['9'], tip: '對半分' },
            { q: '10 × 6 = ?', a: '60', answers: ['60'], tip: '加一個 0' },
            { q: '2 點再過 30 分是？', a: '2點30分', answers: ['2點30分', '2:30', '兩點三十分'], tip: '時間' },
            { q: '30 ÷ 5 = ?', a: '6', answers: ['6'], tip: '除法' }
          ]
        })
      ], { review: true })
    ]
  };
};
