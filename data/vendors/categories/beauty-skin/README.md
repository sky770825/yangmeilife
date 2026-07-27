# 楊梅美容護膚廠商

## 對應頁面

- 前台頁面：`beauty-skin.html`
- 所屬主分類：美容美體與按摩舒壓
- 主分類入口：`pages/beauty-wellness/index.html`

## 資料來源

- 廠商資料：`vendors.json`（**正式更新入口**）
- 核實清單：`updates.json`（由產生器依 `vendors.json` 產出）
- 前台顯示：只讀取 `vendors` 陣列
- 待補清單：`candidateVendors`，不會顯示於前台廠商卡片

## 更新流程

1. 編輯本資料夾的 `vendors.json`。
2. 有官方或平台可確認來源時，才填入電話、地址、營業時間與官方連結。
3. 從專案根目錄執行 `node scripts/build-main-structure.mjs` 同步前台與 `updates.json`。
4. 人工核實完成後，更新 `verified`、`verificationStatus`、`verificationLevel` 與 `lastVerifiedAt`。

## 重要提醒

- **不可**把展示資料標為已核實（`verified: true`）。
- **不可**自行編造電話、地址、官方來源或營業時間。
- 沒有可確認來源時，欄位保留 `null` 或空字串，並維持 `verificationStatus: "待核實"`。

## Task A2.1 來源刷新（2026-07-27）

- `beauty-skin-real-1` 的官網與 Freetime 預約頁仍可讀取，並支持店名、電話、地址與營業時間；既存 LINE 路徑的目前公開帳號識別無法與頁面顯示 ID 完整對應，因此保留原整體核實日期。
- `beauty-skin-real-2`、`beauty-skin-real-3` 的既存官方社群來源在本次抓取環境無法完整讀取；無地址、電話或歇業衝突，資料與既有核實日期維持不變。
- 目錄與搜尋摘要僅記錄存取情況，未作為欄位更新證據；未提升任何 `candidateVendors`，亦未執行產生器。
- 完整存取紀錄與欄位決策見 `reports/vendor-source-refresh/2026-07-27/beauty-skin.md`。

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
