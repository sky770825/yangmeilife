# Cursor 任務：廠商資料正式化批次

建立時間：2026-07-03T06:27:19+0800
專案根目錄：`/Users/caijunchang/Desktop/程式專案資料夾/yangmeilife-生活集拷貝`

## 任務目標

把目前 11 個廠商分類的資料維護流程正式化，讓每個分類資料夾成為後續更新入口，並讓前台廠商頁清楚顯示「已核實 / 待核實 / 缺電話 / 缺地址 / 缺來源」等狀態。

這一批不要把示範商家改成已核實，也不要自行編造電話、地址、官方來源或營業時間。沒有可確認來源時，欄位要保留為 `null` 或空字串，並在更新檔與 UI 顯示待補狀態。

## 現況摘要

- 廠商分類：11 類。
- 廠商資料：33 筆。
- 目前 33 筆全是 `verificationStatus=待核實`。
- 目前 33 筆都缺 `phone`。
- 目前 33 筆都缺 `address`。
- 目前分類資料夾都有 `README.md`、`vendors.json`、`updates.json`。
- 目前 `updates.json` 都由產生器產出，但內容不足以當作後續核實清單。

## 重要結構問題

現在 `scripts/build-main-structure.mjs` 會：

1. 讀取 `data/vendors/vendor-categories.json`。
2. 從其中的 `categories[].vendors` 產生 `assets/js/vendor-data.js`。
3. 覆寫 `data/vendors/categories/<slug>/vendors.json`。
4. 覆寫 `data/vendors/categories/<slug>/updates.json`。

這代表如果之後人工更新各分類資料夾中的 `vendors.json`，再執行 build 會被 `vendor-categories.json` 覆蓋。這跟「每個資料夾都是後續更新入口」的目標衝突。

第一優先要修正資料來源邊界：

- `data/vendors/vendor-categories.json`：作為分類 metadata 與 runtime 匯總輸出。
- `data/vendors/categories/<slug>/vendors.json`：作為該分類廠商資料來源。
- `data/vendors/categories/<slug>/updates.json`：作為該分類更新、缺漏、核實清單來源或產出報告。
- `scripts/build-main-structure.mjs` 必須優先讀取每個分類資料夾的 `vendors.json`，不能只讀 `vendor-categories.json` 的內嵌 vendors。

## 目前 11 個分類

| slug | 分類 | 主分類 | 筆數 | 目前廠商 |
| --- | --- | --- | --- | --- |
| beauty-skin | 楊梅美容護膚廠商 | 美容美體與按摩舒壓 | 3 | 楊梅光采肌膚管理、埔心植萃美顏室、富岡亮顏工作室 |
| hair-salon | 楊梅美髮造型廠商 | 美容美體與按摩舒壓 | 3 | 楊梅剪染研究室、埔心髮型工作室、富岡男士理髮 |
| eyelash-service | 楊梅美睫服務廠商 | 美容美體與按摩舒壓 | 3 | 楊梅自然睫作、埔心睫眉設計、富岡輕感美睫 |
| nail-service | 楊梅美甲服務廠商 | 美容美體與按摩舒壓 | 3 | 楊梅指尖美學、埔心日系美甲室、富岡手足護理 |
| thai-massage | 楊梅泰式按摩廠商 | 美容美體與按摩舒壓 | 3 | 楊梅蘭納泰式舒壓、埔心古法按摩館、富岡香氛舒壓 |
| vietnamese-massage | 楊梅越式按摩廠商 | 美容美體與按摩舒壓 | 3 | 楊梅越式養生館、埔心足體會館、富岡輕鬆養生 |
| taiwanese-massage | 楊梅台式按摩廠商 | 美容美體與按摩舒壓 | 3 | 楊梅傳統整復舒壓、埔心足體工坊、富岡在地按摩 |
| american-chiropractic | 楊梅美式整復廠商 | 美容美體與按摩舒壓 | 3 | 楊梅脊衡整復所、埔心關節調理室、富岡動作修復 |
| food-truck | 楊梅餐車廠商 | 美食餐飲與行動攤商 | 3 | 四維路鹽酥雞餐車、埔心甜點餐車、富岡咖啡行動吧 |
| kungfu-tea | 楊梅飲品廠商 | 美食餐飲與行動攤商 | 3 | 功夫茶楊梅店、埔心鮮果茶吧、富岡手搖飲 |
| rental-management | 楊梅包租代管廠商 | 房產金融與物件 | 3 | 楊梅租管顧問、埔心社宅包租團隊、富岡出租管理 |

