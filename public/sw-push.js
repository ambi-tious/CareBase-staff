// プッシュ通知専用Service Worker

// プッシュ通知受信時の処理
self.addEventListener('push', function (event) {
  console.log('Push event received:', event);

  let options = {
    body: '新しい通知があります',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    tag: 'carebase-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: '表示',
        icon: '/icons/icon-96x96.png',
      },
      {
        action: 'close',
        title: '閉じる',
      },
    ],
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('Push payload:', payload);

      options = {
        ...options,
        body: payload.body || options.body,
        icon: payload.icon || options.icon,
        badge: payload.badge || options.badge,
        tag: payload.tag || options.tag,
        data: {
          url: payload.url || '/notifications',
          timestamp: payload.timestamp || Date.now(),
        },
        actions: payload.actions || options.actions,
      };
    } catch (error) {
      console.error('Failed to parse push payload:', error);
    }
  }

  const title = event.data ? event.data.json().title || 'CareBase' : 'CareBase';

  event.waitUntil(self.registration.showNotification(title, options));
});

// 通知クリック時の処理
self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received:', event);

  event.notification.close();

  const action = event.action;
  const url = event.notification.data?.url || '/notifications';

  if (action === 'close') {
    // 閉じるアクションの場合は何もしない
    return;
  }

  // 表示アクション（デフォルト）の場合はアプリを開く
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // 既存のウィンドウがあるかチェック
      for (let client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // 既存のウィンドウにフォーカス
          return client.focus().then(() => {
            // URLが異なる場合はナビゲート
            if (client.url !== self.location.origin + url) {
              return client.navigate(url);
            }
          });
        }
      }
      // 新しいウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Service Worker のバックグラウンド同期
self.addEventListener('backgroundsync', function (event) {
  if (event.tag === 'carebase-sync') {
    console.log('Background sync:', event);
    event.waitUntil(
      // バックグラウンドでデータ同期の処理
      Promise.resolve()
    );
  }
});

// インストール時の処理
self.addEventListener('install', function (event) {
  console.log('Push Service Worker installed');
  self.skipWaiting();
});

// アクティベート時の処理
self.addEventListener('activate', function (event) {
  console.log('Push Service Worker activated');
  event.waitUntil(self.clients.claim());
});
