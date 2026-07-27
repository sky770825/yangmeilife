# Cursor 狀態欄位與路由語意審查報告

審查時間：2026-07-02
審查依據：`docs/CURSOR_STATUS_ROUTING_AUDIT.md`
資料基準：`data/site-functions.json`（未修改）、`scripts/build-main-structure.mjs`、`assets/js/site-search-data.js`、`assets/js/site-search.js`（任務書所列 `assets/js/search.js` 已不存在，搜尋邏輯實際在 `site-search.js`）

> 執行狀態：本報告為修正前問題盤點。2026-07-02 已完成批次 B：`scripts/build-main-structure.mjs` 現在依 `targetType` / `primaryTarget` 決定搜尋頁、分類頁與更新檔主入口；`kungfu-tea-live`、`food-truck-live` 已改為站內正式廠商頁優先，外部部署為次入口；`loan-calc-external` 維持外部工具優先，`loan-calc.html` 為站內次入口。

---

## 1. 摘要

**最大問題：`status` 與 `external` 同時承擔「頁面成熟度」與「點擊路由」，且產生器以 `external` 優先於廠商頁／本地頁，導致 3 個雙入口功能在搜尋與分類頁一律導向外部網址、狀態標籤也與實際頁面類型不符。**

---

## 2. 欄位拆分建議

建議將 `data/site-functions.json` 每筆功能的語意拆成下列欄位，並保留 `status` 一段時間作為相容別名（由產生器對照映射），再逐步移除。

### `implementationStatus`（功能成熟度）

描述「這個功能在本站的實作階段」，**不決定**點擊後去哪裡。

| 允許值 | 說明 | 對應現況 |
|--------|------|----------|
| `current-page` | 新版主架構頁，內容已就位 | `status: current-page`（首頁、搜尋） |
| `service-page` | 已納入 `data/service-page-source.mjs` 的正式功能頁 | 32 筆；JSON 多數仍標 `archive-source` |
| `vendor-page` | 已納入廠商資料流的正式廠商頁 | 11 筆；JSON 多數仍標 `archive-source` |
| `bridge-page` | 根目錄有新版橋接入口，內容待從舊版升級 | 15 筆尚未現代化頁 |
| `archive-only` | 僅有 `archivePath`，根目錄無可用頁 | 目前 0 筆（皆已被產生器補橋接頁） |
| `needs-page` | 尚無可用入口 | 僅在 `page` 不存在且無外部網址時使用 |

### `targetType`（主要點擊目標）

描述「使用者從搜尋／分類卡片點擊時，預設應去哪裡」。

| 允許值 | 說明 |
|--------|------|
| `local-page` | 開啟 `page` 指定的本地 HTML |
| `external-link` | 開啟 `externalUrl`（建議由 `currentUrl` 重新命名） |
| `archive-fallback` | 僅在無本地頁、無外部網址時，導向 `archivePath` |
| `none` | 尚無可用入口（顯示停用或待建立） |

### 雙入口擴充欄位（`targetType` 無法單欄表達時）

當本地頁與外部服務並存時，建議再加：

| 欄位 | 說明 |
|------|------|
| `secondaryTargetType` | 次要入口類型，例如 `local-page` |
| `secondaryTargetUrl` | 次要入口網址或檔名 |
| `primaryTarget` | `external` 或 `local`，標明卡片主按鈕預設行為 |

目前專案中有 **3 筆**符合雙入口：`loan-calc-external`、`kungfu-tea-live`、`food-truck-live`。

### 建議一併整理的相關欄位

| 現有欄位 | 建議 |
|----------|------|
| `currentUrl` | 重新命名為 `externalUrl`，且僅在 `targetType` 為 `external-link` 或雙入口時填寫 |
| `external`（boolean） | 改由 `targetType` 推導，避免與 `implementationStatus` 衝突 |
| `page` | 保留，表示本地頁路徑 |
| `archivePath` | 保留，供橋接頁與舊版參考 |

### 產生器顯示狀態（`displayStatus`）

