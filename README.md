# CareBase フロントエンド

CareBaseは、介護現場の記録・情報共有を効率化するSaaS型Webアプリケーションのフロントエンドです。

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/hornet-ventures/carebase-staff)

## 🎯 プロジェクト概要

CareBaseは、多忙な介護スタッフでも直感的かつ迅速に操作できる、高速で信頼性の高いUIを提供します。

### ターゲットユーザー

- **施設職員**（介護職員、看護師、施設長など）
  - 日々のデータ入力と確認
  - タブレットや共有PCでの利用を想定
- **運営管理者**（WillGroup様）
  - 複数施設のデータを横断的に確認・管理
  - データの可視化やレポーティング

## 🛠 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **UI**: React 19
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **状態管理**: React Hooks (useState, useEffect)
- **デザインパターン**: Atomic Design
- **開発ツール**: ESLint, Prettier
- **テスト**: Jest, React Testing Library
- **デプロイ**: Vercel

## 📁 ディレクトリ構造

```
├── app/ # Next.js App Router
│ ├── (main)/ # メインレイアウトグループ
│ │ ├── residents/ # 利用者関連ページ
│ │ └── layout.tsx # メインレイアウト
│ ├── api/ # APIルート（モック）
│ └── globals.css # グローバルスタイル
├── components/ # UIコンポーネント（Atomic Design）
│ ├── 1_atoms/ # 最小単位のコンポーネント
│ ├── 2_molecules/ # 複数のAtomで構成
│ ├── 3_organisms/ # 自立したUIセクション
│ └── ui/ # shadcn/ui コンポーネント
├── __tests__/ # テストファイル
├── docs/ # プロジェクトドキュメント
├── mocks/ # モックデータ
├── lib/ # ユーティリティ関数
└── public/ # 静的ファイル
```

## 🚀 セットアップ

### 前提条件

- Node.js 18.x または 20.x (LTS)
- pnpm 8.x

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd carebase-staff

# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev
```

開発サーバーが起動したら、[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## 🔧 開発環境でのモックデータ

開発環境（`NODE_ENV=development`）では、実際のAPIサーバーに接続することなく、モックデータでアプリケーションをテストできます。

### 認証機能

以下の認証情報でログインできます：

| ログインID | パスワード | 説明       |
| ---------- | ---------- | ---------- |
| admin      | password   | 管理者施設 |
| demo       | demo       | デモ施設   |

### 組織データ

以下のモックデータが利用可能です：

- **グループ**: 介護フロアA、介護フロアB、管理部門
- **チーム**: 朝番チーム、日勤チーム、夜勤チーム、管理チーム
- **スタッフ**: 各チームに配置されたスタッフ情報

### モックデータの特徴

- 開発環境では自動的にモックデータが使用されます
- コンソールにデバッグログが出力されます
- 本番環境では実際のAPIが呼び出されます

### 開発環境の表示

開発環境では以下の場所に環境表示が表示されます：

- **ログイン画面**: 認証情報と共に環境バッジを表示
- **スタッフ選択画面**: ページ上部に環境バッジを表示
- **メインレイアウト**: 画面上部に固定バーで環境表示
- **ヘッダー**: Logo横に小さなDEVバッジを表示

## 🧪 テスト

### テストの実行

```bash
# 全テストを実行
pnpm test

# テストをウォッチモードで実行
pnpm test:watch

# カバレッジ付きでテストを実行
pnpm test:coverage


```

### テストカバレッジ

テストカバレッジは以下の基準を満たす必要があります：

- **Branches**: 70%以上
- **Functions**: 70%以上
- **Lines**: 70%以上
- **Statements**: 70%以上

### テストファイルの配置

- `__tests__/` ディレクトリにテストファイルを配置
- コンポーネントのテストは `__tests__/components/` に配置
- フックのテストは `__tests__/hooks/` に配置

## 📚 ドキュメント

プロジェクトの詳細なドキュメントは `docs/` ディレクトリに格納されています：

- **[overview.md](./docs/overview.md)** - CareBaseフロントエンドシステムの概要
- **[screen-list.md](./docs/screen-list.md)** - 全画面一覧と機能概要
- **[v0-development-guidelines.md](./docs/v0-development-guidelines.md)** - v0.dev開発指針

## 🏗 開発ガイドライン

### Atomic Design

UIコンポーネントは Atomic Design の階層に従って実装します：

- **Atoms** (`1_atoms/`): 最小単位のコンポーネント
- **Molecules** (`2_molecules/`): 複数のAtomで構成される機能単位
- **Organisms** (`3_organisms/`): 自立したUIセクション

### コーディング規約

- TypeScriptの型定義を必須とする
- ESLint/Prettierによるコード品質管理
- コンポーネントのprops型を明示的に定義
- サーバーコンポーネント（RSC）を基本とし、必要な場合のみクライアントコンポーネントを使用

## 🎨 主要機能

### ケアボード

- **時間ベース表示**: 24時間のタイムライン表示
- **利用者ベース表示**: 利用者ごとのケア項目一覧

### 連絡・予定管理

- **週間表示**: Googleカレンダー風の週間スケジュール表示
- **月間表示**: カレンダーグリッド形式での月間表示
- **編集機能**: 連絡事項・予定・申し送りの作成・編集・削除
- **フィルター機能**: 種別・重要度・ステータス別の絞り込み

### 利用者管理

- 利用者詳細情報の表示・編集
- 家族情報、医療機関情報の管理
- 個別ポイント管理

### レスポンシブデザイン

- タブレット・PC両対応
- タブレット横向き操作を基本想定（1024px）
- スマートフォンは補助的な役割（375px）

## 🤝 コントリビューション

1. フィーチャーブランチを作成
2. 変更を実装
3. テストを実行
4. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🔗 関連リンク

- **モック環境**: [https://carebase-staff.vercel.app](https://carebase-staff.vercel.app)
- **設計ドキュメント**: [docs/overview.md](./docs/overview.md)

---
