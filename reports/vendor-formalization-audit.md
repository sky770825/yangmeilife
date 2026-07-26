# 廠商資料正式化稽核

更新時間：2026-07-03T06:27:19+0800

## 完成項目

本批次已把廠商資料維護流程正式化：

1. `scripts/build-main-structure.mjs` 會優先讀取 `data/vendors/categories/<slug>/vendors.json`。
2. `data/vendors/vendor-categories.json` 保留分類 metadata，runtime 匯總由 build 重新產出。
3. 11 個分類資料夾都保留 `README.md`、`vendors.json`、`updates.json`。
4. 33 筆 vendor 都補齊維護欄位：`phone`、`address`、`businessHours`、`officialUrl`、`mapUrl`、`lineUrl`、`contactNote`、`verificationLevel`、`missingFields`、`officialSource`、`sourceUrls`、`lastVerifiedAt`。
5. 前台廠商頁已顯示 `待核實`、`電話待補`、`地址待補`、`來源待補`。
6. 前台篩選器已加入：全部、已核實、待核實、缺聯絡資料、缺官方來源。

## 資料統計

| 項目 | 數量 |
| --- | ---: |
| 廠商分類資料夾 | 11 |
| 廠商資料 | 33 |
| 已核實 | 0 |
| 待核實 | 33 |
| `verificationLevel=demo` | 33 |
| 缺電話 | 33 |
| 缺地址 | 33 |
| 缺官方來源 | 33 |
| 欄位缺漏問題 | 0 |
| updates 對帳問題 | 0 |

## 資料邊界

- 正式廠商資料入口：`data/vendors/categories/<slug>/vendors.json`
- 每類更新清單：`data/vendors/categories/<slug>/updates.json`
- 分類總覽報告：`data/vendors/vendor-summary.json`
- 前台 runtime：`assets/js/vendor-data.js`

這批沒有補入真實電話、地址、營業時間或官方來源；所有商家仍維持展示資料，不能當作已核實商家。

## 驗證結果

已通過：

- `node --check scripts/build-main-structure.mjs`
- `node scripts/build-main-structure.mjs`
- `node --check assets/js/vendor-page.js`
- `node --check assets/js/vendor-data.js`
- active site local ref scan：83 個 HTML、534 個本地引用、`missingCount=0`
- Playwright：`beauty-skin.html` desktop 1440x1000
- Playwright：`food-truck.html` mobile 390x844
- Playwright：`rental-management.html` mobile 390x844

Playwright 三頁結果：

| 頁面 | viewport | console/pageerror | 水平溢出 | vendor cards | 待補狀態 | 篩選 |
| --- | --- | --- | --- | ---: | --- | --- |
| `beauty-skin.html` | 1440x1000 | 0 / 0 | 無 | 3 | 有 | 通過 |
| `food-truck.html` | 390x844 | 0 / 0 | 無 | 3 | 有 | 通過 |
| `rental-management.html` | 390x844 | 0 / 0 | 無 | 3 | 有 | 通過 |

## 備註

完整掃描包含 `archive/cursor-history/latest/` 時，歷史拷貝內有 3 個舊引用缺失。這些不屬於目前 active site，未在本批次改動。

## 下一步

下一批應進入實際商家核實：逐類查官方網站、Google Maps、LINE 或店家授權資料，再更新各分類 `vendors.json` 的電話、地址、來源與 `lastVerifiedAt`。

## 2026-07-03 核實批次

- 已完成 `kungfu-tea` / `楊梅飲品廠商` 第一批核實。
- 依指定只保留 1 筆飲品商家：功夫茶楊梅四維店，地址顯示為 `楊梅區四維路 90 號`。
- 全站廠商前台統計更新為：1 筆前台廠商、1 筆已核實、30 筆待補候選。
- 批次報告：`reports/vendor-verification-batch-2026-07-03.md`

## 2026-07-03 去假化批次

- 已完成全站廠商去假化第一輪。
- 10 個未核實分類已清空前台 vendor cards，改顯示 `資料建置中`。
- 原本 30 筆展示店名已移入各分類 `candidateVendors`，只留作待補核實清單。
- `assets/js/vendor-data.js` 與 `data/vendors/vendor-categories.json` 不再輸出展示店名。
- 批次報告：`reports/vendor-defake-batch-2026-07-03.md`

## 2026-07-03 美髮核實批次

- 已完成 `hair-salon` / `楊梅美髮造型廠商` 第一批核實。
- 新增 3 筆前台已核實店家：Fashion Hair Salon、Lin美髮沙龍楊梅旗艦店、YL Hair Salon 意翎髮藝。
- 原本 3 筆展示美髮店名仍保留於 `candidateVendors`，未進入前台。
- 全站前台廠商統計更新為：4 筆前台廠商、4 筆已核實、30 筆待補候選。
- 批次報告：`reports/vendor-verification-hair-salon-2026-07-03.md`

## 2026-07-03 美容護膚核實批次

- 已完成 `beauty-skin` / `楊梅美容護膚廠商` 第一批核實。
- 新增 3 筆前台已核實店家：Queenie漾美學館、一一美容美體、Arya愛麗雅皮膚管理體雕中心。
- 原本 3 筆展示美容護膚店名仍保留於 `candidateVendors`，未進入前台。
- 修正前台空價格顯示：`price: null` 不再渲染成文字 `null`。
- 修正前台洽詢連結：優先連店家 `lineUrl`，沒有 LINE 時連店家官方頁或站方 LINE。
- 全站前台廠商統計更新為：7 筆前台廠商、7 筆已核實、30 筆待補候選。
- 批次報告：`reports/vendor-verification-beauty-skin-2026-07-03.md`

## 2026-07-03 美甲核實批次

- 已完成 `nail-service` / `楊梅美甲服務廠商` 第一批核實。
- 新增 4 筆前台已核實店家：嶼你YN美甲美學殿、八四時髦指感空間、妮莉莎美學 Nelissa Aesthetic、Relax蕾娜絲美甲美睫概念館（四維店）。
- 原本 3 筆展示美甲店名仍保留於 `candidateVendors`，未進入前台。
- 多分店店家只收錄楊梅指定分店資料，避免混入中壢或新農店。
- 全站前台廠商統計更新為：11 筆前台廠商、11 筆已核實、30 筆待補候選。
- 批次報告：`reports/vendor-verification-nail-service-2026-07-03.md`
