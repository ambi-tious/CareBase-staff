# テストガイド

CareBaseプロジェクトのテスト戦略とガイドラインです。

## テスト環境

### 使用ライブラリ

- **Jest**: テストフレームワーク
- **React Testing Library**: Reactコンポーネントのテスト
- **@testing-library/jest-dom**: DOM要素のマッチャー
- **@testing-library/user-event**: ユーザーインタラクションのシミュレーション

### セットアップ

テスト環境は以下のファイルで設定されています：

- `jest.config.js`: Jest設定
- `jest.setup.js`: テスト環境のセットアップ

## テスト実行

\`\`\`bash

# 全テスト実行

npm test

# ウォッチモードでテスト実行

npm run test:watch

# カバレッジレポート付きでテスト実行

npm run test:coverage
\`\`\`

## テスト戦略

### 1. Atoms（1_atoms）

- プロパティの正しい表示
- 条件分岐の動作
- エッジケースの処理

### 2. Molecules（2_molecules）

- 複数のAtomの組み合わせ
- プロパティの伝播
- ユーザーインタラクション

### 3. Organisms（3_organisms）

- 複雑なコンポーネントの統合
- データフローの確認
- 状態管理の動作

### 4. Pages

- ページレベルの統合テスト
- ルーティングの動作
- データ取得の確認

## テスト作成ガイドライン

### 命名規則

- テストファイル: `*.test.tsx` または `*.test.ts`
- テストケース: 日本語での説明を推奨

### テストの構造

\`\`\`typescript
describe('ComponentName', () => {
it('should render correctly', () => {
// テストコード
})

it('should handle user interaction', () => {
// テストコード
})
})
\`\`\`

### モック

- Next.jsの機能（Image, Link, Router）は自動的にモック
- 外部APIやコンポーネントは必要に応じてモック

## カバレッジ目標

- **Statements**: 80%以上
- **Branches**: 75%以上
- **Functions**: 80%以上
- **Lines**: 80%以上

## 継続的インテグレーション

テストは以下のタイミングで自動実行されます：

- プルリクエスト作成時
- メインブランチへのマージ時
- デプロイ前

## トラブルシューティング

### よくある問題

1. **Next.js Image コンポーネントのエラー**

   - `jest.setup.js`でモック済み

2. **ルーターのエラー**

   - `next/navigation`のモック済み

3. **CSS関連のエラー**
   - Tailwind CSSは自動的に処理される

### デバッグ

\`\`\`bash

# 特定のテストファイルのみ実行

npm test -- contact-info-card.test.tsx

# デバッグモードでテスト実行

npm test -- --verbose
\`\`\`
