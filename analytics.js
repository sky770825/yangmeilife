// 網站分析追蹤系統
class Analytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageViews = [];
    this.userInteractions = [];
    this.errors = [];
    
    this.init();
  }
  
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  init() {
    this.trackPageView();
    this.setupEventListeners();
    this.trackUserEngagement();
    this.trackErrors();
  }
  
  // 頁面瀏覽追蹤
  trackPageView() {
    const pageData = {
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    this.pageViews.push(pageData);
    this.sendEvent('page_view', pageData);
    
    console.log('頁面瀏覽追蹤:', pageData);
  }
  
  // 用戶互動追蹤
  trackUserInteraction(action, element, data = {}) {
    const interactionData = {
      action: action,
      element: element,
      timestamp: Date.now(),
      url: window.location.href,
      sessionId: this.sessionId,
      ...data
    };
    
    this.userInteractions.push(interactionData);
    this.sendEvent('user_interaction', interactionData);
    
    console.log('用戶互動追蹤:', interactionData);
  }
  
  // 功能使用追蹤
  trackFeatureUsage(feature, action, data = {}) {
    const featureData = {
      feature: feature,
      action: action,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...data
    };
    
    this.sendEvent('feature_usage', featureData);
    
    console.log('功能使用追蹤:', featureData);
  }
  
  // 錯誤追蹤
  trackError(error, context = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      ...context
    };
    
    this.errors.push(errorData);
    this.sendEvent('error', errorData);
    
    console.error('錯誤追蹤:', errorData);
  }
  
  // 性能追蹤
  trackPerformance() {
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0];
      const performanceData = {
        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint(),
        timestamp: Date.now(),
        sessionId: this.sessionId
      };
      
      this.sendEvent('performance', performanceData);
      
      console.log('性能追蹤:', performanceData);
    }
  }
  
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const fpEntry = paintEntries.find(entry => entry.name === 'first-paint');
    return fpEntry ? fpEntry.startTime : null;
  }
  
  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : null;
  }
  
  // 設置事件監聽器
  setupEventListeners() {
    // 點擊追蹤
    document.addEventListener('click', (e) => {
      const element = e.target;
      const tagName = element.tagName.toLowerCase();
      const className = element.className;
      const id = element.id;
      
      this.trackUserInteraction('click', {
        tagName: tagName,
        className: className,
        id: id,
        text: element.textContent?.substring(0, 100)
      });
    });
    
    // 表單提交追蹤
    document.addEventListener('submit', (e) => {
      const form = e.target;
      const formData = new FormData(form);
      const formFields = {};
      
      for (let [key, value] of formData.entries()) {
        formFields[key] = value;
      }
      
      this.trackUserInteraction('form_submit', {
        formId: form.id,
        formClass: form.className,
        fields: Object.keys(formFields)
      });
    });
    
    // 頁面離開追蹤
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd();
    });
    
    // 頁面可見性變化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackUserInteraction('page_hidden');
      } else {
        this.trackUserInteraction('page_visible');
      }
    });
  }
  
  // 用戶參與度追蹤
  trackUserEngagement() {
    let scrollDepth = 0;
    let maxScrollDepth = 0;
    
    window.addEventListener('scroll', () => {
      scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // 追蹤滾動深度里程碑
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
          this.trackUserInteraction('scroll_25');
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
          this.trackUserInteraction('scroll_50');
        } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
          this.trackUserInteraction('scroll_75');
        } else if (maxScrollDepth >= 100) {
          this.trackUserInteraction('scroll_100');
        }
      }
    });
    
    // 追蹤停留時間
    this.startTime = Date.now();
  }
  
  // 錯誤追蹤設置
  trackErrors() {
    window.addEventListener('error', (e) => {
      this.trackError(e.error, {
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      });
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      this.trackError(new Error(e.reason), {
        type: 'unhandledrejection'
      });
    });
  }
  
  // 會話結束追蹤
  trackSessionEnd() {
    const sessionDuration = Date.now() - this.startTime;
    const sessionData = {
      duration: sessionDuration,
      pageViews: this.pageViews.length,
      interactions: this.userInteractions.length,
      errors: this.errors.length,
      timestamp: Date.now()
    };
    
    this.sendEvent('session_end', sessionData);
  }
  
  // 發送事件到分析服務
  sendEvent(eventType, data) {
    // 這裡可以整合Google Analytics或其他分析服務
    if (typeof gtag !== 'undefined') {
      gtag('event', eventType, {
        event_category: 'engagement',
        event_label: JSON.stringify(data),
        value: 1
      });
    }
    
    // 本地儲存（用於調試）
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push({
      type: eventType,
      data: data,
      timestamp: Date.now()
    });
    
    // 只保留最近100個事件
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(events));
  }
  
  // 獲取分析報告
  getAnalyticsReport() {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      duration: Date.now() - this.startTime,
      pageViews: this.pageViews,
      userInteractions: this.userInteractions,
      errors: this.errors,
      performance: this.getPerformanceData()
    };
  }
  
  getPerformanceData() {
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint()
      };
    }
    return null;
  }
  
  // 清除分析數據
  clearAnalyticsData() {
    localStorage.removeItem('analytics_events');
    this.pageViews = [];
    this.userInteractions = [];
    this.errors = [];
  }
}

// 初始化分析
const analytics = new Analytics();

// 在頁面載入完成後追蹤性能
window.addEventListener('load', () => {
  setTimeout(() => {
    analytics.trackPerformance();
  }, 1000);
});

// 導出給其他模組使用
window.analytics = analytics;
