# 二手交易系統優化建議

## ✅ 已實現功能
- [x] 多圖上傳（最多5張）
- [x] 14天自動下架
- [x] Google Sheets 資料儲存
- [x] Google Drive 圖片儲存

## 🔧 需要補充的功能

### 1. **前端多圖上傳支援**
目前前端只支援單圖，需要改為：
- 多檔案選擇（`multiple` 屬性）
- 圖片預覽區域（上傳前可預覽/刪除）
- 最多5張限制提示
- 圖片大小限制（建議每張 < 5MB）

### 2. **圖片顯示優化**
- 支援多圖輪播（第一張大圖，可切換）
- 或網格展示（5張縮圖）
- 圖片載入失敗時顯示預設圖

### 3. **14天倒數顯示**
- 在每個刊登卡片顯示「剩餘 X 天」
- 過期前 3 天顯示警告樣式
- 過期項目自動隱藏（前端過濾）

### 4. **Apps Script 優化建議**

#### a. 增加圖片大小驗證
```javascript
// 在上傳前檢查（前端做比較好，但後端也可檢查）
function uploadImageToDrive(imageBase64) {
  // 估算檔案大小（base64 約為原檔 1.33 倍）
  const estimatedSize = (imageBase64.length * 3) / 4 - 2; // bytes
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (estimatedSize > maxSize) {
    throw new Error('圖片檔案過大（上限 5MB）');
  }
  // ... 原有程式碼
}
```

#### b. 電話號碼驗證（前端+後端）
```javascript
// 前端驗證
function validatePhone(phone) {
  const phoneRegex = /^09\d{8}$/; // 台灣手機格式
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
}

// Apps Script 也可加驗證
if (!/^09\d{8}$/.test(contact_phone.replace(/[-\s]/g, ''))) {
  return sendError('電話格式錯誤（應為 09xx-xxx-xxx）');
}
```

#### c. 刪除刊登時清理 Drive 圖片（選項）
```javascript
// 在 doPost 刪除部分加入
if (payload.action === 'delete' && payload.id) {
  // ... 找到要刪除的列
  const imageUrls = [
    values[i][4], values[i][5], values[i][6], 
    values[i][7], values[i][8] // image_url_1~5
  ].filter(Boolean);
  
  // 刪除 Drive 上的圖片（選項，可選）
  // for (const url of imageUrls) {
  //   const fileId = extractFileIdFromUrl(url);
  //   if (fileId) {
  //     try {
  //       DriveApp.getFileById(fileId).setTrashed(true);
  //     } catch (e) {}
  //   }
  // }
  
  sheet.deleteRow(i + 1);
  return sendSuccess({ deleted: true });
}

function extractFileIdFromUrl(url) {
  const match = url.match(/[?&]id=([^&]+)/);
  return match ? match[1] : null;
}
```

#### d. 手動觸發清理過期（供測試用）
```javascript
// 可手動執行測試清理功能
function testPurgeExpired() {
  purgeExpired();
  console.log('清理完成');
}
```

### 5. **前端功能補充**

#### a. 搜尋/篩選功能
- 依物品名稱搜尋
- 依聯絡人搜尋
- 排序（最新/最舊）

#### b. 分頁功能
- 如果資料量大，支援分頁顯示
- 每頁顯示 10-20 筆

#### c. 圖片放大檢視
- 點擊圖片可全螢幕檢視
- 支援左右切換多圖

#### d. 載入動畫優化
- 上傳進度條
- 骨架屏（Skeleton Screen）

### 6. **資料驗證增強**

#### 前端驗證
- 物品名稱長度限制（50字）
- 描述長度限制（500字）
- 電話格式驗證
- 圖片格式驗證（只允許 jpg, png, webp）
- 圖片數量限制（最多5張）

#### 後端驗證（Apps Script）
- 所有欄位長度檢查
- SQL 注入防護（雖然不是 SQL，但仍需驗證）
- XSS 防護（HTML 跳脫）

### 7. **效能優化**

#### Apps Script
- 大量資料時分批讀取
- 使用快取減少 API 呼叫

#### 前端
- 圖片懶加載（lazy loading）
- 虛擬滾動（大量資料時）

### 8. **使用者體驗優化**

#### a. 友善的錯誤訊息
- 網路錯誤：顯示「網路連線失敗，請檢查網路後重試」
- 上傳失敗：顯示「圖片上傳失敗，請檢查圖片格式與大小」
- 表單驗證：即時顯示錯誤，不要等到提交

#### b. 成功提示
- 使用 Toast 通知（不是 alert）
- 發布成功後顯示確認訊息

#### c. 確認對話框
- 刪除時顯示確認（已有）
- 14天到期提醒（即將過期）

### 9. **安全性建議**

#### a. 檔案名稱清理
```javascript
// Apps Script 中
const safeFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
// 避免使用原始檔名，防止路徑注入
```

#### b. 內容過濾
```javascript
// 過濾敏感資訊（選項）
function sanitizeText(text) {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}
```

### 10. **監控與統計**

#### Apps Script 新增
```javascript
// 統計函式（供管理員查看）
function getStats() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const total = sheet.getLastRow() - 1;
  const today = new Date().toISOString().split('T')[0];
  // 可加入更多統計...
  return {
    total: total,
    today: today
  };
}
```

## 📋 優先實作建議

### 高優先級（必須）
1. ✅ **前端多圖上傳** - 改為支援最多5張
2. ✅ **多圖顯示** - 輪播或網格展示
3. ✅ **14天倒數** - 顯示剩餘天數
4. ✅ **圖片預覽** - 上傳前可預覽

### 中優先級（建議）
5. 圖片大小驗證（前端+後端）
6. 電話格式驗證
7. 錯誤訊息優化
8. 自動過濾過期項目（前端）

### 低優先級（可選）
9. 搜尋功能
10. 分頁功能
11. 刪除時清理 Drive 圖片
12. 統計功能

## 🚀 下一步行動

1. 修改 `second-hand.html` 支援多圖上傳
2. 優化圖片顯示（輪播或網格）
3. 加入 14 天倒數顯示
4. 優化 Apps Script（驗證、錯誤處理）
5. 設定時間驅動觸發器（自動清理過期）

需要我幫你實作哪個功能？

