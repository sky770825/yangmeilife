# 逐頁檢視初版報告

檢視原則：新版 2026-06-26 UI 為主，舊版 Cursor History 僅作資料/缺頁補件來源。

## 目前實體頁面

| 頁面 | 大小 | 行數 | 本地引用數 | 缺檔引用 | 初步問題 |
| --- | ---: | ---: | ---: | ---: | --- |
| index.html | 130135 | 3094 | 5 | 2 | 保留 cardPreview/previewContent，但目前 DOM 可能不存在<br>Swiper 初始化依賴 .mySwiper，需要確認頁面是否存在<br>有即時/統計文案，需確認是否真資料<br>存在 inline onclick，鍵盤可近用性需逐步改善<br>本地連結缺檔 2 個 |
| search.html | 5803 | 122 | 16 | 14 | 本地連結缺檔 14 個 |

## 本地缺頁引用

| 缺失頁面 | Cursor 歷史補件 | 歷史時間 |
| --- | --- | --- |
| air-conditioning.html | archive/cursor-history/latest/air-conditioning.html | 2026-01-29T10:22:01.889Z |
| booking.html | 無 |  |
| bus.html | archive/cursor-history/latest/bus.html | 2026-01-07T01:03:29.980Z |
| daily-quote.html | archive/cursor-history/latest/daily-quote.html | 2026-01-07T01:16:21.767Z |
| fortune.html | archive/cursor-history/latest/fortune.html | 2026-01-07T10:18:32.687Z |
| games.html | archive/cursor-history/latest/games.html | 2026-01-07T01:21:36.892Z |
| garbage.html | archive/cursor-history/latest/garbage.html | 2026-01-07T01:03:24.641Z |
| mbti.html | archive/cursor-history/latest/mbti.html | 2026-01-07T01:16:54.159Z |
| moving-company.html | archive/cursor-history/latest/moving-company.html | 2026-01-29T08:41:11.884Z |
| paint-service.html | archive/cursor-history/latest/paint-service.html | 2026-01-29T10:22:01.889Z |
| pest-control.html | archive/cursor-history/latest/pest-control.html | 2026-01-29T13:00:12.209Z |
| receipt.html | archive/cursor-history/latest/receipt.html | 2026-01-07T01:16:05.287Z |
| water-electric.html | archive/cursor-history/latest/water-electric.html | 2026-01-29T13:00:12.200Z |
| weather.html | archive/cursor-history/latest/weather.html | 2026-01-07T07:34:32.998Z |
| worship.html | archive/cursor-history/latest/worship.html | 2026-01-07T01:13:51.393Z |

## 廠商分類頁檢查

新版 `assets/js/vendor-directory.js` 已定義 11 個分類頁與 33 筆廠商資料，但目前分類頁本體尚未放回主資料夾。

| 分類頁 | 分類名稱 | 廠商數 | 狀態 | 補件來源 |
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

## 優先設計檢查點

1. `index.html` 是目前最新 UI 主體，但仍有首頁互動風險：卡片 inline onclick、cardPreview DOM 可能缺失、Swiper 容器需確認、統計文案可信度需再查。
2. `search.html` 目前是簡化搜尋頁，視覺密度低於首頁；服務清單連到多個缺失工具頁，需要補頁或先降級成可用狀態。
3. 廠商分類 UI 在 `assets/js/vendor-directory.js` 較新，包含 compact/gallery、搜尋、排序、收藏；後續補回頁面時應套用這個新版元件，不應直接使用舊版頁面視覺。
4. 舊版有 60 個 HTML 頁面，可用來補內容和功能，但 UI/比例要向新版靠齊。

## 實機瀏覽器檢查

- 本地網址：`http://127.0.0.1:8017/`
- 首頁、`assets/css/tailwind.min.css`、`assets/js/homepage-thumbnails.js`、`search.html` HTTP 狀態皆為 200。
- 首頁可載入並顯示主要區塊；搜尋「垃圾車」可帶到 `search.html`，並顯示 1 筆結果。
- Console error：Swiper CDN CSS/JS 的 `integrity` 雜湊不符，被瀏覽器封鎖。
- Console error：`search.html` 載入時請求 `favicon.ico` 回 404。
- 搜尋結果 `garbage.html` 目前缺檔，屬於第一輪補頁或降級處理項。

## Cursor 狀態

- 已建立 `docs/CURSOR_AUTO_TASK.md` 作為 Cursor Auto 第一輪任務包。
- 已嘗試啟動 `cursor agent` 執行任務，但終端長時間無輸出，且沒有看到 Cursor 新增分類頁或完成回報；已停止該背景 agent。
- 已用 macOS `open -a Cursor` 開啟本專案資料夾，後續可在 Cursor Auto 讀取 `docs/CURSOR_AUTO_TASK.md` 繼續修改。

## 2026-07-02 功能分類補充

- 已新增 `data/site-functions.json`，整理 65 個功能。
- 已新增 `data/site-categories.json`，整理 11 個功能分類。
- 已新增 `pages/index.html` 作為功能分類總覽。
- 已在每個 `pages/<分類>/` 建立 `index.html`、`updates.json`、`updates.html`、`README.md`。
- 已建立 58 個根目錄功能橋接頁，讓首頁既有功能連結先導到分類/更新頁，不再直接 404。
- 本地 HTML 連結掃描：83 個 HTML，缺檔連結 0。
