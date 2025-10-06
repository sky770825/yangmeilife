// 安全性增強系統
class SecurityManager {
  constructor() {
    this.cspViolations = [];
    this.xssAttempts = [];
    this.init();
  }
  
  init() {
    this.setupCSP();
    this.setupXSSProtection();
    this.setupInputSanitization();
    this.setupCSRFProtection();
    this.setupClickjackingProtection();
  }
  
  // Content Security Policy 設置
  setupCSP() {
    const cspPolicy = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    // 創建meta標籤
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = cspPolicy;
    document.head.appendChild(cspMeta);
    
    // CSP違規報告
    document.addEventListener('securitypolicyviolation', (e) => {
      this.reportCSPViolation(e);
    });
  }
  
  // CSP違規報告
  reportCSPViolation(event) {
    const violation = {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      originalPolicy: event.originalPolicy,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
    
    this.cspViolations.push(violation);
    console.warn('CSP違規:', violation);
    
    // 發送到監控服務
    this.sendSecurityEvent('csp_violation', violation);
  }
  
  // XSS防護
  setupXSSProtection() {
    // 過濾危險的HTML標籤和屬性
    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form'];
    const dangerousAttributes = ['onload', 'onerror', 'onclick', 'onmouseover', 'javascript:'];
    
    // 監控DOM變化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.scanForXSS(node);
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // 監控innerHTML使用
    this.interceptInnerHTML();
  }
  
  // 掃描XSS攻擊
  scanForXSS(element) {
    const dangerousTags = ['script', 'iframe', 'object', 'embed'];
    const dangerousAttributes = ['onload', 'onerror', 'onclick', 'onmouseover'];
    
    // 檢查危險標籤
    dangerousTags.forEach(tag => {
      if (element.tagName && element.tagName.toLowerCase() === tag) {
        this.reportXSSAttempt('dangerous_tag', element);
      }
    });
    
    // 檢查危險屬性
    if (element.attributes) {
      Array.from(element.attributes).forEach(attr => {
        if (dangerousAttributes.includes(attr.name.toLowerCase())) {
          this.reportXSSAttempt('dangerous_attribute', element, attr);
        }
      });
    }
    
    // 檢查子元素
    Array.from(element.children).forEach(child => {
      this.scanForXSS(child);
    });
  }
  
  // 攔截innerHTML使用
  interceptInnerHTML() {
    const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    
    Object.defineProperty(Element.prototype, 'innerHTML', {
      get: function() {
        return originalInnerHTML.get.call(this);
      },
      set: function(value) {
        // 檢查是否包含危險內容
        if (this.containsDangerousContent(value)) {
          console.warn('檢測到潛在的XSS攻擊:', value);
          this.reportXSSAttempt('innerHTML_injection', this, { value: value });
        }
        return originalInnerHTML.set.call(this, value);
      }
    });
  }
  
  // 檢查危險內容
  containsDangerousContent(html) {
    const dangerousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>/gi
    ];
    
    return dangerousPatterns.some(pattern => pattern.test(html));
  }
  
  // XSS攻擊報告
  reportXSSAttempt(type, element, details = {}) {
    const attempt = {
      type: type,
      element: element.tagName,
      details: details,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    this.xssAttempts.push(attempt);
    console.warn('XSS攻擊嘗試:', attempt);
    
    // 發送到監控服務
    this.sendSecurityEvent('xss_attempt', attempt);
  }
  
  // 輸入清理
  setupInputSanitization() {
    // 監控所有輸入欄位
    document.addEventListener('input', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        this.sanitizeInput(e.target);
      }
    });
  }
  
  // 清理輸入內容
  sanitizeInput(input) {
    const originalValue = input.value;
    let sanitizedValue = originalValue;
    
    // 移除危險字符
    sanitizedValue = sanitizedValue
      .replace(/[<>]/g, '') // 移除尖括號
      .replace(/javascript:/gi, '') // 移除javascript協議
      .replace(/on\w+\s*=/gi, '') // 移除事件處理器
      .trim();
    
    if (sanitizedValue !== originalValue) {
      input.value = sanitizedValue;
      console.warn('輸入已清理:', { original: originalValue, sanitized: sanitizedValue });
    }
  }
  
  // CSRF防護
  setupCSRFProtection() {
    // 生成CSRF令牌
    this.csrfToken = this.generateCSRFToken();
    
    // 為所有表單添加CSRF令牌
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.tagName === 'FORM') {
        this.addCSRFToken(form);
      }
    });
    
    // 為AJAX請求添加CSRF令牌
    this.interceptFetch();
  }
  
  // 生成CSRF令牌
  generateCSRFToken() {
    return 'csrf_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
  
  // 添加CSRF令牌到表單
  addCSRFToken(form) {
    let csrfInput = form.querySelector('input[name="csrf_token"]');
    if (!csrfInput) {
      csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = 'csrf_token';
      csrfInput.value = this.csrfToken;
      form.appendChild(csrfInput);
    }
  }
  
  // 攔截fetch請求
  interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = (url, options = {}) => {
      if (options.method && options.method.toUpperCase() !== 'GET') {
        // 為非GET請求添加CSRF令牌
        if (!options.headers) {
          options.headers = {};
        }
        options.headers['X-CSRF-Token'] = this.csrfToken;
      }
      return originalFetch(url, options);
    };
  }
  
  // 防止點擊劫持
  setupClickjackingProtection() {
    // 檢查是否在iframe中
    if (window !== window.top) {
      // 如果不是從信任的來源載入，則跳轉到主頁面
      if (!this.isTrustedOrigin(document.referrer)) {
        window.top.location = window.location.href;
      }
    }
    
    // 設置X-Frame-Options標頭（通過JavaScript模擬）
    document.addEventListener('DOMContentLoaded', () => {
      const frameBuster = document.createElement('script');
      frameBuster.textContent = `
        if (top !== self) {
          top.location = self.location;
        }
      `;
      document.head.appendChild(frameBuster);
    });
  }
  
  // 檢查是否為信任來源
  isTrustedOrigin(referrer) {
    const trustedDomains = [
      'realtor-platform.com',
      'localhost',
      '127.0.0.1'
    ];
    
    try {
      const referrerUrl = new URL(referrer);
      return trustedDomains.some(domain => 
        referrerUrl.hostname === domain || referrerUrl.hostname.endsWith('.' + domain)
      );
    } catch (e) {
      return false;
    }
  }
  
  // 發送安全事件
  sendSecurityEvent(type, data) {
    // 這裡可以發送到安全監控服務
    console.log('安全事件:', { type, data });
    
    // 本地儲存（用於調試）
    const events = JSON.parse(localStorage.getItem('security_events') || '[]');
    events.push({
      type: type,
      data: data,
      timestamp: Date.now()
    });
    
    // 只保留最近50個事件
    if (events.length > 50) {
      events.splice(0, events.length - 50);
    }
    
    localStorage.setItem('security_events', JSON.stringify(events));
  }
  
  // 獲取安全報告
  getSecurityReport() {
    return {
      cspViolations: this.cspViolations,
      xssAttempts: this.xssAttempts,
      csrfToken: this.csrfToken,
      timestamp: Date.now()
    };
  }
  
  // 清除安全數據
  clearSecurityData() {
    localStorage.removeItem('security_events');
    this.cspViolations = [];
    this.xssAttempts = [];
  }
}

// 初始化安全管理器
const securityManager = new SecurityManager();

// 導出給其他模組使用
window.securityManager = securityManager;
