// プッシュ通知専用のService Worker機能

// プッシュ通知を受信した時の処理
self.addEventListener('push', function (event) {
  console.log('プッシュ通知を受信しました:', event);

  if (!event.data) {
    console.log('プッシュ通知にデータがありません');
    return;
  }

  try {
    const data = event.data.json();
    console.log('プッシュ通知データ:', data);

    const options = {
      body: data.body || '新しい連絡・予定が作成されました',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/icon-96x96.png',
      image: data.image,
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/contact-schedule',
        timestamp: data.timestamp || Date.now(),
      },
      actions: data.actions || [
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
      requireInteraction: true, // ユーザーが操作するまで表示を維持
      silent: false,
    };

    event.waitUntil(self.registration.showNotification(data.title || '新しい連絡・予定', options));
  } catch (error) {
    console.error('プッシュ通知の処理でエラーが発生しました:', error);

    // フォールバック通知を表示
    event.waitUntil(
      self.registration.showNotification('新しい連絡・予定', {
        body: '新しい連絡・予定が作成されました',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        data: {
          url: '/contact-schedule',
          timestamp: Date.now(),
        },
      })
    );
  }
});

// 通知をクリックした時の処理
self.addEventListener('notificationclick', function (event) {
  console.log('通知がクリックされました:', event);

  event.notification.close();

  // アクションボタンの処理
  if (event.action === 'close') {
    return;
  }

  const url = event.notification.data?.url || '/contact-schedule';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function (clientList) {
      // 既に開いているウィンドウがあるかチェック
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        const clientUrl = new URL(client.url);
        const targetUrl = new URL(url, self.location.origin);

        if (clientUrl.origin === targetUrl.origin && 'focus' in client) {
          // 既存のウィンドウにフォーカスして指定のURLに移動
          client.focus();
          return client.navigate(targetUrl.href);
        }
      }

      // 新しいウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// プッシュサブスクリプションが変更された時の処理
self.addEventListener('pushsubscriptionchange', function (event) {
  console.log('プッシュサブスクリプションが変更されました:', event);

  event.waitUntil(
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: self.location.origin.includes('localhost')
          ? 'BJFybK3wc0AIrs62V3tnWM-JNo2vUoaFQbfS6ut5hfg6DNrI-JJE6pqGWkBs8jFOJOiDtXNSIJkr4kXWXsNaD0A' // 開発用
          : 'BJFybK3wc0AIrs62V3tnWM-JNo2vUoaFQbfS6ut5hfg6DNrI-JJE6pqGWkBs8jFOJOiDtXNSIJkr4kXWXsNaD0A', // 本番用（環境変数から取得することを推奨）
      })
      .then(function (newSubscription) {
        // 新しいサブスクリプションをサーバーに送信
        return fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSubscription),
        });
      })
      .catch(function (error) {
        console.error('プッシュサブスクリプションの再登録に失敗しました:', error);
      })
  );
});
