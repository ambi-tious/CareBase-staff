# ログイン コンポーネント設計書

## 概要
CareBase-staff ログインシステムのコンポーネント設計書です。Atomic Design パターンに従い、再利用可能でメンテナンス性の高いコンポーネント構造を定義します。

## 設計原則

### 1. Atomic Design パターン
- **Atoms (原子)**: 最小単位のUI要素
- **Molecules (分子)**: 複数のAtomを組み合わせた機能単位
- **Organisms (有機体)**: 複数のMoleculeを組み合わせた画面セクション
- **Templates**: レイアウト構造の定義
- **Pages**: 実際の画面実装

### 2. コンポーネント責務
- **単一責任の原則**: 各コンポーネントは単一の責任を持つ
- **Props interface**: 明確なProps型定義
- **State 管理**: 必要最小限のローカルstate
- **Error Boundary**: エラーハンドリングの実装

### 3. 型安全性
- **TypeScript**: 全コンポーネントでのTypeScript使用
- **Props validation**: 厳密なProps型チェック
- **Event handling**: 型安全なイベントハンドリング

## コンポーネント階層

```
app/(auth)/
├── login/
│   └── page.tsx                    # ログインページ (Page)

components/
├── 1_atoms/
│   ├── common/
│   │   ├── logo.tsx               # ロゴ
│   │   └── loading-spinner.tsx    # ローディングスピナー
│   ├── forms/
│   │   ├── input-field.tsx        # 入力フィールド
│   │   ├── password-field.tsx     # パスワードフィールド
│   │   └── submit-button.tsx      # 送信ボタン
│   └── navigation/
│       └── back-button.tsx        # 戻るボタン
├── 2_molecules/
│   ├── auth/
│   │   ├── login-form.tsx         # ログインフォーム
│   │   ├── staff-group-selector.tsx # グループ選択
│   │   ├── staff-team-selector.tsx  # チーム選択
│   │   └── staff-selector.tsx     # 職員選択
│   └── feedback/
│       └── message-alert.tsx      # メッセージアラート
├── 3_organisms/
│   └── auth/
│       ├── login-screen.tsx       # ログイン画面
│       └── staff-selection-screen.tsx # 職員選択画面
```

## 1. Atoms (原子)

### Logo コンポーネント
**機能:** CareBaseロゴとテキストの表示
**Props:** className（スタイル）、size（サイズ指定）
**特徴:** 
- サイズ指定対応（sm/md/lg）
- CareBase ブルーカラー使用
- ハートアイコン + テキストロゴ

実装: [`components/1_atoms/common/logo.tsx`](/components/1_atoms/common/logo.tsx)

### InputField コンポーネント
**機能:** 汎用入力フィールド
**Props:** id、label、type、value、onChange、placeholder、disabled、error、required、className
**特徴:**
- アクセシビリティ対応（aria-*属性）
- エラー状態の視覚的フィードバック
- 必須項目のマーク表示
- フォーカス状態のスタイリング

実装: [`components/1_atoms/forms/input-field.tsx`](/components/1_atoms/forms/input-field.tsx)

### SubmitButton コンポーネント
**機能:** 送信ボタン
**Props:** children、isLoading、disabled、type、variant、size、className、onClick
**特徴:**
- ローディング状態表示
- バリアント対応（primary/secondary/outline）
- サイズ対応（sm/md/lg）
- アクセシビリティ対応

実装: [`components/1_atoms/forms/submit-button.tsx`](/components/1_atoms/forms/submit-button.tsx)

### LoadingSpinner コンポーネント
**機能:** ローディングスピナー
**Props:** size、className
**特徴:**
- サイズ指定対応
- CareBase ブルーカラー
- アニメーション対応

実装: [`components/1_atoms/common/loading-spinner.tsx`](/components/1_atoms/common/loading-spinner.tsx)

## 2. Molecules (分子)

### MessageAlert コンポーネント
**機能:** メッセージアラート表示
**Props:** type（success/error/info/warning）、message、className、onClose
**特徴:**
- 4種類のアラートタイプ
- アイコン付き表示
- 閉じるボタン（オプション）
- カラー別スタイリング

実装: [`components/2_molecules/feedback/message-alert.tsx`](/components/2_molecules/feedback/message-alert.tsx)

### LoginForm コンポーネント
**機能:** ログインフォーム
**Props:** onLogin、isLoading、className
**特徴:**
- リアルタイムバリデーション
- エラー状態管理
- ローディング状態表示
- アクセシビリティ対応

**内部状態:**
- 入力値（施設ID、パスワード）
- エラー状態
- メッセージ状態

実装: [`components/2_molecules/auth/login-form.tsx`](/components/2_molecules/auth/login-form.tsx)

### StaffGroupSelector コンポーネント
**機能:** スタッフグループ選択
**Props:** groups、selectedGroupId、onGroupSelect、className
**特徴:**
- カード形式の選択UI
- アイコン付き表示
- 選択状態の視覚的フィードバック
- チーム数の表示

実装: [`components/2_molecules/auth/staff-group-selector.tsx`](/components/2_molecules/auth/staff-group-selector.tsx)

## 3. Organisms (有機体)

### LoginScreen コンポーネント
**機能:** ログイン画面全体のレイアウト
**Props:** onLogin、onStaffSelection、className
**特徴:**
- 中央配置レイアウト
- ロゴ表示
- ログインフォーム統合
- クイックアクセスボタン
- フッター表示

**構成要素:**
- Logo コンポーネント
- LoginForm コンポーネント
- 職員選択スキップボタン
- 著作権フッター

