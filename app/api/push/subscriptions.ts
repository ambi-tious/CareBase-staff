// プッシュ通知サブスクリプションの管理
// メモリ内でサブスクリプションを保存（開発用）
// 実際のアプリケーションではデータベースを使用

export interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
  timestamp: string;
}

export const subscriptions: PushSubscription[] = [];
