# 娛樂互動資料治理批次

執行時間：2026-07-02T18:08:47+0800

## 本批目標

把 `games.html`、`fortune.html`、`mbti.html`、`daily-quote.html` 的可更新內容從互動腳本拆出，改成可維護資料檔，避免後續更新題庫、金句或運勢文字時改到互動邏輯。

## 新增資料結構

- `data/entertainment/README.md`：維護流程與注意事項
- `data/entertainment/games.json`：遊戲分頁、路線記憶地點、市集快手題庫、梅花合成階段、生活快問題庫、localStorage key
- `data/entertainment/fortune.json`：星座、運勢模板、塔羅、幸運色、水晶、localStorage key
- `data/entertainment/mbti.json`：20 題題庫、16 型摘要、免責提示、localStorage key
- `data/entertainment/daily-quotes.json`：金句分類、文案、作者、來源狀態、localStorage key
- `data/entertainment/manifest.json`：產生器輸出的 runtime 對照檔

## 產生器與前端

- `scripts/build-main-structure.mjs` 會讀取 `data/entertainment/*.json`。
- 產生器會輸出 `assets/js/entertainment-data.js`。
- 四個娛樂頁會先載入 `assets/js/entertainment-data.js`，再載入 `assets/js/entertainment-widgets.js`。
- `assets/js/entertainment-widgets.js` 已改為讀取 `window.YANGMEI_ENTERTAINMENT_DATA`，只保留互動邏輯與最小 fallback。
- `data/service-page-source.mjs` 已把四個娛樂頁的 `sourceFile` 指向對應的 `data/entertainment/*.json`。

## 驗證結果

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check assets/js/entertainment-data.js`：通過
- `node --check scripts/build-main-structure.mjs`：通過
- `node --check data/service-page-source.mjs`：通過
- 四個 `data/entertainment/*.json`：JSON parse 通過
- `node scripts/build-main-structure.mjs`：通過，輸出 11 個分類、65 個功能、33 筆廠商資料
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`

## Playwright 輪詢

本機網址：`http://127.0.0.1:8028/`

共同檢查：

- `window.YANGMEI_ENTERTAINMENT_DATA` 存在
- `sourceFolder` 為 `data/entertainment/`
- runtime data count：4 筆運勢、6 張塔羅、20 題 MBTI、12 筆金句
- 桌機 1440 x 1000 無水平溢出
- 手機 390 x 844 無水平溢出
- console / pageerror：`0`

互動檢查：

- `games.html`：已於遊戲重做批次升級為路線記憶、市集快手、梅花合成與生活快問；詳見 `reports/games-redesign-audit.md`
- `fortune.html`：星座切換、三張塔羅、3 張牌、保存紀錄皆正常
- `mbti.html`：20 題完整作答，結果區只出現 1 次
- `daily-quote.html`：分類搜尋、隨機金句、收藏皆正常

結果：`allChecksPass=true`

## 後續建議

- 遊戲頁已改走新版四遊戲組；後續優先加深動畫、音效、每日挑戰與分數規則。
- 若要正式發布金句或運勢內容，需補 `sourceStatus`、作者、授權與審核日期。
- 若未來資料量變大，可再把 `mbti.json` 拆成 `questions.json` 與 `types.json`。