実装: [`components/3_organisms/auth/login-screen.tsx`](/components/3_organisms/auth/login-screen.tsx)

### StaffSelectionScreen コンポーネント
**機能:** 職員選択画面全体
**Props:** onStaffSelected、onBack、className
**特徴:**
- 3段階選択プロセス
- ステップインジケータ
- 戻るボタン
- 確認・リセット機能
- エラー表示

**内部状態:**
- 選択されたグループ/チーム/スタッフ
- エラー状態
- ローディング状態

**構成要素:**
- StaffGroupSelector
- StaffTeamSelector  
- StaffSelector
- MessageAlert
- アクションボタン

実装: [`components/3_organisms/auth/staff-selection-screen.tsx`](/components/3_organisms/auth/staff-selection-screen.tsx)

## 4. Pages (ページ)

### Login Page
**機能:** ログインページの状態管理とルーティング
**特徴:**
- 認証モード管理（login/staff-selection）
- ルーティング制御
- 職員データの永続化
- エラーハンドリング

**状態管理:**
- authMode: ログイン画面 ⟷ 職員選択画面
- 認証フロー制御
- 画面遷移管理

実装: [`app/(auth)/login/page.tsx`](/app/(auth)/login/page.tsx)

## 5. 型定義

### Staff Types
職員関連の型定義：

- **Staff**: 職員の基本情報
- **StaffTeam**: チーム構造
- **StaffGroup**: グループ構造  
- **AuthState**: 認証状態

型定義: [`types/staff.ts`](/types/staff.ts)

### Form Types
フォーム関連の型定義：

- **LoginCredentials**: ログイン認証情報
- **StaffSelection**: 職員選択情報
- **FormErrors**: フォームエラー状態
- **MessageState**: メッセージ状態

型定義: [`types/forms.ts`](/types/forms.ts)

## 6. スタイリング

### Tailwind CSS カスタムカラー
CareBase専用カラーパレット：

- **carebase-blue**: メインブルー (#0ea5e9)
- **carebase-blue-dark**: ダークブルー (#0284c7)
- **carebase-blue-light**: ライトブルー (#e0f2fe)
- **carebase-bg**: 背景色 (#f8fafc)
- **carebase-text-primary**: プライマリテキスト (#1e293b)
- **carebase-text-secondary**: セカンダリテキスト (#64748b)

設定: [`tailwind.config.ts`](/tailwind.config.ts)

### カスタムCSS
再利用可能なCSSクラス：

- **carebase-focus**: フォーカススタイル
- **carebase-input**: 入力フィールド基本スタイル
- **carebase-button**: ボタン基本スタイル
- **carebase-button-primary**: プライマリボタン
- **carebase-card**: カード基本スタイル

スタイル: [`styles/globals.css`](/styles/globals.css)

## 7. テスト

### コンポーネントテスト例
Jest + React Testing Library を使用：

**テスト対象:**
- フォーム要素の正常レンダリング
- 必須項目バリデーション
- 正常な認証フロー
- エラー状態の表示

**テストパターン:**
- 正常系テスト
- 異常系テスト
- ユーザーインタラクションテスト
- アクセシビリティテスト

テスト実装: [`__tests__/components/`](/__tests__/components/) ディレクトリ

## 8. パフォーマンス最適化

### React.memo の使用
パフォーマンス最適化：

- 不要な再レンダリングを防止
- Props変更時のみ再レンダリング
- メモリ使用量の最適化

実装例: [`components/2_molecules/auth/staff-group-selector.tsx`](/components/2_molecules/auth/staff-group-selector.tsx)

### useMemo と useCallback の使用
重い計算とコールバック関数の最適化：

- 重い計算結果のキャッシュ
- コールバック関数の最適化
- 依存配列による制御

実装例: [`components/3_organisms/auth/staff-selection-screen.tsx`](/components/3_organisms/auth/staff-selection-screen.tsx)

## 9. アクセシビリティ

### WAI-ARIA 対応
アクセシビリティ標準への準拠：

- aria-describedby: エラーメッセージとの関連付け
- aria-invalid: 入力状態の表示
- aria-required: 必須項目の表示
- role属性: 要素の役割明確化

実装例: [`components/1_atoms/forms/input-field.tsx`](/components/1_atoms/forms/input-field.tsx)

### キーボードナビゲーション
キーボード操作サポート：

- Tab順序の最適化
- Enter/Spaceキーでの操作
-矢印キーでの選択移動
- Escapeキーでのキャンセル

実装例: [`components/2_molecules/auth/staff-group-selector.tsx`](/components/2_molecules/auth/staff-group-selector.tsx)

## 10. 国際化対応

### i18n 準備
国際化対応の基盤：

**メッセージ管理:**
- 言語別メッセージファイル
- 型安全なメッセージキー
- 動的言語切り替え

**対応予定言語:**
- 日本語（デフォルト）
- 英語
- 中国語（簡体字）

実装準備: [`types/i18n.ts`](/types/i18n.ts)、[`hooks/useI18n.ts`](/hooks/useI18n.ts)

## まとめ

このコンポーネント設計により、以下の利点が得られます：

- **再利用性**: Atomic Design パターンによる高い再利用性
- **保守性**: 単一責任の原則による保守のしやすさ
- **型安全性**: TypeScript による厳密な型チェック
- **テスト容易性**: 単体テストが書きやすい構造
- **パフォーマンス**: React.memo、useMemo等による最適化
- **アクセシビリティ**: WAI-ARIA対応とキーボードナビゲーション
- **拡張性**: 将来的な機能追加に対応しやすい構造

この設計により、ログインシステムの実装・保守・拡張が効率的に行えます。