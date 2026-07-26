# 互動深化批次驗證報告

驗證時間：2026-07-02T17:42:30+0800

## 本批處理範圍

- `games.html`：新增記憶配對、反應測試、剪刀石頭布、數字合併四個基礎互動。
- `fortune.html`：新增星座切換、今日運勢、三張塔羅、保存紀錄、複製分享文字。
- `mbti.html`：新增 20 題逐題測驗、進度條、16 型結果、結果保存、重新開始。
- `daily-quote.html`：新增分類篩選、關鍵字搜尋、隨機金句、收藏、複製分享文字。

## 修改檔案

- `assets/js/entertainment-widgets.js`：新增四個娛樂互動模組。非娛樂頁會自動 no-op。
- `scripts/build-main-structure.mjs`：正式功能頁模板新增 `assets/js/entertainment-data.js` 與 `assets/js/entertainment-widgets.js`。
- `data/service-page-source.mjs`：四個娛樂頁的 `summary`、`highlights`、`checklist`、`dataStatus` 已改為第一階段互動已接，並指向 `data/entertainment/*.json`。
- `data/entertainment/*.json`：已新增娛樂互動資料檔，後續內容更新優先改這裡。
- `assets/js/service-page-data.js`：由產生器同步更新。
- `assets/js/entertainment-data.js`：由產生器同步輸出 runtime data。
- `games.html`、`fortune.html`、`mbti.html`、`daily-quote.html`：由產生器同步更新 script 引用與 meta description。

## Playwright 輪詢結果

本機網址：`http://127.0.0.1:8028/`

| 頁面 | 桌機 1440x1000 | 手機 390x844 | 互動檢查 |
| --- | --- | --- | --- |
| `games.html` | 無水平溢出，widget 正常 | 無水平溢出，widget 正常 | 4 個分頁、剪刀石頭布、16 格合併盤、反應測試按鈕、12 張記憶卡皆正常 |
| `fortune.html` | 無水平溢出，widget 正常 | 無水平溢出，widget 正常 | 星座切換、三張塔羅、3 張牌、保存紀錄皆正常 |
| `mbti.html` | 無水平溢出，widget 正常 | 無水平溢出，widget 正常 | 20 題可完整作答，結果區只出現 1 次 |
| `daily-quote.html` | 無水平溢出，widget 正常 | 無水平溢出，widget 正常 | 分類搜尋、隨機金句、收藏皆正常 |

Console / pageerror：`0`

## 靜態檢查

- `node --check assets/js/entertainment-widgets.js`：通過
- `node --check scripts/build-main-structure.mjs`：通過
- `node --check assets/js/service-page.js`：通過
- `node --check assets/js/service-page-data.js`：通過
- `node --check data/service-page-source.mjs`：通過
- `node scripts/build-main-structure.mjs`：通過，輸出 11 個分類、65 個功能、33 筆廠商資料
- 正式站連結掃描：83 個 HTML、534 個本地引用，`missingCount=0`

備註：若掃描包含 `archive/`，會看到舊版封存檔既有的 3 個缺漏引用；正式站範圍已排除，且本批沒有新增缺漏引用。

## 後續建議

- 舊版遊戲大廳完整 10 款遊戲尚未全部移植；本批先完成可用的基礎互動。
- `fortune`、`mbti`、`daily-quote` 的題庫與內容已拆到 `data/entertainment/`，後續內容更新不需要改互動腳本。
- 金句來源、塔羅/運勢文本、MBTI 類型描述仍需授權與來源核實後，才能升級為正式內容資料。