`scripts/build-main-structure.mjs` 的 `statusText()` 目前輸出「新版頁面／正式功能頁／正式廠商頁／新版橋接頁／外部連結／舊版來源／待建立」。建議改為：

```
displayStatus = f(implementationStatus, targetType, localPageExists)
```

**不再**用 `fn.external` 單獨覆寫廠商頁或正式功能頁的成熟度標籤。

---

## 3. 受影響功能清單

共 65 筆功能。下表「建議欄位」依目前檔案系統實際狀態推導；「產生器顯示」為執行 `build-main-structure.mjs` 後使用者看到的標籤。

| id | title | 目前 status | 目前 page | 建議 implementationStatus | 建議 targetType | 產生器顯示 | 備註 |
|----|-------|-------------|-----------|-------------------------|-----------------|------------|------|
| home | 首頁 | current-page | index.html | current-page | local-page | 新版頁面 | — |
| search | 搜尋服務 | current-page | search.html | current-page | local-page | 新版頁面 | — |
| dashboard | 生活助手儀表板 | archive-source | dashboard.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| share | 分享頁 | archive-source | share.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| notifications | 通知中心 | archive-source | notifications.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| property-valuation | 房屋估價 | external-active | — | none | external-link | 外部連結 | 純外部 |
| loan-calc-external | 房貸試算 | external-active | loan-calc.html | bridge-page | dual-entry | 外部連結 | 搜尋／分類優先外部；本地橋接頁被忽略 |
| featured-properties | 精選物件 | external-active | — | none | external-link | 外部連結 | 純外部 |
| pre-sale | 新案預售 | external-active | — | none | external-link | 外部連結 | 純外部 |
| investor | 投資人工具 | archive-source | investor.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| tax-calc | 稅費試算 | archive-source | tax-calc.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| rental-management | 包租代管 | archive-source | rental-management.html | vendor-page | local-page | 正式廠商頁 | JSON status 過時 |
| rental-mgmt | 租賃管理工具 | archive-source | rental-mgmt.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| weather | 天氣查詢 | archive-source | weather.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| garbage | 垃圾車時間 | archive-source | garbage.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| bus | 公車動態 | archive-source | bus.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| parking | 停車資訊 | archive-source | parking.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| taxi | 計程車行 | archive-source | taxi.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| rate | 匯率查詢 | archive-source | rate.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| local-life | 在地生活 | archive-source | local-life.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| renovation | 裝潢設計 | archive-source | renovation.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| decor-calc | 裝潢估算 | archive-source | decor-calc.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| water-electric | 水電修繕 | archive-source | water-electric.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| inspection-company | 驗屋公司 | archive-source | inspection-company.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| inspection | 驗屋檢查工具 | archive-source | inspection.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| anti-dust-screen | 防霾紗網 | archive-source | anti-dust-screen.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| paint-service | 油漆工程 | archive-source | paint-service.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| pest-control | 病媒防治 | archive-source | pest-control.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| moving-company | 搬家公司 | archive-source | moving-company.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| air-conditioning | 冷氣服務 | archive-source | air-conditioning.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| item-storage | 收納倉儲 | archive-source | item-storage.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| kungfu-tea-live | 功夫茶楊梅店 | external-active | kungfu-tea.html | vendor-page | dual-entry | 外部連結 | 已有正式廠商頁，但 `external` 覆寫顯示與路由 |
| food-truck-live | 餐車位置追蹤 | external-active | food-truck.html | vendor-page | dual-entry | 外部連結 | 同上 |
| beauty-skin | 美容護膚 | archive-source | beauty-skin.html | vendor-page | local-page | 正式廠商頁 | JSON status 過時 |
| hair-salon | 美髮造型 | archive-source | hair-salon.html | vendor-page | local-page | 正式廠商頁 | JSON status 過時 |
| eyelash-service | 美睫服務 | archive-source | eyelash-service.html | vendor-page | local-page | 正式廠商頁 | JSON status 過時 |
| nail-service | 美甲服務 | archive-source | nail-service.html | vendor-page | local-page | 正式廠商頁 | JSON status 過時 |
| thai-massage | 泰式按摩 | archive-source | thai-massage.html | vendor-page | local-page | 正式廠商頁 | JSON status 過時 |
| vietnamese-massage | 越式按摩 | archive-source | vietnamese-massage.html | vendor-page | local-page | 正式廠商頁 | JSON status 過時 |
| taiwanese-massage | 台式按摩 | archive-source | taiwanese-massage.html | vendor-page | local-page | 正式廠商頁 | JSON status 過時 |
| american-chiropractic | 美式整復 | archive-source | american-chiropractic.html | vendor-page | local-page | 正式廠商頁 | JSON status 過時 |
| receipt | 發票對獎 | archive-source | receipt.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| expense-tracker | 每日記帳 | archive-source | expense-tracker.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| todo-list | 待辦清單 | archive-source | todo-list.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| price-comparison | 比價工具 | archive-source | price-comparison.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| health-record | 健康紀錄 | archive-source | health-record.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| utility-tracking | 水電費追蹤 | archive-source | utility-tracking.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| maintenance-record | 保養維修紀錄 | archive-source | maintenance-record.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| motorcycle-maintenance | 機車保養 | archive-source | motorcycle-maintenance.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| community-board | 社區公告 | archive-source | community-board.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| community-chat | 社區聊天 | archive-source | community-chat.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| reviews | 評論與評價 | archive-source | reviews.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| worship | 拜拜專區 | archive-source | worship.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| second-hand | 二手交易 | archive-source | second-hand.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| subsidy | 補助優惠 | archive-source | subsidy.html | service-page | local-page | 正式功能頁 | JSON status 過時 |
| games | 遊戲大廳 | archive-source | games.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| fortune | 每日運勢 | archive-source | fortune.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| mbti | MBTI 測驗 | archive-source | mbti.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| daily-quote | 每日金句 | archive-source | daily-quote.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| vendor-join | 廠商進駐 | external-active | — | none | external-link | 外部連結 | 與房屋估價共用 LINE 網址 |
| vendor-admin | 廠商後台 | archive-source | vendor-admin.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| test-image-upload | 圖片上傳測試 | archive-source | test-image-upload.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |
| booking | 預約服務 | needs-page | booking.html | bridge-page | local-page | 新版橋接頁 | **資料與現況不一致**（見第 4 節） |
| crown-care | 冠冕居服 | external-active | — | none | external-link | 外部連結 | 純外部 |
| hospital-clinic | 醫院診所 | archive-source | hospital-clinic.html | bridge-page | local-page | 新版橋接頁 | 尚未現代化 |

