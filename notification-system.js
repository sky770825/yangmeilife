/**
 * 通知系統 - 濬瑒房產生活平台
 * 功能：推播通知、消息中心、提醒管理
 */

class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.permission = 'default';
    this.isSupported = 'Notification' in window;
    this.init();
  }

  // 初始化通知系統
  init() {
    this.loadNotifications();
    this.setupNotificationButton();
    this.setupServiceWorker();
    this.startPeriodicChecks();
  }

  // 請求通知權限
  async requestPermission() {
    if (!this.isSupported) {
      this.showMessage('您的瀏覽器不支援推播通知', 'warning');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        this.showMessage('通知權限已開啟！', 'success');
        this.savePermissionState(true);
        return true;
      } else {
        this.showMessage('通知權限被拒絕', 'error');
        this.savePermissionState(false);
        return false;
      }
    } catch (error) {
      console.error('請求通知權限失敗:', error);
      this.showMessage('請求通知權限失敗', 'error');
      return false;
    }
  }

  // 發送推播通知
  async sendNotification(title, options = {}) {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        tag: options.tag || 'default',
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        ...options
      });

      // 自動關閉通知
      setTimeout(() => {
        notification.close();
      }, options.duration || 5000);

      // 點擊通知事件
      notification.onclick = () => {
        window.focus();
        if (options.url) {
          window.open(options.url, '_blank');
        }
        notification.close();
      };

      return true;
    } catch (error) {
      console.error('發送通知失敗:', error);
      this.showMessage('發送通知失敗', 'error');
      return false;
    }
  }

  // 添加通知到消息中心
  addNotification(notification) {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.updateNotificationBadge();
    this.showInAppNotification(newNotification);
  }

  // 顯示應用內通知
  showInAppNotification(notification) {
    const container = document.getElementById('notificationContainer') || this.createNotificationContainer();
    
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification-item';
    notificationElement.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${notification.icon || '🔔'}</div>
        <div class="notification-text">
          <div class="notification-title">${notification.title}</div>
          <div class="notification-message">${notification.message}</div>
          <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    container.appendChild(notificationElement);

    // 自動移除
    setTimeout(() => {
      if (notificationElement.parentElement) {
        notificationElement.remove();
      }
    }, 5000);

    // 添加動畫
    notificationElement.style.opacity = '0';
    notificationElement.style.transform = 'translateX(100%)';
    setTimeout(() => {
      notificationElement.style.transition = 'all 0.3s ease';
      notificationElement.style.opacity = '1';
      notificationElement.style.transform = 'translateX(0)';
    }, 100);
  }

  // 創建通知容器
  createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    container.className = 'notification-container';
    container.innerHTML = `
      <style>
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          max-width: 400px;
          pointer-events: none;
        }
        
        .notification-item {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 0.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #667eea;
          pointer-events: auto;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .notification-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        
        .notification-content {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        
        .notification-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        
        .notification-text {
          flex: 1;
        }
        
        .notification-title {
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }
        
        .notification-message {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 0.25rem;
        }
        
        .notification-time {
          color: #9ca3af;
          font-size: 0.8rem;
        }
        
        .notification-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .notification-close:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #374151;
        }
        
        .dark .notification-item {
          background: rgba(30, 30, 30, 0.95);
          border-left-color: #818cf8;
        }
        
        .dark .notification-title {
          color: #f9fafb;
        }
        
        .dark .notification-message {
          color: #d1d5db;
        }
        
        .dark .notification-time {
          color: #9ca3af;
        }
        
        .dark .notification-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f9fafb;
        }
      </style>
    `;
    
    document.body.appendChild(container);
    return container;
  }

  // 設置通知按鈕
  setupNotificationButton() {
    // 檢查是否已有通知按鈕
    if (document.getElementById('notificationBtn')) return;

    const button = document.createElement('button');
    button.id = 'notificationBtn';
    button.className = 'notification-btn';
    button.innerHTML = `
      <span class="notification-icon">🔔</span>
      <span class="notification-badge" id="notificationBadge" style="display: none;">0</span>
    `;
    button.innerHTML += `
      <style>
        .notification-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          background: var(--grad-primary, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .notification-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 0.8rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
    `;

    button.addEventListener('click', () => {
      this.showNotificationCenter();
    });

    document.body.appendChild(button);
  }

  // 顯示通知中心
  showNotificationCenter() {
    // 創建通知中心模態框
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
      <div class="notification-modal-content">
        <div class="notification-modal-header">
          <h2>🔔 通知中心</h2>
          <button class="notification-modal-close" onclick="this.closest('.notification-modal').remove()">×</button>
        </div>
        <div class="notification-modal-body">
          <div class="notification-actions">
            <button onclick="notificationSystem.markAllAsRead()" class="btn-secondary">全部標為已讀</button>
            <button onclick="notificationSystem.clearAll()" class="btn-secondary">清除全部</button>
            <button onclick="notificationSystem.requestPermission()" class="btn-primary">開啟推播</button>
          </div>
          <div class="notification-list" id="notificationList">
            ${this.renderNotificationList()}
          </div>
        </div>
      </div>
      <style>
        .notification-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(5px);
        }
        
        .notification-modal-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .notification-modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .notification-modal-header h2 {
          margin: 0;
          color: #1f2937;
        }
        
        .notification-modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .notification-modal-close:hover {
          background: rgba(0, 0, 0, 0.1);
          color: #374151;
        }
        
        .notification-modal-body {
          padding: 1.5rem;
          max-height: 60vh;
          overflow-y: auto;
        }
        
        .notification-actions {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        
        .btn-primary, .btn-secondary {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #667eea;
          border: 2px solid #667eea;
        }
        
        .btn-primary:hover, .btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .notification-item-modal {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 0.5rem;
          border-left: 4px solid #667eea;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .notification-item-modal:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .notification-item-modal.unread {
          border-left-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }
        
        .notification-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        
        .notification-item-title {
          font-weight: bold;
          color: #1f2937;
        }
        
        .notification-item-time {
          color: #6b7280;
          font-size: 0.8rem;
        }
        
        .notification-item-message {
          color: #4b5563;
          line-height: 1.4;
        }
        
        .dark .notification-modal-content {
          background: rgba(30, 30, 30, 0.95);
        }
        
        .dark .notification-modal-header h2 {
          color: #f9fafb;
        }
        
        .dark .notification-item-modal {
          background: rgba(55, 65, 81, 0.5);
          border-left-color: #818cf8;
        }
        
        .dark .notification-item-modal.unread {
          border-left-color: #f87171;
          background: rgba(248, 113, 113, 0.1);
        }
        
        .dark .notification-item-title {
          color: #f9fafb;
        }
        
        .dark .notification-item-message {
          color: #d1d5db;
        }
      </style>
    `;

    document.body.appendChild(modal);

    // 點擊背景關閉
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // 渲染通知列表
  renderNotificationList() {
    if (this.notifications.length === 0) {
      return '<div class="text-center text-gray-500 py-8">暫無通知</div>';
    }

    return this.notifications.map(notification => `
      <div class="notification-item-modal ${!notification.read ? 'unread' : ''}" 
           onclick="notificationSystem.markAsRead(${notification.id})">
        <div class="notification-item-header">
          <div class="notification-item-title">${notification.title}</div>
          <div class="notification-item-time">${this.formatTime(notification.timestamp)}</div>
        </div>
        <div class="notification-item-message">${notification.message}</div>
      </div>
    `).join('');
  }

  // 標記為已讀
  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.updateNotificationBadge();
    }
  }

  // 全部標為已讀
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.saveNotifications();
    this.updateNotificationBadge();
    this.showMessage('全部通知已標為已讀', 'success');
  }

  // 清除全部通知
  clearAll() {
    if (confirm('確定要清除所有通知嗎？')) {
      this.notifications = [];
      this.saveNotifications();
      this.updateNotificationBadge();
      this.showMessage('所有通知已清除', 'success');
    }
  }

  // 更新通知徽章
  updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;

    const unreadCount = this.notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
      badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  // 設置Service Worker
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker 註冊成功:', registration);
        })
        .catch(error => {
          console.log('Service Worker 註冊失敗:', error);
        });
    }
  }

  // 定期檢查通知
  startPeriodicChecks() {
    // 檢查垃圾車通知
    setInterval(() => {
      this.checkGarbageNotification();
    }, 60000); // 每分鐘檢查一次

    // 檢查天氣通知
    setInterval(() => {
      this.checkWeatherNotification();
    }, 300000); // 每5分鐘檢查一次

    // 檢查利率通知
    setInterval(() => {
      this.checkRateNotification();
    }, 600000); // 每10分鐘檢查一次
  }

  // 檢查垃圾車通知
  checkGarbageNotification() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    // 假設週一、三、五是垃圾車日，晚上8點提醒
    if ([1, 3, 5].includes(day) && hour === 20 && now.getMinutes() === 0) {
      this.addNotification({
        title: '🗑️ 垃圾車提醒',
        message: '今晚8點有垃圾車，請記得倒垃圾！',
        icon: '🗑️',
        type: 'reminder'
      });

      this.sendNotification('🗑️ 垃圾車提醒', {
        body: '今晚8點有垃圾車，請記得倒垃圾！',
        tag: 'garbage',
        requireInteraction: true
      });
    }
  }

  // 檢查天氣通知
  checkWeatherNotification() {
    // 這裡可以整合真實的天氣API
    const hour = new Date().getHours();
    
    // 每天早上8點發送天氣提醒
    if (hour === 8 && new Date().getMinutes() === 0) {
      this.addNotification({
        title: '🌤️ 今日天氣',
        message: '今天多雲時晴，氣溫24-28°C，適合外出看房！',
        icon: '🌤️',
        type: 'weather'
      });

      this.sendNotification('🌤️ 今日天氣', {
        body: '今天多雲時晴，氣溫24-28°C，適合外出看房！',
        tag: 'weather'
      });
    }
  }

  // 檢查利率通知
  checkRateNotification() {
    // 這裡可以整合真實的利率API
    const hour = new Date().getHours();
    
    // 每週一早上9點發送利率資訊
    if (new Date().getDay() === 1 && hour === 9 && new Date().getMinutes() === 0) {
      this.addNotification({
        title: '📈 利率資訊',
        message: '本週房貸利率維持在2.85%，投資環境良好！',
        icon: '📈',
        type: 'rate'
      });

      this.sendNotification('📈 利率資訊', {
        body: '本週房貸利率維持在2.85%，投資環境良好！',
        tag: 'rate'
      });
    }
  }

  // 格式化時間
  formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    if (diff < 60000) return '剛剛';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分鐘前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小時前`;
    return time.toLocaleDateString();
  }

  // 顯示消息
  showMessage(message, type = 'info') {
    // 創建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    messageEl.innerHTML += `
      <style>
        .message {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10001;
          padding: 1rem 2rem;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          animation: slideDown 0.3s ease;
        }
        
        .message-success { background: #10b981; }
        .message-error { background: #ef4444; }
        .message-warning { background: #f59e0b; }
        .message-info { background: #3b82f6; }
        
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(messageEl);
    
    // 自動移除
    setTimeout(() => {
      messageEl.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }

  // 保存通知到本地存儲
  saveNotifications() {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('保存通知失敗:', error);
    }
  }

  // 從本地存儲載入通知
  loadNotifications() {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        this.notifications = JSON.parse(saved);
        this.updateNotificationBadge();
      }
    } catch (error) {
      console.error('載入通知失敗:', error);
      this.notifications = [];
    }
  }

  // 保存權限狀態
  savePermissionState(granted) {
    try {
      localStorage.setItem('notificationPermission', granted.toString());
    } catch (error) {
      console.error('保存權限狀態失敗:', error);
    }
  }

  // 載入權限狀態
  loadPermissionState() {
    try {
      const saved = localStorage.getItem('notificationPermission');
      return saved === 'true';
    } catch (error) {
      console.error('載入權限狀態失敗:', error);
      return false;
    }
  }

  // 測試通知
  testNotification() {
    this.addNotification({
      title: '🧪 測試通知',
      message: '這是一個測試通知，確認通知系統運作正常！',
      icon: '🧪',
      type: 'test'
    });

    this.sendNotification('🧪 測試通知', {
      body: '這是一個測試通知，確認通知系統運作正常！',
      tag: 'test'
    });
  }
}

// 創建全局實例
window.notificationSystem = new NotificationSystem();

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
  // 添加測試按鈕（開發用）
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const testBtn = document.createElement('button');
    testBtn.textContent = '測試通知';
    testBtn.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 20px;
      z-index: 1000;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.8rem;
    `;
    testBtn.onclick = () => notificationSystem.testNotification();
    document.body.appendChild(testBtn);
  }
});
