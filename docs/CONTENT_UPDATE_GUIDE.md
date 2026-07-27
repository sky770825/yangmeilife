# 功能分類與資訊更新維護說明

## 主要資料源

- `data/site-functions.json`：所有功能總表。
- `data/site-categories.json`：分類定義。
- `data/site-navigation.json`：主架構索引，列出入口頁、分類資料夾與數量。
- `data/service-page-source.mjs`：正式功能頁內容來源，包含卡片項目、更新清單與估算器設定。
- `data/service-pages.json`：正式功能頁產出資料，由生成器同步，不要手動當作主要來源。
- `pages/<分類>/updates.json`：每個分類自己的資訊更新檔。
- `pages/<分類>/updates.html`：每個分類給維護者看的資訊更新分頁。
- `data/vendors/categories/<廠商分類>/vendors.json`：各廠商頁實際展示資料。
- `data/vendors/categories/<廠商分類>/updates.json`：各廠商分類的更新核對清單。

## 資料可信度欄位

正式功能頁會輸出 `dataStatus`：

- `dataReadiness`：例如 `展示資料`、`人工維護`、`已接資料源`。
- `verificationStatus`：例如 `待核實`、`已核實`。
- `needsVerification`：是否仍需要人工核實。
- `sourceFile`：目前資料維護來源。
- `sourceNote`：顯示給使用者看的資料狀態說明。
- `lastVerifiedAt`：最後人工核實日期，未核實時為 `null`。

廠商資料每筆會輸出：

- `verified`：是否已完成商家或平台核實。
- `needsVerification`：是否仍需核實。
- `verificationStatus`：卡片上顯示的狀態。
- `dataReadiness`：資料成熟度。
- `dataSource`：資料來源檔。
- `sourceNote`：資料來源備註。
- `lastVerifiedAt`：最後核實日期。

未核實資料會在正式功能頁與廠商頁顯示提示，不應移除，除非該頁資料來源已完成核實。

## 更新流程

1. 新增或修改功能時，先更新 `data/site-functions.json`。
2. 若是正式功能頁內容，更新 `data/service-page-source.mjs`。
3. 若功能屬於廠商資料，同步檢查 `data/vendors/vendor-categories.json`，並確認 `verified` 與 `lastVerifiedAt`。
4. 若是廠商頁，更新 `data/vendors/categories/<廠商分類>/vendors.json`。
5. 從專案根目錄執行 `node scripts/build-main-structure.mjs`。
6. 確認 `pages/<分類>/index.html`、`updates.html`、`search.html` 與相關功能頁是否同步。
7. 若要把功能放回首頁，再修改 `index.html` 的對應卡片連結。

## 功能狀態與路由欄位

`data/site-functions.json` 目前保留舊欄位 `status`，同時新增下列欄位，先作為資料治理與下一批路由整理的基準：

- `implementationStatus`：功能在本站的實作成熟度，例如 `current-page`、`service-page`、`vendor-page`、`bridge-page`、`none`。
- `targetType`：使用者點擊入口的類型，例如 `local-page`、`external-link`、`dual-entry`。
- `externalUrl`：外部網址；沒有外部入口時為 `null`。
- `primaryTarget`：雙入口功能的主入口，依功能決策填 `local-page` 或 `external-link`。
- `secondaryTargetType` / `secondaryTargetUrl`：雙入口功能的次要入口，可保留本地頁或外部部署作為備用入口。

目前 `status` 與 `currentUrl` 仍維持相容；搜尋頁、分類頁與更新檔的實際主連結已由 `targetType` 與 `primaryTarget` 決定。現階段雙入口決策如下：

- `loan-calc-external`：外部房貸工具為主入口，`loan-calc.html` 為站內次入口。
- `kungfu-tea-live`：`kungfu-tea.html` 正式廠商頁為主入口，外部部署為次入口。
- `food-truck-live`：`food-truck.html` 正式廠商頁為主入口，外部部署為次入口。

## 主架構生成器

`scripts/build-main-structure.mjs` 會同步：

- `pages/index.html`
- 11 個 `pages/<分類>/index.html`
- 11 個 `pages/<分類>/updates.html`
- 11 個 `pages/<分類>/updates.json`
- `data/site-navigation.json`
- `assets/js/site-search-data.js`
- `data/service-pages.json`
- `assets/js/service-page-data.js`
- `assets/js/service-page.js`
- `assets/js/vendor-data.js`
- 11 個根目錄廠商正式頁
- `daily-info`、`home-services`、`personal-tools` 與 `community-content` 的正式功能頁

## 狀態說明

- `current-page`：主資料夾已有可用頁面。
- `external-active`：目前走外部連結。
- `archive-source`：舊版快照有來源，但需套新版 UI 後再上主站。
- `needs-page`：目前沒有主頁，也沒有可直接使用的新版頁面。
- `implementationStatus: service-page`：已納入正式功能頁資料流。
- `implementationStatus: vendor-page`：已納入正式廠商資料流。
- `implementationStatus: bridge-page`：已有本地橋接頁，但內容仍需升級。
- `targetType: dual-entry`：同時有外部入口與本地頁，需人工決定主入口。
- `新版橋接頁`：根目錄已有新版入口，但內容仍需從舊版來源升級。
- `正式功能頁`：已使用新版功能頁資料與互動介面。
- `正式廠商頁`：已使用新版廠商資料與卡片介面。
