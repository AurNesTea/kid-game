/**
 * mathGenerator.js
 * 通用數學出題引擎：支援加、減、乘、除
 * 具備進借位保底機制、結果範圍過濾與除法整除判定
 */

const OPERATIONS = {
  addition: {
    symbol: '+',
    calc: (a, b) => a + b,
    checkSpecial: (a, b) => (a % 10) + (b % 10) >= 10, // 是否進位
  },
  subtraction: {
    symbol: '-',
    calc: (a, b) => a - b,
    checkSpecial: (a, b) => (a % 10) < (b % 10), // 是否借位
  },
  multiplication: {
    symbol: '×',
    calc: (a, b) => a * b,
    checkSpecial: (a, b) => false,
  },
  division: {
    symbol: '÷',
    calc: (a, b) => a / b,
    checkSpecial: (a, b) => a % b === 0, // 對除法而言，整除即為特殊要求
  }
};

/**
 * 隨機抽樣 n 個元素
 */
function sampleN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

/**
 * 通用出題函式
 * @param {Object} options
 * @param {'addition'|'subtraction'|'multiplication'|'division'} options.type 運算類型
 * @param {[number, number]} options.rangeA 數字 A 範圍 [min, max]
 * @param {[number, number]} options.rangeB 數字 B 範圍 [min, max]
 * @param {number} options.total 總題數
 * @param {number} options.minSpecial 保底特殊題數（進位/借位）
 * @param {[number, number]} options.resultRange 結果數值範圍 [min, max]
 * @param {boolean} options.noRemainder 除法是否強制整除
 * @returns {Array<{ a: number, b: number, op: string, answer: number }>}
 */
export function generateMathQuestions({
  type = 'addition',
  rangeA = [1, 20],
  rangeB = [1, 20],
  total = 10,
  minSpecial = 3,
  resultRange = [0, 100],
  noRemainder = true
}) {
  const opConfig = OPERATIONS[type];
  if (!opConfig) throw new Error(`Unsupported operation type: ${type}`);

  const specialPool = [];
  const normalPool = [];

  // 1. 遍歷範圍產生題目池
  for (let a = rangeA[0]; a <= rangeA[1]; a++) {
    for (let b = rangeB[0]; b <= rangeB[1]; b++) {
      // 除數不為 0
      if (type === 'division' && b === 0) continue;

      const answer = opConfig.calc(a, b);

      // 過濾結果範圍
      if (answer < resultRange[0] || answer > resultRange[1]) continue;

      // 除法整除過濾
      if (type === 'division' && noRemainder && a % b !== 0) continue;

      const question = { a, b, op: opConfig.symbol, answer };

      if (opConfig.checkSpecial(a, b)) {
        specialPool.push(question);
      } else {
        normalPool.push(question);
      }
    }
  }

  // 2. 抽樣邏輯
  // 保底特殊題
  const selectedSpecial = sampleN(specialPool, minSpecial);

  // 填充剩餘題目
  const remainingCount = total - selectedSpecial.length;
  let selectedNormal = sampleN(normalPool, remainingCount);

  // 如果普通題池不足，從剩餘的特殊題池補
  if (selectedNormal.length < remainingCount) {
    const usedIds = new Set(selectedSpecial);
    const availableSpecial = specialPool.filter(q => !usedIds.has(q));
    const extra = sampleN(availableSpecial, remainingCount - selectedNormal.length);
    selectedNormal = [...selectedNormal, ...extra];
  }

  // 3. 合併洗牌後回傳
  return [...selectedSpecial, ...selectedNormal].sort(() => Math.random() - 0.5);
}
