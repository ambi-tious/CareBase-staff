import { NextRequest, NextResponse } from 'next/server';
import { subscriptions } from '../subscriptions';

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    // サブスクリプションの検証
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // 既存のサブスクリプションをチェック（重複防止）
    const existingIndex = subscriptions.findIndex((sub) => sub.endpoint === subscription.endpoint);

    const subscriptionData = {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      timestamp: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // 既存のサブスクリプションを更新
      subscriptions[existingIndex] = subscriptionData;
      console.log('プッシュ通知サブスクリプション更新:', subscriptionData);
    } else {
      // 新しいサブスクリプションを追加
      subscriptions.push(subscriptionData);
      console.log('新しいプッシュ通知サブスクリプション:', subscriptionData);
    }

    console.log(`現在のサブスクリプション数: ${subscriptions.length}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('プッシュ通知サブスクリプション登録エラー:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// サブスクリプション一覧を取得（デバッグ用）
export async function GET() {
  return NextResponse.json({
    subscriptions: subscriptions.map((sub) => ({
      endpoint: sub.endpoint.substring(0, 50) + '...',
      timestamp: sub.timestamp,
    })),
    count: subscriptions.length,
  });
}
