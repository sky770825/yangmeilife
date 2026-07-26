# Cursor 輪詢任務：狀態欄位與路由語意審查

請在本專案根目錄執行審查，只輸出報告，不要修改網站程式、資料檔或產生器。

重要限制：不要執行 shell、node、python、npm、git 或任何終端命令。請只讀下列指定檔案，依照檔案內容做人工審查式報告。

## 審查目標

目前 `data/site-functions.json` 的 `status` 同時承擔兩件事：

1. 功能成熟度：目前是新版頁面、正式功能頁、橋接頁、舊版來源、尚未建立。
2. 點擊目標：點擊後走本地頁、外部連結、或尚無可用入口。

請檢查是否應拆成：

- `implementationStatus`：描述功能成熟度。
- `targetType`：描述入口類型，例如 `local-page`、`external-link`、`none`。
- `targetUrl` 或 `externalUrl`：描述外部網址。

## 必讀檔案

- `data/site-functions.json`
- `scripts/build-main-structure.mjs`
- `assets/js/site-search-data.js`
- `assets/js/site-search.js`
- `reports/big-picture-audit.md`
- `docs/CONTENT_UPDATE_GUIDE.md`

## 重點範圍

請特別檢查：

- 8 個 `external-active` 功能，其中有些有本地 `page`，有些沒有。
- 1 個 `needs-page` 功能：`booking.html` 已存在，但資料狀態仍是 `needs-page`。
- 15 個尚未現代化的本地頁：
  - `dashboard.html`
  - `share.html`
  - `notifications.html`
  - `loan-calc.html`
  - `investor.html`
  - `tax-calc.html`
  - `rental-mgmt.html`
  - `games.html`
  - `fortune.html`
  - `mbti.html`
  - `daily-quote.html`
  - `vendor-admin.html`
  - `test-image-upload.html`
  - `booking.html`
  - `hospital-clinic.html`

## 請輸出到

`reports/cursor-status-routing-findings.md`

## 報告格式

請用繁體中文，包含：

1. 摘要：一句話說明最大問題。
2. 欄位拆分建議：列出建議欄位與每個欄位的允許值。
3. 受影響功能清單：逐列列出 `id`、`title`、目前 `status`、目前 `page`、建議 `implementationStatus`、建議 `targetType`。
4. 需要人工決策的功能：例如外部連結來源不明、同時有本地頁與外部入口的功能。
5. 下一步實作順序：分成小批次，不要一次大改。
6. 風險：如果直接批次修改，搜尋頁、分類頁、首頁可能出現什麼錯誤。

## 限制

- 不要改 `data/site-functions.json`。
- 不要改 `scripts/build-main-structure.mjs`。
- 不要改任何 HTML、CSS、JS。
- 不要執行終端命令，不要跑資料統計腳本。
- 只建立或更新 `reports/cursor-status-routing-findings.md`。
