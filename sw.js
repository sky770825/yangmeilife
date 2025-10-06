const CACHE_NAME = 'realtor-app-v1.0.0';
const urlsToCache = [
  '/',
  '/主頁.html',
  '/loan-calc.html',
  '/decor-calc.html',
  '/tax-calc.html',
  '/rate.html',
  '/weather.html',
  '/garbage.html',
  '/receipt.html',
  '/bus.html',
  '/fortune.html',
  '/mbti.html',
  '/daily-quote.html',
  '/showcase.html',
  '/hot.html',
  '/grant-housing.html',
  '/grant-renovation.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css'
];

// 安裝Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker 安裝中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('緩存已打開');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('緩存失敗:', error);
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker 激活中...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('刪除舊緩存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截網路請求
self.addEventListener('fetch', event => {
  // 只處理GET請求
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果緩存中有，直接返回
        if (response) {
          return response;
        }

        // 否則從網路獲取
        return fetch(event.request).then(response => {
          // 檢查是否為有效響應
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆響應
          const responseToCache = response.clone();

          // 將響應添加到緩存
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(error => {
          console.log('網路請求失敗:', error);
          // 如果是HTML頁面請求失敗，返回離線頁面
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/主頁.html');
          }
        });
      })
  );
});

// 推送通知
self.addEventListener('push', event => {
  console.log('收到推送通知:', event);
  
  const options = {
    body: event.data ? event.data.text() : '您有新的提醒',
    icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%236366f1;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%238b5cf6;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="192" height="192" rx="32" fill="url(%23grad1)"/%3E%3Ctext x="96" y="110" font-family="Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="white"%3E🏠%3C/text%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"%3E%3Crect width="96" height="96" rx="16" fill="%23ef4444"/%3E%3Ctext x="48" y="60" font-size="40" text-anchor="middle" fill="white"%3E🔔%3C/text%3E%3C/svg%3E',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看詳情',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"%3E%3Crect width="48" height="48" rx="8" fill="%2310b981"/%3E%3Ctext x="24" y="30" font-size="20" text-anchor="middle" fill="white"%3E👀%3C/text%3E%3C/svg%3E'
      },
      {
        action: 'close',
        title: '關閉',
        icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"%3E%3Crect width="48" height="48" rx="8" fill="%236b7280"/%3E%3Ctext x="24" y="30" font-size="20" text-anchor="middle" fill="white"%3E❌%3C/text%3E%3C/svg%3E'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('濬瑒房產生活平台', options)
  );
});

// 通知點擊處理
self.addEventListener('notificationclick', event => {
  console.log('通知被點擊:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // 打開相關頁面
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // 關閉通知
    console.log('通知已關閉');
  } else {
    // 默認行為：打開主頁
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// 背景同步
self.addEventListener('sync', event => {
  console.log('背景同步:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // 執行背景同步任務
  return new Promise((resolve) => {
    console.log('執行背景同步...');
    // 這裡可以添加同步邏輯，比如同步用戶數據
    setTimeout(() => {
      console.log('背景同步完成');
      resolve();
    }, 1000);
  });
}
