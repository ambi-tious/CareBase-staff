# ログイン画面設計書

更新日時: 2025年7月11日  
作成者: Devin AI  
ステータス: 設計完了  
Issue: [#141 （認証）｜ログイン](https://github.com/ambi-tious/CareBase-staff/issues/141)

## 概要

CareBase-staffアプリケーションのログイン画面設計書です。施設IDとパスワードによる認証機能を提供し、認証成功時は職員選択画面へ遷移します。

## 全体レイアウト

### 画面構成

```
┌─────────────────────────────────────┐
│                                     │
│              CareBase               │
│                Logo                 │
│                                     │
│  ┌─────────────────────────────┐    │
│  │         ログイン            │    │
│  │                             │    │
│  │  施設ID                     │    │
│  │  [________________]         │    │
│  │                             │    │
│  │  パスワード                 │    │
│  │  [________________]         │    │
│  │                             │    │
│  │  [エラーメッセージ表示領域] │    │
│  │                             │    │
│  │  [     ログイン     ]       │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│     © 2025 CareBase. All rights     │
│           reserved.                 │
│                                     │
└─────────────────────────────────────┘
```

### 画面項目

| 項目名 | コンポーネント | 必須 | 最小桁数 | 最大桁数 | フォーマット | 初期値 | 備考 |
|--------|----------------|------|----------|----------|--------------|--------|------|
| ロゴ | Logo | - | - | - | - | - | CareBaseロゴを表示 |
| ページタイトル | CardTitle | - | - | - | - | ログイン | カード内ヘッダー |
| 施設ID | InputField | ◯ | 1 | 50 | 英数字 | - | テキスト入力フィールド |
| パスワード | InputField | ◯ | 1 | 100 | - | - | パスワード入力フィールド |
| エラーメッセージ | ErrorAlert | - | - | - | - | - | 認証エラー時に表示 |
| 成功メッセージ | ErrorAlert | - | - | - | - | - | 認証成功時に表示 |
| ログインボタン | LoginButton | - | - | - | - | ログイン | 認証実行ボタン |
| フッター | テキスト | - | - | - | - | © 2025 CareBase. All rights reserved. | 著作権表示 |

## コンポーネント構成

### 使用コンポーネント

#### Atoms（1_atoms）
- `Logo` - CareBaseロゴ表示
- `InputField` - 入力フィールド（施設ID、パスワード）
- `LoginButton` - ログインボタン

#### Molecules（2_molecules）
- `LoginForm` - ログインフォーム全体
- `ErrorAlert` - エラー・成功メッセージ表示

#### UI Components
- `Card`, `CardContent`, `CardHeader`, `CardTitle` - カードレイアウト

### レイアウト仕様

- **背景色**: `bg-carebase-bg`
- **カード最大幅**: `max-w-md` (28rem)
- **レスポンシブ**: モバイル・タブレット・PC対応
- **中央配置**: `flex items-center justify-center`
- **パディング**: `p-4`

## 機能仕様

### アクション

| 項目名 | 処理内容 | 対象API | 遷移先画面 |
|--------|----------|---------|------------|
| ログインボタン | 施設IDとパスワードで認証を実行 | `/api/v1/auth/staff/login` | 職員選択画面 (`/staff-selection`) |
| フォーム送信 | Enterキー押下時の認証実行 | 同上 | 同上 |

### 入力チェック

| 項目名 | イベント | チェック内容 | エラーメッセージ |
|--------|----------|--------------|------------------|
| 施設ID | input/blur | 必須項目チェック | 施設IDを入力してください |
| 施設ID | input/blur | 最大桁数チェック | 施設IDは50文字以下で入力してください |
| パスワード | input/blur | 必須項目チェック | パスワードを入力してください |
| パスワード | input/blur | 最大桁数チェック | パスワードは100文字以下で入力してください |
| フォーム全体 | submit | 認証失敗チェック | 施設IDまたはパスワードが正しくありません |

### バリデーション仕様

#### リアルタイムバリデーション
- 入力中にフィールドレベルでのバリデーションを実行
- エラー状態の場合、フィールドを赤色でハイライト
- エラーメッセージをフィールド下部に表示

#### フォームバリデーション
- 全フィールドが有効な場合のみログインボタンを有効化
- 無効な状態では `disabled` 属性を設定

## 状態管理

### フォーム状態

```typescript
interface LoginFormState {
  facilityId: string;      // 施設ID
  password: string;        // パスワード
  isLoading: boolean;      // ローディング状態
  error: string | null;    // エラーメッセージ
  success: boolean;        // 成功状態
}
```

### フィールドエラー状態

```typescript
interface FieldErrors {
  facilityId?: string;     // 施設IDエラー
  password?: string;       // パスワードエラー
}
```

## API連携

### 認証API

**エンドポイント**: `POST /api/v1/auth/staff/login`

**リクエスト**:
```typescript
interface AuthRequest {
  facilityId: string;
  password: string;
}
```

**レスポンス**:
```typescript
interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}
```

### 認証フロー

1. ユーザーが施設IDとパスワードを入力
2. フォームバリデーションを実行
3. 認証APIを呼び出し
4. 成功時：トークンを保存し職員選択画面へ遷移
5. 失敗時：エラーメッセージを表示

## UI/UX仕様

### デザインシステム

- **プライマリカラー**: `carebase-blue`
- **テキストカラー**: `carebase-text-primary`
- **背景カラー**: `carebase-bg`
- **フォント**: システムフォント（日本語対応）

### アクセシビリティ

- **キーボードナビゲーション**: Tab/Shift+Tabでフォーカス移動
- **スクリーンリーダー**: aria-labelとlabel要素の適切な設定
- **フォーカス表示**: フォーカス時の視覚的フィードバック
- **エラー通知**: エラー発生時の適切な通知

### レスポンシブ対応

- **モバイル**: 320px以上
- **タブレット**: 768px以上  
- **デスクトップ**: 1024px以上

## 技術実装

### ファイル構成

```
app/(auth)/login/
├── page.tsx              # ログインページコンポーネント
└── README.md            # 本設計書

components/
├── 1_atoms/auth/
│   ├── InputField.tsx    # 入力フィールド
│   └── LoginButton.tsx   # ログインボタン
├── 2_molecules/auth/
│   ├── login-form.tsx    # ログインフォーム
│   └── ErrorAlert.tsx    # エラーアラート
└── ui/                   # shadcn/ui コンポーネント

hooks/
├── useAuth.ts           # 認証状態管理
└── useLoginForm.ts      # フォーム状態管理

types/
└── auth.ts              # 認証関連型定義
```

### 主要Hook

#### useLoginForm
- フォーム状態管理
- バリデーション処理
- 送信処理

#### useAuth  
- 認証状態管理
- トークン管理
- ローカルストレージ連携

## テスト仕様

### 単体テスト
- コンポーネントレンダリングテスト
- フォームバリデーションテスト
- API呼び出しテスト

### 統合テスト
- ログインフロー全体のテスト
- エラーハンドリングテスト
- 画面遷移テスト

## 参考資料

- [FlutterFlow参考画面](https://carebase.flutterflow.app/authLogin)
- [CareBase-api認証エンドポイント](https://github.com/ambi-tious/CareBase-api/issues/3)
- [画面一覧](../../../docs/screen-list.md#認証関連)

## 更新履歴

| 日付 | 更新者 | 更新内容 |
|------|--------|----------|
| 2025-07-11 | Devin AI | 初版作成 |
