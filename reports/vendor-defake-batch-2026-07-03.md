# 全站廠商去假化批次 2026-07-03

## 批次目標

移除前台未核實展示店家，避免網站看起來列出尚未確認的真實廠商。

## 完成結果

- 前台廠商卡片只保留 1 筆已核實店家：功夫茶楊梅四維店。
- 10 個未核實分類的 `vendors` 已清空，不再輸出到 `assets/js/vendor-data.js`。
- 原本 30 筆展示店家已移到各分類 `candidateVendors`，只作為待補核實清單。
- 空分類頁前台顯示 `資料建置中，目前尚未收錄已核實店家，歡迎店家登錄。`
- `data/vendors/vendor-categories.json` 與 `assets/js/vendor-data.js` 不包含候選展示店名。

## 全站統計

| 項目 | 數量 |
| --- | ---: |
| 前台廠商 | 1 |
| 已核實 | 1 |
| 待補候選 | 30 |
| 空廠商分類 | 10 |

## 保留店家

| 分類 | 店家 | 地址 |
| --- | --- | --- |
| 楊梅飲品廠商 | 功夫茶楊梅四維店 | 楊梅區四維路 90 號 |

## 主要修改

- `scripts/build-main-structure.mjs`
  - `vendors: []` 不再 fallback 回舊展示資料。
  - 新增 `candidateVendors` 待補清單輸出。
  - 空分類自動標示 `資料建置中 / 待收錄`。
  - 前台空狀態改成資料建置中文案。
  - `vendor-categories.json` / `vendor-data.js` 不輸出候選展示店名。
- `data/vendors/categories/*/vendors.json`
  - 10 類未核實展示店家移入 `candidateVendors`。
  - `kungfu-tea` 只保留功夫茶楊梅四維店。

## 驗證

- `node --check scripts/build-main-structure.mjs`：通過
- `node scripts/build-main-structure.mjs`：通過，輸出 11 類、前台 vendor 1 筆
- `node --check assets/js/vendor-page.js`：通過
- `node --check assets/js/vendor-data.js`：通過
- active site local ref scan：83 個 HTML、534 個本地引用、`missingCount=0`
- runtime 檢查：`assets/js/vendor-data.js` 只含功夫茶楊梅四維店，不含展示店名
- Playwright `beauty-skin.html` mobile 390x844：0 console error、0 pageerror、0 張卡、顯示資料建置中
- Playwright `kungfu-tea.html` mobile 390x844：0 console error、0 pageerror、1 張卡、顯示功夫茶楊梅四維店與 `楊梅區四維路 90 號`

## 下一步

後續新增廠商時，先放入各分類 `candidateVendors` 或待補清單；確認官方來源、電話、地址後，再移入 `vendors` 讓前台顯示。

## 後續更新

- 2026-07-03 已完成 `hair-salon` 核實批次，3 筆美髮店家已移入前台 `vendors`。
- 全站前台 vendor 數由 1 筆更新為 4 筆；待補候選仍為 30 筆。
- 2026-07-03 已完成 `beauty-skin` 核實批次，3 筆美容護膚店家已移入前台 `vendors`。
- 全站前台 vendor 數由 4 筆更新為 7 筆；待補候選仍為 30 筆。
- 2026-07-03 已完成 `nail-service` 核實批次，4 筆美甲服務店家已移入前台 `vendors`。
- 全站前台 vendor 數由 7 筆更新為 11 筆；待補候選仍為 30 筆。
