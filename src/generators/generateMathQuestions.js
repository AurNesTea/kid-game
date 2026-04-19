/**
 * generateMathQuestions.js
 * 出題引擎：加法 / 減法，數字範圍 1-20，每輪 10 題
 * 規則：每輪保底 3 題進位（加法）或借位（減法），其餘 7 題從 normal pool 填充
 */

// ─── 輔助：從陣列隨機取 n 個不重複元素 ───────────────────────────────────────
function sampleN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, shuffled.length))
}

// ─── 產生「加法」全部可能的題目 ──────────────────────────────────────────────
function buildAdditionPools() {
  const carry = []   // 進位：個位相加 ≥ 10
  const normal = []  // 一般：個位相加 < 10，且結果 ≤ 20

  for (let a = 1; a <= 20; a++) {
    for (let b = 1; b <= 20; b++) {
      if (a + b > 20) continue  // 超出範圍
      const q = { a, b, op: '+', answer: a + b }
      if ((a % 10) + (b % 10) >= 10) {
        carry.push(q)
      } else {
        normal.push(q)
      }
    }
  }
  return { carry, normal }
}

// ─── 產生「減法」全部可能的題目 ──────────────────────────────────────────────
function buildSubtractionPools() {
  const borrow = [] // 借位：被減數個位 < 減數個位
  const normal = [] // 一般：被減數個位 ≥ 減數個位，且結果 ≥ 0

  for (let a = 1; a <= 20; a++) {
    for (let b = 1; b <= 20; b++) {
      if (a - b < 0) continue   // 不產生負數
      const q = { a, b, op: '-', answer: a - b }
      if ((a % 10) < (b % 10)) {
        borrow.push(q)
      } else {
        normal.push(q)
      }
    }
  }
  return { carry: borrow, normal }
}

// ─── 主函式 ──────────────────────────────────────────────────────────────────
/**
 * @param {'addition' | 'subtraction'} mode
 * @param {number} total     總題數（預設 10）
 * @param {number} minCarry  每輪保底進位/借位題數（預設 3）
 * @returns {Array<{ a: number, b: number, op: string, answer: number }>}
 */
export function generateMathQuestions(mode = 'addition', total = 10, minCarry = 3) {
  const { carry, normal } =
    mode === 'addition' ? buildAdditionPools() : buildSubtractionPools()

  // 保底取 minCarry 題進位/借位
  const carryQuestions = sampleN(carry, minCarry)

  // 剩餘從 normal pool 填充；若 normal pool 不夠則從 carry pool 補
  const remaining = total - carryQuestions.length
  let normalQuestions = sampleN(normal, remaining)
  if (normalQuestions.length < remaining) {
    // normal 不夠時，從 carry pool 剩餘題目補足
    const extra = sampleN(
      carry.filter(q => !carryQuestions.includes(q)),
      remaining - normalQuestions.length
    )
    normalQuestions = [...normalQuestions, ...extra]
  }

  // 合併後洗牌
  const all = [...carryQuestions, ...normalQuestions].sort(() => Math.random() - 0.5)
  return all
}
