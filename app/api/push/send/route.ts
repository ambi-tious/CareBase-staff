import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { subscriptions } from '../subscriptions';

// VAPID設定
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@carebase-staff.vercel.app';
const vapidSubject = vapidEmail.startsWith('mailto:') ? vapidEmail : `mailto:${vapidEmail}`;

webpush.setVapidDetails(
  vapidSubject,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    'BANkjz6pnwS2ba20B7CJHa645sdVPq5HEYgQgz3KrvAF593wNulqcEhw5bRwTw9xa8HTzY8eydo3pzh86RYs0zU',
  process.env.VAPID_PRIVATE_KEY || '6xZthipotyNW4MN7Z5HFgNDHwCHMnGDJ0q908J2SMiY'
);

export async function POST(request: NextRequest) {
  try {
    const { title, body, url, icon } = await request.json();

    // プッシュ通知のペイロード
    const payload = JSON.stringify({
      title: title || '新しい連絡・予定',
      body: body || '新しい連絡・予定が作成されました',
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      url: url || '/contact-schedule',
      timestamp: Date.now(),
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
    });

    // メモリ内のサブスクリプションを使用（開発用）

    if (process.env.NODE_ENV === 'development') {
      console.log(`送信対象サブスクリプション数: ${subscriptions.length}`);
    }

    if (subscriptions.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('アクティブなプッシュ通知サブスクリプションが見つかりません');
      }
      return NextResponse.json({
        success: true,
        message: 'No active subscriptions found',
        sent: 0,
      });
    }

    // 全てのサブスクリプションにプッシュ通知を送信
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            payload
          );
          return { success: true, endpoint: subscription.endpoint };
        } catch (error) {
          console.error('プッシュ通知送信エラー:', error);
          // 無効なサブスクリプションの場合は削除
          if (error instanceof Error && error.message.includes('410')) {
            // TODO: 無効なサブスクリプションをデータベースから削除
            // await db.pushSubscription.delete({
            //   where: { id: subscription.id },
            // });
          }
          return { success: false, endpoint: subscription.endpoint, error };
        }
      })
    );

    const successful = results.filter(
      (result) => result.status === 'fulfilled' && result.value.success
    ).length;

    if (process.env.NODE_ENV === 'development') {
      console.log(`プッシュ通知送信完了: ${successful}/${subscriptions.length} 成功`);
    }

    return NextResponse.json({
      success: true,
      sent: successful,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error('プッシュ通知送信エラー:', error);
    return NextResponse.json({ error: 'Failed to send push notification' }, { status: 500 });
  }
}