### 統計摘要

| 項目 | 數量 |
|------|------|
| 功能總數 | 65 |
| `external-active`（JSON） | 8 |
| 其中純外部（無本地 page） | 5 |
| 雙入口（有 page + externalUrl） | 3 |
| JSON 仍標 `archive-source` 但已是正式頁 | 43（32 功能頁 + 11 廠商頁） |
| 尚未現代化橋接頁 | 15 |
| `needs-page` 但本地檔已存在 | 1（booking） |

---

## 4. 需要人工決策的功能

### 4.1 雙入口：本地頁 vs 外部連結

| id | 衝突說明 | 決策問題 |
|----|----------|----------|
| `loan-calc-external` | 有 `loan-calc.html` 橋接頁，也有 `housepice.pages.dev` 外部試算 | 主入口應為外部試算還是本站頁？是否要把外部工具嵌入／連結放在橋接頁即可？ |
| `kungfu-tea-live` | 有正式廠商頁 `kungfu-tea.html`，也有 `kungfuteahtml.pages.dev` 即時頁 | 搜尋／分類應導向廠商列表還是外部菜單站？兩者內容是否重複？ |
| `food-truck-live` | 有正式廠商頁 `food-truck.html`，也有 `siwei.pages.dev` 位置追蹤 | 同上：廠商資料頁 vs 即時位置站，哪個是主產品？ |

**現行行為：** 產生器在 `statusText()` 與搜尋 URL（`currentUrl \|\| page`）皆**優先外部**，使用者從搜尋點「功夫茶」「餐車」會離開本站，分類頁標籤卻無法反映「已有正式廠商頁」。

