'use strict';

/** 四年級上 — thickened practice banks */
module.exports = function (h) {
  var L = h.L, scaffold = h.scaffold, word = h.word, errorP = h.errorP, recap = h.recap, choiceWhat = h.choiceWhat;

  return {
    meta: { label: '四年級上學期', track: '課綱進度', focus: '大數、多位數乘除、等值分數、小數、角度', units: 5 },
    lessons: [
      L('m41-count1', '大數與換算', '千、萬', 'count', ['scaffold', 'error'], [
        scaffold({
          id: 's1', prompt: '3050 的百位是？', expression: '位值', answer: '0', answers: ['0'],
          hints: ['個十百千萬……對過去。', '3050：十位 5、百位 0、千位 3。', '百位是 0。', '答案是 0。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's2', prompt: '2 萬 = 幾仟？', expression: '換算', answer: '20', answers: ['20', '20仟', '二十'],
          hints: ['1 萬＝10 仟。', '2 萬＝20 仟。', '答案 20。', '答案是 20。']
        }),
        scaffold({
          id: 's3', prompt: '4820 的千位是？', expression: '位值', answer: '4', answers: ['4'],
          hints: ['從右邊數：個、十、百、千。', '千位是 4。', '答案 4。', '答案是 4。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's4', prompt: '5 仟 = 幾佰？', expression: '換算', answer: '50', answers: ['50', '50佰', '五十'],
          hints: ['1 仟＝10 佰。', '5 仟＝50 佰。', '答案 50。', '答案是 50。']
        }),
        scaffold({
          id: 's5', prompt: '3 萬 2 仟，寫成數字是？', expression: '寫數', answer: '32000', answers: ['32000', '32,000'],
          hints: ['3 萬＝30000，再加 2 仟。', '30000+2000=32000。', '答案 32000。', '答案是 32000。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's6', prompt: '7060 的十位是？', expression: '位值', answer: '6', answers: ['6'],
          hints: ['個位是 0，十位是下一位。', '7060 的十位是 6。', '答案 6。', '答案是 6。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's7', prompt: '4 萬 = 幾佰？', expression: '換算', answer: '400', answers: ['400', '400佰'],
          hints: ['1 萬＝100 佰。', '4 萬＝400 佰。', '答案 400。', '答案是 400。']
        }),
        scaffold({
          id: 's8', prompt: '哪個比較大？9080 還是 9800？', expression: '比較', answer: '9800', answers: ['9800'],
          hints: ['先比千位，都是 9。', '再比百位：8 和 0，8 比較大。', '9800 比較大。', '答案是 9800。'],
          pitfall: 'compare'
        }),
        errorP({
          id: 'e1', title: '讀數錯在哪？', expression: '2040',
          correctAnswer: '二千零四十',
          lines: [
            { text: '千位是 2', ok: true },
            { text: '百位是 0，要讀「零」', ok: true },
            { text: '有人讀成「二千四十」漏掉中間的零也可以？——其實也可以，但寫成 240 就大錯', ok: true },
            { text: '寫成數字 240', ok: false, why: '漏掉十位的結構；2040 ≠ 240。' }
          ],
          wrongIndex: 3,
          why: '位值中的 0 不能隨便拿掉。'
        }),
        errorP({
          id: 'e2', title: '換算哪步錯？', expression: '3 萬＝？仟',
          correctAnswer: '30',
          lines: [
            { text: '1 萬＝10 仟', ok: true },
            { text: '所以 3 萬＝30 仟', ok: true },
            { text: '有人做成 3 萬＝3 仟', ok: false, why: '漏乘 10；3 萬是 30 仟。' }
          ],
          wrongIndex: 2,
          why: '萬換仟要×10。'
        }),
        errorP({
          id: 'e3', title: '位值錯在哪？', expression: '5600',
          correctAnswer: '五千六百',
          lines: [
            { text: '千位是 5', ok: true },
            { text: '百位是 6', ok: true },
            { text: '有人說這是 56 個百，卻寫成 56', ok: false, why: '56 個百＝5600，不是 56。' }
          ],
          wrongIndex: 2,
          why: '5600＝56 個百。'
        }),
        errorP({
          id: 'e4', title: '寫數錯在哪？', expression: '1 萬 5 佰',
          correctAnswer: '10500',
          lines: [
            { text: '1 萬＝10000', ok: true },
            { text: '5 佰＝500', ok: true },
            { text: '有人寫成 1500（漏掉萬後面的 0 位）', ok: false, why: '中間百千之間的 0 要保留；是 10500。' }
          ],
          wrongIndex: 2,
          why: '1 萬 5 佰＝10500。'
        })
      ]),

      L('m41-calc1', '多位數乘除', '一步步對齊', 'calc', ['scaffold', 'error'], [
        scaffold({
          id: 's1', prompt: '125 × 3 = ?', expression: '125×3', answer: '375', answers: ['375'],
          hints: ['3×5=15 寫 5 進 1；3×2+1=7；3×1=3。', '答案 375。', '答案是 375。', '答案是 375。'],
          pitfall: 'regroup'
        }),
        scaffold({
          id: 's2', prompt: '84 ÷ 4 = ?', expression: '84÷4', answer: '21', answers: ['21'],
          hints: ['8÷4=2，4÷4=1。', '商是 21。', '答案 21。', '答案是 21。']
        }),
        scaffold({
          id: 's3', prompt: '216 × 2 = ?', expression: '216×2', answer: '432', answers: ['432'],
          hints: ['2×6=12 寫 2 進 1；2×1+1=3；2×2=4。', '答案 432。', '答案是 432。', '答案是 432。'],
          pitfall: 'regroup'
        }),
        scaffold({
          id: 's4', prompt: '96 ÷ 3 = ?', expression: '96÷3', answer: '32', answers: ['32'],
          hints: ['9÷3=3，6÷3=2。', '商是 32。', '答案 32。', '答案是 32。']
        }),
        scaffold({
          id: 's5', prompt: '150 × 4 = ?', expression: '150×4', answer: '600', answers: ['600'],
          hints: ['4×0=0；4×5=20 寫 0 進 2；4×1+2=6。', '答案 600。', '答案是 600。', '答案是 600。'],
          pitfall: 'regroup'
        }),
        scaffold({
          id: 's6', prompt: '72 ÷ 6 = ?', expression: '72÷6', answer: '12', answers: ['12'],
          hints: ['想想 6×12=72。', '商是 12。', '答案 12。', '答案是 12。']
        }),
        scaffold({
          id: 's7', prompt: '205 × 3 = ?', expression: '205×3', answer: '615', answers: ['615'],
          hints: ['3×5=15 寫 5 進 1；3×0+1=1；3×2=6。', '答案 615。', '答案是 615。', '答案是 615。'],
          pitfall: 'regroup'
        }),
        scaffold({
          id: 's8', prompt: '105 ÷ 5 = ?', expression: '105÷5', answer: '21', answers: ['21'],
          hints: ['5×21=105。', '或 100÷5=20，5÷5=1。', '答案 21。', '答案是 21。']
        }),
        errorP({
          id: 'e1', title: '除法哪步錯？', expression: '96 ÷ 3',
          correctAnswer: '32',
          lines: [
            { text: '9÷3=3，寫在十位', ok: true },
            { text: '6÷3=2，寫在個位', ok: true },
            { text: '有人把商寫成 23（十位個位對調）', ok: false, why: '商的位值要對齊：是 32 不是 23。' }
          ],
          wrongIndex: 2,
          why: '96÷3=32。'
        }),
        errorP({
          id: 'e2', title: '乘法哪步錯？', expression: '48 × 2',
          correctAnswer: '96',
          lines: [
            { text: '個位 8×2=16，寫 6 進 1', ok: true },
            { text: '十位 4×2=8，再加進位 1 得 9', ok: true },
            { text: '有人漏加進位，寫成 86', ok: false, why: '進位的 1 要加在十位；正確是 96。' }
          ],
          wrongIndex: 2,
          why: '48×2=96。'
        }),
        errorP({
          id: 'e3', title: '除法錯在哪？', expression: '63 ÷ 3',
          correctAnswer: '21',
          lines: [
            { text: '6÷3=2，寫在十位', ok: true },
            { text: '3÷3=1，寫在個位', ok: true },
            { text: '有人做成 63÷3=20（個位漏除）', ok: false, why: '個位 3÷3=1，商是 21。' }
          ],
          wrongIndex: 2,
          why: '63÷3=21。'
        }),
        errorP({
          id: 'e4', title: '乘法直式錯在哪？', expression: '135 × 2',
          correctAnswer: '270',
          lines: [
            { text: '2×5=10，寫 0 進 1', ok: true },
            { text: '2×3+1=7', ok: true },
            { text: '2×1=2，合起來應是 270', ok: true },
            { text: '有人把進位忘了，寫成 260', ok: false, why: '中間那位要加進位；正確是 270。' }
          ],
          wrongIndex: 3,
          why: '135×2=270。'
        })
      ]),

      L('m41-frac1', '等值分數與小數', '一樣多的不同寫法', 'frac', ['scaffold', 'word'], [
        scaffold({
          id: 's1', prompt: '1/2 = ?/4', expression: '等值', answer: '2', answers: ['2', '2/4'],
          hints: ['上下同乘 2。', '1×2 / 2×2 = 2/4。', '答案分子是 2。', '答案是 2。']
        }),
        scaffold({
          id: 's2', prompt: '0.25 等於幾分之幾？（最簡）', expression: '小數→分數',
          answer: '1/4', answers: ['1/4', '¼', '25/100', '1／4'],
          hints: ['0.25=25/100。', '約分÷25 → 1/4。', '答案 1/4。', '答案是 1/4。']
        }),
        scaffold({
          id: 's3', prompt: '1/3 = ?/6', expression: '等值', answer: '2', answers: ['2', '2/6'],
          hints: ['上下同乘 2。', '1×2 / 3×2 = 2/6。', '答案分子是 2。', '答案是 2。']
        }),
        scaffold({
          id: 's4', prompt: '0.5 等於幾分之幾？（最簡）', expression: '小數→分數',
          answer: '1/2', answers: ['1/2', '½', '5/10', '1／2'],
          hints: ['0.5=5/10。', '約分÷5 → 1/2。', '答案 1/2。', '答案是 1/2。']
        }),
        scaffold({
          id: 's5', prompt: '2/5 = ?/10', expression: '等值', answer: '4', answers: ['4', '4/10'],
          hints: ['上下同乘 2。', '2×2 / 5×2 = 4/10。', '答案分子是 4。', '答案是 4。']
        }),
        scaffold({
          id: 's6', prompt: '0.75 等於幾分之幾？（最簡）', expression: '小數→分數',
          answer: '3/4', answers: ['3/4', '¾', '75/100', '3／4'],
          hints: ['0.75=75/100。', '約分÷25 → 3/4。', '答案 3/4。', '答案是 3/4。']
        }),
        scaffold({
          id: 's7', prompt: '3/4 = ?/8', expression: '等值', answer: '6', answers: ['6', '6/8'],
          hints: ['上下同乘 2。', '3×2 / 4×2 = 6/8。', '答案分子是 6。', '答案是 6。']
        }),
        scaffold({
          id: 's8', prompt: '2/8 約成最簡分數是？', expression: '約分', answer: '1/4', answers: ['1/4', '¼', '1／4'],
          hints: ['上下同除以 2。', '2÷2 / 8÷2 = 1/4。', '答案 1/4。', '答案是 1/4。']
        }),
        word({
          id: 'w1',
          story: '媽媽說：「倒了半杯水。」半杯用分數怎麼寫？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('半杯的分數寫法', ['水有幾 c.c.', '杯子多大']),
          askOp: '半是？',
          opOptions: choiceWhat('1/2', ['1/3', '2/1']),
          answer: '1/2', answers: ['1/2', '½', '二分之一'],
          hints: ['一半就是 1/2。', '答案 1/2。', '答案是 1/2。', '答案是 1/2。'],
          explain: '半＝1/2。'
        }),
        word({
          id: 'w2',
          story: '披薩切成 8 等份，小華吃了 2 份。吃了全部的幾分之幾？（可約分）',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('吃了全部的幾分之幾', ['切成幾份', '剩幾份']),
          askOp: '怎麼寫？',
          opOptions: choiceWhat('2/8 約成 1/4', ['2/6', '8/2']),
          answer: '1/4', answers: ['1/4', '¼', '2/8', '1／4'],
          hints: ['吃了 2/8。', '上下÷2 得 1/4。', '答案 1/4。', '答案是 1/4。'],
          explain: '2/8=1/4。'
        }),
        word({
          id: 'w3',
          story: '一條繩子長 1 公尺，剪下 0.25 公尺。剪下的是全長的幾分之幾？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('剪下佔全長的幾分之幾', ['繩子幾公尺', '還剩幾公尺']),
          askOp: '0.25 等於？',
          opOptions: choiceWhat('1/4', ['1/2', '1/5']),
          answer: '1/4', answers: ['1/4', '¼', '0.25', '1／4'],
          hints: ['0.25=25/100=1/4。', '答案 1/4。', '答案是 1/4。', '答案是 1/4。'],
          explain: '0.25＝1/4。'
        }),
        word({
          id: 'w4',
          story: '班級 10 人中有 5 人參加社團。參加的人數佔全班幾分之幾？（最簡）',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('參加人數佔全班幾分之幾', ['參加幾人', '全班幾人']),
          askOp: '怎麼寫？',
          opOptions: choiceWhat('5/10 約成 1/2', ['5/5', '10/5']),
          answer: '1/2', answers: ['1/2', '½', '5/10', '1／2'],
          hints: ['5/10。', '上下÷5 得 1/2。', '答案 1/2。', '答案是 1/2。'],
          explain: '5/10=1/2。'
        }),
        word({
          id: 'w5',
          story: '蛋糕切成 4 等份，吃掉 3 份。吃掉的用分數怎麼寫？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('吃掉佔全部的幾分之幾', ['切成幾份', '剩幾份']),
          askOp: '怎麼寫？',
          opOptions: choiceWhat('3/4', ['3/3', '4/3']),
          answer: '3/4', answers: ['3/4', '¾', '3／4'],
          hints: ['分子是吃掉的份數。', '分母是全部份數。', '是 3/4。', '答案是 3/4。'],
          explain: '吃掉 3/4。'
        }),
        word({
          id: 'w6',
          story: '水瓶容量的 0.5 等於幾分之幾？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('0.5 的分數寫法', ['水瓶多大', '水有幾毫升']),
          askOp: '0.5 等於？',
          opOptions: choiceWhat('1/2', ['1/5', '5/1']),
          answer: '1/2', answers: ['1/2', '½', '5/10', '1／2'],
          hints: ['0.5 就是一半。', '寫成 1/2。', '答案 1/2。', '答案是 1/2。'],
          explain: '0.5＝1/2。'
        })
      ]),

      L('m41-shape1', '角度', '直角、銳角、鈍角', 'shape', ['scaffold', 'word'], [
        scaffold({
          id: 's1', prompt: '剛好 90 度的角叫做？', expression: '角', answer: '直角', answers: ['直角'],
          hints: ['像書本角落那樣方方的。', '叫直角。', '答案是直角。', '答案是直角。']
        }),
        scaffold({
          id: 's2', prompt: '比直角小的角叫做？', expression: '角', answer: '銳角', answers: ['銳角'],
          hints: ['小於 90°。', '叫銳角。', '答案是銳角。', '答案是銳角。']
        }),
        scaffold({
          id: 's3', prompt: '比直角大、比平角小的角叫做？', expression: '角', answer: '鈍角', answers: ['鈍角'],
          hints: ['大於 90°、小於 180°。', '叫鈍角。', '答案是鈍角。', '答案是鈍角。']
        }),
        scaffold({
          id: 's4', prompt: '平角是幾度？', expression: '角', answer: '180', answers: ['180', '180度', '180°'],
          hints: ['一條直線張開的角。', '平角＝180 度。', '答案 180。', '答案是 180。']
        }),
        scaffold({
          id: 's5', prompt: '45 度的角是什麼角？', expression: '角', answer: '銳角', answers: ['銳角'],
          hints: ['45 < 90。', '比直角小→銳角。', '答案是銳角。', '答案是銳角。']
        }),
        scaffold({
          id: 's6', prompt: '120 度的角是什麼角？', expression: '角', answer: '鈍角', answers: ['鈍角'],
          hints: ['120 > 90 且 < 180。', '是鈍角。', '答案是鈍角。', '答案是鈍角。']
        }),
        scaffold({
          id: 's7', prompt: '直角是幾度？', expression: '角', answer: '90', answers: ['90', '90度', '90°'],
          hints: ['方方正正的角。', '直角＝90 度。', '答案 90。', '答案是 90。']
        }),
        scaffold({
          id: 's8', prompt: '30 度的角是什麼角？', expression: '角', answer: '銳角', answers: ['銳角'],
          hints: ['30 < 90。', '是銳角。', '答案是銳角。', '答案是銳角。']
        }),
        word({
          id: 'w1',
          story: '一把扇子張開的角度比直角大、比平角小。這是什麼角？',
          askWhat: '在問角的名稱',
          whatOptions: choiceWhat('這是什麼角', ['扇子幾度', '是不是直角']),
          askOp: '大於直角、小於平角？',
          opOptions: choiceWhat('鈍角', ['銳角', '直角']),
          answer: '鈍角', answers: ['鈍角'],
          hints: ['90°～180° 之間是鈍角。', '答案鈍角。', '答案是鈍角。', '答案是鈍角。'],
          explain: '鈍角。'
        }),
        word({
          id: 'w2',
          story: '時鐘的指針從 3 走到 12，這段夾角剛好像書本角落。這是什麼角？',
          askWhat: '在問角的名稱',
          whatOptions: choiceWhat('這是什麼角', ['走了幾小時', '幾點鐘']),
          askOp: '像書本角落？',
          opOptions: choiceWhat('直角', ['銳角', '鈍角']),
          answer: '直角', answers: ['直角'],
          hints: ['方方的角是直角。', '答案直角。', '答案是直角。', '答案是直角。'],
          explain: '直角。'
        }),
        word({
          id: 'w3',
          story: '剪刀張開一個很小的口，角度明顯小於直角。這是什麼角？',
          askWhat: '在問角的名稱',
          whatOptions: choiceWhat('這是什麼角', ['剪刀幾度', '是不是平角']),
          askOp: '小於直角？',
          opOptions: choiceWhat('銳角', ['鈍角', '直角']),
          answer: '銳角', answers: ['銳角'],
          hints: ['小於 90° 是銳角。', '答案銳角。', '答案是銳角。', '答案是銳角。'],
          explain: '銳角。'
        }),
        word({
          id: 'w4',
          story: '一張紙對折後再打開，折痕兩邊合成一條直線。這個角是幾度？',
          askWhat: '求角度',
          whatOptions: choiceWhat('這個平角是幾度', ['紙多長', '折了幾次']),
          askOp: '直線的角？',
          opOptions: choiceWhat('180度', ['90度', '45度']),
          answer: '180', answers: ['180', '180度', '180°'],
          hints: ['平角是 180 度。', '答案 180。', '答案是 180。', '答案是 180。'],
          explain: '平角＝180°。'
        }),
        word({
          id: 'w5',
          story: '屋頂斜面和地面的夾角大約 60 度。這是什麼角？',
          askWhat: '在問角的名稱',
          whatOptions: choiceWhat('這是什麼角', ['屋頂多高', '斜面多長']),
          askOp: '60 度屬於？',
          opOptions: choiceWhat('銳角', ['鈍角', '直角']),
          answer: '銳角', answers: ['銳角'],
          hints: ['60 < 90 → 銳角。', '答案銳角。', '答案是銳角。', '答案是銳角。'],
          explain: '銳角。'
        }),
        word({
          id: 'w6',
          story: '門打開到大約 135 度。這是什麼角？',
          askWhat: '在問角的名稱',
          whatOptions: choiceWhat('這是什麼角', ['門多寬', '開了幾次']),
          askOp: '135 度屬於？',
          opOptions: choiceWhat('鈍角', ['銳角', '直角']),
          answer: '鈍角', answers: ['鈍角'],
          hints: ['135 在 90 和 180 之間。', '是鈍角。', '答案鈍角。', '答案是鈍角。'],
          explain: '鈍角。'
        })
      ]),

      L('m41-review1', '小小複習', '大數・乘除・分數', 'review', ['recap'], [
        recap({
          id: 'r1', title: '四年級上・小小複習',
          questions: [
            { q: '1 萬 = 幾千？', a: '10', answers: ['10', '10千'], tip: '換算' },
            { q: '36 × 5 = ?', a: '180', answers: ['180'], tip: '乘法' },
            { q: '2/6 約成最簡？', a: '1/3', answers: ['1/3', '⅓'], tip: '上下÷2' },
            { q: '4080 的百位是？', a: '0', answers: ['0'], tip: '位值' },
            { q: '72 ÷ 8 = ?', a: '9', answers: ['9'], tip: '除法' },
            { q: '0.5 = ?（分數最簡）', a: '1/2', answers: ['1/2', '½'], tip: '小數' },
            { q: '剛好 90 度叫？', a: '直角', answers: ['直角'], tip: '角度' },
            { q: '1/2 = ?/8', a: '4', answers: ['4', '4/8'], tip: '等值' }
          ]
        })
      ], { review: true })
    ]
  };
};
