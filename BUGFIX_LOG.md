# Bug 修復記錄

## 問題：導航列按鈕點擊無法跳轉連結

**日期**: 2025-01-XX  
**影響範圍**: index.html 的所有使用 `openTool()` 函數的按鈕

### 問題描述

用戶報告導航列按鈕（記帳、遊戲、房訊、拜拜）點擊後沒有反應，無法跳轉到對應頁面。

### 問題原因

**根本原因：函數依賴未初始化的對象**

原本的 `openTool` 函數實現：
```javascript
function openTool(url) {
  app.openTool(url);  // ❌ 依賴 app 對象
}
```

但是 `app` 對象的初始化位置：
```javascript
// 在第 2345 行才初始化
const app = new PropertyApp();
```

**問題分析**：
1. JavaScript 是按順序執行的
2. 當 HTML 中的 `onclick="openTool('xxx.html')"` 被點擊時
3. 如果腳本還沒有執行到 `const app = new PropertyApp()` 這一行
4. `app` 變數就是 `undefined`
5. 嘗試調用 `app.openTool(url)` 會導致錯誤：`Cannot read property 'openTool' of undefined`
6. 結果：按鈕點擊沒有反應，頁面不會跳轉

### 解決方案

**將函數改為獨立實現，不依賴 app 對象**：

```javascript
// 全域函數（獨立實現，不依賴 app）
function openTool(url) {
  if (!url) {
    console.error('openTool: url 參數缺失');
    return;
  }
  
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // 外部連結在新視窗打開
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // 內部連結在原視窗打開
      window.location.href = url;
    }
  } catch (error) {
    console.error('openTool 執行錯誤:', error);
    // 降級處理：直接使用 location.href
    window.location.href = url;
  }
}
```

### 改進點

1. ✅ **消除依賴**：不再依賴 `app` 對象，函數可以立即使用
2. ✅ **錯誤處理**：添加了 try-catch 和參數驗證
3. ✅ **降級處理**：如果出錯，使用最簡單的方式進行跳轉
4. ✅ **更早可用**：函數定義後即可使用，無需等待對象初始化

### 影響的按鈕

以下按鈕都使用 `openTool()` 函數，已全部修復：
- 導航列：記帳、遊戲、房訊、拜拜按鈕
- Hero 區：房屋估價按鈕
- 輕鬆時光區：遊戲、運勢、MBTI、金句卡片
- 熱門服務區：所有服務卡片
- 生活服務區：所有服務卡片
- 其他功能區：所有相關卡片

### 經驗教訓

1. **避免循環依賴**：函數定義時避免依賴後續才會初始化的對象
2. **獨立函數優先**：對於簡單的工具函數，應該獨立實現，不依賴類實例
3. **錯誤處理**：添加適當的錯誤處理和降級方案
4. **測試時機**：測試時要考慮腳本執行順序，特別是使用 `onclick` 內聯事件時

### 相關文件

- `index.html` - 主頁面文件
- 修復位置：第 2183-2204 行

### 狀態

✅ **已修復** - 所有按鈕現在都可以正常工作