## 要修改的範圍

優先修改來源與產生器：

- `scripts/build-main-structure.mjs`
- `data/vendors/vendor-categories.json`
- `data/vendors/categories/*/vendors.json`
- `data/vendors/categories/*/updates.json`
- `data/vendors/categories/*/README.md`
- `assets/js/vendor-page.js` 由產生器輸出，不要只手改生成檔，應該改產生器內的 `vendorPageJs`。
- `assets/js/vendor-data.js` 由產生器輸出。
- 11 個根目錄廠商頁由產生器輸出：`beauty-skin.html`、`hair-salon.html`、`eyelash-service.html`、`nail-service.html`、`thai-massage.html`、`vietnamese-massage.html`、`taiwanese-massage.html`、`american-chiropractic.html`、`food-truck.html`、`kungfu-tea.html`、`rental-management.html`。

可以新增報告：

- `reports/vendor-formalization-audit.md`

## 建議資料欄位

每筆 vendor 保留現有欄位，並補上可維護但不造假的欄位：

```json
{
  "id": "beauty-skin-1",
  "name": "楊梅光采肌膚管理",
  "area": "楊梅市區",
  "price": "$899 起",
  "rating": "4.8",
  "image": "https://...",
  "tags": ["深層清潔", "保濕修護", "預約制"],
  "phone": null,
  "address": null,
  "businessHours": null,
  "officialUrl": null,
  "mapUrl": null,
  "lineUrl": null,
  "contactNote": "待補官方聯絡資料",
  "verified": false,
  "needsVerification": true,
  "verificationStatus": "待核實",
  "verificationLevel": "demo",
  "missingFields": ["phone", "address", "officialSource"],
  "dataReadiness": "展示資料",
  "dataSource": "data/vendors/categories/beauty-skin/vendors.json",
  "sourceNote": "展示資料，尚未完成店家或平台核實。",
  "officialSource": null,
  "sourceUrls": [],
  "lastVerifiedAt": null,
  "updatedAt": "2026-07-03T06:27:19+0800"
}
```

`verificationLevel` 建議值：

- `demo`：展示資料，不可當作真實商家。
- `needs_contact`：可能有商家名稱，但缺聯絡與官方來源。
- `source_found`：找到官方來源但尚未人工確認。
- `verified`：已由官方來源或人工確認。

目前這批若沒有真實來源，只能維持 `demo` 或 `needs_contact`，不能改成 `verified`。

## updates.json 要包含的內容

每個分類的 `updates.json` 不應只是空殼，至少要包含：

- `generatedAt`
- `owner`
- `page`
- `title`
- `source`
- `summary`
- `counts`
  - `total`
  - `verified`
  - `needsVerification`
  - `missingPhone`
  - `missingAddress`
  - `missingOfficialSource`
- `updateChecklist`
- `vendors`
  - `id`
  - `name`
  - `verificationStatus`
  - `verificationLevel`
  - `needsVerification`
  - `missingFields`
  - `lastVerifiedAt`
  - `updatedAt`

## README 要包含的內容

每個 `data/vendors/categories/<slug>/README.md` 至少要有：

- 對應頁面。
- 所屬主分類。
- 資料來源檔。
- 更新流程。
- 不可把展示資料標為已核實的提醒。
- 必填欄位清單。
- 核實狀態說明。

## 前台 UI 要調整

