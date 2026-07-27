# Cursor 高層架構審查結果

審查時間：2026-07-02
專案根目錄：`yangmeilife-生活集拷貝`
審查方式：唯讀檢查（未修改正式網站檔案）

## 摘要

主架構已具備可運作的中央資料流：`data/site-functions.json` → `scripts/build-main-structure.mjs` → 分類頁、搜尋資料、32 個正式功能頁、11 個正式廠商頁。語法檢查與數量統計（11 分類 / 65 功能 / 32 功能頁 / 33 廠商）皆與基準線一致。

目前最大的結構性風險不在「缺頁」，而在 **三軌入口不同步**（首頁手寫、`pages/*` 產生器、搜尋資料）、**正式頁內容仍藏在產生器內**、以及 **示範資料在 UI 上呈現得像已核實內容**。15 個尚未現代化的橋接頁會讓從首頁進入的使用者遇到「只有說明、沒有功能」的斷點。

建議下一輪優先做「資料治理與狀態釐清」，再分批現代化剩餘 15 頁；首頁大改與娛樂類頁面可排在後段。

---

## 方向性問題

### 1. High - 正式功能頁內容真實來源在產生器，而非可維護的資料檔

- 影響範圍：`scripts/build-main-structure.mjs`（`servicePageEnhancements`，約 400+ 行）、`data/service-pages.json`（產出物）、`assets/js/service-page-data.js`、`docs/CONTENT_UPDATE_GUIDE.md`
- 觀察：`servicePageEnhancements` 才是 32 個正式功能頁的卡片、摘要、checklist、計算器設定來源；`build-main-structure.mjs` 執行後才寫入 `data/service-pages.json`。維護指南卻寫「更新 `data/service-pages.json`」，與實際資料流相反。
- 風險：內容維護者改 JSON 後一跑 build 就被覆寫；Cursor Auto 也容易在 1500 行的產生器裡做大範圍修改，難以 code review。
- 建議：下一批先把 enhancements 抽成 `data/service-page-source/` 或單一 `data/service-page-source.json`，產生器只負責合併 `site-functions.json` 與輸出；同步修正 `CONTENT_UPDATE_GUIDE.md`。
- 是否適合 Cursor Auto：**適合**，但任務需限定為「搬移資料、不改 UI 行為」，一次處理一個分類（如 `daily-info`）較安全。

### 2. High - 首頁、分類頁、搜尋頁三軌導覽未同步

- 影響範圍：`index.html`（約 53 處 `openTool()` 手寫連結）、`pages/<category>/index.html`（產生器輸出）、`assets/js/site-search-data.js`、`data/site-functions.json`
- 觀察：分類頁與搜尋由 `site-functions.json` 驅動；首頁卡片仍手動維護，且未涵蓋全部 65 功能。首頁僅一處 CTA 連到 `pages/index.html`，多數使用者仍從首頁卡片直達功能，不經分類總覽。
- 風險：新增或變更功能時，首頁、搜尋、分類三處狀態標籤與目標 URL 容易漂移；使用者從不同入口進入同一功能可能得到不同體驗。
- 建議：短期在 `site-functions.json` 增加 `featuredOnHome` / `homeSection` 欄位，由產生器輸出首頁卡片片段（或獨立 `homepage-cards.json`）；中期再決定是否保留 3000 行 `index.html` 的互動層。
- 是否適合 Cursor Auto：**部分適合**（資料欄位與產生器擴充）；首頁視覺與動效調整需人工審核。

### 3. High - `external-active` 與本地廠商頁並存，造成幽靈頁與導覽分裂

- 影響範圍：`kungfu-tea.html`、`food-truck.html`、`data/site-functions.json`、`pages/food-drink/index.html`、`index.html`、`assets/js/site-search-data.js`、`data/vendors/categories/kungfu-tea/`、`food-truck/`
- 觀察：
  - `site-functions.json` 中功夫茶、餐車為 `external-active`，`currentUrl` 指向外部 pages.dev。
  - 同時存在正式廠商頁 `kungfu-tea.html`、`food-truck.html`（`vendor-page.js` 渲染），含 3 筆展示廠商。
  - 首頁與 `pages/food-drink` 連到**外部**；分類頁註解仍寫「舊版來源：kungfu-tea.html」；搜尋結果標「外部連結」。
  - 本地廠商頁**無主流程入口**（僅直接 URL 或舊版 archive 可達）。
- 風險：維護者不知道要更新外部站還是本地 `vendors.json`；使用者搜尋到外部連結，卻存在另一套本地商家列表；日後若改回本地頁，首頁與搜尋需同步大改。
- 建議：人工決策每個功能的**唯一 canonical target**（外部 OR 本地廠商頁 OR 停用本地頁）；在 `site-functions.json` 拆成 `implementationStatus` 與 `linkTarget` 兩欄；未選定的本地頁加 `noindex` 或移除產出。
- 是否適合 Cursor Auto：**不適合自動改連結**；適合先做衝突清單與 schema 提案，由人工確認後再執行。

