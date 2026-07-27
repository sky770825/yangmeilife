# Public Page Cleanup - 2026-07-03

## Scope

- 移除消費者頁面上的工程端、維護端與資料來源提示文字。
- 將公開顯示的「廠商 / 後台 / 測試」語氣改成「店家 / 資料管理 / 圖片上傳」。
- 店家卡片保留電話、導航、官網與洽詢等消費者操作，隱藏核實狀態徽章。
- 後台維護欄位仍保留在資料檔中，不顯示在前台。

## Updated Areas

- `scripts/build-main-structure.mjs`
  - 共用導覽按鈕補上明確色彩 fallback。
  - 分類頁統計改為「可使用 / 店家」。
  - 店家頁標題、介紹、空狀態轉成消費者文案。
  - 店家卡片移除「已核實 / 待核實」顯示。
  - 搜尋索引將公開標籤轉成店家語氣。

- `data/site-categories.json`
  - `vendors-admin` 改為「店家合作與資料管理」。

- `data/site-functions.json`
  - 「廠商進駐」改為「店家登錄」。
  - 「廠商後台」改為「店家資料管理」。
  - 「圖片上傳測試」改為「圖片上傳」。

- `data/service-page-source.mjs`
  - 店家資料管理、圖片上傳、預約服務頁改成前台可讀文案。

## Verification

- `node --check scripts/build-main-structure.mjs`
- `node --check data/service-page-source.mjs`
- `node --check assets/js/vendor-page.js`
- `node --check assets/js/service-page.js`
- `node --check assets/js/site-search.js`
- JSON parse check for `data/site-functions.json` and `data/site-categories.json`
- Current-site local reference scan: 83 HTML files, 512 local references, 0 missing
- Browser visible-text scan passed for:
  - `pages/index.html`
  - `search.html`
  - `pages/vendors-admin/index.html`
  - `vendor-admin.html`
  - `test-image-upload.html`
  - `booking.html`
  - `kungfu-tea.html`

## Screenshots

- `output/playwright/public-clean-categories-desktop.png`
- `output/playwright/public-clean-search-desktop.png`
- `output/playwright/public-clean-store-management-desktop.png`
- `output/playwright/public-clean-kungfu-desktop.png`
- `output/playwright/public-clean-kungfu-mobile.png`
