# 廠商核實批次 2026-07-03

## 批次範圍

- 分類：`kungfu-tea` / `楊梅飲品廠商`
- 資料檔：`data/vendors/categories/kungfu-tea/vendors.json`
- 頁面：`kungfu-tea.html`
- 狀態：只保留 1 筆指定飲品店，1 筆已核實，0 筆待核實

## 已更新商家

| 商家 | 電話 | 地址 | 來源 |
| --- | --- | --- | --- |
| 功夫茶楊梅四維店 | 03-488-2975 | 楊梅區四維路 90 號 | 功夫茶官方據點、功夫茶楊梅四維店店家頁 |

## 來源 URL

- `https://www.kungfutea.com.tw/location/?page=11`
- `https://shop5877.noon360.com/mainssl/uploads/shop5877/html/home.html`

## 保留空值

本批沒有可用官方來源核實的欄位維持空值：

- `rating`
- 部分商家的 `businessHours`
- 部分商家的 `lineUrl`

前台已調整為：已核實但無官方評分時，顯示 `已核實`，不顯示假星等。

## 驗證結果

- `node --check scripts/build-main-structure.mjs`：通過
- `node scripts/build-main-structure.mjs`：通過，輸出 11 類、31 筆
- `node --check assets/js/vendor-page.js`：通過
- `node --check assets/js/vendor-data.js`：通過
- active site local ref scan：83 個 HTML、534 個本地引用、`missingCount=0`
- `kungfu-tea.html` active data：只保留功夫茶楊梅四維店，地址顯示 `楊梅區四維路 90 號`

## 全站廠商摘要

| 項目 | 數量 |
| --- | ---: |
| 前台廠商總數 | 1 |
| 已核實 | 1 |
| 待補候選 | 30 |
| 未核實前台廠商 | 0 |

## 下一批建議

下一批可處理 `hair-salon` 或 `beauty-skin`。這兩類需要以官方粉專、Google 商家頁、政府登記或店家官網交叉確認，避免把展示店名誤當真實商家。