### 4. High - 示範資料在 UI 層缺乏「未核實」標示，易被誤認為真實商家或官方資訊

- 影響範圍：`assets/js/vendor-page.js`、`assets/js/service-page.js`、`data/vendors/categories/*/vendors.json`、`data/vendors/categories/*/updates.json`（含 `needsVerification: true`）
- 觀察：
  - 廠商 `updates.json` 已標 `status: "展示資料"`、`needsVerification: true`，但 `vendors.json` 與 `vendor-page.js` **未讀取或顯示**這些欄位。
  - 畫面直接呈現店名、★ 評分、價格、Unsplash 圖片，視覺上等同已上架商家。
  - 正式功能頁（如 `garbage.html`、`weather.html`）的區域路線、天氣描述也是骨架文案，僅 checklist 提到「待官方核對」，一般使用者不會看到。
- 風險：上線後信任度受損；法律或商業糾紛風險（虛構店名/評分）；維護者以為資料已完備。
- 建議：在 `vendor-page.js`、`service-page.js` 加全域 banner（「展示資料，非官方核實」）；`vendors.json` 補 `verified`、`source`、`updatedAt`；未核實項目不顯示評分或改為「待核實」。
- 是否適合 Cursor Auto：**適合**加 UI 標示與 schema 欄位；實際商家核實必須人工。

### 5. Medium - `site-functions.json` 狀態與 UI 顯示狀態脫鉤

- 影響範圍：`data/site-functions.json`、`scripts/build-main-structure.mjs`（`statusText()`）、分類頁狀態徽章、搜尋結果狀態
- 觀察：9 個廠商功能在 JSON 仍為 `archive-source`，但產生器依「本地廠商頁是否存在」動態顯示「正式廠商頁」。`rental-management.html` 在搜尋為「正式廠商頁」，JSON 卻是 `archive-source`。
- 風險：以 JSON 為準的維護流程與實際 UI 不一致；批次篩選「尚未正式化」功能時會漏判。
- 建議：build 結束時回寫 `site-functions.json` 的衍生狀態，或改為單一 `derivedStatus` 欄位並在文件中定義優先順序。
- 是否適合 Cursor Auto：**適合**做狀態同步腳本與文件更新。

### 6. Medium - 15 個橋接頁造成「可點進、無功能」的體驗斷層

- 影響範圍：首頁直連的 `dashboard.html`、`games.html`、`fortune.html`、`mbti.html`、`daily-quote.html`、`hospital-clinic.html` 等；各頁約 47 行、標籤「新版橋接頁」
- 觀察：首頁仍大量 `onclick="openTool('games.html')"` 等連到橋接頁；橋接頁僅導向分類入口、`updates.html`、archive 舊版，**沒有實際工具**。`loan-calc.html` 稍好，有「開啟外部連結」按鈕但仍多一層。
- 風險：使用者以為功能壞掉或網站未完成；搜尋若顯示「新版橋接頁」也無法滿足需求。
- 建議：依首頁曝光優先排序現代化（見下方批次）；過渡期可在橋接頁加明顯「功能整理中」與一鍵跳轉（外部或舊版）。
- 是否適合 Cursor Auto：**適合分批**升級為正式功能頁或專用模板；不適合一次 15 頁全改。

### 7. Medium - 廠商資料分層已有雛形，但展示層與治理層未接通

- 影響範圍：`data/vendors/categories/<id>/vendors.json`、`updates.json`、`assets/js/vendor-page.js`、`assets/js/vendor-directory.js`（舊版集中資料，仍留存）
- 觀察：分類子資料夾結構清楚（11 類 × `vendors.json` + `updates.json` + README）。展示用 `vendors.json` 僅有 `id, name, area, price, rating, image, tags`；缺少電話、地址、營業時間、資料來源、核實日。`updates.json` 的治理資訊未流入前端。
- 風險：雙份資料源（`vendor-directory.js` vs `vendor-data.js`）增加混淆；擴充商家時不知必填欄位。
- 建議：定義 `vendors.json` schema v2；build 時驗證必填欄位；逐步淘汰 `vendor-directory.js` 若已不再使用。
- 是否適合 Cursor Auto：**適合** schema 與驗證腳本；商家內容需人工。

### 8. Medium - 首頁技術債影響行動版穩定與可信度

- 影響範圍：`index.html`（約 3094 行）、行動版首屏與搜尋流程
- 觀察：
  - `cardPreview` / `previewContent` DOM **不存在**，但 JS 仍引用（`showCardPreview`）。
  - `mySwiper` 初始化有判斷容器，但頁面內無對應元素；Swiper CDN `integrity` 不符會被瀏覽器封鎖（`page-review.md` 已記錄）。
  - Hero 區顯示「12,345 位用戶」等裝飾數字；`updateUserCount()` 僅在元素存在時改為「常用」，多數情況仍顯示假數字。
  - 大量 `onclick` 卡片，鍵盤與螢幕閱讀器可及性弱於分類頁的 `<a>` 結構。
