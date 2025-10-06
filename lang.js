// 多語言支援系統
const translations = {
  'zh-TW': {
    // 主頁
    'home.title': '濬瑒房產生活平台',
    'home.subtitle': '提供房產工具、生活服務、補助優惠等一站式服務',
    'home.install': '安裝應用',
    'home.share': '分享',
    'home.notification': '開啟通知',
    
    // 導航
    'nav.home': '首頁',
    'nav.property': '房產工具',
    'nav.life': '生活服務',
    'nav.fun': '趣味互動',
    'nav.contact': '聯絡我們',
    
    // 房產工具
    'property.loan': '房貸試算',
    'property.decor': '裝潢估價',
    'property.tax': '稅費試算',
    'property.rate': '即時利率',
    
    // 生活服務
    'life.weather': '天氣資訊',
    'life.garbage': '垃圾車提醒',
    'life.receipt': '發票對獎',
    'life.bus': '公車即時',
    
    // 趣味互動
    'fun.fortune': '今日運勢',
    'fun.mbti': 'MBTI測驗',
    'fun.quote': '每日金句',
    
    // 通用
    'common.loading': '載入中...',
    'common.error': '發生錯誤',
    'common.success': '操作成功',
    'common.cancel': '取消',
    'common.confirm': '確認',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.close': '關閉',
    'common.save': '儲存',
    'common.delete': '刪除',
    'common.edit': '編輯',
    'common.view': '查看',
    'common.search': '搜尋',
    'common.filter': '篩選',
    'common.sort': '排序',
    'common.refresh': '重新整理',
    'common.retry': '重試'
  },
  
  'zh-CN': {
    // 主页
    'home.title': '濬瑒房产生活平台',
    'home.subtitle': '提供房产工具、生活服务、补助优惠等一站式服务',
    'home.install': '安装应用',
    'home.share': '分享',
    'home.notification': '开启通知',
    
    // 导航
    'nav.home': '首页',
    'nav.property': '房产工具',
    'nav.life': '生活服务',
    'nav.fun': '趣味互动',
    'nav.contact': '联系我们',
    
    // 房产工具
    'property.loan': '房贷试算',
    'property.decor': '装潢估价',
    'property.tax': '税费试算',
    'property.rate': '实时利率',
    
    // 生活服务
    'life.weather': '天气资讯',
    'life.garbage': '垃圾车提醒',
    'life.receipt': '发票对奖',
    'life.bus': '公交实时',
    
    // 趣味互动
    'fun.fortune': '今日运势',
    'fun.mbti': 'MBTI测验',
    'fun.quote': '每日金句',
    
    // 通用
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.success': '操作成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.back': '返回',
    'common.next': '下一步',
    'common.previous': '上一步',
    'common.close': '关闭',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.view': '查看',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.refresh': '刷新',
    'common.retry': '重试'
  },
  
  'en': {
    // Home
    'home.title': 'Jun Yang Real Estate Life Platform',
    'home.subtitle': 'One-stop service for real estate tools, life services, and subsidy benefits',
    'home.install': 'Install App',
    'home.share': 'Share',
    'home.notification': 'Enable Notifications',
    
    // Navigation
    'nav.home': 'Home',
    'nav.property': 'Real Estate Tools',
    'nav.life': 'Life Services',
    'nav.fun': 'Fun & Interactive',
    'nav.contact': 'Contact Us',
    
    // Property Tools
    'property.loan': 'Mortgage Calculator',
    'property.decor': 'Decoration Estimate',
    'property.tax': 'Tax Calculator',
    'property.rate': 'Live Interest Rates',
    
    // Life Services
    'life.weather': 'Weather Info',
    'life.garbage': 'Garbage Truck Reminder',
    'life.receipt': 'Invoice Lottery',
    'life.bus': 'Bus Tracker',
    
    // Fun & Interactive
    'fun.fortune': 'Daily Fortune',
    'fun.mbti': 'MBTI Test',
    'fun.quote': 'Daily Quotes',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.refresh': 'Refresh',
    'common.retry': 'Retry'
  }
};

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('preferred-language') || this.detectLanguage();
    this.init();
  }
  
  detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-Hant')) {
      return 'zh-TW';
    } else if (browserLang.startsWith('zh-CN') || browserLang.startsWith('zh-Hans')) {
      return 'zh-CN';
    } else if (browserLang.startsWith('en')) {
      return 'en';
    }
    return 'zh-TW'; // 默認繁體中文
  }
  
  init() {
    this.updateLanguage();
    this.setupLanguageSelector();
  }
  
  updateLanguage() {
    document.documentElement.lang = this.currentLang;
    this.translatePage();
  }
  
  translatePage() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
      const key = element.dataset.translate;
      const translation = this.translate(key);
      if (translation) {
        element.textContent = translation;
      }
    });
    
    // 更新標題
    const title = this.translate('home.title');
    if (title) {
      document.title = title;
    }
    
    // 更新meta描述
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = this.translate('home.subtitle');
    }
  }
  
  translate(key) {
    return translations[this.currentLang]?.[key] || key;
  }
  
  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('preferred-language', lang);
      this.updateLanguage();
      
      // 觸發語言變更事件
      document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: lang }
      }));
    }
  }
  
  setupLanguageSelector() {
    const selector = document.getElementById('languageSelector');
    if (selector) {
      selector.value = this.currentLang;
      selector.addEventListener('change', (e) => {
        this.setLanguage(e.target.value);
      });
    }
  }
  
  getCurrentLanguage() {
    return this.currentLang;
  }
  
  getAvailableLanguages() {
    return Object.keys(translations);
  }
}

// 全局語言管理器實例
const languageManager = new LanguageManager();

// 導出給其他模組使用
window.languageManager = languageManager;
