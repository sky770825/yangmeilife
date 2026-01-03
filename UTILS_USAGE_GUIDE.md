# 工具函數使用指南

## 📋 概述

`utils.js` 提供了統一的工具函數，用於處理 localStorage 操作、表單驗證、圖片處理等常見功能。

---

## 🔧 localStorage 安全操作

### 儲存數據
```javascript
// ❌ 舊方式（不安全）
localStorage.setItem('key', JSON.stringify(data));

// ✅ 新方式（安全，有錯誤處理）
safeLocalStorageSet('key', data);
```

### 讀取數據
```javascript
// ❌ 舊方式（不安全）
const data = JSON.parse(localStorage.getItem('key') || '[]');

// ✅ 新方式（安全，有錯誤處理）
const data = safeLocalStorageGet('key', []); // 第二個參數是預設值
```

### 刪除數據
```javascript
// ✅ 安全刪除
safeLocalStorageRemove('key');
```

### 檢查可用性
```javascript
if (isLocalStorageAvailable()) {
  // 可以使用 localStorage
} else {
  // 降級處理（如使用記憶體存儲）
}
```

---

## 📝 表單驗證

### 驗證台灣手機號碼
```javascript
if (validateTaiwanPhone('0912345678')) {
  // 手機號碼格式正確
}
```

### 驗證電子郵件
```javascript
if (validateEmail('user@example.com')) {
  // 電子郵件格式正確
}
```

### 驗證必填欄位
```javascript
const validation = validateRequiredFields({
  name: document.getElementById('name').value,
  email: document.getElementById('email').value,
  phone: document.getElementById('phone').value
});

if (!validation.valid) {
  showUserFriendlyError(`請填寫以下欄位: ${validation.missingFields.join(', ')}`);
}
```

---

## 🖼️ 圖片處理

### 圖片轉 Base64
```javascript
const fileInput = document.getElementById('imageInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  try {
    const base64 = await imageToBase64(file, 2048); // 最大 2MB
    // 使用 base64
  } catch (error) {
    showUserFriendlyError(error.message);
  }
});
```

### 創建圖片佔位符
```javascript
const placeholder = createImagePlaceholder('無圖', 200, 200);
// 返回 Base64 圖片數據
```

---

## 📅 日期時間工具

### 格式化日期
```javascript
const date = new Date();
const formatted = formatDate(date, 'zh-TW');
// 輸出: "2024年1月15日"
```

### 計算日期差
```javascript
const days = daysBetween(new Date('2024-01-01'), new Date('2024-01-15'));
// 輸出: 14
```

---

## 📊 CSV 匯出

```javascript
const data = [
  { name: '物品1', category: '電子', location: '房間A' },
  { name: '物品2', category: '書籍', location: '書房' }
];

const headers = ['name', 'category', 'location'];
exportToCSV(data, headers, '物品清單.csv');
```

---

## ⚡ 性能優化工具

### 防抖（Debounce）
```javascript
// 搜尋輸入框，用戶停止輸入 300ms 後才執行搜尋
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce((e) => {
  performSearch(e.target.value);
}, 300));
```

### 節流（Throttle）
```javascript
// 滾動事件，每 100ms 最多執行一次
window.addEventListener('scroll', throttle(() => {
  updateScrollPosition();
}, 100));
```

---

## ❌ 錯誤處理

### 用戶友好的錯誤提示
```javascript
// 自動檢測頁面是否有 showNotification 或 showToast 函數
// 如果沒有，會降級到 alert
showUserFriendlyError('操作失敗，請稍後再試', 'error');
showUserFriendlyError('請注意事項', 'warning');
showUserFriendlyError('提示訊息', 'info');
```

---

## 📦 在頁面中使用

### 1. 引入工具函數
在 HTML 文件的 `<head>` 或 `<body>` 中引入：
```html
<script src="utils.js"></script>
```

### 2. 使用函數
函數會自動掛載到全域作用域，可以直接使用：
```javascript
// 在任何地方直接使用
const data = safeLocalStorageGet('myData', []);
safeLocalStorageSet('myData', newData);
```

### 3. 遷移現有代碼

#### 遷移 localStorage 操作
```javascript
// 找到所有 localStorage.setItem
// 替換為 safeLocalStorageSet

// 找到所有 localStorage.getItem
// 替換為 safeLocalStorageGet

// 找到所有 localStorage.removeItem
// 替換為 safeLocalStorageRemove
```

---

## ✅ 已應用工具函數的頁面

- ✅ `item-storage.html` - 物品收納管理（已應用 localStorage 安全操作）
- ✅ `health-record.html` - 健康記錄本（已應用 localStorage 安全操作）
- ✅ `utility-tracking.html` - 水電用量追蹤（已應用 localStorage 安全操作）
- ✅ `todo-list.html` - 待辦事項管理（已應用 localStorage 安全操作）
- ✅ `price-comparison.html` - 比價工具（已應用 localStorage 安全操作）
- ✅ `maintenance-record.html` - 家庭維修記錄本（已應用 localStorage 安全操作）
- ✅ `motorcycle-maintenance.html` - 機車保養記錄（已應用 localStorage 安全操作）
- ✅ `community-board.html` - 社區公告板（已應用 localStorage 安全操作）

---

## 📋 待遷移頁面列表

以下頁面建議逐步遷移：

### 高優先級（數據量大的頁面）
- ✅ `health-record.html` - 健康記錄本（已完成）
- ✅ `utility-tracking.html` - 水電用量追蹤（已完成）
- `expense-tracker.html` - 記帳
- ✅ `todo-list.html` - 待辦事項（已完成）

### 中優先級
- ✅ `price-comparison.html` - 比價工具（已完成）
- ✅ `maintenance-record.html` - 維修記錄（已完成）
- ✅ `motorcycle-maintenance.html` - 機車保養（已完成）
- ✅ `community-board.html` - 社區公告（已完成）

---

## 🔍 檢查清單

遷移頁面時，請檢查：

- [ ] 引入 `utils.js`
- [ ] 替換所有 `localStorage.setItem` 為 `safeLocalStorageSet`
- [ ] 替換所有 `localStorage.getItem` 為 `safeLocalStorageGet`
- [ ] 替換所有 `localStorage.removeItem` 為 `safeLocalStorageRemove`
- [ ] 測試儲存空間已滿的情況
- [ ] 測試隱私模式（無痕模式）
- [ ] 測試數據損壞的恢復

---

## 🚀 下一步

1. ✅ 創建工具函數庫（已完成）
2. ✅ 在一個頁面中應用作為示例（item-storage.html）
3. ⏳ 逐步遷移其他頁面
4. ⏳ 添加更多工具函數（如需要）

---

**最後更新**：2024年

