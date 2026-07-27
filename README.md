# YangmeiLife 網站資料夾分類

本資料夾以 2026-06-26 新版 UI 為主版本整理。

## 目錄

- `index.html`：網站首頁，保留在根目錄方便靜態網站直接開啟。
- `search.html`：目前搜尋頁，暫留根目錄避免路徑破壞。
- `assets/css/`：樣式資源。
- `assets/js/`：前端互動腳本。
- `data/site-functions.json`：所有功能總表。
- `data/site-categories.json`：分類定義。
- `data/site-navigation.json`：主架構入口、分類、數量與資料夾位置索引。
- `data/service-pages.json`：已升級正式功能頁的展示資料。
- `data/vendors/`：廠商分類與廠商清單資料。
- `pages/`：功能分類入口，每個分類資料夾都有 `index.html`、`updates.json`、`updates.html`。
- `scripts/build-main-structure.mjs`：主架構生成器，用中央 JSON 同步分類頁、更新頁、搜尋資料與廠商頁。
- `docs/`：Cursor 任務書與維護文件。
- `reports/`：盤點、逐頁檢視、Cursor Auto 任務摘要。
- `archive/cursor-history/`：從 Cursor History 集中歸檔的舊版最新快照，只作為補件來源。

## 功能分類

- 總覽頁：`pages/index.html`
- 分類數：11
- 功能數：65
- 廠商分類頁：11 個，已改成資料驅動頁，資料來源在 `data/vendors/categories/*`。
- 正式功能頁：32 個，集中在 `daily-info`、`home-services`、`personal-tools` 與 `community-content`。
- 根目錄功能橋接頁：非廠商功能先承接首頁既有卡片連結，避免尚未套新版 UI 的功能直接 404。
- 維護說明：`docs/CONTENT_UPDATE_GUIDE.md`

## 同步主架構

修改 `data/site-functions.json`、`data/site-categories.json` 或廠商資料後，從專案根目錄執行：

```bash
node scripts/build-main-structure.mjs
```

這會同步 `pages/` 分類頁、各分類 `updates.*`、`search.html` 搜尋資料、正式功能頁資料、廠商資料子目錄與 11 個廠商正式頁。

## 備份

整理前已建立同層備份：

`/Users/caijunchang/Desktop/程式專案資料夾/yangmeilife-生活集拷貝_backup_20260702-130012`
