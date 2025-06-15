# CareBase フロントエンド

CareBaseは、介護現場の記録・情報共有を効率化するSaaS型Webアプリケーションのフロントエンドです。

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/hornet-ventures/v0-care-base-wu)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/3p6xHt7FLAl)

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
- **デプロイ**: Vercel

## 📁 ディレクトリ構造

\`\`\`
├── app/                    # Next.js App Router
│   ├── (main)/            # メインレイアウトグループ
│   │   ├── residents/     # 利用者関連ページ
│   │   └── layout.tsx     # メインレイアウト
│   ├── api/               # APIルート（モック）
│   └── globals.css        # グローバルスタイル
├── components/            # UIコンポーネント（Atomic Design）
│   ├── 1_atoms/          # 最小単位のコンポーネント
│   ├── 2_molecules/      # 複数のAtomで構成
│   ├── 3_organisms/      # 自立したUIセクション
│   └── ui/               # shadcn/ui コンポーネント
├── docs/                 # プロジェクトドキュメント
├── mocks/                # モックデータ
├── lib/                  # ユーティリティ関数
└── public/               # 静的ファイル
\`\`\`

## 🚀 セットアップ

### 前提条件
- Node.js 22.x (LTS)
- npm または yarn

### インストール

\`\`\`bash
# リポジトリをクローン
git clone <repository-url>
cd carebase-frontend

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
\`\`\`

開発サーバーが起動したら、[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## 📚 ドキュメント

プロジェクトの詳細なドキュメントは `docs/` ディレクトリに格納されています：

- **[overview.md](./docs/overview.md)** - CareBaseフロントエンドシステムの概要
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

### 利用者管理
- 利用者詳細情報の表示・編集
- 家族情報、医療機関情報の管理
- 個別ポイント管理

### レスポンシブデザイン
- タブレット・PC両対応
- モバイルファーストアプローチ

## 🚀 デプロイ

### Vercel（推奨）
\`\`\`bash
# Vercel CLIを使用
npm i -g vercel
vercel
\`\`\`

### 手動デプロイ
\`\`\`bash
# ビルド
npm run build

# 本番サーバー起動
npm start
\`\`\`

## 🤝 コントリビューション

1. フィーチャーブランチを作成
2. 変更を実装
3. テストを実行
4. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🔗 関連リンク

- **本番環境**: [https://vercel.com/hornet-ventures/v0-care-base-wu](https://vercel.com/hornet-ventures/v0-care-base-wu)
- **v0.dev プロジェクト**: [https://v0.dev/chat/projects/3p6xHt7FLAl](https://v0.dev/chat/projects/3p6xHt7FLAl)
- **設計ドキュメント**: [docs/overview.md](./docs/overview.md)

---

*このプロジェクトは [v0.dev](https://v0.dev) を使用して開発されています。*
