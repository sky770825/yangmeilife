# Cursor Auto 任務包：YangmeiLife 分頁輪詢與修正

## 工作原則

1. 以 2026-06-26 新版 UI 為主：`index.html`、`assets/css/tailwind.min.css`、`assets/js/vendor-directory.js`。
2. 不要用舊版覆蓋新版。舊版只從 `archive/cursor-history/latest/` 擷取缺頁內容與資料。
3. 先修可用性與缺頁，再做視覺微調；每次修改後回報檔案清單和測試結果。
4. 廠商資料以 `data/vendors/vendor-categories.json` 為資料源，避免在多個頁面重複硬編。

## 第一輪輪詢任務

請逐頁檢查：

- `index.html`
- `search.html`
- `data/vendors/vendor-categories.json` 對應的 11 個廠商分類頁
- `reports/page-review.md` 裡列出的缺失本地頁

## 第一輪修正範圍

1. 讀 `reports/page-review.md` 與 `reports/folder-classification.md`。
2. 檢查 `index.html` 的互動問題，依 `docs/CURSOR_FIX_TASK.md` 修首頁穩定性，但不要大改版。
3. 把 11 個廠商分類頁補回可用狀態：
   - 來源可參考 `archive/cursor-history/latest/*.html`。
   - 視覺與卡片比例要套新版 `assets/js/vendor-directory.js`。
   - 分類頁要載入 `assets/css/tailwind.min.css` 與 `assets/js/vendor-directory.js`。
4. 搜尋頁連結要能導向實際存在頁；缺頁未補回前，不要留下死連結。
5. 修完後更新 `reports/page-review.md` 的狀態。

## 已驗證的立即問題

- 首頁 Swiper CDN CSS/JS 的 `integrity` 雜湊不符，瀏覽器會封鎖資源；請改成本地資源、移除錯誤 integrity，或在沒有 `.mySwiper` 時移除 Swiper 依賴。
- `search.html` 會觸發 `favicon.ico` 404；請補 favicon 或在 head 使用一致的 icon 設定。
- 搜尋「垃圾車」會顯示結果，但連到目前缺失的 `garbage.html`；請補頁或先改成可用入口。

## 驗收要求

- 靜態掃描沒有舊資源路徑：`tailwind.min.css`、`homepage-thumbnails.js` 不應再從根目錄載入。
- 首頁搜尋可以保存關鍵字並進入搜尋頁。
- 廠商彈窗可以開關。
- 主要卡片在手機寬度下不重疊。
- 廠商分類頁至少 11 頁可開啟，且每頁顯示對應 3 筆廠商資料。
- 回報 Console error、缺頁、需要人工確認的正式網域與素材。