廠商頁目前主要顯示圖片、店名、地區、價格、tag、收藏與洽詢。這批要補上：

- 卡片上清楚顯示 `待核實` 或 `已核實`。
- 未核實資料不要顯示星等為可信評分；目前已用 `待核實` 取代 rating，保留這個方向。
- 顯示聯絡狀態：
  - 有電話：顯示電話。
  - 無電話：顯示「電話待補」。
  - 有地址：顯示地址。
  - 無地址：顯示「地址待補」。
  - 有官方來源：顯示來源連結。
  - 無官方來源：顯示「來源待補」。
- 搜尋要納入 `phone`、`address`、`contactNote`、`verificationStatus`、`missingFields`。
- 排序或篩選建議新增：
  - 全部
  - 已核實
  - 待核實
  - 缺聯絡資料
  - 缺官方來源
- 不要讓長地址、長來源 URL 造成手機水平溢出。

## 產生器要調整

在 `scripts/build-main-structure.mjs` 中：

- 新增讀取分類資料夾 vendor source 的 helper。
- 對每個 category 先計算 slug：`slugFromPage(vendorCategory.page)`。
- 優先讀 `data/vendors/categories/<slug>/vendors.json` 的 `.vendors`。
- 若分類資料夾不存在或檔案不存在，再 fallback 到 `vendorCategory.vendors`。
- 建立 normalize function，補齊 `phone`、`address`、`businessHours`、`officialUrl`、`mapUrl`、`lineUrl`、`contactNote`、`verificationLevel`、`missingFields`、`officialSource`、`sourceUrls`。
- `missingFields` 應依欄位自動計算，不要只信任既有 JSON。
- `updates.json` 由 normalize 後資料產出完整 counts 與 vendors 清單。
- `vendor-summary.json` 要同步包含核實統計。
- `data/vendors/README.md` 要更新，說明分類資料夾是正式更新入口。

## 驗證要求

完成後請執行：

```bash
node --check scripts/build-main-structure.mjs
node scripts/build-main-structure.mjs
node --check assets/js/vendor-page.js
node --check assets/js/vendor-data.js
```

再執行一個 local ref scan，確認全站連結沒有壞掉。可用現有掃描方式或寫臨時 Node 腳本，最終要確認：

- HTML 數量仍為 83 左右。
- 本地引用 `missingCount=0`。

Playwright 驗證至少跑：

- `beauty-skin.html` desktop 1440 x 1000。
- `food-truck.html` mobile 390 x 844。
- `rental-management.html` mobile 390 x 844。

每頁檢查：

- console / pageerror 為 0。
- 無水平溢出。
- 資料狀態提示可見。
- 3 張 vendor card 可見。
- 「電話待補」「地址待補」「來源待補」可見。
- 篩選器可切換「待核實」與「缺聯絡資料」。

## 完成條件

- 11 個分類資料夾的 `updates.json` 都不再是空資訊。
- 33 筆 vendors 都有一致欄位。
- 未核實資料仍維持 `verified=false`、`needsVerification=true`、`verificationStatus=待核實`。
- 沒有編造電話、地址、官方來源、營業時間。
- build 後不會把分類資料夾中的 vendor 欄位洗掉。
- `reports/vendor-formalization-audit.md` 已記錄修改、欄位、驗證結果與下一步需要人工核實的事項。

## 給 Cursor Agent 的執行提示

請在專案根目錄執行這份任務。先修正 `scripts/build-main-structure.mjs` 的廠商資料來源邊界，讓分類資料夾中的 `vendors.json` 成為廠商資料來源；接著補齊 11 個分類的 vendor 欄位、updates 清單與 README；最後更新廠商前台 UI，顯示電話待補、地址待補、來源待補、核實篩選與手機不溢出的狀態。不要把示範商家標為已核實，不要自行編造真實聯絡資料。完成後執行 node check、build、全站連結掃描與 Playwright 桌機/手機驗證，並把結果寫入 `reports/vendor-formalization-audit.md`。
