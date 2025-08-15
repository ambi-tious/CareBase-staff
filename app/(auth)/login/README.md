# ログイン画面設計書

- 画面名: `ログイン`
- パス: `/login`
- URL: https://carebase-staff.vercel.app/login

## 概要

ログイン画面設計書です。
施設IDとパスワードによる認証機能を提供し、認証成功時は職員選択画面へ遷移します。

認証フローは以下の通りです：

1. 施設IDとパスワードで認証
2. 認証成功時にトークンとユーザー情報を取得
3. 職員選択画面 (`/staff-selection`) へ自動遷移
4. 認証情報はlocalStorageに永続化

## 全体レイアウト

### 画面構成

<img width="607" height="534" alt="image" src="https://github.com/user-attachments/assets/b7195a6b-7c05-4f49-93e7-9cccdd783eb1" />

### 画面項目

| 項目名           | コンポーネント | 必須 | 最小桁数 | 最大桁数 | フォーマット | 初期値                                | 備考                                                     |
| ---------------- | -------------- | ---- | -------- | -------- | ------------ | ------------------------------------- | -------------------------------------------------------- |
| ロゴ             | Logo           | -    | -        | -        | -            | -                                     | CareBaseロゴを表示（components/1_atoms/common/logo）     |
| ページタイトル   | CardTitle      | -    | -        | -        | -            | ログイン                              | カード内ヘッダー                                         |
| 施設ID           | InputField     | ◯    | 1        | -        | -            | -                                     | テキスト入力フィールド、リアルタイムバリデーション対応   |
| パスワード       | InputField     | ◯    | 1        | -        | -            | -                                     | パスワード入力フィールド、リアルタイムバリデーション対応 |
| エラーメッセージ | ErrorAlert     | -    | -        | -        | -            | -                                     | 認証エラー時に表示、dismissible機能付き                  |
| 成功メッセージ   | ErrorAlert     | -    | -        | -        | -            | ログインに成功しました。              | 認証成功時に表示                                         |
| ログインボタン   | LoginButton    | -    | -        | -        | -            | ログイン                              | 認証実行ボタン、ローディング状態表示機能付き             |
| フッター         | テキスト       | -    | -        | -        | -            | © 2025 CareBase. All rights reserved. | 著作権表示                                               |

## 機能仕様

### アクション

| 項目名         | 処理内容                       | 対象API                    | 遷移先画面                        |
| -------------- | ------------------------------ | -------------------------- | --------------------------------- |
| ログインボタン | 施設IDとパスワードで認証を実行 | `/api/v1/auth/staff/login` | 職員選択画面 (`/staff-selection`) |
| フォーム送信   | Enterキー押下時の認証実行      | 同上                       | 同上                              |

### 入力チェック（リアルタイムバリデーション）

| 項目名       | イベント   | チェック内容     | エラーメッセージ                         |
| ------------ | ---------- | ---------------- | ---------------------------------------- |
| 施設ID       | input/blur | 必須項目チェック | 施設IDは必須です                         |
| パスワード   | input/blur | 必須項目チェック | パスワードは必須です                     |
| フォーム全体 | submit     | 認証失敗チェック | 施設IDまたはパスワードが正しくありません |

### バリデーション仕様

#### リアルタイムバリデーション

- `useLoginForm` フックによる入力中のフィールドレベルバリデーション
- `touched` 状態管理により、フィールドがフォーカスされた後にバリデーションを実行
- エラー状態の場合、フィールドを赤色でハイライト（variant="error"）
- エラーメッセージをフィールド下部に表示
- 開発環境では緩和されたバリデーション（`validateLoginFormRelaxed`）を使用

#### フォームバリデーション

- 全フィールドが有効かつ空でない場合のみログインボタンを有効化
- 無効な状態では `disabled` 属性を設定
- `isFormValid` プロパティによる動的な有効性チェック

#### ローディング状態

- 認証処理中はローディングスピナーを表示
- ボタンテキストが「ログイン中...」に変更
- フォーム全体が無効化され、重複送信を防止

## 開発環境での認証

### モック認証情報

開発環境では以下の認証情報でテストが可能です：

| 施設ID | パスワード | 説明                   |
| ------ | ---------- | ---------------------- |
| admin  | password   | 管理者権限でのテスト用 |
| demo   | demo       | デモ用アカウント       |

### 認証フロー詳細

1. **認証処理**
   - `authService.login()` による認証API呼び出し
   - 成功時にJWTトークンとユーザー情報を取得

2. **状態管理**
   - `useAuth` フックによる認証状態の管理
   - localStorage への認証情報永続化
   - 認証状態の自動復元

3. **職員選択**
   - 認証成功後、`/staff-selection` へ自動遷移
   - `authService.selectStaff()` による職員選択API
   - 選択された職員情報もlocalStorageに保存

## コンポーネント構成

### 主要コンポーネント

- **LoginForm** (`components/2_molecules/auth/login-form.tsx`)
  - フォーム全体の制御とレイアウト
  - `useLoginForm` フックとの連携
  - `LoginResult` 型を返すonLogin関数を受け取る

- **InputField** (`components/1_atoms/auth/InputField.tsx`)
  - バリデーション対応入力フィールド
  - variant（default/error/success）による状態表示
  - isRequired プロパティによる必須マーク表示

- **LoginButton** (`components/1_atoms/auth/LoginButton.tsx`)
  - ローディング状態表示機能
  - variant（default/outline/ghost）とsize（sm/md/lg）対応
  - fullWidth プロパティによる幅調整

- **ErrorAlert** (`components/2_molecules/auth/ErrorAlert.tsx`)
  - エラー・成功メッセージ表示
  - type（error/success/warning/info）による色分け
  - dismissible機能による手動非表示

### フック

- **useLoginForm** (`hooks/useLoginForm.ts`)
  - フォーム状態管理とバリデーション
  - リアルタイムバリデーション機能
  - touched状態による適切なタイミングでのエラー表示
  - `LoginResult` 型を返すonSubmit関数を受け取る

- **useAuth** (`hooks/useAuth.ts`)
  - 認証状態の管理
  - localStorage との同期
  - 認証API呼び出し
  - boolean を返すlogin関数を提供

## API仕様

### エンドポイント

| エンドポイント                         | 説明                   |
| -------------------------------------- | ---------------------- |
| `/api/v1/auth/staff/login`             | 職員ログイン           |
| `/api/v1/auth/staff/logout`            | ログアウト             |
| `/api/v1/auth/staff/select`            | 職員選択               |
| `/api/v1/auth/staff/password-reminder` | パスワードリマインダー |
| `/api/v1/auth/staff/password-reset`    | パスワードリセット     |

### 認証レスポンス

```typescript
interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    facilityId: string;
    role: 'staff' | 'admin';
    permissions: string[];
  };
  error?: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}
```

## 参考資料

- [FlutterFlow参考画面](https://carebase.flutterflow.app/authLogin)
- [CareBase-api認証エンドポイント](https://github.com/ambi-tious/CareBase-api/issues/3)
- [画面一覧](../../../docs/screen-list.md#認証関連)