### 4.2 外部連結來源與維護責任

| id | externalUrl | 待確認 |
|----|-------------|--------|
| `property-valuation` | `https://lin.ee/Ij6z94H` | 是否為官方客服入口？與 `vendor-join` 重複是否刻意？ |
| `vendor-join` | `https://lin.ee/Ij6z94H` | 與房屋估價相同 LINE，是否要拆成不同追蹤連結？ |
| `featured-properties` | `https://flyjung168.pages.dev/` | 第三方 pages.dev，是否仍為有效物件來源？ |
| `pre-sale` | `https://salersteam.pages.dev/junyang` | 活動頁是否長期維護？ |
| `loan-calc-external` | `housepice.pages.dev` | 是否為團隊自有工具？可否改為本站 `service-page`？ |
| `crown-care` | `https://www.crowncare.tw/` | 合作夥伴官網，是否需加上離站提示或資料核實欄位？ |

### 4.3 `booking` 狀態與描述過時

- JSON：`status: needs-page`，描述寫「主資料夾尚未補頁」。
- 實際：`booking.html` **已存在**（產生器輸出的橋接頁），首頁 `index.html` 亦硬編碼連到 `booking.html`。
- 建議人工決定：僅更新資料為 `bridge-page`，或進一步規劃成正式功能頁／表單頁。

### 4.4 純外部功能的成熟度標記

`property-valuation`、`featured-properties`、`pre-sale`、`vendor-join`、`crown-care` 沒有本地 `page`，`implementationStatus` 應為 `none` 而非任何「已建頁」狀態；目前 `external-active` 勉強可用，但與雙入口的 `external-active` 語意不同，更支持拆分欄位。

---

## 5. 下一步實作順序

建議分小批次，每批都可獨立驗證搜尋頁、分類頁與首頁，避免一次大改。

### 批次 A：資料欄位設計（不動連結行為）

1. 在 `data/site-functions.json` **新增** `implementationStatus`、`targetType`、`externalUrl`（可先並存 `status`、`currentUrl`）。
2. 依本報告第 3 節表格填入 65 筆建議值。
3. 更新 `docs/CONTENT_UPDATE_GUIDE.md` 的狀態說明（若維護流程需要）。
4. **不修改** `build-main-structure.mjs` 的路由邏輯，僅讓產生器讀取新欄位做驗證報告（可輸出到 `reports/`）。

### 批次 B：修正產生器路由優先序（3 筆雙入口）

1. 調整 `statusText()`：先判斷 `implementationStatus`（service-page／vendor-page），再判斷 `targetType`。
2. 調整搜尋 URL 組裝：依 `primaryTarget` 或 `targetType` 決定，而非一律 `currentUrl` 優先。
3. 調整分類頁 `buildLocalHref()` 與橋接頁的外部按鈕顯示邏輯。
4. 人工決策完成後，處理 `loan-calc-external`、`kungfu-tea-live`、`food-truck-live`。

### 批次 C：同步過時 JSON status（43 筆）

1. 將已正式化的 32 功能頁、`rental-management` 與 10 個其他廠商頁的 `status`／`implementationStatus` 從 `archive-source` 改為 `service-page` 或 `vendor-page`。
2. 執行 `node scripts/build-main-structure.mjs`，確認 `updates.json` 狀態欄與搜尋標籤一致。

### 批次 D：單筆資料修正

1. `booking`：`needs-page` → `bridge-page`，更新描述文字。
2. 確認 `property-valuation` 與 `vendor-join` 是否共用 LINE 為預期行為。

### 批次 E：15 個橋接頁現代化（與欄位拆分平行、互不阻塞）

依 `reports/big-picture-audit.md` 建議順序：

1. `site-core`：`dashboard`、`share`、`notifications`
2. `real-estate`：`investor`、`tax-calc`、`rental-mgmt`（`loan-calc` 待批次 B 決策）
3. `vendors-admin`：`vendor-admin`、`test-image-upload`、`booking`
4. `health-care`：`hospital-clinic`
5. `leisure`：`games`、`fortune`、`mbti`、`daily-quote`

