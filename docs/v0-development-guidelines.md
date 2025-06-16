# v0.dev 開発指針

## 1. はじめに

このドキュメントは、VercelのAI生成UIサービス v0.dev を利用して構築されたUIコンポーネントを、Next.js + TypeScript + Reactアプリケーションに統合するための統一的な開発指針を定めるものです。
本指針の目的は、v0.devによって迅速に生成されたUIモックを、我々のプロジェクトで定義されたアーキテクチャ（Atomic Design）とルールに沿ってリファクタリング・実装し、一貫性と保守性の高いコードベースを維持することです。

## 2. v0.dev利用フェーズのゴール

このフェーズの完了条件は以下の通りです。

- v0.devで生成されたすべての画面UIが、本指針に従ってコンポーネントとして実装されていること。
- 実装されたコンポーネントにモックAPIから取得したデータが正しく表示されていること。
- 静的な画面遷移が問題なく動作し、ユーザー体験の全体像が確認できること。

## 3. 技術スタックと基本方針

- **フレームワーク**: Next.js (App Router) / React / TypeScript
- **APIモック**: Next.js API Routes (/app/api) を使用
- **状態管理**: useState, useEffect のみ（React Query, SWR等は不使用）。クライアントコンポーネント内での限定的な使用を原則とします。
- **データバリデーション**: Zod
- **CSS**: UnoCSS
- **デザインパターン**: Atomic Design
- **画面描画方式**: サーバーコンポーネント (RSC) を基本とし、SSRで描画します。インタラクティブなUIが必要な場合のみクライアントコンポーネント ('use client') を使用してください。
- **データ通信**: axios
- **Node.jsバージョン**: 22.x（LTS）
- **パスエイリアス**: @/ を使用 (tsconfig.jsonで設定)
- **コード品質**:
  - ESLint / Prettier による静的解析とフォーマットを必須とします。
  - すべてのコンポーネントでpropsの型を明示的に定義してください。

## 4. ディレクトリ構成

プロジェクトの主要なディレクトリ構成は以下を基本とします。
\`\`\`
/src
├── app/ # Next.js App Router (ルーティングとページ)
│ ├── (main)/ # メインレイアウトを持つページグループ
│ │ ├── \_components/ # そのページグループでのみ使用するOrganismsなど
│ │ ├── layout.tsx
│ │ └── page.tsx
│ ├── api/ # APIモックのエンドポイント
│ │ └── ...
│ └── layout.tsx # ルートレイアウト
├── components/ # 共通UIコンポーネント (Atomic Design)
│ ├── 1_atoms/
│ ├── 2_molecules/
│ └── 3_organisms/
├── constants/ # 定数
├── hooks/ # 共通カスタムフック
├── mocks/ # モックデータやモック生成関数
├── styles/ # グローバルCSS
└── utils/ # 汎用的な関数
\`\`\`

## 5. 🧱 Atomic Design 指針

UIコンポーネントはAtomic Designの階層に厳密に従って実装します。v0.devから生成されたコードは、この構造に合わせて適切に分解・再構成してください。

### 階層定義

- **1_atoms**: それ以上分割できない最小単位 (Button, Input, Label)。
- **2_molecules**: 複数のAtomで構成される機能単位 (SearchForm, UserAvatar)。
- **3_organisms**: 複数のMoleculeやAtomで構成される自立したUIセクション (Header, Footer, PostCard)。
- **Templates**: ページのレイアウト定義。Next.jsのlayout.tsxがこの役割を担います。
- **Pages**: 具体的なコンテンツを持つページ。Next.jsのpage.tsxがこの役割を担います。

### 運用ルール

- **コンポーネントの責務**: UIを構成するすべての要素は、必ずcomponents配下のコンポーネントを組み合わせて構築してください。
- **拡張と作成**: 新規UIの作成時、既存コンポーネントで対応できない場合は、まず既存の拡張を検討し、それが難しい場合に限り新規作成してください。
- **直接記述の禁止**: page.tsxやlayout.tsxに直接複雑なJSXやスタイルを記述することは原則禁止です。必ずOrganism以下のコンポーネントを適切に組み合わせてページを構成してください。

### スタイリングのルール:

- 意味を持つUI部品（ボタン、カード、フォーム要素など）は、必ずAtomまたはMoleculeとしてコンポーネント化してください。
- Organismやpage.tsx内でのdivやspanへの直接のクラス指定は、レイアウト調整（マージン、パディング、フレックスボックス、グリッドなど）に限定します。繰り返し利用されるUIパターンは、発見次第コンポーネントとして切り出してください。

## 6. APIモック実装ガイドライン

- **エンドポイント**: APIモックはNext.jsのAPI Routes（例: /src/app/api/users/route.ts）に実装します。
- **スキーマの再利用**: APIレスポンスの型定義には、Zodスキーマを再利用することを推奨します。これにより、フロントエンドの型とAPIのデータ構造の一貫性を保証できます。
- **モックデータ**: モックデータ本体は/src/mocksディレクトリに配置し、API Routeからインポートして使用してください。

\`\`\`typescript
import { NextResponse } from 'next/server';
import { users } from '@/mocks/users';

export async function GET() {
return NextResponse.json(users);
}
\`\`\`
