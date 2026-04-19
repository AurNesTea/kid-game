# 🎮 孩子互動遊戲 — Kids Interactive Learning Game

專為小學生設計的互動練習遊戲，目前支援數學加法與減法練習。以 React + Vite 打造，部署於 Netlify。

---

## 🚀 線上體驗

> _(部署後填入 Netlify URL)_

---

## 📋 功能說明

- **加法練習**：1–20 範圍內的加法，保底進位題
- **減法練習**：1–20 範圍內的減法，保底借位題
- **每輪 10 題**，答完自動進入結果頁
- **即時 Feedback**：答對/答錯有提示 Banner
- **分數環動畫**：結果頁以 SVG 動態呈現得分比例
- **彩花特效**：≥ 80 分觸發 Canvas 彩花慶祝動畫（4 秒）
- **6 段評語**：依分數區間給予不同鼓勵語句

---

## 🛠 技術棧

| 類別 | 工具 |
|------|------|
| 框架 | React 18 + Vite |
| 樣式 | Tailwind CSS |
| 路由 | React Router v6 |
| 部署 | Netlify |

---

## 📁 專案結構

```
kids-game/
└── src/
    ├── App.jsx                  # 路由設定
    ├── pages/
    │   ├── HomePage.jsx         # 首頁（模式選擇）
    │   ├── GamePage.jsx         # 遊戲頁面
    │   └── ResultPage.jsx       # 結果頁面
    ├── components/
    │   ├── QuestionCard.jsx     # 題目卡片（題目、Input、Feedback）
    │   ├── ScoreBar.jsx         # 頂部進度條與分數列
    │   └── Confetti.jsx         # Canvas 彩花動畫
    ├── hooks/
    │   └── useGame.js           # 遊戲狀態管理（出題、計分、換題）
    └── generators/
        └── generateMathQuestions.js  # 數學出題引擎（加法進位/減法借位池）
```

---

## ⚙️ 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 打包生產版本
npm run build
```

---

## ☁️ Netlify 部署設定

| 設定項 | 值 |
|--------|-----|
| Build command | `npm run build` |
| Publish directory | `dist` |

**建議**：連結 GitHub Repository，推送後自動觸發部署（CI/CD）。

---

## 🗺 開發路線圖

- [x] Phase 0：路由骨架 + 出題引擎
- [x] Phase 1：遊戲核心流程 + UI 元件拆分（QuestionCard, ScoreBar, Confetti）
- [ ] Phase 2：導覽層（年級 → 科目 → 單元選擇）
- [ ] Phase 3–4：數學引擎通用化 + 1 年級題庫
- [ ] Phase 5–7：3、2、4 年級數學題庫
- [ ] Phase 8：英文出題引擎
- [ ] Phase 9：UI 精修 & RWD
- [ ] Phase 10：Netlify 正式部署

詳細進度請參閱 [`../fyi.md`](../fyi.md)。
