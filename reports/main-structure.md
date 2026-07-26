# 主架構整理報告

生成時間：2026-07-03T09:23:39+0800

## 已完成

- 建立中央導覽資料：`data/site-navigation.json`
- 重建功能分類總覽：`pages/index.html`
- 重建 11 個主分類入口與 `updates.html / updates.json`
- 將 11 個廠商分類拆成子資料夾：`data/vendors/categories/*`
- 將 11 個廠商頁改成正式資料驅動頁：`beauty-skin.html` 等
- 將 `daily-info`、`home-services`、`personal-tools` 與 `community-content` 共 47 個頁面升級成正式功能頁
- 新增正式功能頁源資料：`data/service-page-source.mjs`
- 新增正式功能頁資料：`data/service-pages.json`
- 新增正式功能頁前端資料：`assets/js/service-page-data.js`
- 新增正式功能頁渲染器：`assets/js/service-page.js`
- 新增娛樂互動資料來源：`data/entertainment/*.json`
- 新增娛樂互動前端資料：`assets/js/entertainment-data.js`
- 將 `search.html` 改為使用 `assets/js/site-search-data.js`，來源為 `data/site-functions.json`
- 新增共用圖示：`assets/favicon.svg`

## 數量

- 主分類：11
- 功能：65
- 正式功能頁：47
- 廠商分類：11
- 廠商資料：11

## 下一步

1. 逐頁檢查 32 個正式功能頁的真實資料來源，把示範資訊換成可發布內容。
2. 正式功能頁內容先維護 `data/service-page-source.mjs`，再跑 `node scripts/build-main-structure.mjs` 同步。
3. 廠商資料先維護 `data/vendors/categories/<分類>/vendors.json`，再跑 `node scripts/build-main-structure.mjs` 同步。
4. 下一批可升級 `site-core`、`real-estate`、`leisure`、`vendors-admin` 與 `health-care` 的剩餘橋接頁。
