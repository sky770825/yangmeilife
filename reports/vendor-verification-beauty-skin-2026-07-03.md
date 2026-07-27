# 美容護膚廠商核實批次 2026-07-03

## 批次範圍

- 分類：`beauty-skin` / `楊梅美容護膚廠商`
- 資料檔：`data/vendors/categories/beauty-skin/vendors.json`
- 頁面：`beauty-skin.html`
- 狀態：3 筆已核實，3 筆展示候選保留於 `candidateVendors`

## 已上架店家

| 店家 | 電話 | 地址 | 來源 |
| --- | --- | --- | --- |
| Queenie漾美學館 | 0976-866-869 | 桃園市楊梅區環東路493號2樓 | 官方網站 / Freetime 預約頁 |
| 一一美容美體 | 0931-050-370 | 桃園市楊梅區三民路51號 | Facebook / Instagram / 台灣公司網 |
| Arya愛麗雅皮膚管理體雕中心 | 03-475-0475 | 桃園市楊梅區大成路147號 | Facebook / 1111 公司資訊 / 商工登記 |

## 來源 URL

- `https://www.queenie-spa.com/`
- `https://myfreetime.io/shop/QueenieYang`
- `https://www.facebook.com/a220701/`
- `https://www.instagram.com/reel/DSIEEBGkvBt/`
- `https://twincn.com/item.aspx?no=60094673`
- `https://www.facebook.com/Aryabeautyfly/`
- `https://www.1111.com.tw/corp/73585448/`
- `https://www.findcompany.com.tw/%E6%84%9B%E9%BA%97%E9%9B%85%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8`

## 保留候選

以下展示資料未核實，仍保留在 `candidateVendors`，不進入前台：

- 楊梅光采肌膚管理
- 埔心植萃美顏室
- 富岡亮顏工作室

## 備註

- Arya 愛麗雅的公開電話資料存在多版本；本批前台採 Facebook 公開列示的 `03-475-0475`，並於 `contactNote` 保留另一公開號碼 `0952-166-596` 供後續複核。
- 前台已修正空價格顯示，`price: null` 不再渲染成文字 `null`。
- 前台「洽詢」按鈕已改為優先使用店家 `lineUrl`，沒有 LINE 時才使用店家官方頁或站方 LINE。

## 驗證

- `node --check scripts/build-main-structure.mjs`：通過
- `node scripts/build-main-structure.mjs`：通過，輸出 11 類、前台 vendor 7 筆
- `node --check assets/js/vendor-page.js`：通過
- `node --check assets/js/vendor-data.js`：通過
- active site local ref scan：60 個 HTML、338 個本地引用、`missingCount=0`
- runtime 檢查：前台 JS 含 3 筆美容護膚真實店家，不含原展示美容護膚店名
- Playwright `beauty-skin.html` mobile 390x844：0 console warning/error、無水平溢出、3 張 vendor card、`null` 字樣 0、已核實篩選 3 張、缺聯絡資料篩選 0 張
- Playwright 洽詢連結：Queenie 連店家 LINE、一一連 Facebook、Arya 連店家 LINE

## 全站摘要

| 項目 | 數量 |
| --- | ---: |
| 前台廠商總數 | 7 |
| 已核實 | 7 |
| 待補候選 | 30 |
| 未核實前台廠商 | 0 |

## 下一步

下一批可處理 `nail-service`、`eyelash-service` 或按摩類。仍須維持同樣規則：未能核實電話、地址與來源前，不進入前台 `vendors`。
