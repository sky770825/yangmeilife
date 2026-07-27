# 美甲服務廠商核實批次 2026-07-03

## 批次範圍

- 分類：`nail-service` / `楊梅美甲服務廠商`
- 資料檔：`data/vendors/categories/nail-service/vendors.json`
- 頁面：`nail-service.html`
- 狀態：4 筆已核實，3 筆展示候選保留於 `candidateVendors`

## 已上架店家

| 店家 | 電話 | 地址 | 來源 |
| --- | --- | --- | --- |
| 嶼你YN美甲美學殿 | 03-485-5701 | 桃園市楊梅區環東路447號1樓 | Facebook / Instagram 公開資訊 |
| 八四時髦指感空間 | 0925-296-677 | 桃園市楊梅區中山北路二段23巷27號 | Facebook / Instagram 公開資訊 |
| 妮莉莎美學 Nelissa Aesthetic | 03-431-2061 | 326桃園市楊梅區四維路196號 | 妮莉莎美學官方網站 |
| Relax蕾娜絲美甲美睫概念館（四維店） | 03-482-0127 | 326桃園市楊梅區四維路133號 | Relax蕾娜絲官方網站 / Facebook 公開資訊 |

## 來源 URL

- `https://www.facebook.com/YNnewnails/`
- `https://www.instagram.com/yn_newnails/`
- `https://www.facebook.com/84NailSalon/`
- `https://www.instagram.com/84_nail_salon/`
- `https://www.nelissa.com.tw/meijia.html`
- `https://www.nelissa.com.tw/products.html`
- `https://shop4968.noon360.com/mainssl/uploads/shop4968/html/home.html`
- `https://www.facebook.com/relax4820127/`

## 保留候選

以下展示資料未核實，仍保留在 `candidateVendors`，不進入前台：

- 楊梅指尖美學
- 埔心日系美甲室
- 富岡手足護理

## 備註

- 八四時髦指感空間公開資訊含楊梅店與中壢店；本批只收錄楊梅店。
- Relax 蕾娜絲公開資訊含四維店與新農店；本批只收錄四維店。
- 嶼你 YN 與部分社群來源以 Facebook / Instagram 公開資訊核實；無法核實的 LINE 欄位維持空值，前台洽詢退回官方頁。

## 驗證

- `node --check scripts/build-main-structure.mjs`：通過
- `node scripts/build-main-structure.mjs`：通過，輸出 11 類、前台 vendor 11 筆
- `node --check assets/js/vendor-page.js`：通過
- `node --check assets/js/vendor-data.js`：通過
- active site local ref scan：60 個 HTML、338 個本地引用、`missingCount=0`
- runtime 檢查：前台 JS 含 4 筆美甲真實店家，不含原展示美甲店名
- Playwright `nail-service.html` mobile 390x844：0 console warning/error、無水平溢出、4 張 vendor card、`null` 字樣 0、已核實篩選 4 張、缺聯絡資料篩選 0 張、缺官方來源篩選 0 張

## 全站摘要

| 項目 | 數量 |
| --- | ---: |
| 前台廠商總數 | 11 |
| 已核實 | 11 |
| 待補候選 | 30 |
| 未核實前台廠商 | 0 |

## 下一步

下一批可處理 `eyelash-service` 或按摩類。仍須維持同樣規則：未能核實電話、地址與來源前，不進入前台 `vendors`。
