# Apps Script CORS 修正說明

## 問題
遇到 CORS 錯誤：`No 'Access-Control-Allow-Origin' header is present`

## 解決方案

### 方法 1：重新部署 Apps Script（推薦）

1. 確保部署設定正確：
   - **執行身份**：`我`
   - **具有存取權的使用者**：`所有人`（這很重要！）

2. 如果已經部署，請：
   - 進入 Apps Script
   - 點擊「部署」→「管理部署作業」
   - 點擊部署旁邊的「編輯」圖示
   - 確認「具有存取權的使用者」選擇「所有人」
   - 點擊「部署」重新部署
   - **重新複製新的部署網址**（部署後網址可能會改變）

### 方法 2：檢查 Apps Script 程式碼

確保 `doOptions` 函數存在（處理 CORS 預檢請求）：

```javascript
// ===== CORS 支援 =====
function doOptions() {
  return ContentService.createTextOutput('ok')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

**注意**：雖然 `setHeader` 會報錯，但 Google Apps Script 在部署為「所有人可存取」時會自動處理 CORS headers。

### 方法 3：如果還是不行，使用 JSONP（備用方案）

如果標準 fetch 仍然遇到 CORS 問題，可以考慮在前端使用 JSONP 方式。

## 檢查清單

- [ ] Apps Script 已部署為「所有人可存取」
- [ ] 已重新部署並更新網址
- [ ] `doOptions` 函數存在於 Apps Script 中
- [ ] 前端程式碼中的 URL 已更新為最新部署網址
- [ ] 瀏覽器控制台沒有其他錯誤

## 測試步驟

1. 直接瀏覽器開啟：`https://你的部署網址/exec`
   - 應該看到 `{"ok":true,"list":[]}` 或類似的 JSON
   - 如果看到，表示 API 正常，問題在 CORS

2. 檢查部署設定
   - 確認「具有存取權的使用者」為「所有人」

3. 如果還是不行
   - 嘗試清除瀏覽器快取
   - 或使用無痕模式測試

