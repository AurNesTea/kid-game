# 國小英語群島

給一～六年級孩子玩的英文與數學互動網站（純 HTML/CSS/JS，不用安裝、不用打包）。

## 線上體驗

- **GitHub Pages**：https://aurnestea.github.io/kid-game/
- 本倉庫根目錄即為靜態網站（`index.html`、`assets/`、`english/`、`math/`），由 `master` 分支 `/` 根目錄提供。
- 每次網站更新的內容與日期，請看 [`CHANGELOG.md`](./CHANGELOG.md)（更新紀錄）。

## 怎麼打開（本機）

- 直接開：用瀏覽器打開最上層的 `index.html`（大廳）。
- 或開本機伺服器：

```bash
python3 -m http.server 8080
# 瀏覽器打開 http://localhost:8080/
```

所有連結都是相對路徑，在專案頁子路徑 `/kid-game/` 下也能正常運作。

## 舊版 React 遊戲

先前以 Vite + React 製作的加減法練習遊戲，完整保留在 [`legacy-kid-game/`](./legacy-kid-game/)（含 `package.json`、`src/`、`vite.config.js` 等），不再作為網站根目錄。若要本地跑舊遊戲：

```bash
cd legacy-kid-game
npm install
npm run dev
```

## 路徑（大廳 → 科目 → 航線）

```
index.html                  大廳：封面小夥伴、英文／數學科目卡
assets/
  site.css                  共用版面、按鈕、小夥伴跳一跳
  core.js                   共用：存檔、星星、名字、發音、小工具（支援多科目）
  companions.js             原創探險小夥伴（SVG）、夥伴球圖示
  lobby.js                  大廳用
  english.css / english.js  英文科
  data.js                   英文單字 300 字、句型、12 條航線
  math.css / math.js        數學科（提示階梯、應用題、找錯）
  math-data.js              數學 12 航線關卡（由 scripts/build-math-data.js 產生）
english/
  index.html                選年級 × 學期（12 張卡）
  1-1/ … 6-2/               各學期航線
math/
  index.html                選年級 × 學期（12 張卡）
  1-1/ … 6-2/               各學期航線
```

- 每個科目航線頁只是薄頁面：設定 `window.ISLES_ROUTE = '2-1'`，再載入 `../../assets/` 共用檔。
- 右上角「換人玩」回到科目選單；麵包屑可回「大廳」或科目。
- 舊網址 `index.html#2-1`、`#g2`、`#grade` 會自動轉到英文新路徑。

## 航線

- 年級 1–6 × 上／下學期，共 12 條（英文、數學各一組）
- 上下學期是依常見教科書主題拆的建議進度，不是教育部官方學期表

### 數學怎麼學

- 先請孩子試下一步，再給提示（小提示 → 更清楚 → 示範一步 → 完整說明）
- 應用題：先選「求什麼」、再選「怎麼算」、最後才填答案
- 「找出錯哪」：檢查過程哪一行錯了、為什麼
- 具體物 → 圖示／直式 → 算式；島嶼結束有小小複習
- 常見陷阱回饋：進退位、位值、單位、看錯題

## 兩個孩子怎麼記

都存在這台裝置的瀏覽器（localStorage）：

- 名字按年級（兩科共用）：`english-isles-players`，例如 `{"2":"小明","4":"小華"}`
- 英文星星：`english-isles-g{年級}s{學期}`
- 數學星星：`math-isles-g{年級}s{學期}`（不會覆蓋英文）
- 最後航線：`english-isles-route` / `math-isles-route`，大廳依 `isles-last-subject` 顯示「繼續上次」

## 探險小夥伴

九隻小夥伴是本站自己畫的**原創角色**，靈感來自孩子喜歡的寶可夢冒險風格，**不是官方寶可夢**，也未使用任何官方寶可夢美術。

點一下小夥伴，牠會跳起來。

## 資料

- `assets/data.js` 由上層 `vocab.json`／`grammar.json` 產生，請勿手改
- `assets/math-data.js` 由 `node scripts/build-math-data.js` 產生
- 英文單字參考鑄強初級 300 字與課綱基本 1200 字
- 數學主題參考十二年國教國小數學與常見康軒／翰林／南一學期進度
