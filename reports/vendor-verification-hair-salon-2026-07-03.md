# 美髮廠商核實批次 2026-07-03

## 批次範圍

- 分類：`hair-salon` / `楊梅美髮造型廠商`
- 資料檔：`data/vendors/categories/hair-salon/vendors.json`
- 頁面：`hair-salon.html`
- 狀態：3 筆已核實，3 筆展示候選保留於 `candidateVendors`

## 已上架店家

| 店家 | 電話 | 地址 | 來源 |
| --- | --- | --- | --- |
| Fashion Hair Salon | 03-420-1685 | 桃園市楊梅區新榮路99號 | Facebook / Instagram 公開資訊 |
| Lin美髮沙龍楊梅旗艦店 | 03-488-0733 | 楊梅區大成路57號 | Facebook / 1111 / Gomaji |
| YL Hair Salon 意翎髮藝 | 03-478-9059 | 楊梅區環南路61號 | Facebook / Instagram / 電子名片 |

## 來源 URL

- `https://www.facebook.com/p/Fashion-Hair-Salon-100065096546791/`
- `https://www.instagram.com/p/DWQm1L0FK0j/`
- `https://www.facebook.com/lin4856968/`
- `https://www.1111.com.tw/corp/69623666/`
- `https://www.gomaji.com/store/15289/pid/279869`
- `https://www.facebook.com/yiling688/`
- `https://www.instagram.com/ylhairsalon/`
- `https://www.iringo.com.tw/myecard/ecard1.php?id=BS0000875&openExternalBrowser=1`

## 保留候選

以下展示資料未核實，仍保留在 `candidateVendors`，不進入前台：

- 楊梅剪染研究室
- 埔心髮型工作室
- 富岡男士理髮

## 驗證

- `node --check scripts/build-main-structure.mjs`：通過
- `node scripts/build-main-structure.mjs`：通過，輸出 11 類、前台 vendor 4 筆
- `node --check assets/js/vendor-page.js`：通過
- `node --check assets/js/vendor-data.js`：通過
- active site local ref scan：83 個 HTML、534 個本地引用、`missingCount=0`
- runtime 檢查：前台 JS 含 3 筆美髮真實店家，不含原展示美髮店名
- Playwright `hair-salon.html` mobile 390x844：0 console error、0 pageerror、無水平溢出、3 張 vendor card、缺聯絡資料篩選為 0

## 全站摘要

| 項目 | 數量 |
| --- | ---: |
| 前台廠商總數 | 4 |
| 已核實 | 4 |
| 待補候選 | 30 |
| 未核實前台廠商 | 0 |

## 下一步

下一批可處理 `beauty-skin` 或 `nail-service`。仍須維持同樣規則：未能核實電話、地址與來源前，不進入前台 `vendors`。
