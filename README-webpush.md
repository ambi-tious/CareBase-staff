# Web Push通知機能の実装

CareBase-staffアプリケーションに、連絡・予定作成時のプッシュ通知機能を実装しました。

## 実装内容

### 1. バックエンド機能

- **web-push パッケージ**: サーバーサイドのプッシュ通知送信機能
- **API エンドポイント**:
  - `POST /api/push/subscribe`: プッシュ通知購読の登録
  - `POST /api/push/send`: プッシュ通知の送信

### 2. Service Worker

- **プッシュ通知受信**: `public/sw-push.js`でプッシュメッセージを処理
- **通知表示**: 適切なアイコン、アクション、バイブレーション設定
- **クリック処理**: 通知クリック時のナビゲーション
- **購読管理**: 購読変更時の自動再登録

### 3. クライアントサイド機能

- **プッシュ通知フック**: `hooks/usePushNotifications.ts`で通知の許可・購読管理
- **UI コンポーネント**: `components/2_molecules/push-notification-toggle.tsx`で設定切り替え
- **通知設定画面**: 既存の通知設定ページに統合

### 4. 連絡・予定作成時の自動通知

- 連絡・予定が正常に作成された時に自動でプッシュ通知を送信
- 通知タイトルは種別に応じて動的に生成
- 通知本文は連絡・予定の内容を含む

## セットアップ手順

### 1. 環境変数の設定

`.env.local`ファイルに以下を追加してください：

```env
# VAPID Keys for Web Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BJFybK3wc0AIrs62V3tnWM-JNo2vUoaFQbfS6ut5hfg6DNrI-JJE6pqGWkBs8jFOJOiDtXNSIJkr4kXWXsNaD0A
VAPID_PRIVATE_KEY=khaZyrYNeeVU-HIpaQW2IPpOsoxBQkDK3wsg-iS0r2A
VAPID_EMAIL=admin@carebase-staff.vercel.app
```

### 2. プッシュ通知の有効化

1. アプリケーションにアクセス
2. 「通知設定」→「プッシュ通知」をオンにする
3. ブラウザからの通知許可を承認

### 3. 動作確認

1. 連絡・予定作成画面で新しい項目を作成
2. 作成完了後、プッシュ通知が表示されることを確認
3. 通知をクリックして連絡・予定一覧画面に移動することを確認

## 技術仕様

### VAPID認証

- アプリケーション固有のキーペアを使用
- セキュアな通信を保証

### 通知内容

- **タイトル**: 種別に応じた動的生成（「新しい連絡」「新しい予定」「新しい申し送り」）
- **本文**: 連絡・予定のタイトルと内容（50文字まで）
- **アイコン**: アプリケーションアイコン
- **アクション**: 「表示」「閉じる」ボタン

### ブラウザサポート

- Chrome、Firefox、Edge、Safari (iOS 16.4+)
- Service Worker対応ブラウザ

## トラブルシューティング

### プッシュ通知が表示されない場合

1. ブラウザの通知設定を確認
2. Service Workerが正常に登録されているか確認
3. VAPID キーが正しく設定されているか確認
4. 開発者ツールのコンソールでエラーをチェック

### プッシュ通知の許可が拒否された場合

1. ブラウザの設定でサイトの通知を許可
2. ページをリロードして再度許可を要求

## 今後の拡張

- [ ] ユーザー別通知設定
- [ ] 通知の優先度による配信制御
- [ ] 通知履歴の管理
- [ ] オフライン時の通知キューイング
- [ ] データベースとの連携（現在はモック実装）

## 関連ファイル

- `app/api/push/subscribe/route.ts` - 購読管理API
- `app/api/push/send/route.ts` - 通知送信API
- `public/sw-push.js` - Service Worker プッシュ通知機能
- `hooks/usePushNotifications.ts` - プッシュ通知管理フック
- `components/2_molecules/push-notification-toggle.tsx` - 設定切り替えUI
- `app/(main)/contact-schedule/new/page.tsx` - 連絡・予定作成（通知送信含む）
- `scripts/generate-vapid-keys.js` - VAPIDキー生成スクリプト
