# Google Sheets 整合設定指南

## 📋 Sheet 欄位設定

在你的 Google Sheet (https://docs.google.com/spreadsheets/d/1pP-SNM1Ze7pZya41EntO4VyzprFxontYTK6kXWEZMM0) 中：

### 1. 建立工作表
- 點擊左下角的 **"+"** 建立新工作表
- 工作表名稱：`二手交易`（或 `second_hand_listings`）

### 2. 設定欄位標題（第一列）
在第 1 列的 A-F 欄位填入：

| 欄位 | 欄位名稱 | 說明 |
|------|---------|------|
| A | `id` | 唯一識別碼（UUID） |
| B | `title` | 物品名稱 |
| C | `contact_name` | 聯絡人 |
| D | `contact_phone` | 聯絡電話 |
| E | `image_url` | 照片雲端連結 |
| F | `description` | 物品描述 |
| G | `created_at` | 建立時間（ISO 格式） |

### 3. 建立 Google Drive 資料夾（儲存圖片）
1. 在 Google Drive 建立一個新資料夾
2. 資料夾名稱：`二手交易圖片` 或 `second-hand-images`
3. 右鍵點擊資料夾 → **"共用"** → **"變更為知道連結的使用者"** → **"檢視者"**
4. 複製資料夾的 ID（從網址取得，例如：`https://drive.google.com/drive/folders/1abc123xyz...` 中的 `1abc123xyz...`）

## 🔧 Google Apps Script 設定

### 步驟 1：建立 Apps Script
1. 在你的 Sheet 中，點擊 **"擴充功能"** → **"Apps Script"**
2. 刪除預設程式碼，貼上以下完整程式碼：

```javascript
// ===== 設定區（請替換為你的值） =====
const SHEET_ID = '1pP-SNM1Ze7pZya41EntO4VyzprFxontYTK6kXWEZMM0'; // 你的 Sheet ID
const SHEET_NAME = '二手交易'; // 工作表名稱（請改為你建立的工作表名稱）
const FOLDER_ID = '1c46hGHXyz1uDIJOBFeWIwYxhj59Bxfwu'; // Google Drive 資料夾 ID（已設定）

// ===== 處理新增刊登與刪除（POST） =====
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    
    // 處理刪除請求
    if (payload.action === 'delete' && payload.id) {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
      if (!sheet) {
        return sendError('找不到工作表');
      }

      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      // 找到要刪除的列（從第 2 列開始，第 1 列是標題）
      for (let i = 1; i < values.length; i++) {
        if (values[i][0] === payload.id) { // id 在第一欄（索引 0）
          sheet.deleteRow(i + 1); // +1 因為 Sheet 列數從 1 開始
          return sendSuccess({ deleted: true });
        }
      }
      
      return sendError('找不到要刪除的資料');
    }
    
    // 處理新增刊登
    const { title, contact_name, contact_phone, description, imageUrls = [], imageBase64List = [] } = payload;

    // 驗證必填欄位
    if (!title || !contact_name || !contact_phone) {
      return sendError('缺少必填欄位');
    }
    
    // 驗證欄位長度
    if (title.length > 50) {
      return sendError('物品名稱過長（最多50字）');
    }
    if (contact_name.length > 20) {
      return sendError('聯絡人名稱過長（最多20字）');
    }
    if (description && description.length > 500) {
      return sendError('描述過長（最多500字）');
    }
    
    // 驗證電話格式（台灣手機：09xxxxxxxx）
    const cleanedPhone = contact_phone.replace(/[-\s]/g, '');
    if (!/^09\d{8}$/.test(cleanedPhone)) {
      return sendError('電話格式錯誤（應為 09xx-xxx-xxx）');
    }
    
    // 驗證圖片數量
    const totalImages = imageUrls.length + imageBase64List.length;
    if (totalImages > 5) {
      return sendError('照片數量過多（最多5張）');
    }

    // 處理圖片上傳：最多5張
    const finalUrls = [];
    
    // 先用 imageUrls（已有連結）
    for (let i = 0; i < imageUrls.length && finalUrls.length < 5; i++) {
      if (imageUrls[i]) finalUrls.push(imageUrls[i]);
    }
    
    // 再上傳 imageBase64List
    for (let i = 0; i < imageBase64List.length && finalUrls.length < 5; i++) {
      try {
        const url = uploadImageToDrive(imageBase64List[i]);
        finalUrls.push(url);
      } catch (uploadErr) {
        console.error('圖片上傳失敗:', uploadErr);
        // 跳過失敗的圖片，繼續處理其他圖片
      }
    }
    
    // 補齊到5欄（空字串）
    while (finalUrls.length < 5) {
      finalUrls.push('');
    }

    // 寫入 Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      return sendError('找不到工作表: ' + SHEET_NAME);
    }

    const id = Utilities.getUuid();
    const createdAt = new Date().toISOString();
    const expiresAtIso = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // +14天

    // 確保標題列存在
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 12).setValues([[
        'id', 'title', 'contact_name', 'contact_phone',
        'image_url_1', 'image_url_2', 'image_url_3', 'image_url_4', 'image_url_5',
        'description', 'created_at', 'expires_at'
      ]]);
    }

    // 新增資料列
    sheet.appendRow([
      id,
      title,
      contact_name,
      cleanedPhone, // 使用清理後的電話號碼
      finalUrls[0],
      finalUrls[1],
      finalUrls[2],
      finalUrls[3],
      finalUrls[4],
      description || '',
      createdAt,
      expiresAtIso
    ]);

    return sendSuccess({
      id: id,
      imageUrls: finalUrls.filter(url => url) // 只回傳非空連結
    });
  } catch (err) {
    return sendError(err.toString());
  }
}

// ===== 讀取所有刊登（GET） =====
function doGet() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      return sendError('找不到工作表: ' + SHEET_NAME);
    }

    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    if (values.length <= 1) {
      return sendSuccess({ list: [] });
    }

    // 第一列是標題，跳過
    const headers = values[0];
    const dataRows = values.slice(1);

    // 建立欄位索引
    const colIndex = {
      id: headers.indexOf('id'),
      title: headers.indexOf('title'),
      contact_name: headers.indexOf('contact_name'),
      contact_phone: headers.indexOf('contact_phone'),
      image_url_1: headers.indexOf('image_url_1'),
      image_url_2: headers.indexOf('image_url_2'),
      image_url_3: headers.indexOf('image_url_3'),
      image_url_4: headers.indexOf('image_url_4'),
      image_url_5: headers.indexOf('image_url_5'),
      description: headers.indexOf('description'),
      created_at: headers.indexOf('created_at'),
      expires_at: headers.indexOf('expires_at')
    };

    // 轉換資料格式（最新的在前）
    const list = dataRows
      .map(row => {
        const images = [
          row[colIndex.image_url_1],
          row[colIndex.image_url_2],
          row[colIndex.image_url_3],
          row[colIndex.image_url_4],
          row[colIndex.image_url_5]
        ].filter(Boolean); // 過濾空值
        
        return {
          id: row[colIndex.id] || '',
          title: row[colIndex.title] || '',
          name: row[colIndex.contact_name] || '',
          phone: row[colIndex.contact_phone] || '',
          images: images, // 多圖陣列
          imageUrl: images[0] || '', // 向下相容：第一張圖
          desc: row[colIndex.description] || '',
          createdAt: row[colIndex.created_at] ? new Date(row[colIndex.created_at]).getTime() : Date.now(),
          expiresAt: row[colIndex.expires_at] || ''
        };
      })
      .reverse(); // 最新的在前

    return sendSuccess({ list });
  } catch (err) {
    return sendError(err.toString());
  }
}

// ===== 上傳圖片到 Google Drive =====
function uploadImageToDrive(imageBase64) {
  if (!FOLDER_ID || FOLDER_ID === 'YOUR_FOLDER_ID') {
    throw new Error('未設定 FOLDER_ID');
  }

  // 移除 Base64 前綴
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  
  // 估算檔案大小（base64 約為原檔 1.33 倍）
  const estimatedSize = (base64Data.length * 3) / 4;
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (estimatedSize > maxSize) {
    throw new Error('圖片檔案過大（上限 5MB）');
  }
  
  // 判斷圖片類型
  let mimeType = 'image/png';
  let ext = 'png';
  if (imageBase64.includes('data:image/jpeg') || imageBase64.includes('data:image/jpg')) {
    mimeType = 'image/jpeg';
    ext = 'jpg';
  } else if (imageBase64.includes('data:image/webp')) {
    mimeType = 'image/webp';
    ext = 'webp';
  }
  
  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64Data),
    mimeType,
    `second-hand-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
  );

  const folder = DriveApp.getFolderById(FOLDER_ID);
  const file = folder.createFile(blob);

  // 設定為公開存取
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // 取得公開連結
  return `https://drive.google.com/uc?export=view&id=${file.getId()}`;
}

