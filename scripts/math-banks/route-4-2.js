'use strict';

/** 四年級下 — thickened practice banks */
module.exports = function (h) {
  var L = h.L, scaffold = h.scaffold, word = h.word, errorP = h.errorP, recap = h.recap, choiceWhat = h.choiceWhat;

  return {
    meta: { label: '四年級下學期', track: '課綱進度', focus: '分數小數運算、四則、面積、平均', units: 5 },
    lessons: [
      L('m42-frac1', '異分母分數加減入門', '先通分', 'frac', ['scaffold', 'error'], [
        scaffold({
          id: 's1', prompt: '1/2 + 1/4 = ?', expression: '1/2+1/4', answer: '3/4', answers: ['3/4', '¾', '3／4'],
          hints: ['通分：1/2=2/4。', '2/4+1/4=3/4。', '答案 3/4。', '答案是 3/4。']
        }),
        scaffold({
          id: 's2', prompt: '1/3 + 1/6 = ?', expression: '1/3+1/6', answer: '1/2', answers: ['1/2', '½', '3/6', '1／2'],
          hints: ['通分：1/3=2/6。', '2/6+1/6=3/6=1/2。', '答案 1/2。', '答案是 1/2。']
        }),
        scaffold({
          id: 's3', prompt: '3/4 − 1/4 = ?', expression: '3/4−1/4', answer: '1/2', answers: ['1/2', '½', '2/4', '1／2'],
          hints: ['同分母直接減分子。', '3−1=2，得 2/4=1/2。', '答案 1/2。', '答案是 1/2。']
        }),
        scaffold({
          id: 's4', prompt: '1/2 + 1/8 = ?', expression: '1/2+1/8', answer: '5/8', answers: ['5/8', '5／8'],
          hints: ['1/2=4/8。', '4/8+1/8=5/8。', '答案 5/8。', '答案是 5/8。']
        }),
        scaffold({
          id: 's5', prompt: '5/6 − 1/3 = ?', expression: '5/6−1/3', answer: '1/2', answers: ['1/2', '½', '3/6', '1／2'],
          hints: ['1/3=2/6。', '5/6−2/6=3/6=1/2。', '答案 1/2。', '答案是 1/2。']
        }),
        scaffold({
          id: 's6', prompt: '1/5 + 2/5 = ?', expression: '1/5+2/5', answer: '3/5', answers: ['3/5', '3／5'],
          hints: ['同分母加分子。', '1+2=3。', '答案 3/5。', '答案是 3/5。']
        }),
        scaffold({
          id: 's7', prompt: '3/8 + 1/4 = ?', expression: '3/8+1/4', answer: '5/8', answers: ['5/8', '5／8'],
          hints: ['1/4=2/8。', '3/8+2/8=5/8。', '答案 5/8。', '答案是 5/8。']
        }),
        scaffold({
          id: 's8', prompt: '7/10 − 1/5 = ?', expression: '7/10−1/5', answer: '1/2', answers: ['1/2', '½', '5/10', '1／2'],
          hints: ['1/5=2/10。', '7/10−2/10=5/10=1/2。', '答案 1/2。', '答案是 1/2。']
        }),
        errorP({
          id: 'e1', title: '通分哪步錯？', expression: '1/3 + 1/6',
          correctAnswer: '1/2',
          lines: [
            { text: '公分母可取 6', ok: true },
            { text: '1/3 = 2/6', ok: true },
            { text: '2/6 + 1/6 = 3/6 = 1/2', ok: true },
            { text: '有人直接分子分母相加得 2/9', ok: false, why: '異分母不能直接上下亂加。' }
          ],
          wrongIndex: 3,
          why: '要先通分；1/3+1/6=1/2。'
        }),
        errorP({
          id: 'e2', title: '哪一步通分錯了？', expression: '1/2 + 1/4',
          correctAnswer: '3/4',
          lines: [
            { text: '公分母取 4', ok: true },
            { text: '1/2 = 2/4', ok: true },
            { text: '有人做成 1/2=1/4（分子忘了乘）', ok: false, why: '上下要同乘；1/2=2/4 不是 1/4。' }
          ],
          wrongIndex: 2,
          why: '通分後 2/4+1/4=3/4。'
        }),
        errorP({
          id: 'e3', title: '減法哪步錯？', expression: '5/6 − 1/2',
          correctAnswer: '1/3',
          lines: [
            { text: '公分母取 6', ok: true },
            { text: '1/2 = 3/6', ok: true },
            { text: '5/6 − 3/6 = 2/6 = 1/3', ok: true },
            { text: '有人直接 5−1 / 6−2 得 4/4', ok: false, why: '異分母不能上下分別亂減。' }
          ],
          wrongIndex: 3,
          why: '先通分；5/6−1/2=1/3。'
        }),
        errorP({
          id: 'e4', title: '約分前算錯在哪？', expression: '2/8 + 1/4',
          correctAnswer: '1/2',
          lines: [
            { text: '1/4 = 2/8', ok: true },
            { text: '2/8 + 2/8 = 4/8 = 1/2', ok: true },
            { text: '有人通分後加成 2/8+1/8=3/8', ok: false, why: '1/4 應化成 2/8，不是 1/8。' }
          ],
          wrongIndex: 2,
          why: '2/8+1/4=1/2。'
        })
      ]),

      L('m42-calc1', '小數加減與四則', '對齊小數點', 'calc', ['scaffold', 'error', 'word'], [
        scaffold({
          id: 's1', prompt: '3.6 + 2.45 = ?', expression: '3.6+2.45', answer: '6.05', answers: ['6.05'],
          hints: ['對齊小數點：3.60+2.45。', '等於 6.05。', '答案 6.05。', '答案是 6.05。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's2', prompt: '5.8 − 2.3 = ?', expression: '5.8−2.3', answer: '3.5', answers: ['3.5'],
          hints: ['對齊小數點再減。', '8−3=5，5−2=3。', '答案 3.5。', '答案是 3.5。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's3', prompt: '1.25 + 0.75 = ?', expression: '1.25+0.75', answer: '2', answers: ['2', '2.0', '2.00'],
          hints: ['對齊小數點。', '1.25+0.75=2.00。', '答案 2。', '答案是 2。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's4', prompt: '4.5 − 1.25 = ?', expression: '4.5−1.25', answer: '3.25', answers: ['3.25'],
          hints: ['4.50−1.25。', '等於 3.25。', '答案 3.25。', '答案是 3.25。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's5', prompt: '2.4 + 3.6 = ?', expression: '2.4+3.6', answer: '6', answers: ['6', '6.0'],
          hints: ['對齊小數點。', '2.4+3.6=6.0。', '答案 6。', '答案是 6。'],
          pitfall: 'place'
        }),
        scaffold({
          id: 's6', prompt: '7.2 ÷ 2 = ?', expression: '7.2÷2', answer: '3.6', answers: ['3.6'],
          hints: ['7.2 對半分。', '或 72÷2=36，小數點一位→3.6。', '答案 3.6。', '答案是 3.6。']
        }),
        scaffold({
          id: 's7', prompt: '0.8 × 3 = ?', expression: '0.8×3', answer: '2.4', answers: ['2.4'],
          hints: ['8×3=24，小數一位。', '答案 2.4。', '答案是 2.4。', '答案是 2.4。']
        }),
        scaffold({
          id: 's8', prompt: '9.05 − 4.2 = ?', expression: '9.05−4.2', answer: '4.85', answers: ['4.85'],
          hints: ['9.05−4.20。', '等於 4.85。', '答案 4.85。', '答案是 4.85。'],
          pitfall: 'place'
        }),
        errorP({
          id: 'e1', title: '小數加法錯在哪？', expression: '1.8 + 0.35',
          correctAnswer: '2.15',
          lines: [
            { text: '把小數點對齊再加', ok: true },
            { text: '有人寫成 1.8 + 0.35 = 1.115（沒對齊）', ok: false, why: '應對齊成 1.80+0.35=2.15。' }
          ],
          wrongIndex: 1,
          why: '小數點沒對齊是常見錯誤。'
        }),
        errorP({
          id: 'e2', title: '小數減法錯在哪？', expression: '3.4 − 1.25',
          correctAnswer: '2.15',
          lines: [
            { text: '寫成 3.40 − 1.25', ok: true },
            { text: '正確應得 2.15', ok: true },
            { text: '有人對齊左邊數字硬減得 2.15 以外的錯位結果，例如 2.25', ok: false, why: '必須對齊小數點；3.40−1.25=2.15。' }
          ],
          wrongIndex: 2,
          why: '3.4−1.25=2.15。'
        }),
        errorP({
          id: 'e3', title: '哪一步錯了？', expression: '2.5 + 1.5',
          correctAnswer: '4',
          lines: [
            { text: '小數點對齊：2.5+1.5', ok: true },
            { text: '5+5=10，寫 0 進 1，整數 2+1+1=4', ok: true },
            { text: '有人把答案寫成 3.10（進位處理錯）', ok: false, why: '個位進位後是 4.0，也就是 4。' }
          ],
          wrongIndex: 2,
          why: '2.5+1.5=4。'
        }),
        errorP({
          id: 'e4', title: '乘法小數點錯在哪？', expression: '1.2 × 3',
          correctAnswer: '3.6',
          lines: [
            { text: '先算 12×3=36', ok: true },
            { text: '1.2 有一位小數，積也要一位小數', ok: true },
            { text: '有人寫成 36 或 0.36', ok: false, why: '小數位數要對：1.2×3=3.6。' }
          ],
          wrongIndex: 2,
          why: '1.2×3=3.6。'
        }),
        word({
          id: 'w1',
          story: '媽媽買菜花 85 元，水果 40 元，帶了 200 元。還剩多少？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('還剩多少元', ['菜多少錢', '一共花多少']),
          askOp: '怎麼算？',
          opOptions: choiceWhat('200 − (85+40)', ['200 − 85', '85 + 40 + 200']),
          answer: '75', answers: ['75', '75元'],
          hints: ['先加總花費，再從帶的錢減去。', '85+40=125。', '200−125=75。', '還剩 75 元。'],
          explain: '200−125=75。'
        }),
        word({
          id: 'w2',
          story: '一瓶果汁 1.5 公升，又倒入 0.8 公升。現在有幾公升？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('現在有幾公升', ['原本幾公升', '倒入幾公升']),
          askOp: '算式？',
          opOptions: choiceWhat('1.5 + 0.8', ['1.5 − 0.8', '1.5 × 0.8']),
          answer: '2.3', answers: ['2.3', '2.3公升'],
          hints: ['合起來用加法。', '對齊小數點。', '1.5+0.8=2.3。', '答案 2.3。'],
          explain: '1.5+0.8=2.3。',
          pitfall: 'place'
        }),
        word({
          id: 'w3',
          story: '布料原長 4.5 公尺，剪掉 1.2 公尺。還剩幾公尺？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('還剩幾公尺', ['剪掉幾公尺', '原本幾公尺']),
          askOp: '算式？',
          opOptions: choiceWhat('4.5 − 1.2', ['4.5 + 1.2', '1.2 − 4.5']),
          answer: '3.3', answers: ['3.3', '3.3公尺'],
          hints: ['還剩→減法。', '對齊小數點。', '4.5−1.2=3.3。', '答案 3.3。'],
          explain: '4.5−1.2=3.3。',
          pitfall: 'place'
        }),
        word({
          id: 'w4',
          story: '三枝原子筆各 12.5 元，一共多少元？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('三枝一共多少元', ['一枝多少元', '買了幾枝']),
          askOp: '算式？',
          opOptions: choiceWhat('12.5 × 3', ['12.5 + 3', '12.5 − 3']),
          answer: '37.5', answers: ['37.5', '37.5元'],
          hints: ['每枝一樣貴→乘法。', '12.5×3=37.5。', '答案 37.5。', '答案是 37.5。'],
          explain: '12.5×3=37.5。'
        }),
        word({
          id: 'w5',
          story: '跑步 2.4 公里，再走 1.35 公里。一共幾公里？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('一共幾公里', ['跑步幾公里', '走路幾公里']),
          askOp: '算式？',
          opOptions: choiceWhat('2.4 + 1.35', ['2.4 − 1.35', '2.4 × 1.35']),
          answer: '3.75', answers: ['3.75', '3.75公里'],
          hints: ['合起來用加法。', '2.40+1.35=3.75。', '答案 3.75。', '答案是 3.75。'],
          explain: '2.4+1.35=3.75。',
          pitfall: 'place'
        }),
        word({
          id: 'w6',
          story: '牛奶 3.6 公升平均倒進 3 瓶，每瓶幾公升？',
          askWhat: '求什麼？',
          whatOptions: choiceWhat('每瓶幾公升', ['一共幾公升', '有幾瓶']),
          askOp: '算式？',
          opOptions: choiceWhat('3.6 ÷ 3', ['3.6 − 3', '3.6 × 3']),
          answer: '1.2', answers: ['1.2', '1.2公升'],
          hints: ['平均分→除法。', '3.6÷3=1.2。', '答案 1.2。', '答案是 1.2。'],
          explain: '3.6÷3=1.2。'
        })
      ]),

      L('m42-shape1', '三角形與平行四邊形面積', '底×高÷2', 'shape', ['scaffold', 'word'], [
        scaffold({
          id: 's1', prompt: '三角形底 8、高 5，面積？', expression: '8×5÷2', answer: '20', answers: ['20'],
          hints: ['面積＝底×高÷2。', '40÷2=20。', '答案 20。', '答案是 20。']
        }),
        scaffold({
          id: 's2', prompt: '平行四邊形底 7、高 4，面積？', expression: '7×4', answer: '28', answers: ['28'],
          hints: ['面積＝底×高。', '7×4=28。', '答案 28。', '答案是 28。']
        }),
        scaffold({
          id: 's3', prompt: '三角形底 10、高 6，面積？', expression: '10×6÷2', answer: '30', answers: ['30'],
          hints: ['底×高÷2。', '60÷2=30。', '答案 30。', '答案是 30。']
        }),
        scaffold({
          id: 's4', prompt: '平行四邊形底 12、高 5，面積？', expression: '12×5', answer: '60', answers: ['60'],
          hints: ['底×高。', '12×5=60。', '答案 60。', '答案是 60。']
        }),
        scaffold({
          id: 's5', prompt: '三角形底 9、高 4，面積？', expression: '9×4÷2', answer: '18', answers: ['18'],
          hints: ['9×4=36，再÷2。', '面積 18。', '答案 18。', '答案是 18。']
        }),
        scaffold({
          id: 's6', prompt: '平行四邊形底 8、高 8，面積？', expression: '8×8', answer: '64', answers: ['64'],
          hints: ['底×高。', '8×8=64。', '答案 64。', '答案是 64。']
        }),
        scaffold({
          id: 's7', prompt: '三角形底 6、高 7，面積？', expression: '6×7÷2', answer: '21', answers: ['21'],
          hints: ['6×7=42，÷2=21。', '答案 21。', '答案是 21。', '答案是 21。']
        }),
        scaffold({
          id: 's8', prompt: '平行四邊形底 15、高 3，面積？', expression: '15×3', answer: '45', answers: ['45'],
          hints: ['底×高。', '15×3=45。', '答案 45。', '答案是 45。']
        }),
        word({
          id: 'w1',
          story: '平行四邊形底 10 公分、高 6 公分。面積多少平方公分？',
          askWhat: '求面積',
          whatOptions: choiceWhat('平行四邊形面積', ['周長', '底多長']),
          askOp: '公式？',
          opOptions: choiceWhat('底 × 高', ['(底+高)×2', '底 × 高 ÷ 2']),
          answer: '60', answers: ['60', '60平方公分'],
          hints: ['平行四邊形面積＝底×高。', '10×6=60。', '答案 60。', '答案是 60。'],
          explain: '10×6=60。'
        }),
        word({
          id: 'w2',
          story: '三角旗底邊 12 公分、高 5 公分。面積多少平方公分？',
          askWhat: '求面積',
          whatOptions: choiceWhat('三角形面積', ['周長', '高多長']),
          askOp: '公式？',
          opOptions: choiceWhat('底 × 高 ÷ 2', ['底 × 高', '(底+高)×2']),
          answer: '30', answers: ['30', '30平方公分'],
          hints: ['三角形要÷2。', '12×5÷2=30。', '答案 30。', '答案是 30。'],
          explain: '12×5÷2=30。'
        }),
        word({
          id: 'w3',
          story: '校園花圃是平行四邊形，底 9 公尺、高 4 公尺。面積多少平方公尺？',
          askWhat: '求面積',
          whatOptions: choiceWhat('平行四邊形面積', ['周長', '底多長']),
          askOp: '公式？',
          opOptions: choiceWhat('底 × 高', ['底 × 高 ÷ 2', '底 + 高']),
          answer: '36', answers: ['36', '36平方公尺'],
          hints: ['底×高。', '9×4=36。', '答案 36。', '答案是 36。'],
          explain: '9×4=36。'
        }),
        word({
          id: 'w4',
          story: '一塊三角形菜圃底 14 公尺、高 5 公尺。面積多少平方公尺？',
          askWhat: '求面積',
          whatOptions: choiceWhat('三角形面積', ['周長', '高多長']),
          askOp: '公式？',
          opOptions: choiceWhat('底 × 高 ÷ 2', ['底 × 高', '底 − 高']),
          answer: '35', answers: ['35', '35平方公尺'],
          hints: ['14×5=70，÷2=35。', '答案 35。', '答案是 35。', '答案是 35。'],
          explain: '14×5÷2=35。'
        }),
        word({
          id: 'w5',
          story: '美術課剪一個平行四邊形，底 11 公分、高 2 公分。面積？',
          askWhat: '求面積',
          whatOptions: choiceWhat('平行四邊形面積', ['周長', '用了幾張紙']),
          askOp: '公式？',
          opOptions: choiceWhat('底 × 高', ['底 × 高 ÷ 2', '(底+高)×2']),
          answer: '22', answers: ['22', '22平方公分'],
          hints: ['11×2=22。', '答案 22。', '答案是 22。', '答案是 22。'],
          explain: '11×2=22。'
        }),
        word({
          id: 'w6',
          story: '屋頂的三角形截面底 16 公尺、高 3 公尺。面積多少平方公尺？',
          askWhat: '求面積',
          whatOptions: choiceWhat('三角形面積', ['周長', '底多長']),
          askOp: '公式？',
          opOptions: choiceWhat('底 × 高 ÷ 2', ['底 × 高', '底 + 高']),
          answer: '24', answers: ['24', '24平方公尺'],
          hints: ['16×3=48，÷2=24。', '答案 24。', '答案是 24。', '答案是 24。'],
          explain: '16×3÷2=24。'
        })
      ]),

      L('m42-apply1', '平均', '總和÷個數', 'apply', ['scaffold', 'word', 'error'], [
        scaffold({
          id: 's1', prompt: '考試 80、90、70，平均幾分？', expression: '平均', answer: '80', answers: ['80'],
          hints: ['先加總：80+90+70=240。', '再÷3。', '240÷3=80。', '答案 80。']
        }),
        scaffold({
          id: 's2', prompt: '身高 120、130、140 公分，平均幾公分？', expression: '平均', answer: '130', answers: ['130'],
          hints: ['120+130+140=390。', '390÷3=130。', '答案 130。', '答案是 130。']
        }),
        scaffold({
          id: 's3', prompt: '4、6、8、10 的平均是？', expression: '平均', answer: '7', answers: ['7'],
          hints: ['4+6+8+10=28。', '28÷4=7。', '答案 7。', '答案是 7。']
        }),
        scaffold({
          id: 's4', prompt: '投籃連續 3 次：2、4、6 分，平均每次幾分？', expression: '平均', answer: '4', answers: ['4'],
          hints: ['2+4+6=12。', '12÷3=4。', '答案 4。', '答案是 4。']
        }),
        scaffold({
          id: 's5', prompt: '五天喝水量：1、2、3、2、2 公升，平均每天幾公升？', expression: '平均', answer: '2', answers: ['2'],
          hints: ['1+2+3+2+2=10。', '10÷5=2。', '答案 2。', '答案是 2。']
        }),
        scaffold({
          id: 's6', prompt: '15、25、35 的平均是？', expression: '平均', answer: '25', answers: ['25'],
          hints: ['15+25+35=75。', '75÷3=25。', '答案 25。', '答案是 25。']
        }),
        scaffold({
          id: 's7', prompt: '小考 60、70、80、90，平均幾分？', expression: '平均', answer: '75', answers: ['75'],
          hints: ['60+70+80+90=300。', '300÷4=75。', '答案 75。', '答案是 75。']
        }),
        scaffold({
          id: 's8', prompt: '9、9、12 的平均是？', expression: '平均', answer: '10', answers: ['10'],
          hints: ['9+9+12=30。', '30÷3=10。', '答案 10。', '答案是 10。']
        }),
        errorP({
          id: 'e1', title: '平均哪步錯？', expression: '2、4、6 的平均',
          correctAnswer: '4',
          lines: [
            { text: '加總 2+4+6=12', ok: true },
            { text: '除以個數 3', ok: true },
            { text: '有人除以最大數 6 得 2', ok: false, why: '平均是÷個數，不是÷最大數。' }
          ],
          wrongIndex: 2,
          why: '12÷3=4。'
        }),
        errorP({
          id: 'e2', title: '哪一步錯了？', expression: '10、20、30 的平均',
          correctAnswer: '20',
          lines: [
            { text: '加總 10+20+30=60', ok: true },
            { text: '除以 3 得 20', ok: true },
            { text: '有人只加兩頭 10+30 再÷2 得 20——這裡碰巧對，但漏掉中間數的算法不穩', ok: true },
            { text: '有人做成 10+20+30=60 後÷2 得 30', ok: false, why: '有 3 個數就要÷3，不是÷2。' }
          ],
          wrongIndex: 3,
          why: '60÷3=20。'
        }),
        errorP({
          id: 'e3', title: '平均錯在哪？', expression: '5、5、8 的平均',
          correctAnswer: '6',
          lines: [
            { text: '加總 5+5+8=18', ok: true },
            { text: '個數是 3', ok: true },
            { text: '有人看到兩個 5，直接說平均是 5', ok: false, why: '不能忽略 8；18÷3=6。' }
          ],
          wrongIndex: 2,
          why: '平均是總和÷個數＝6。'
        }),
        errorP({
          id: 'e4', title: '計算過程哪步錯？', expression: '12、15、18 的平均',
          correctAnswer: '15',
          lines: [
            { text: '12+15+18=45', ok: true },
            { text: '45÷3=15', ok: true },
            { text: '有人先算 15 是中間數就當平均，卻把加總寫成 40', ok: false, why: '加總應是 45；雖中間數剛好是平均，但過程數字錯了。' }
          ],
          wrongIndex: 2,
          why: '正確加總 45，平均 15。'
        }),
        word({
          id: 'w1',
          story: '小華三天跑步 2 公里、3 公里、4 公里。平均每天跑幾公里？',
          askWhat: '求平均每天距離',
          whatOptions: choiceWhat('平均每天跑幾公里', ['三天一共跑幾公里', '最多那天幾公里']),
          askOp: '怎麼算？',
          opOptions: choiceWhat('(2+3+4) ÷ 3', ['2+3+4', '4 − 2']),
          answer: '3', answers: ['3', '3公里'],
          hints: ['平均＝總和÷天數。', '9÷3=3。', '答案 3 公里。', '答案是 3。'],
          explain: '9÷3=3。'
        }),
        word({
          id: 'w2',
          story: '四次練習投籃進球：3、5、4、4。平均每次進幾球？',
          askWhat: '求平均每次進球',
          whatOptions: choiceWhat('平均每次進幾球', ['一共進幾球', '最多那次幾球']),
          askOp: '怎麼算？',
          opOptions: choiceWhat('(3+5+4+4) ÷ 4', ['3+5+4+4', '5 − 3']),
          answer: '4', answers: ['4'],
          hints: ['加總 16。', '16÷4=4。', '答案 4。', '答案是 4。'],
          explain: '16÷4=4。'
        }),
        word({
          id: 'w3',
          story: '小美兩次數學考 88 分、92 分。平均幾分？',
          askWhat: '求平均分數',
          whatOptions: choiceWhat('平均幾分', ['兩次相差幾分', '最高幾分']),
          askOp: '怎麼算？',
          opOptions: choiceWhat('(88+92) ÷ 2', ['88+92', '92 − 88']),
          answer: '90', answers: ['90'],
          hints: ['88+92=180。', '180÷2=90。', '答案 90。', '答案是 90。'],
          explain: '180÷2=90。'
        }),
        word({
          id: 'w4',
          story: '五位同學身高：130、132、128、134、126 公分。平均身高幾公分？',
          askWhat: '求平均身高',
          whatOptions: choiceWhat('平均身高幾公分', ['最高幾公分', '一共幾人']),
          askOp: '怎麼算？',
          opOptions: choiceWhat('(130+132+128+134+126) ÷ 5', ['130+132+128+134+126', '134 − 126']),
          answer: '130', answers: ['130'],
          hints: ['加總 650。', '650÷5=130。', '答案 130。', '答案是 130。'],
          explain: '650÷5=130。'
        }),
        word({
          id: 'w5',
          story: '三盤水果各有 6、9、12 顆。平均每盤幾顆？',
          askWhat: '求平均每盤顆數',
          whatOptions: choiceWhat('平均每盤幾顆', ['一共幾顆', '最多那盤幾顆']),
          askOp: '怎麼算？',
          opOptions: choiceWhat('(6+9+12) ÷ 3', ['6+9+12', '12 − 6']),
          answer: '9', answers: ['9'],
          hints: ['6+9+12=27。', '27÷3=9。', '答案 9。', '答案是 9。'],
          explain: '27÷3=9。'
        }),
        word({
          id: 'w6',
          story: '一週七天閱讀時間（分）：10、10、10、10、10、10、24。平均每天幾分鐘？',
          askWhat: '求平均每天分鐘數',
          whatOptions: choiceWhat('平均每天幾分鐘', ['一週一共幾分鐘', '最多那天幾分鐘']),
          askOp: '怎麼算？',
          opOptions: choiceWhat('(10×6+24) ÷ 7', ['10×7', '24 − 10']),
          answer: '12', answers: ['12', '12分', '12分鐘'],
          hints: ['先加總：10×6+24=84。', '再÷7。', '84÷7=12。', '平均每天 12 分鐘。'],
          explain: '84÷7=12。'
        })
      ]),

      L('m42-review1', '小小複習', '分數小數・面積・平均', 'review', ['recap'], [
        recap({
          id: 'r1', title: '四年級下・小小複習',
          questions: [
            { q: '1/2 + 1/4 = ?', a: '3/4', answers: ['3/4', '¾'], tip: '通分' },
            { q: '三角形底 6 高 4 面積？', a: '12', answers: ['12'], tip: '÷2' },
            { q: '10、20、30 平均？', a: '20', answers: ['20'], tip: '總和÷3' },
            { q: '3.5 + 1.25 = ?', a: '4.75', answers: ['4.75'], tip: '對齊小數點' },
            { q: '平行四邊形底 9 高 5 面積？', a: '45', answers: ['45'], tip: '底×高' },
            { q: '5/6 − 1/3 = ?', a: '1/2', answers: ['1/2', '½'], tip: '通分' },
            { q: '2.4 × 2 = ?', a: '4.8', answers: ['4.8'], tip: '小數乘法' },
            { q: '50、70、60 平均？', a: '60', answers: ['60'], tip: '總和÷3' }
          ]
        })
      ], { review: true })
    ]
  };
};
