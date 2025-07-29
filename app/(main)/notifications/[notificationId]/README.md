# 通知詳細画面設計書

- 画面名: `通知詳細`
- パス: `/notifications/[notificationId]`
- URL: https://carebase-staff.vercel.app/notifications/[notificationId]

## 概要

通知詳細表示機能の設計書です。
お知らせ詳細表示、遷移URL指定機能、詳細画面表示要件に関する詳細な設計仕様を定義します。
通知の内容を詳細に表示し、必要に応じて外部URLへの遷移機能や通知の既読状態更新機能を提供します。

Issue: [#043 [設計] #043 その他｜通知詳細](https://github.com/ambi-tious/CareBase-staff/issues/57)

## 全体レイアウト

### 画面構成

通知詳細表示のメイン画面として以下の要素で構成：

- ページヘッダー（画面タイトル、戻るボタン、通知一覧へのリンク）
- 通知詳細表示エリア（タイトル、内容、送信者、送信日時）
- 通知ステータス表示（既読・未読状態）
- 遷移URL機能（外部リンクボタン）
- アクション機能（既読にする、重要度変更）
- 関連情報表示（カテゴリ、対象利用者など）

### 画面項目

| 項目名             | コンポーネント    | 必須 | 表示条件         | 初期値         | 備考                                |
| ------------------ | ----------------- | ---- | ---------------- | -------------- | ----------------------------------- |
| 戻るボタン         | Button            | -    | 常時             | 戻る           | ArrowLeft アイコン                  |
| 画面タイトル       | Heading           | -    | 常時             | 通知詳細       | Bell アイコン付き                   |
| 通知一覧リンク     | Button            | -    | 常時             | 通知一覧       | List アイコン付き                   |
| 通知タイトル       | Heading           | ◯    | 常時             | -              | 通知のタイトル表示                  |
| 通知内容           | Text              | ◯    | 常時             | -              | 通知の詳細内容表示                  |
| 送信者情報         | UserBadge         | -    | 送信者情報あり時 | -              | 送信者名・役職表示                  |
| 送信日時           | DateTime          | ◯    | 常時             | -              | 送信日時の表示                      |
| ステータスバッジ   | StatusBadge       | ◯    | 常時             | 未読/既読      | 未読は赤色、既読は緑色              |
| 重要度バッジ       | PriorityBadge     | -    | 重要度設定時     | -              | 高・中・低の重要度表示              |
| カテゴリバッジ     | CategoryBadge     | -    | カテゴリ設定時   | -              | 通知カテゴリの表示                  |
| 対象利用者表示     | ResidentCard      | -    | 利用者指定時     | -              | 関連利用者の表示                    |
| 遷移URLボタン      | Button            | -    | 遷移URL設定時    | -              | ExternalLink アイコン付き外部リンク |
| 既読ボタン         | Button            | -    | 未読時           | 既読にする     | Check アイコン付き                  |
| 重要度変更ボタン   | Button            | -    | 常時             | 重要度変更     | Flag アイコン付き                   |
| 通知削除ボタン     | Button            | -    | 削除権限あり時   | 削除           | Trash アイコン付き、危険色          |
| 添付ファイル表示   | FileList          | -    | 添付ファイル時   | -              | ファイル名・サイズ表示              |
| 更新履歴           | Timeline          | -    | 更新履歴あり時   | -              | 通知の更新履歴表示                  |

## 機能仕様

### アクション

| 項目名           | 処理内容                           | 対象API                        | 遷移先画面                     |
| ---------------- | ---------------------------------- | ------------------------------ | ------------------------------ |
| 戻る             | 前の画面に戻る                     | -                              | 前画面                         |
| 通知一覧         | 通知一覧画面への遷移               | -                              | 通知一覧画面（`/notifications`）|
| 既読にする       | 通知を既読状態に更新               | `PUT /api/v1/notifications/{id}/read` | 同一画面（状態更新）        |
| 重要度変更       | 通知の重要度を変更                 | `PUT /api/v1/notifications/{id}/priority` | 同一画面（状態更新）    |
| 遷移URL実行      | 指定されたURLに新しいタブで遷移    | -                              | 外部URL（新規タブ）            |
| 通知削除         | 通知を削除                         | `DELETE /api/v1/notifications/{id}` | 通知一覧画面                |
| 添付ファイル表示 | 添付ファイルをダウンロード・表示   | `GET /api/v1/files/{fileId}`   | ファイルダウンロード           |

### 入力チェック

| 項目名     | イベント       | チェック内容           | エラーメッセージ           |
| ---------- | -------------- | ---------------------- | -------------------------- |
| 通知削除   | 削除実行前     | 削除権限の確認         | 削除権限がありません       |
| 遷移URL    | URL遷移前      | URLの有効性確認        | 無効なURLです              |
| 重要度変更 | 重要度変更前   | 変更権限の確認         | 重要度を変更する権限がありません |

### バリデーション仕様

#### 通知データ検証
- 通知IDの存在確認
- 通知へのアクセス権限確認
- 削除された通知の場合はエラー表示

#### 遷移URL検証  
- URL形式の妥当性チェック（http/https プロトコル）
- 危険なURLのブロック（フィッシングサイト等）
- 内部URL（同一ドメイン）と外部URLの区別

#### 権限チェック
- 通知の閲覧権限確認
- 既読状態変更権限確認  
- 削除権限確認（管理者・通知作成者のみ）

## UI/UX仕様

### レスポンシブデザイン

#### モバイル（375px〜）
- 単一カラムレイアウト
- タッチ操作に適したボタンサイズ（最小44px）
- スワイプで戻る機能対応
- 縦向き表示最適化

#### タブレット（1024px〜）
- 2カラムレイアウト（詳細 + サイドバー）
- 関連情報をサイドバーに配置
- 横向き操作対応

#### デスクトップ（1280px〜）
- 3カラムレイアウト対応
- キーボードショートカット対応
- ホバー効果によるインタラクション強化

### カラーテーマ

#### ステータス色
- **未読**: `--error: #ef4444`（赤色）
- **既読**: `--success: #10b981`（緑色）
- **重要**: `--warning: #f59e0b`（オレンジ色）

#### 重要度色
- **高**: `--priority-high: #ef4444`（赤色）
- **中**: `--priority-medium: #f59e0b`（オレンジ色）
- **低**: `--priority-low: #3b82f6`（青色）

#### アクション色
- **遷移URL**: `--carebase-blue: #3b82f6`（ブランドカラー）
- **削除**: `--error: #ef4444`（危険色）
- **既読**: `--success: #10b981`（成功色）

### アニメーション

#### トランジション効果
- ページ遷移: `300ms ease-in-out`
- ステータス変更: `150ms ease-in-out`
- ホバー効果: `200ms ease-in-out`

#### マイクロインタラクション
- ボタンクリック時のスケール効果
- 既読時のフェードアウト効果
- ローディング時のスピナー表示

### アクセシビリティ

#### キーボードナビゲーション
- Tab キーでの順次フォーカス移動
- Enter キーでのアクション実行
- Escape キーでのモーダル閉じる

#### スクリーンリーダー対応
- 適切な見出し構造（h1, h2, h3）
- aria-label による要素の説明
- role 属性による要素の役割明示

#### コントラスト比
- WCAG 2.1 AA レベル準拠（4.5:1以上）
- 色だけに依存しない情報伝達
- フォーカスインジケーターの明確な表示

## 技術仕様

### 使用コンポーネント

#### Atoms（1_atoms）
- `Button`: 各種アクションボタン
- `Badge`: ステータス・重要度・カテゴリ表示
- `StatusBadge`: 既読・未読状態表示
- `PriorityBadge`: 重要度表示
- `CategoryBadge`: カテゴリ表示

#### Molecules（2_molecules）
- `UserCard`: 送信者情報表示
- `ResidentCard`: 対象利用者表示
- `FileList`: 添付ファイル一覧
- `Timeline`: 更新履歴表示

#### Organisms（3_organisms）
- `NotificationDetailHeader`: 通知詳細ヘッダー
- `NotificationContent`: 通知内容表示
- `NotificationActions`: アクションボタン群
- `NotificationSidebar`: 関連情報表示

### データ型定義

```typescript
// 通知詳細型
interface Notification {
  id: string;
  title: string;
  content: string;
  htmlContent?: string;
  category: NotificationCategory;
  priority: Priority;
  status: NotificationStatus;
  transitionUrl?: string;
  senderId?: string;
  senderInfo?: User;
  targetResidents?: Resident[];
  attachments?: AttachmentFile[];
  createdAt: DateTime;
  updatedAt: DateTime;
  readAt?: DateTime;
  readBy?: string[];
  updateHistory?: NotificationHistory[];
}

// 通知カテゴリ型
type NotificationCategory = 
  | 'information'    // お知らせ
  | 'urgent'         // 緊急連絡
  | 'schedule'       // スケジュール
  | 'system'         // システム通知
  | 'care'           // ケア関連
  | 'maintenance';   // メンテナンス

// 通知ステータス型
type NotificationStatus = 'unread' | 'read' | 'archived';

// 重要度型
type Priority = 'high' | 'medium' | 'low';

// 添付ファイル型
interface AttachmentFile {
  id: string;
  filename: string;
  filesize: number;
  mimetype: string;
  url: string;
  thumbnailUrl?: string;
}

// 通知履歴型
interface NotificationHistory {
  id: string;
  action: 'created' | 'updated' | 'read' | 'priority_changed';
  performedBy: string;
  performedAt: DateTime;
  details?: Record<string, any>;
}

// API レスポンス型
interface NotificationDetailResponse {
  success: boolean;
  data: Notification;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canChangePriority: boolean;
  };
}

// 通知更新リクエスト型
interface UpdateNotificationRequest {
  status?: NotificationStatus;
  priority?: Priority;
  readAt?: DateTime;
}
```

### API仕様

#### 通知詳細取得
```
GET /api/v1/notifications/{notificationId}

Response:
{
  "success": true,
  "data": {
    "id": "notification-123",
    "title": "定期メンテナンスのお知らせ",
    "content": "本日深夜にシステムメンテナンスを実施します...",
    "category": "system",
    "priority": "medium",
    "status": "unread",
    "transitionUrl": "https://example.com/maintenance",
    "createdAt": "2025-01-25T10:00:00Z",
    "readAt": null
  },
  "permissions": {
    "canEdit": false,
    "canDelete": false,
    "canChangePriority": true
  }
}
```

#### 通知既読更新
```
PUT /api/v1/notifications/{notificationId}/read

Request Body:
{
  "readAt": "2025-01-25T15:30:00Z"
}

Response:
{
  "success": true,
  "data": {
    "id": "notification-123",
    "status": "read",
    "readAt": "2025-01-25T15:30:00Z"
  }
}
```

#### 通知重要度変更
```
PUT /api/v1/notifications/{notificationId}/priority

Request Body:
{
  "priority": "high"
}

Response:
{
  "success": true,
  "data": {
    "id": "notification-123",
    "priority": "high",
    "updatedAt": "2025-01-25T15:35:00Z"
  }
}
```

#### 通知削除
```
DELETE /api/v1/notifications/{notificationId}

Response:
{
  "success": true,
  "message": "通知が削除されました"
}
```

### 状態管理

#### カスタムフック
```typescript
// 通知詳細管理フック
function useNotificationDetail(notificationId: string) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<NotificationPermissions | null>(null);

  // 通知詳細取得
  const fetchNotification = useCallback(async () => {
    // API実装
  }, [notificationId]);

  // 既読状態更新
  const markAsRead = useCallback(async () => {
    // API実装
  }, [notificationId]);

  // 重要度変更
  const changePriority = useCallback(async (priority: Priority) => {
    // API実装
  }, [notificationId]);

  // 通知削除
  const deleteNotification = useCallback(async () => {
    // API実装
  }, [notificationId]);

  return {
    notification,
    loading,
    error,
    permissions,
    markAsRead,
    changePriority,
    deleteNotification,
    refetch: fetchNotification
  };
}
```

### エラーハンドリング

#### エラー種別
- **404 Not Found**: 通知が存在しない
- **403 Forbidden**: アクセス権限がない
- **400 Bad Request**: 無効なリクエスト
- **500 Internal Server Error**: サーバーエラー

#### エラー表示
- エラー状態に応じた適切なメッセージ表示
- 再試行ボタンの提供
- エラー発生時の代替アクション提示

### パフォーマンス最適化

#### データ取得最適化
- 通知詳細データの適切なキャッシュ
- 不要なAPI呼び出しの削減
- 添付ファイルの遅延読み込み

#### レンダリング最適化
- React.memo による不要な再レンダリング防止
- useCallback, useMemo の適切な使用
- 大きなコンテンツの仮想化対応

## 参考資料

### 関連画面
- [通知一覧画面](/notifications) - 通知の一覧表示
- [申し送り詳細画面](/handovers/[handoverId]) - 類似の詳細画面実装
- [利用者詳細画面](/residents/[residentId]) - 詳細画面のレイアウト参考

### 設計ガイドライン
- [標準設計書](../../../docs/standard-design-document.md) - 共通設計指針
- [画面一覧](../../../docs/screen-list.md) - 全画面概要
- [コンポーネント設計](/components) - 使用コンポーネント

### 外部仕様
- [shadcn/ui](https://ui.shadcn.com/) - UIコンポーネントライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - アクセシビリティガイドライン

---

**補足事項**

### 遷移URL機能について
お知らせに遷移URLが指定されている場合、以下の仕様で動作します：

1. **URL表示**: 遷移URLボタンを詳細画面内に表示
2. **外部リンク**: 新しいタブ・ウィンドウで外部サイトを開く
3. **内部リンク**: 同一タブでアプリ内ページに遷移
4. **セキュリティ**: 危険なURLはブロック、警告表示

### 詳細画面の必要性について
通知に遷移URLが設定されている場合でも、詳細画面は以下の理由で必要です：

1. **コンテキスト提供**: 遷移前に通知の詳細内容を確認
2. **履歴管理**: 既読状態や確認履歴の記録
3. **メタ情報**: 送信者、送信日時、重要度等の表示
4. **権限管理**: ユーザーの権限に応じたアクション提供
5. **添付ファイル**: 遷移URL以外の補足資料の表示

### ユーザビリティ考慮事項
- 遷移URLがある場合も、詳細内容の確認を促すUI設計
- 外部サイト遷移時の明確な案内とセキュリティ警告
- モバイル端末での操作性を重視したタッチインターフェース
- 高齢者にも分かりやすいシンプルなレイアウトとナビゲーション

---

_最終更新: 2025年1月25日_