// ===== 回應輔助函式（移除 setHeader，避免 TypeError） =====
function sendSuccess(data) {
  return ContentService.createTextOutput(JSON.stringify({
    ok: true,
    ...data
  }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendError(message) {
  return ContentService.createTextOutput(JSON.stringify({
    ok: false,
    error: message
  }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== CORS 支援 =====
// 注意：Google Apps Script 部署為「所有人可存取」時會自動處理 CORS
// setHeader 會導致錯誤，所以移除
function doOptions() {
  return ContentService.createTextOutput('ok')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### 步驟 2：替換設定值
在程式碼開頭的設定區，替換：
- `SHEET_ID`: 已設定為你的 Sheet ID
- `SHEET_NAME`: 改為你的工作表名稱（例如：`二手交易`）
- `FOLDER_ID`: 貼上你的 Google Drive 資料夾 ID

### 步驟 3：儲存與部署
1. 點擊 **"檔案"** → **"儲存"**（或按 Ctrl+S）
2. 點擊 **"部署"** → **"新增部署作業"**
3. 選擇類型：**"網頁應用程式"**
4. 設定：
   - **說明**：`二手交易 API`
   - **執行身份**：`我`
   - **具有存取權的使用者**：`所有人`
5. 點擊 **"部署"**
6. **複製部署後的網頁應用程式網址**（類似：`https://script.google.com/macros/s/.../exec`）
7. 第一次部署需要授權，點擊 **"授權"** 並允許存取

## 📝 在前端使用

將部署後的網址填入 `second-hand.html` 的設定中（稍後會修改檔案）。

## ✅ 測試

部署完成後，可以在瀏覽器測試：
- **讀取**：`https://你的部署網址/exec`
- 應該會看到 JSON 格式的資料

