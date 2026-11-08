'use strict';

/** 二年級上 — thickened practice banks */
module.exports = function (h) {
  var L = h.L, scaffold = h.scaffold, word = h.word, errorP = h.errorP, recap = h.recap, choiceWhat = h.choiceWhat;

  return {
    meta: { label: '二年級上學期', track: '課綱進度', focus: '100 以內數、兩位數加減進退位、公分、乘法初步', units: 5 },
    lessons: [
      L('m21-count1', '100 以內與位值', '十位・個位', 'count', ['scaffold', 'error'], [
        scaffold({
          id: 's1', prompt: '47 的十位是？', expression: '位值', answer: '4', answers: ['4'],
          hints: ['左邊是十位。', '47 寫成 4 個十和 7 個一。', '十位是 4。', '答案是 4。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's2', prompt: '3 個十和 9 個一是多少？', expression: '合成', answer: '39', answers: ['39'],
          hints: ['3 個十＝30。', '30+9=39。', '答案是 39。', '答案是 39。']
        }),
        scaffold({
          id: 's3', prompt: '83 的個位是？', expression: '位值', answer: '3', answers: ['3'],
          hints: ['個位在最右邊。', '83：十位 8、個位 3。', '個位是 3。', '答案是 3。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's4', prompt: '5 個十和 0 個一是多少？', expression: '合成', answer: '50', answers: ['50'],
          hints: ['5 個十＝50。', '個位是 0，還是 50。', '答案是 50。', '答案是 50。']
        }),
        scaffold({
          id: 's5', prompt: '哪個比較大？68 還是 86？', expression: '比較', answer: '86', answers: ['86'],
          hints: ['先比十位。', '8 個十比 6 個十大。', '86 比較大。', '答案是 86。'],
          pitfall: 'compare'
        }),
        scaffold({
          id: 's6', prompt: '72 裡面有幾個十？', expression: '位值', answer: '7', answers: ['7', '7個'],
          hints: ['看十位的數字。', '72 的十位是 7。', '有 7 個十。', '答案是 7。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's7', prompt: '4 個十和 6 個一，再加 1 個十是多少？', expression: '合成', answer: '56', answers: ['56'],
          hints: ['先合成 46。', '再加 1 個十＝10，46+10=56。', '答案是 56。', '答案是 56。']
        }),
        scaffold({
          id: 's8', prompt: '把 90 想成「幾個十」？', expression: '位值', answer: '9', answers: ['9', '9個', '9個十'],
          hints: ['90＝9×10。', '十位是 9。', '是 9 個十。', '答案是 9。'],
          pitfall: 'place'
        }),
        errorP({
          id: 'e1', title: '誰搞錯位值了？', expression: '讀數 52',
          correctAnswer: '52',
          lines: [
            { text: '個位是 2', ok: true },
            { text: '十位是 5', ok: true },
            { text: '所以這是 25（把十位個位說反了）', ok: false, why: '5 在十位、2 在個位，應讀作 52，不是 25。' }
          ],
          wrongIndex: 2,
          why: '位值不能左右對調：52 ≠ 25。'
        }),
        errorP({
          id: 'e2', title: '哪一步位值錯了？', expression: '讀數 70',
          correctAnswer: '70',
          lines: [
            { text: '十位是 7，表示 7 個十', ok: true },
            { text: '個位是 0', ok: true },
            { text: '有人說這是 7（把十位當個位）', ok: false, why: '7 在十位，應是 70，不是 7。' }
          ],
          wrongIndex: 2,
          why: '十位的 7 代表 70。'
        }),
        errorP({
          id: 'e3', title: '合成哪裡錯了？', expression: '6 個十 + 4 個一',
          correctAnswer: '64',
          lines: [
            { text: '6 個十＝60', ok: true },
            { text: '再加 4 個一', ok: true },
            { text: '寫成 46（十位個位對調）', ok: false, why: '十位應寫 6、個位寫 4，是 64 不是 46。' }
          ],
          wrongIndex: 2,
          why: '6 個十和 4 個一合成 64。'
        }),
        errorP({
          id: 'e4', title: '比大小哪步錯？', expression: '比較 39 和 93',
          correctAnswer: '93 比較大',
          lines: [
            { text: '先看十位：3 和 9', ok: true },
            { text: '9 個十比較大，所以 93 大', ok: true },
            { text: '有人只看個位 9>3，說 39 比較大', ok: false, why: '要比十位；93 的十位比較大。' }
          ],
          wrongIndex: 2,
          why: '比兩位數大小時，先比十位。'
        })
      ]),

      L('m21-calc1', '兩位數加法（進位）', '個位滿十向前進', 'calc', ['scaffold', 'error'], [
        scaffold({
          id: 's1', prompt: '28 + 17 = ?', expression: '28 + 17', answer: '45', answers: ['45'],
          steps: [
            { ask: '個位 8+7=？', answer: '15', tip: '先算個位' },
            { ask: '個位寫下幾？進幾？', answer: '5進1', tip: '寫 5 進 1' },
            { ask: '十位 2+1+進位1=？', answer: '4', tip: '別忘進位' }
          ],
          hints: ['個位：8+7=15，寫 5 進 1。', '十位：2+1+1=4。', '答案 45。', '答案是 45。'],
          pitfall: 'regroup',
          companionAsk: '進位的那 1 要加在十位喔！'
        }),
        scaffold({
          id: 's2', prompt: '36 + 29 = ?', expression: '36 + 29', answer: '65', answers: ['65'],
          hints: ['個位 6+9=15，寫 5 進 1。', '十位 3+2+1=6。', '答案 65。', '答案是 65。'],
          pitfall: 'regroup'
        }),
        scaffold({
          id: 's3', prompt: '48 + 27 = ?', expression: '48 + 27', answer: '75', answers: ['75'],
          hints: ['個位 8+7=15，寫 5 進 1。', '十位 4+2+1=7。', '答案 75。', '答案是 75。'],
          pitfall: 'regroup'
        }),
        scaffold({
          id: 's4', prompt: '59 + 16 = ?', expression: '59 + 16', answer: '75', answers: ['75'],
          hints: ['個位 9+6=15，寫 5 進 1。', '十位 5+1+1=7。', '答案 75。', '答案是 75。'],
          pitfall: 'regroup'
        }),
        scaffold({
          id: 's5', prompt: '37 + 48 = ?', expression: '37 + 48', answer: '85', answers: ['85'],
          hints: ['個位 7+8=15，寫 5 進 1。', '十位 3+4+1=8。', '答案 85。', '答案是 85。'],
          pitfall: 'regroup'
        }),
        scaffold({
          id: 's6', prompt: '26 + 39 = ?', expression: '26 + 39', answer: '65', answers: ['65'],
          hints: ['個位 6+9=15，寫 5 進 1。', '十位 2+3+1=6。', '答案 65。', '答案是 65。'],
          pitfall: 'regroup'
        }),
        scaffold({
          id: 's7', prompt: '18 + 47 = ?', expression: '18 + 47', answer: '65', answers: ['65'],
          hints: ['個位 8+7=15，寫 5 進 1。', '十位 1+4+1=6。', '答案 65。', '答案是 65。'],
          pitfall: 'regroup'
        }),
        scaffold({
          id: 's8', prompt: '55 + 28 = ?', expression: '55 + 28', answer: '83', answers: ['83'],
          hints: ['個位 5+8=13，寫 3 進 1。', '十位 5+2+1=8。', '答案 83。', '答案是 83。'],
          pitfall: 'regroup'
        }),
        errorP({
          id: 'e1', title: '直式哪一行錯了？', expression: '45 + 28',
          correctAnswer: '73',
          lines: [
            { text: '個位：5+8=13，寫 3 進 1', ok: true },
            { text: '十位：4+2=6（忘記加進位）', ok: false, why: '十位要加進位的 1：4+2+1=7。' },
            { text: '答案寫成 63', ok: false, why: '因為漏加進位。' }
          ],
          wrongIndex: 1,
          why: '漏掉進位是常見錯誤；正確是 73。'
        }),
        errorP({
          id: 'e2', title: '進位哪步錯了？', expression: '39 + 27',
          correctAnswer: '66',
          lines: [
            { text: '個位 9+7=16，寫 6 進 1', ok: true },
            { text: '十位 3+2=5，再加進位 1 得 6', ok: true },
            { text: '有人個位寫 16 不進位，答案變成 516', ok: false, why: '個位只能寫一位數，滿十要進位。' }
          ],
          wrongIndex: 2,
          why: '39+27=66，個位滿十一定要進位。'
        }),
        errorP({
          id: 'e3', title: '哪裡算錯了？', expression: '56 + 19',
          correctAnswer: '75',
          lines: [
            { text: '個位 6+9=15，寫 5 進 1', ok: true },
            { text: '十位：5+1=6（漏加進位）', ok: false, why: '十位是 5+1+進位1=7。' },
            { text: '答案寫 65', ok: false, why: '漏了進位的 1。' }
          ],
          wrongIndex: 1,
          why: '正確是 56+19=75。'
        }),
        errorP({
          id: 'e4', title: '直式錯在哪？', expression: '47 + 35',
          correctAnswer: '82',
          lines: [
            { text: '個位 7+5=12，寫 2 進 1', ok: true },
            { text: '十位 4+3+1=8', ok: true },
            { text: '有人把進位加到個位又加一次，寫成 92', ok: false, why: '進位只能加在十位一次；正確是 82。' }
          ],
          wrongIndex: 2,
          why: '47+35=82。'
        })
      ]),

      L('m21-calc2', '兩位數減法（退位）', '不夠就借', 'calc', ['scaffold', 'error', 'word'], [
        scaffold({
          id: 's1', prompt: '52 − 18 = ?', expression: '52 − 18', answer: '34', answers: ['34'],
          steps: [
            { ask: '個位 2 夠不夠減 8？', answer: '不夠', tip: '要借' },
            { ask: '借位後個位變 12，12−8=？', answer: '4', tip: '個位' },
            { ask: '十位 5 借走後剩 4，4−1=？', answer: '3', tip: '十位' }
          ],
          hints: ['個位不夠，向十位借 1。', '12−8=4；十位 4−1=3。', '答案 34。', '答案是 34。'],
          pitfall: 'borrow'
        }),
        scaffold({
          id: 's2', prompt: '71 − 34 = ?', expression: '71 − 34', answer: '37', answers: ['37'],
          hints: ['個位 1 不夠減 4，借位變 11。', '11−4=7；十位 6−3=3。', '答案 37。', '答案是 37。'],
          pitfall: 'borrow'
        }),
        scaffold({
          id: 's3', prompt: '80 − 27 = ?', expression: '80 − 27', answer: '53', answers: ['53'],
          hints: ['個位 0 不夠，借成 10。', '10−7=3；十位 7−2=5。', '答案 53。', '答案是 53。'],
          pitfall: 'borrow'
        }),
        scaffold({
          id: 's4', prompt: '64 − 19 = ?', expression: '64 − 19', answer: '45', answers: ['45'],
          hints: ['個位不夠，14−9=5。', '十位 5−1=4。', '答案 45。', '答案是 45。'],
          pitfall: 'borrow'
        }),
        scaffold({
          id: 's5', prompt: '93 − 48 = ?', expression: '93 − 48', answer: '45', answers: ['45'],
          hints: ['個位 3 不夠減 8，借成 13。', '13−8=5；十位 8−4=4。', '答案 45。', '答案是 45。'],
          pitfall: 'borrow'
        }),
        scaffold({
          id: 's6', prompt: '55 − 27 = ?', expression: '55 − 27', answer: '28', answers: ['28'],
          hints: ['個位 5 不夠減 7，借成 15。', '15−7=8；十位 4−2=2。', '答案 28。', '答案是 28。'],
          pitfall: 'borrow'
        }),
        scaffold({
          id: 's7', prompt: '42 − 15 = ?', expression: '42 − 15', answer: '27', answers: ['27'],
          hints: ['個位借位：12−5=7。', '十位 3−1=2。', '答案 27。', '答案是 27。'],
          pitfall: 'borrow'
        }),
        scaffold({
          id: 's8', prompt: '60 − 38 = ?', expression: '60 − 38', answer: '22', answers: ['22'],
          hints: ['個位 0 借成 10，10−8=2。', '十位 5−3=2。', '答案 22。', '答案是 22。'],
          pitfall: 'borrow'
        }),
        errorP({
          id: 'e1', title: '哪一步借位錯了？', expression: '40 − 16',
          correctAnswer: '24',
          lines: [
            { text: '個位 0 不夠減 6，向十位借 1', ok: true },
            { text: '個位變成 10，10−6=4', ok: true },
            { text: '十位借走後是 4，再減 1 得 3（錯把 4 當沒借）', ok: false, why: '十位原是 4，借走後是 3，再減 1 應是 2。' },
            { text: '答案寫 34', ok: false, why: '十位算錯。' }
          ],
          wrongIndex: 2,
          why: '借位後十位是 3−1=2，答案 24。'
        }),
        errorP({
          id: 'e2', title: '退位哪裡錯？', expression: '53 − 29',
          correctAnswer: '24',
          lines: [
            { text: '個位 3 不夠減 9，向十位借 1', ok: true },
            { text: '個位 13−9=4', ok: true },
            { text: '十位忘了減借走的 1，算成 5−2=3', ok: false, why: '借走後十位是 4，再減 2 得 2。' }
          ],
          wrongIndex: 2,
          why: '正確是 53−29=24。'
        }),
        errorP({
          id: 'e3', title: '直式錯在哪？', expression: '81 − 47',
          correctAnswer: '34',
          lines: [
            { text: '個位不夠，借成 11−7=4', ok: true },
            { text: '十位應是 7−4=3', ok: true },
            { text: '有人個位直接 7−1 倒過來減，寫成 46', ok: false, why: '不夠減要向十位借，不能上下對調硬減。' }
          ],
          wrongIndex: 2,
          why: '81−47=34。'
        }),
        errorP({
          id: 'e4', title: '借位錯在哪一步？', expression: '70 − 25',
          correctAnswer: '45',
          lines: [
            { text: '個位 0 不夠，向十位借 1 變成 10', ok: true },
            { text: '10−5=5', ok: true },
            { text: '十位借走後還當 7 去減 2，寫成 55', ok: false, why: '十位借走後是 6，6−2=4，答案 45。' }
          ],
          wrongIndex: 2,
          why: '借位後十位少 1；70−25=45。'
        }),
        word({
          id: 'w1',
          story: '書包裡有 63 枝彩色筆，借給同學 25 枝。還剩幾枝？',
          askWhat: '要求什麼？',
          whatOptions: choiceWhat('還剩幾枝彩色筆', ['借出幾枝', '原本幾枝']),
          askOp: '算式？',
          opOptions: choiceWhat('63 − 25', ['63 + 25', '25 − 63']),
          answer: '38', answers: ['38'],
          hints: ['還剩→減法，且要退位。', '個位 3−5 不夠。', '63−25=38。', '還剩 38 枝。'],
          explain: '63−25=38。'
        }),
        word({
          id: 'w2',
          story: '操場上有 81 個小朋友，走掉 36 人。還剩幾人？',
          askWhat: '要求什麼？',
          whatOptions: choiceWhat('還剩幾人', ['走掉幾人', '原本幾人']),
          askOp: '算式？',
          opOptions: choiceWhat('81 − 36', ['81 + 36', '36 − 81']),
          answer: '45', answers: ['45'],
          hints: ['還剩→減法。', '個位要借位。', '81−36=45。', '還剩 45 人。'],
          explain: '81−36=45。'
        }),
        word({
          id: 'w3',
          story: '水壺裡有 50 杯水，倒掉 18 杯。還剩幾杯？',
          askWhat: '要求什麼？',
          whatOptions: choiceWhat('還剩幾杯水', ['倒掉幾杯', '原本幾杯']),
          askOp: '算式？',
          opOptions: choiceWhat('50 − 18', ['50 + 18', '18 − 50']),
          answer: '32', answers: ['32'],
          hints: ['還剩→減法。', '個位 0 不夠減 8。', '50−18=32。', '還剩 32 杯。'],
          explain: '50−18=32。'
        }),
        word({
          id: 'w4',
          story: '小美有 74 張貼紙，送給弟弟 29 張。還剩幾張？',
          askWhat: '要求什麼？',
          whatOptions: choiceWhat('還剩幾張貼紙', ['送出幾張', '原本幾張']),
          askOp: '算式？',
          opOptions: choiceWhat('74 − 29', ['74 + 29', '29 − 74']),
          answer: '45', answers: ['45'],
          hints: ['還剩→減法。', '個位要退位。', '74−29=45。', '還剩 45 張。'],
          explain: '74−29=45。'
        }),
        word({
          id: 'w5',
          story: '書架上有 92 本書，借出 47 本。還剩幾本？',
          askWhat: '要求什麼？',
          whatOptions: choiceWhat('還剩幾本書', ['借出幾本', '原本幾本']),
          askOp: '算式？',
          opOptions: choiceWhat('92 − 47', ['92 + 47', '47 − 92']),
          answer: '45', answers: ['45'],
          hints: ['還剩→減法。', '個位 2 不夠減 7。', '92−47=45。', '還剩 45 本。'],
          explain: '92−47=45。'
        }),
        word({
          id: 'w6',
          story: '班上蒐集了 65 個瓶蓋，丟掉壞的 28 個。還剩幾個？',
          askWhat: '要求什麼？',
          whatOptions: choiceWhat('還剩幾個瓶蓋', ['丟掉幾個', '原本幾個']),
          askOp: '算式？',
          opOptions: choiceWhat('65 − 28', ['65 + 28', '28 − 65']),
          answer: '37', answers: ['37'],
          hints: ['還剩→減法。', '個位要借位。', '65−28=37。', '還剩 37 個。'],
          explain: '65−28=37。'
        })
      ]),

      L('m21-measure1', '公分與乘法初步', '用尺量、相同的加', 'measure', ['scaffold', 'word'], [
        scaffold({
          id: 's1', prompt: '一支鉛筆長 15 公分，另一支長 9 公分。差幾公分？', expression: '15−9',
          answer: '6', answers: ['6', '6公分'],
          hints: ['求相差用減法。', '15−9=6。', '差 6 公分。', '答案是 6。'],
          pitfall: 'unit'
        }),
        scaffold({
          id: 's2', prompt: '3 個 4 合起來是？', expression: '3×4 或 4+4+4', answer: '12', answers: ['12'],
          hints: ['4+4+4。', '也可以想成 3×4。', '答案 12。', '答案是 12。']
        }),
        scaffold({
          id: 's3', prompt: '直尺從 0 量到 12，這段長幾公分？', expression: '長度', answer: '12', answers: ['12', '12公分'],
          hints: ['從 0 到 12。', '長度是 12 公分。', '答案 12。', '答案是 12。'],
          pitfall: 'unit'
        }),
        scaffold({
          id: 's4', prompt: '2 個 5 合起來是？', expression: '2×5 或 5+5', answer: '10', answers: ['10'],
          hints: ['5+5。', '2×5=10。', '答案 10。', '答案是 10。']
        }),
        scaffold({
          id: 's5', prompt: '一條線 30 公分，另一條 18 公分。合起來幾公分？', expression: '30+18',
          answer: '48', answers: ['48', '48公分'],
          hints: ['合起來用加法。', '30+18=48。', '答案 48 公分。', '答案是 48。'],
          pitfall: 'unit'
        }),
        scaffold({
          id: 's6', prompt: '4 個 3 合起來是？', expression: '4×3 或 3+3+3+3', answer: '12', answers: ['12'],
          hints: ['3+3+3+3。', '4×3=12。', '答案 12。', '答案是 12。']
        }),
        scaffold({
          id: 's7', prompt: '橡皮擦長 4 公分，排 5 枝連起來大約幾公分？', expression: '4×5',
          answer: '20', answers: ['20', '20公分'],
          hints: ['相同長度相加。', '4×5=20。', '答案 20 公分。', '答案是 20。'],
          pitfall: 'unit'
        }),
        scaffold({
          id: 's8', prompt: '25 公分比 19 公分長幾公分？', expression: '25−19',
          answer: '6', answers: ['6', '6公分'],
          hints: ['求相差用減法。', '25−19=6。', '長 6 公分。', '答案是 6。'],
          pitfall: 'unit'
        }),
        word({
          id: 'w1',
          story: '一條緞帶 20 公分，剪掉 8 公分。還剩幾公分？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('還剩幾公分', ['剪掉幾公分', '原本幾公分']),
          askOp: '算式？',
          opOptions: choiceWhat('20 − 8', ['20 + 8', '8 − 20']),
          answer: '12', answers: ['12', '12公分'],
          hints: ['注意單位是公分。', '20−8=12。', '還剩 12 公分。', '答案 12 公分。'],
          explain: '長度相減：20−8=12（公分）。',
          pitfall: 'unit'
        }),
        word({
          id: 'w2',
          story: '小華身高比妹妹高 12 公分，妹妹高 110 公分。小華高幾公分？（先想相差）妹妹加相差等於小華。',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('小華身高幾公分', ['妹妹多高', '相差幾公分']),
          askOp: '算式？',
          opOptions: choiceWhat('110 + 12', ['110 − 12', '12 − 110']),
          answer: '122', answers: ['122', '122公分'],
          hints: ['比妹妹高→加上相差。', '110+12=122。', '小華 122 公分。', '答案 122。'],
          explain: '110+12=122。',
          pitfall: 'unit'
        }),
        word({
          id: 'w3',
          story: '一盒積木每排 5 個，排了 3 排。一共幾個？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('一共幾個積木', ['一排幾個', '排了幾排']),
          askOp: '算式？',
          opOptions: choiceWhat('5 × 3', ['5 + 3', '5 − 3']),
          answer: '15', answers: ['15'],
          hints: ['相同的加幾次→乘法。', '5×3=15。', '一共 15 個。', '答案 15。'],
          explain: '5×3=15。'
        }),
        word({
          id: 'w4',
          story: '媽媽買繩子 45 公分，用掉 17 公分。還剩幾公分？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('還剩幾公分', ['用掉幾公分', '原本幾公分']),
          askOp: '算式？',
          opOptions: choiceWhat('45 − 17', ['45 + 17', '17 − 45']),
          answer: '28', answers: ['28', '28公分'],
          hints: ['還剩→減法。', '45−17=28。', '還剩 28 公分。', '答案 28。'],
          explain: '45−17=28。',
          pitfall: 'unit'
        }),
        word({
          id: 'w5',
          story: '一枝蠟筆大約 8 公分，4 枝首尾接起來大約幾公分？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('接起來大約幾公分', ['一枝幾公分', '有幾枝']),
          askOp: '算式？',
          opOptions: choiceWhat('8 × 4', ['8 + 4', '8 − 4']),
          answer: '32', answers: ['32', '32公分'],
          hints: ['相同長度相加。', '8×4=32。', '大約 32 公分。', '答案 32。'],
          explain: '8×4=32。',
          pitfall: 'unit'
        }),
        word({
          id: 'w6',
          story: '教室門口到黑板 28 公分又 28 公分再量一次，這兩段合起來幾公分？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('兩段合起來幾公分', ['一段幾公分', '量了幾次']),
          askOp: '算式？',
          opOptions: choiceWhat('28 + 28', ['28 − 28', '28 × 28']),
          answer: '56', answers: ['56', '56公分'],
          hints: ['合起來用加法，或 2 個 28。', '28+28=56。', '答案 56 公分。', '答案是 56。'],
          explain: '28+28=56。',
          pitfall: 'unit'
        })
      ]),

      L('m21-review1', '小小複習', '位值與進退位', 'review', ['recap'], [
        recap({
          id: 'r1', title: '二年級上・小小複習',
          questions: [
            { q: '58 的個位是？', a: '8', answers: ['8'], tip: '右邊' },
            { q: '27 + 15 = ?', a: '42', answers: ['42'], tip: '進位' },
            { q: '50 − 23 = ?', a: '27', answers: ['27'], tip: '退位' },
            { q: '64 的十位是？', a: '6', answers: ['6'], tip: '左邊' },
            { q: '38 + 27 = ?', a: '65', answers: ['65'], tip: '進位' },
            { q: '72 − 45 = ?', a: '27', answers: ['27'], tip: '退位' },
            { q: '4 個十和 5 個一是？', a: '45', answers: ['45'], tip: '合成' },
            { q: '3 個 5 合起來是？', a: '15', answers: ['15'], tip: '相同加' }
          ]
        })
      ], { review: true })
    ]
  };
};