每完成一頁，將 `implementationStatus` 改為 `service-page` 或對應類型，並跑產生器。

---

## 6. 風險：若直接批次修改可能出現的錯誤

### 6.1 搜尋頁（`search.html` + `site-search-data.js`）

| 風險 | 說明 |
|------|------|
| 錯誤離站 | 搜尋 URL 公式為 `currentUrl \|\| page \|\| archivePath`；只改 `status` 不改公式，雙入口仍會連到外部 |
| 標籤誤導 | `statusText()` 若仍 `external` 優先，功夫茶／餐車在搜尋結果顯示「外部連結」而非「正式廠商頁」 |
| 搜尋不到 | 若把 `page` 清空只留外部網址，關鍵字仍正常；但若誤刪 `tags`／`description` 會影響比對 |
| `#` 死連結 | 無 `currentUrl`、無本地檔、無 `archivePath` 時 URL 為 `#`，使用者點擊無反應 |

### 6.2 分類頁（`pages/<category>/index.html`）

| 風險 | 說明 |
|------|------|
| 「可進入」計數失真 | `active` 計算為 `external \|\| localPageExists`；雙入口只算一個可進入，但實際有兩條路徑 |
| 卡片連結與橋接頁不一致 | 分類卡片可能直連外部，點進 `loan-calc.html` 橋接頁卻還有「開啟外部連結」按鈕，體驗重複或矛盾 |
| 相對路徑錯誤 | `buildLocalHref` 從分類子目錄出發；若把外部網址誤寫成相對路徑會 404 |

### 6.3 首頁（`index.html`）

| 風險 | 說明 |
|------|------|
| 與中央資料不同步 | 首頁多處硬編碼 `booking.html`，未讀 `site-functions.json`；只改 JSON 不會改首頁行為 |
| 狀態標籤不一致 | 首頁卡片若有自訂狀態文字，可能與搜尋／分類頁的新標籤不同步 |

### 6.4 產生器覆寫

| 風險 | 說明 |
|------|------|
| 手改被洗掉 | 直接改 `site-search-data.js`、`pages/*/index.html` 會在下次 `build-main-structure.mjs` 被覆蓋；應只改資料源與產生器 |
| `reports/main-structure.md` 被覆蓋 | 審查結論應寫在 `reports/cursor-status-routing-findings.md` 等獨立檔，勿依賴產生器報告 |

### 6.5 一次大改的具體故障情境

1. 將所有 `archive-source` 批量改為 `service-page`，但未在 `service-page-source.mjs` 新增內容 → 產生器仍正常，但 `updates.json` 與維護文件語意混亂。
2. 將 `kungfu-tea-live` 的 `external` 改 `false` 但未指定 `targetType` → 可能改連本地廠商頁，與營運上想推外部即時頁的意圖相反。
3. 將 `booking` 改 `current-page` 但未補內容 → 橋接頁仍顯示「尚未補頁」文案，使用者困惑。
4. 移除 `external` 旗標但搜尋邏輯仍讀 `currentUrl` → 外部功能變成開啟 `#` 或錯誤本地頁。

---

## 附錄：產生器關鍵邏輯（審查依據）

### `statusText()` 優先序（現況）

```
1. fn.external          → 外部連結
2. vendorPageSet        → 正式廠商頁
3. servicePageSet       → 正式功能頁
4. status=current-page  → 新版頁面
5. localPageExists      → 新版橋接頁
6. archivePath          → 舊版來源
7. else                 → 待建立
```

問題：步驟 1 使 `kungfu-tea-live`、`food-truck-live` 永遠顯示「外部連結」，跳過步驟 2 的「正式廠商頁」。

### 搜尋 URL 組裝（現況）

```javascript
const url = fn.currentUrl || (localPageExists && fn.page) || fn.archivePath || '#';
```

問題：`currentUrl` 永遠優先於本地 `page`，雙入口功能無法從搜尋進入本地廠商頁或橋接頁。

---

*本報告僅新增／更新 `reports/cursor-status-routing-findings.md`，未修改 `data/site-functions.json`、`scripts/build-main-structure.mjs` 或任何 HTML／CSS／JS。*
