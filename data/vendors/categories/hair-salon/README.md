# 楊梅美髮造型廠商

## 對應頁面

- 前台頁面：`hair-salon.html`
- 所屬主分類：美容美體與按摩舒壓
- 主分類入口：`pages/beauty-wellness/index.html`

## 資料來源

- 廠商資料：`vendors.json`（**正式更新入口**）
- 核實清單：`updates.json`（由產生器依 `vendors.json` 產出）
- 前台顯示：只讀取 `vendors` 陣列
- 待補清單：`candidateVendors`，不會顯示於前台廠商卡片

## 更新流程

1. 編輯本資料夾的 `vendors.json`。
2. 僅在店家自控的官方網站、社群或預約頁能對應到同一分店時，才更新電話、地址、營業時間、官方連結或預約連結。
3. `fieldSources` 必須逐欄列出可證明該欄位的 URL；泛用 LINE 加好友頁、目錄與搜尋摘要不能證明店名、電話、地址或營業時間。
4. 本來源刷新作業不執行完整產生器，也不直接修改 `updates.json` 或前台輸出檔。
5. 人工核實完成後，更新 `verified`、`verificationStatus`、`verificationLevel` 與 `lastVerifiedAt`。

## YL LINE 短網址註記

- `https://lin.ee/hxk7s94` 與店家電子名片使用的 `https://lin.ee/jriwMC6` 均解析至 LINE 帳號 `@396zqkal`；後者是店家自控的短網址呈現刷新，不代表預約目的地或帳號變更。

## 重要提醒

- **不可**把展示資料標為已核實（`verified: true`）。
- **不可**自行編造電話、地址、官方來源或營業時間。
- 沒有可確認來源時，欄位保留 `null` 或空字串，並維持 `verificationStatus: "待核實"`。

## 必填欄位清單

| 欄位 | 說明 |
| --- | --- |
| `id` | 分類內唯一識別 |
| `name` | 店名 |
| `area` | 服務地區 |
| `phone` | 電話（無來源則 `null`） |
| `address` | 地址（無來源則 `null`） |
| `officialUrl` / `officialSource` / `sourceUrls` | 官方來源（無則 `null` / `[]`） |
| `verificationStatus` | `待核實` 或 `已核實` |
| `verificationLevel` | `demo` / `needs_contact` / `source_found` / `verified` |
| `missingFields` | 由產生器自動計算，亦可手動對照 |

## 核實狀態說明

| 狀態 | 意義 |
| --- | --- |
| `demo` | 展示資料，不可當真實商家 |
| `needs_contact` | 有店名但缺聯絡與官方來源 |
| `source_found` | 找到官方來源但尚未人工確認 |
| `verified` | 已由官方來源或人工確認 |

## 目前統計

- 廠商總數：3
- 已核實：3
- 待核實：0
- 缺電話：0
- 缺地址：0
- 缺官方來源：0
- 待補候選：3
- 最後同步：2026-07-03T09:23:39+0800
- 最近來源刷新：2026-07-27（未執行完整產生器）
