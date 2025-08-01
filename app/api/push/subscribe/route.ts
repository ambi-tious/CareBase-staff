import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    // サブスクリプションの検証
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // TODO: データベースにサブスクリプションを保存
    // 現在はログに出力（開発用）
    console.log('新しいプッシュ通知サブスクリプション:', {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      timestamp: new Date().toISOString(),
    });

    // 実際のアプリケーションでは、以下のようにデータベースに保存
    // await db.pushSubscription.create({
    //   data: {
    //     endpoint: subscription.endpoint,
    //     p256dh: subscription.keys.p256dh,
    //     auth: subscription.keys.auth,
    //     userId: getCurrentUserId(), // 現在のユーザーIDを取得
    //     createdAt: new Date(),
    //   },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('プッシュ通知サブスクリプション登録エラー:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
