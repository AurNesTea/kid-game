# 國小英語群島

給一～六年級孩子玩的英文單字與句型互動網站（純 HTML/CSS/JS，不用安裝、不用打包）。

## 線上體驗

- **GitHub Pages**：https://aurnestea.github.io/kid-game/
- 本倉庫根目錄即為靜態網站（`index.html`、`assets/`、`english/`），由 `master` 分支 `/` 根目錄提供。

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
index.html                  大廳：封面小夥伴、英文科目卡「出發」
assets/
  site.css                  共用版面、按鈕、小夥伴跳一跳
  core.js                   共用：存檔、星星、名字、英文發音、小工具
  companions.js             原創探險小夥伴（SVG）、夥伴球圖示
  lobby.js                  大廳用
  english.css               英文科：選單、群島、遊戲
  english.js                英文科：年級學期選單、航線頁、遊戲
  data.js                   單字 300 字、句型 22 個、12 條航線關卡
english/
  index.html                選年級 × 學期（12 張卡）
  1-1/index.html            一年級上學期
  1-2/index.html            一年級下學期
  …
  6-2/index.html            六年級下學期
```

- 每個 `english/年級-學期/index.html` 只是一個薄薄的頁面：設定 `window.ISLES_ROUTE = '2-1'`，再載入 `../../assets/` 的共用檔。
- 航線頁裡面的島嶼用 `#island/hello` 這種網址切換，例如 `english/2-1/index.html#island/family`。
- 右上角「換人玩」回到 `english/index.html` 重新選年級與學期；麵包屑可回「大廳」或「英文」。
- 舊網址 `index.html#2-1`、`#g2`、`#grade` 會自動轉到新路徑。
- 之後要加其他科目，可以在 `english/` 旁邊開新資料夾，並在大廳加一張卡片。

## 航線

- 年級 1–6 × 上／下學期，共 12 條
- 一～二年級標示「先修準備」（課綱正式英語多自三年級起）
- 五年級新字少，以複習島為主；六年級沒有新的 300 字，練銜接國中文法＋複習
- 上下學期是依常見教科書主題拆的建議進度，不是教育部官方學期表

## 遊戲

- 看英選中／看中選英／配對（每種過關得 1 顆 ★）
- 拼拼看（四年級起）
- 句型說明＋選擇題
- 聽發音使用瀏覽器內建英文語音（沒有語音的裝置會安靜略過）

## 兩個孩子怎麼記

都存在這台裝置的瀏覽器（localStorage）：

- 名字按年級：`english-isles-players`，例如 `{"2":"小明","4":"小華"}`（上／下學期同名）
- 星星按學期：`english-isles-g{年級}s{學期}`，例如 `english-isles-g2s1`
- 最後玩的航線：`english-isles-route`（例如 `"4-2"`），大廳會出現「繼續上次」
- 舊版的 `english-isles-g2`／`english-isles-g4` 進度，在新鍵還是空的時候會自動搬過來

## 探險小夥伴

九隻小夥伴是本站自己畫的**原創角色**，靈感來自孩子喜歡的寶可夢冒險風格，**不是官方寶可夢**，也未使用任何官方寶可夢美術：

| 島 | 小夥伴 | 屬性 |
|---|---|---|
| 打招呼・自己島 | 啾啾星（星星天線小雞） | 電 |
| 數字・顏色・時間島 | 叮叮石（頭上長水晶的石頭） | 岩 |
| 家庭・身體・衣服島 | 焰糰子（頭頂小火苗的麻糬） | 火 |
| 食物・動物島 | 芽芽豆（嫩芽豆子） | 草 |
| 學校・場所・交通島 | 波波滴（水滴） | 水 |
| 天氣・運動島 | 咻咻雲（彩虹尾巴雲朵） | 飛 |
| 動詞・形容詞島 | 蹦蹦彈（彈簧球） | 妖 |
| 句型島 | 夢夢月（彎月小球） | 超 |
| 複習島 | 咕咕螺（螺旋殼蝸牛） | 地 |

點一下小夥伴，牠會跳起來。

## 資料

- `assets/data.js` 由上層 `vocab.json`／`grammar.json` 產生，請勿手改
- 單字參考鑄強初級 300 字與課綱基本 1200 字
