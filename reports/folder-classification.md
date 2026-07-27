# 資料夾分類報告

## 主版本判定

- 主 UI 版本：`yangmeilife-生活集拷貝`，最新檔案時間 2026-06-26。
- 補件來源：`archive/cursor-history/latest/`，來源為舊版 `yangmeilife-生活集` Cursor History。

## 目前分類結果

| 類別 | 位置 | 用途 |
| --- | --- | --- |
| 入口頁 | `index.html` | 保留根目錄，避免靜態站首頁失效 |
| 搜尋頁 | `search.html` | 暫留根目錄；後續可移到 `pages/search.html` 並加轉址 |
| CSS | `assets/css/tailwind.min.css` | 本地 Tailwind build/minified 檔 |
| JS | `assets/js/homepage-thumbnails.js` | 首頁精選縮圖互動 |
| JS | `assets/js/vendor-directory.js` | 新版廠商卡片 UI 與分類資料來源 |
| 功能總表 | `data/site-functions.json` | 65 個功能的分類、狀態、現行連結、舊版來源 |
| 分類定義 | `data/site-categories.json` | 11 個分類資料夾的名稱、說明與維護負責類型 |
| 廠商資料 | `data/vendors/vendor-categories.json` | 從新版 JS 抽出的 11 類、33 筆廠商資料 |
| 廠商摘要 | `data/vendors/vendor-summary.json` | 分類頁與廠商數摘要 |
| 功能分類頁 | `pages/index.html` | 所有分類入口總覽 |
| 分類資料夾 | `pages/<分類>/` | 每個分類都有 `index.html`、`updates.json`、`updates.html`、`README.md` |
| 功能橋接頁 | 根目錄 `*.html` | 58 個尚未正式套版的功能頁，先承接首頁連結並指向分類/更新頁 |
| 文件 | `docs/CURSOR_FIX_TASK.md` | 原 Cursor 修正任務 |
| 更新指南 | `docs/CONTENT_UPDATE_GUIDE.md` | 後續內容更新流程 |
| 舊版快照 | `archive/cursor-history/latest/` | 舊版 166 個最新快照，補頁用 |

## 廠商資料摘要

- 分類數：11
- 廠商數：33

| 分類頁 | 分類名稱 | 廠商數 | 目前頁面 | 舊版來源 |
| --- | --- | ---: | --- | --- |
| beauty-skin.html | 楊梅美容護膚廠商 | 3 | 缺頁 | archive/cursor-history/latest/beauty-skin.html |
| hair-salon.html | 楊梅美髮造型廠商 | 3 | 缺頁 | archive/cursor-history/latest/hair-salon.html |
| eyelash-service.html | 楊梅美睫服務廠商 | 3 | 缺頁 | archive/cursor-history/latest/eyelash-service.html |
| nail-service.html | 楊梅美甲服務廠商 | 3 | 缺頁 | archive/cursor-history/latest/nail-service.html |
| thai-massage.html | 楊梅泰式按摩廠商 | 3 | 缺頁 | archive/cursor-history/latest/thai-massage.html |
| vietnamese-massage.html | 楊梅越式按摩廠商 | 3 | 缺頁 | archive/cursor-history/latest/vietnamese-massage.html |
| taiwanese-massage.html | 楊梅台式按摩廠商 | 3 | 缺頁 | archive/cursor-history/latest/taiwanese-massage.html |
| american-chiropractic.html | 楊梅美式整復廠商 | 3 | 缺頁 | archive/cursor-history/latest/american-chiropractic.html |
| food-truck.html | 楊梅餐車廠商 | 3 | 缺頁 | archive/cursor-history/latest/food-truck.html |
| kungfu-tea.html | 楊梅飲品廠商 | 3 | 缺頁 | archive/cursor-history/latest/kungfu-tea.html |
| rental-management.html | 楊梅包租代管廠商 | 3 | 缺頁 | archive/cursor-history/latest/rental-management.html |

## 驗證結果

- 分類資料夾：11 個。
- 每個分類資料夾皆有 `index.html`、`updates.json`、`updates.html`、`README.md`。
- 根目錄功能橋接頁：58 個。
- 本地 HTML 連結掃描：83 個 HTML，缺檔連結 0。
