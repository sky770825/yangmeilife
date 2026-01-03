/**
 * 通用工具函數庫
 * 提供統一的錯誤處理、localStorage 操作等功能
 */

// ===== localStorage 安全操作 =====

/**
 * 安全地儲存數據到 localStorage
 * @param {string} key - 儲存鍵名
 * @param {any} value - 要儲存的值（會自動 JSON.stringify）
 * @returns {boolean} 是否儲存成功
 */
function safeLocalStorageSet(key, value) {
  try {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      // 儲存空間已滿
      console.error('localStorage 儲存空間已滿');
      showUserFriendlyError('儲存空間已滿，請刪除一些舊數據以釋放空間');
    } else if (error.name === 'SecurityError') {
      // 安全錯誤（如隱私模式）
      console.error('localStorage 存取被拒絕（可能為隱私模式）');
      showUserFriendlyError('無法儲存數據，請檢查瀏覽器設定');
    } else {
      console.error('localStorage 儲存失敗:', error);
      showUserFriendlyError('儲存數據時發生錯誤，請稍後再試');
    }
    return false;
  }
}

/**
 * 安全地從 localStorage 讀取數據
 * @param {string} key - 讀取鍵名
 * @param {any} defaultValue - 預設值（當鍵不存在或解析失敗時返回）
 * @returns {any} 讀取的值或預設值
 */
function safeLocalStorageGet(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error('localStorage 讀取失敗:', error);
    // 如果解析失敗，嘗試清除損壞的數據
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('清除損壞數據失敗:', e);
    }
    return defaultValue;
  }
}

/**
 * 安全地從 localStorage 刪除數據
 * @param {string} key - 要刪除的鍵名
 * @returns {boolean} 是否刪除成功
 */
function safeLocalStorageRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('localStorage 刪除失敗:', error);
    return false;
  }
}

/**
 * 檢查 localStorage 是否可用
 * @returns {boolean} 是否可用
 */
function isLocalStorageAvailable() {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// ===== 用戶友好的錯誤提示 =====

/**
 * 顯示用戶友好的錯誤訊息
 * @param {string} message - 錯誤訊息
 * @param {string} type - 錯誤類型 (error/warning/info)
 */
function showUserFriendlyError(message, type = 'error') {
  // 如果頁面有 showNotification 函數，使用它
  if (typeof showNotification === 'function') {
    showNotification(message, type);
    return;
  }
  
  // 如果頁面有 showToast 函數，使用它
  if (typeof showToast === 'function') {
    showToast(message, type);
    return;
  }
  
  // 降級到 alert
  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  alert(`${icons[type] || '⚠️'} ${message}`);
}

// ===== 表單驗證工具 =====

/**
 * 驗證台灣手機號碼格式
 * @param {string} phone - 手機號碼
 * @returns {boolean} 是否有效
 */
function validateTaiwanPhone(phone) {
  if (!phone) return false;
  // 移除所有非數字字符
  const cleaned = phone.replace(/[-\s()]/g, '');
  // 台灣手機號碼：09開頭，共10碼
  return /^09\d{8}$/.test(cleaned);
}

/**
 * 驗證電子郵件格式
 * @param {string} email - 電子郵件
 * @returns {boolean} 是否有效
 */
function validateEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 驗證必填欄位
 * @param {Object} fields - 欄位對象 {fieldName: value, ...}
 * @returns {Object} {valid: boolean, missingFields: string[]}
 */
function validateRequiredFields(fields) {
  const missingFields = [];
  for (const [fieldName, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingFields.push(fieldName);
    }
  }
  return {
    valid: missingFields.length === 0,
    missingFields
  };
}

// ===== 圖片處理工具 =====

/**
 * 將圖片轉換為 Base64
 * @param {File} file - 圖片檔案
 * @param {number} maxSizeKB - 最大檔案大小（KB）
 * @returns {Promise<string>} Base64 字串
 */
function imageToBase64(file, maxSizeKB = 2048) {
  return new Promise((resolve, reject) => {
    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      reject(new Error('檔案必須是圖片格式'));
      return;
    }
    
    // 檢查檔案大小
    if (file.size > maxSizeKB * 1024) {
      reject(new Error(`圖片大小不能超過 ${maxSizeKB}KB`));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('讀取圖片失敗'));
    reader.readAsDataURL(file);
  });
}

/**
 * 創建圖片載入失敗的佔位符
 * @param {string} text - 佔位符文字
 * @param {number} width - 寬度
 * @param {number} height - 高度
 * @returns {string} Base64 圖片數據
 */
function createImagePlaceholder(text = '無圖', width = 200, height = 200) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // 背景
  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(0, 0, width, height);
  
  // 文字
  ctx.fillStyle = '#9ca3af';
  ctx.font = `${Math.min(width, height) / 6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL();
}

// ===== 日期時間工具 =====

/**
 * 格式化日期
 * @param {Date|string} date - 日期
 * @param {string} format - 格式（'zh-TW' 或其他）
 * @returns {string} 格式化後的日期字串
 */
function formatDate(date, format = 'zh-TW') {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return '';
  }
  
  if (format === 'zh-TW') {
    return d.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  return d.toLocaleDateString(format);
}

/**
 * 計算兩個日期之間的天數
 * @param {Date|string} date1 - 日期1
 * @param {Date|string} date2 - 日期2
 * @returns {number} 天數差
 */
function daysBetween(date1, date2) {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ===== CSV 匯出工具 =====

/**
 * 匯出數據為 CSV
 * @param {Array} data - 數據陣列
 * @param {Array} headers - 標題陣列
 * @param {string} filename - 檔案名稱
 */
function exportToCSV(data, headers, filename) {
  try {
    const csvRows = [];
    
    // 添加 BOM 以支援中文（Excel）
    csvRows.push('\uFEFF');
    
    // 添加標題
    csvRows.push(headers.join(','));
    
    // 添加數據
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // 處理包含逗號或引號的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('CSV 匯出失敗:', error);
    showUserFriendlyError('匯出失敗，請稍後再試');
    return false;
  }
}

// ===== 防抖和節流工具 =====

/**
 * 防抖函數
 * @param {Function} func - 要執行的函數
 * @param {number} wait - 等待時間（毫秒）
 * @returns {Function} 防抖後的函數
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 節流函數
 * @param {Function} func - 要執行的函數
 * @param {number} limit - 時間限制（毫秒）
 * @returns {Function} 節流後的函數
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ===== 匯出所有函數 =====
// 如果使用模組系統，可以使用 export
// 否則函數會自動掛載到全域作用域

// 檢查是否在瀏覽器環境
if (typeof window !== 'undefined') {
  // 將工具函數掛載到 window 對象（可選）
  window.utils = {
    safeLocalStorageSet,
    safeLocalStorageGet,
    safeLocalStorageRemove,
    isLocalStorageAvailable,
    showUserFriendlyError,
    validateTaiwanPhone,
    validateEmail,
    validateRequiredFields,
    imageToBase64,
    createImagePlaceholder,
    formatDate,
    daysBetween,
    exportToCSV,
    debounce,
    throttle
  };
}