- 風險：Console 錯誤、互動失效、假統計降低信任；手機上密集卡片難掃描。
- 建議：優先修 Swiper / 移除死碼 / 假統計；行動版輪詢應包含「首頁 → 搜尋 → 結果頁 → 正式功能頁」完整路徑。
- 是否適合 Cursor Auto：**適合**修死碼與 CDN；統計文案與首頁 IA 需人工定調。

### 9. Low - 報告與產物邊界易混淆

- 影響範圍：`reports/main-structure.md`（每次 build 覆寫）、`reports/page-review.md`、`reports/folder-classification.md`（部分內容已過時）
- 觀察：`folder-classification.md` 仍寫「11 個廠商分類頁缺頁」；現況已補齊。`main-structure.md` 含 Cursor 執行狀態，重建後會消失。
- 風險：新進維護者或 Cursor Auto 讀到過時報告而做錯決策。
- 建議：人工審查固定寫入 `reports/cursor-big-picture-findings.md`；過時報告加頂部「可能過時」或改由 build 產生 `reports/generated-*`。
- 是否適合 Cursor Auto：**適合**更新文件與加註記；不適合把審查寫進 `main-structure.md`。

---

## 建議修改批次

### 批次 0：資料治理（建議最先做，1–2 輪）

1. 抽出 `servicePageEnhancements` → 獨立資料檔
2. 釐清功夫茶 / 餐車 / 房貸試算等 external vs 本地頁策略
3. 同步 `site-functions.json` 顯示狀態與 UI 徽章
4. 廠商與功能頁加「展示資料」banner + schema 欄位

### 批次 1：高曝光橋接頁現代化（使用者體感最大）

| 優先序 | 頁面 | 理由 |
| --- | --- | --- |
| 1 | `dashboard.html` | 首頁「生活助手」核心入口，應整合常用工具捷徑 |
| 2 | `hospital-clinic.html` | 醫療類信任敏感，橋接頁傷害大 |
| 3 | `investor.html`、`tax-calc.html`、`rental-mgmt.html` | 房產區與首頁投資/租賃相關卡片連結 |
| 4 | `games.html`、`fortune.html`、`mbti.html`、`daily-quote.html` | 首頁「輕鬆時光」四張卡直連，目前全為空殼 |
| 5 | `share.html`、`notifications.html` | 核心導覽，但首頁曝光較低 |
| 6 | `loan-calc.html` | 已有外部連結，可改為輕量 redirect 或內嵌說明頁 |
| 7 | `vendor-admin.html`、`booking.html` | 後台向，可晚於前台 |
| 8 | `test-image-upload.html` | 測試頁，可移出主導覽或加維護者限定 |

### 批次 2：首頁與跨頁導覽（依賴批次 0 的狀態定義）

1. 修 `index.html` 死碼、Swiper、假統計
2. 首頁卡片資料化或與 `site-functions.json` 對帳
3. 桌機 + 手機巡檢：首頁 → 搜尋 → 分類 → 功能頁 → 返回

### 批次 3：內容深度（在 UI 穩定後）

1. 32 個正式功能頁逐頁標記 `dataReadiness`（展示 / 人工維護 / API）
2. 33 筆廠商資料人工核實或替換為真實合作商家

---

## 需要人工確認的事項

1. **功夫茶、餐車**：canonical 入口要外部站（pages.dev）還是本地廠商目錄頁？若選外部，是否下架 `kungfu-tea.html` / `food-truck.html` 的產出？
2. **房貸試算 `loan-calc.html`**：長期要內嵌試算、保留外部連結，還是合併到 `investor.html` / `tax-calc.html`？
3. **包租代管**：`rental-management.html`（廠商頁）與 `rental-mgmt.html`（工具橋接）是否要合併或明確分工？
4. **首頁假統計**（12,345 用戶、50+ 工具）：改為真實數字、移除，還是改文案為「精選服務」不宣稱用戶數？
5. **示範廠商**：上線前是否全部隱藏評分，或僅顯示已簽約商家？
6. **`test-image-upload.html`**：是否應從正式導覽與 `site-functions.json` 移除，僅留開發環境？
7. **`booking.html`**：狀態為 `needs-page` 且無 archive 來源，需定義產品範圍後再交 Cursor 實作。

---

## 本輪驗證紀錄

```text
node --check scripts/build-main-structure.mjs     ✓
node --check assets/js/service-page.js            ✓
node --check assets/js/site-search.js             ✓
site-navigation totals: 11 / 65 / 32 / 11 / 33    ✓
service-pages.json: 32 pages                      ✓
vendor-categories: 11                             ✓
```
