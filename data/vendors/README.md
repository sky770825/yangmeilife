# 廠商資料分類

## 資料邊界

- **正式更新入口**：`data/vendors/categories/<slug>/vendors.json`
- **分類 metadata 與 runtime 匯總**：`data/vendors/vendor-categories.json`（由產生器輸出）
- **核實清單產出**：`data/vendors/categories/<slug>/updates.json`
- **前端載入**：`assets/js/vendor-data.js`、`assets/js/vendor-page.js`

分類數：11
廠商數：11

## 更新流程

1. 到對應分類資料夾編輯 `vendors.json`。
2. 執行：

```bash
node scripts/build-main-structure.mjs
```

3. 產生器會讀取各分類 `vendors.json`，**不會**用 `vendor-categories.json` 內嵌資料覆蓋分類資料夾內容。

## 不可造假提醒

- 展示資料維持 `verificationStatus: "待核實"`、`verified: false`。
- 沒有官方或平台可確認來源時，電話、地址、營業時間與官方連結保留 `null`。

| 分類頁 | 分類名稱 | 資料夾 | 廠商數 |
| --- | --- | --- | --- |
| beauty-skin.html | 楊梅美容護膚廠商 | `data/vendors/categories/beauty-skin` | 3 |
| hair-salon.html | 楊梅美髮造型廠商 | `data/vendors/categories/hair-salon` | 3 |
| eyelash-service.html | 楊梅美睫服務廠商 | `data/vendors/categories/eyelash-service` | 0 |
| nail-service.html | 楊梅美甲服務廠商 | `data/vendors/categories/nail-service` | 4 |
| thai-massage.html | 楊梅泰式按摩廠商 | `data/vendors/categories/thai-massage` | 0 |
| vietnamese-massage.html | 楊梅越式按摩廠商 | `data/vendors/categories/vietnamese-massage` | 0 |
| taiwanese-massage.html | 楊梅台式按摩廠商 | `data/vendors/categories/taiwanese-massage` | 0 |
| american-chiropractic.html | 楊梅美式整復廠商 | `data/vendors/categories/american-chiropractic` | 0 |
| food-truck.html | 楊梅餐車廠商 | `data/vendors/categories/food-truck` | 0 |
| kungfu-tea.html | 楊梅飲品廠商 | `data/vendors/categories/kungfu-tea` | 1 |
| rental-management.html | 楊梅包租代管廠商 | `data/vendors/categories/rental-management` | 0 |
