# CareBase-staff 標準設計書

## 概要

本ドキュメントは、CareBase-staffアプリケーションの標準設計書です。
介護現場の記録・情報共有を効率化するSaaS型Webアプリケーションの設計指針、技術仕様、UI/UX規約を統一的に定義します。

## 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [技術アーキテクチャ](#技術アーキテクチャ)
3. [設計原則](#設計原則)
4. [画面設計標準](#画面設計標準)
5. [コンポーネント設計](#コンポーネント設計)
6. [UI/UX標準](#uiux標準)
7. [データ設計](#データ設計)
8. [API設計](#api設計)
9. [テスト設計](#テスト設計)
10. [開発ガイドライン](#開発ガイドライン)

---

## 1. プロジェクト概要

### 1.1 システム概要

**CareBase-staff**は、介護現場の記録・情報共有を効率化するSaaS型Webアプリケーションのフロントエンドです。
多忙な介護スタッフでも直感的かつ迅速に操作できる、高速で信頼性の高いUIを提供します。

### 1.2 ターゲットユーザー

- **施設職員**（介護職員、看護師、施設長など）
  - 日々のデータ入力と確認
  - タブレットや共有PCでの利用を想定
- **運営管理者**（WillGroup様）
  - 複数施設のデータを横断的に確認・管理
  - データの可視化やレポーティング

### 1.3 主要機能

- **認証・権限管理**: 施設ID→スタッフ選択の2段階認証
- **利用者管理**: 利用者情報の登録・編集・参照
- **ケアボード**: 時間ベース・利用者ベースでのケア記録表示
- **介護記録**: 日々の介護記録の作成・編集・検索
- **連絡・予定管理**: 週間・月間表示での連絡事項・予定管理
- **申し送り**: スタッフ間の情報共有
- **書類管理**: 各種書類のアップロード・管理

---

## 2. 技術アーキテクチャ

### 2.1 技術スタック

| 分類 | 技術 | バージョン | 用途 |
|------|------|------------|------|
| **フレームワーク** | Next.js | 15 | App Router使用 |
| **言語** | TypeScript | 最新 | 型安全性確保 |
| **UI** | React | 19 | コンポーネントベース開発 |
| **スタイリング** | Tailwind CSS | 最新 | ユーティリティファースト |
| **UIコンポーネント** | shadcn/ui | 最新 | 統一されたデザインシステム |
| **状態管理** | React Hooks | - | useState, useEffect |
| **デザインパターン** | Atomic Design | - | コンポーネント階層化 |
| **開発ツール** | ESLint, Prettier | 最新 | コード品質管理 |
| **テスト** | Jest, React Testing Library | 最新 | 単体・統合テスト |
| **デプロイ** | Vercel | - | 本番環境 |

### 2.2 ディレクトリ構造

```
├── app/                    # Next.js App Router
│   ├── (main)/            # メインレイアウトグループ
│   │   ├── residents/     # 利用者関連ページ
│   │   ├── care-records/  # 介護記録関連ページ
│   │   ├── contact-schedule/ # 連絡・予定関連ページ
│   │   ├── handovers/     # 申し送り関連ページ
│   │   └── layout.tsx     # メインレイアウト
│   ├── (auth)/            # 認証関連ページ
│   │   ├── login/         # ログイン画面
│   │   ├── staff-selection/ # スタッフ選択画面
│   │   └── layout.tsx     # 認証レイアウト
│   ├── api/               # APIルート（モック）
│   └── globals.css        # グローバルスタイル
├── components/            # UIコンポーネント（Atomic Design）
│   ├── 1_atoms/          # 最小単位のコンポーネント
│   ├── 2_molecules/      # 複数のAtomで構成
│   ├── 3_organisms/      # 自立したUIセクション
│   └── ui/               # shadcn/ui コンポーネント
├── __tests__/            # テストファイル
├── docs/                 # プロジェクトドキュメント
├── mocks/                # モックデータ
├── lib/                  # ユーティリティ関数
└── public/               # 静的ファイル
```

### 2.3 アーキテクチャ原則

- **コンポーネントベース開発**: 再利用可能でメンテナンス性の高いコンポーネント設計
- **サーバーコンポーネント優先**: RSCを基本とし、必要な場合のみクライアントコンポーネント使用
- **型安全性**: TypeScriptによる厳密な型定義
- **レスポンシブデザイン**: モバイルファーストアプローチ

---

## 3. 設計原則

### 3.1 基本設計原則

1. **ユーザビリティ優先**: 介護スタッフの業務効率を最優先
2. **一貫性**: 全画面で統一されたUI/UX
3. **アクセシビリティ**: WCAG 2.1 AA レベル準拠
4. **パフォーマンス**: 高速な画面表示と操作レスポンス
5. **保守性**: 拡張・修正が容易な設計

### 3.2 UI/UX設計原則

- **直感的操作**: 説明不要で操作できるインターフェース
- **エラー防止**: 入力ミスを防ぐバリデーションとガイダンス
- **フィードバック**: 操作結果の明確な表示
- **効率性**: 最小限の操作で目的を達成

### 3.3 技術設計原則

- **単一責任**: 各コンポーネントは単一の責任を持つ
- **疎結合**: コンポーネント間の依存関係を最小化
- **再利用性**: 共通機能のコンポーネント化
- **テスタビリティ**: テストしやすい設計

---

## 4. 画面設計標準

### 4.1 画面設計書テンプレート

各画面の設計書は以下の構成で作成する：

```markdown
# [画面名]設計書

- 画面名: `[画面名]`
- パス: `/[path]`
- URL: https://carebase-staff.vercel.app/[path]

## 概要
[画面の目的と主要機能の説明]

## 全体レイアウト

### 画面構成
[画面の構成要素の説明]

### 画面項目
| 項目名 | コンポーネント | 必須 | 表示条件 | 初期値 | 備考 |
|--------|----------------|------|----------|--------|------|

## 機能仕様

### アクション
| 項目名 | 処理内容 | 対象API | 遷移先画面 |
|--------|----------|---------|------------|

### 入力チェック
| 項目名 | イベント | チェック内容 | エラーメッセージ |
|--------|----------|--------------|------------------|

### バリデーション仕様
[詳細なバリデーションロジック]

## UI/UX仕様

### レスポンシブデザイン
[画面サイズ別の表示仕様]

### カラーテーマ
[使用する色の定義]

### アニメーション
[アニメーション効果の定義]

### アクセシビリティ
[アクセシビリティ対応]

## 技術仕様

### 使用コンポーネント
[使用するコンポーネントの一覧]

### データ型定義
[TypeScript型定義]

### API仕様
[使用するAPIエンドポイント]

## 参考資料
[関連ドキュメントへのリンク]
```

### 4.2 画面カテゴリ

| カテゴリ | 説明 | 主要画面 |
|----------|------|----------|
| **認証関連** | ログイン・スタッフ選択 | ログイン画面、スタッフ選択画面 |
| **利用者管理** | 利用者情報の管理 | 利用者一覧、利用者詳細、利用者登録 |
| **ケアボード** | ケア記録の表示・管理 | 時間ベース表示、利用者ベース表示 |
| **介護記録** | 介護記録の作成・管理 | 記録一覧、記録作成、記録編集 |
| **連絡・予定** | 連絡事項・予定の管理 | カレンダー表示、ボード表示 |
| **申し送り** | スタッフ間の情報共有 | 申し送り一覧、申し送り作成 |
| **書類管理** | 各種書類の管理 | 書類一覧、書類アップロード |

### 4.3 共通レイアウト要素

#### ヘッダー
- ロゴ・アプリ名
- 現在のスタッフ情報
- グループ・チーム情報
- ログアウトボタン

#### ナビゲーション
- メインメニュー
- パンくずリスト
- 戻るボタン

#### フッター
- バージョン情報
- サポート情報

---

## 5. コンポーネント設計

### 5.1 Atomic Design階層

#### 1_atoms（原子）
最小単位のコンポーネント。それ以上分割できない要素。

**例:**
- `Button`: 基本ボタン
- `Input`: 入力フィールド
- `Badge`: バッジ表示
- `StatusBadge`: ステータス表示
- `PriorityBadge`: 重要度表示

**命名規則:**
- PascalCase
- 機能を表す名前
- 汎用的な名前を使用

#### 2_molecules（分子）
複数のAtomで構成される機能単位。

**例:**
- `SearchBar`: 検索バー
- `UserCard`: ユーザーカード
- `FormField`: フォームフィールド
- `TableRow`: テーブル行

**命名規則:**
- PascalCase
- 機能 + 種類の組み合わせ
- 例: `ResidentCard`, `CareRecordForm`

#### 3_organisms（有機体）
複数のMoleculeやAtomで構成される自立したUIセクション。

**例:**
- `Header`: ヘッダー
- `ResidentList`: 利用者一覧
- `CareRecordForm`: 介護記録フォーム
- `ContactScheduleBoard`: 連絡・予定ボード

**命名規則:**
- PascalCase
- 機能領域 + 種類の組み合わせ
- 例: `ResidentDetailTabs`, `CareRecordList`

### 5.2 コンポーネント設計ガイドライン

#### Props設計
```typescript
interface ComponentProps {
  // 必須プロパティ
  id: string;
  title: string;
  
  // オプショナルプロパティ
  className?: string;
  disabled?: boolean;
  
  // イベントハンドラー
  onClick?: () => void;
  onSubmit?: (data: FormData) => void;
  
  // 子要素
  children?: React.ReactNode;
}
```

#### 型定義規則
- すべてのPropsにinterface定義
- 必須・オプショナルの明確な区別
- 適切なジェネリクス使用
- Union型での選択肢制限

#### ファイル構成
```
components/
├── 1_atoms/
│   ├── button/
│   │   ├── button.tsx
│   │   ├── button.test.tsx
│   │   └── index.ts
│   └── ...
├── 2_molecules/
└── 3_organisms/
```

---

## 6. UI/UX標準

### 6.1 カラーパレット

#### プライマリカラー
```css
:root {
  --carebase-blue: #3B82F6;
  --carebase-blue-light: #60A5FA;
  --carebase-blue-dark: #1D4ED8;
}
```

#### セマンティックカラー
```css
:root {
  /* ステータス */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* グレースケール */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
}
```

#### 機能別カラー
```css
/* 記録種別 */
--meal: #F97316;      /* 食事 */
--bath: #3B82F6;      /* 入浴 */
--medication: #8B5CF6; /* 服薬 */
--excretion: #A3A3A3; /* 排泄 */
--vital: #EF4444;     /* バイタル */
--exercise: #10B981;  /* 運動 */
--communication: #6366F1; /* コミュニケーション */

/* 重要度 */
--priority-high: #EF4444;
--priority-medium: #F59E0B;
--priority-low: #3B82F6;

/* ステータス */
--status-draft: #6B7280;
--status-completed: #10B981;
--status-confirmed: #3B82F6;
```

### 6.2 タイポグラフィ

#### フォントファミリー
```css
:root {
  --font-sans: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

#### フォントサイズ
```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}
```

### 6.3 スペーシング

#### 基本スペーシング
```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### 6.4 レスポンシブブレークポイント

```css
:root {
  --breakpoint-mobile: 375px;  /* スマートフォン */
  --breakpoint-tablet: 1024px; /* タブレット（横向き操作想定） */
  --breakpoint-desktop: 1280px; /* デスクトップ */
  --breakpoint-xl: 1536px;     /* 大画面 */
}
```

#### デバイス別設計方針
- **スマートフォン（375px）**: 縦向き表示、シンプルなレイアウト
- **タブレット（1024px）**: 横向き操作を基本想定、効率的な業務フロー
- **デスクトップ（1280px以上）**: 全機能表示、管理者向け操作

### 6.5 アニメーション

#### トランジション
```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}
```

#### 共通アニメーション
- **ホバー効果**: `hover:shadow-md transition-shadow`
- **フェードイン**: `animate-fade-in`
- **スライドイン**: `animate-slide-in`
- **スケール**: `hover:scale-105 transition-transform`

### 6.6 アクセシビリティ

#### 必須対応項目
- **キーボードナビゲーション**: Tab キーでの操作対応
- **スクリーンリーダー**: 適切な aria-label 設定
- **コントラスト比**: WCAG 2.1 AA レベル準拠（4.5:1以上）
- **フォーカス表示**: 明確なフォーカスインジケーター

#### 実装例
```tsx
<button
  aria-label="利用者を削除"
  className="focus:ring-2 focus:ring-carebase-blue focus:outline-none"
  tabIndex={0}
>
  削除
</button>
```

---

## 7. データ設計

### 7.1 共通データ型

#### 基本型
```typescript
// 共通ID型
type ID = string;

// 日時型
type DateTime = string; // ISO 8601形式

// ステータス型
type Status = 'active' | 'inactive' | 'deleted';

// 重要度型
type Priority = 'high' | 'medium' | 'low';
```

#### ユーザー関連
```typescript
interface User {
  id: ID;
  name: string;
  furigana: string;
  email: string;
  role: UserRole;
  groupId: ID;
  teamId: ID;
  isActive: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
}

type UserRole = 
  | 'facility_manager'    // 施設長
  | 'chief_care_worker'   // 主任介護職員
  | 'nurse'               // 看護師
  | 'care_worker'         // 介護職員
  | 'office_staff';       // 事務職員
```

#### 利用者関連
```typescript
interface Resident {
  id: ID;
  name: string;
  furigana: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  admissionDate: string;
  dischargeDate?: string;
  status: 'admitted' | 'discharged';
  groupId: ID;
  teamId: ID;
  careLevel: CareLevel;
  medicalInfo: MedicalInfo;
  contactInfo: ContactInfo;
  createdAt: DateTime;
  updatedAt: DateTime;
}

type CareLevel = 
  | 'support_1' | 'support_2'
  | 'care_1' | 'care_2' | 'care_3' | 'care_4' | 'care_5';
```

#### 介護記録関連
```typescript
interface CareRecord {
  id: ID;
  residentId: ID;
  category: CareRecordCategory;
  title: string;
  content: string;
  summary: string;
  recordedAt: DateTime;
  priority: Priority;
  status: CareRecordStatus;
  createdBy: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
}

type CareRecordCategory = 
  | 'meal'           // 食事
  | 'bath'           // 入浴
  | 'medication'     // 服薬
  | 'excretion'      // 排泄
  | 'vital'          // バイタル
  | 'exercise'       // 運動
  | 'communication'  // コミュニケーション
  | 'other';         // その他

type CareRecordStatus = 'draft' | 'completed' | 'confirmed';
```

### 7.2 API レスポンス型

#### 共通レスポンス
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### エラーレスポンス
```typescript
interface ApiError {
  success: false;
  message: string;
  errors: string[];
  code: string;
}
```

---

## 8. API設計

### 8.1 エンドポイント命名規則

#### RESTful API設計
```
GET    /api/v1/residents           # 利用者一覧取得
GET    /api/v1/residents/{id}      # 利用者詳細取得
POST   /api/v1/residents           # 利用者新規作成
PUT    /api/v1/residents/{id}      # 利用者更新
DELETE /api/v1/residents/{id}      # 利用者削除

GET    /api/v1/care-records        # 介護記録一覧取得
POST   /api/v1/care-records        # 介護記録作成
PUT    /api/v1/care-records/{id}   # 介護記録更新
DELETE /api/v1/care-records/{id}   # 介護記録削除
```

### 8.2 リクエスト・レスポンス仕様

#### 共通ヘッダー
```
Content-Type: application/json
Authorization: Bearer {token}
Accept: application/json
```

#### ページネーション
```typescript
interface PaginationParams {
  page?: number;      // デフォルト: 1
  limit?: number;     // デフォルト: 20
  sort?: string;      // ソートフィールド
  order?: 'asc' | 'desc'; // ソート順
}
```

#### 検索・フィルター
```typescript
interface SearchParams {
  q?: string;         // 検索キーワード
  category?: string;  // カテゴリフィルター
  status?: string;    // ステータスフィルター
  dateFrom?: string;  // 開始日
  dateTo?: string;    // 終了日
}
```

### 8.3 エラーハンドリング

#### HTTPステータスコード
- `200`: 成功
- `201`: 作成成功
- `400`: リクエストエラー
- `401`: 認証エラー
- `403`: 権限エラー
- `404`: リソース未発見
- `422`: バリデーションエラー
- `500`: サーバーエラー

#### エラーレスポンス例
```json
{
  "success": false,
  "message": "バリデーションエラーが発生しました",
  "errors": [
    "名前は必須です",
    "メールアドレスの形式が正しくありません"
  ],
  "code": "VALIDATION_ERROR"
}
```

---

## 9. テスト設計

### 9.1 テスト戦略

#### テストピラミッド
1. **単体テスト（Unit Tests）**: 70%
   - コンポーネントの個別機能
   - ユーティリティ関数
   - カスタムフック

2. **統合テスト（Integration Tests）**: 20%
   - コンポーネント間の連携
   - API通信
   - ページ全体の動作

3. **E2Eテスト（End-to-End Tests）**: 10%
   - ユーザーシナリオ
   - クリティカルパス

### 9.2 テストカバレッジ目標

| 項目 | 目標値 |
|------|--------|
| **Branches** | 70%以上 |
| **Functions** | 70%以上 |
| **Lines** | 70%以上 |
| **Statements** | 70%以上 |

### 9.3 テスト実装例

#### コンポーネントテスト
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/1_atoms/button';

describe('Button', () => {
  it('正常にレンダリングされる', () => {
    render(<Button>テストボタン</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('クリックイベントが発火する', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>クリック</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled状態で正しく動作する', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>無効ボタン</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

#### カスタムフックテスト
```typescript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  it('初期値が正しく設定される', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial-value')
    );
    
    expect(result.current[0]).toBe('initial-value');
  });

  it('値の更新が正しく動作する', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'initial')
    );
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
  });
});
```

---

## 10. 開発ガイドライン

### 10.1 コーディング規約

#### TypeScript
- 厳密な型定義を使用
- `any`型の使用を禁止
- 適切なジェネリクス使用
- Union型での選択肢制限

#### React
- 関数コンポーネントを使用
- カスタムフックでロジック分離
- useCallbackとuseMemoの適切な使用
- 適切なkey属性の設定

#### CSS/Tailwind
- ユーティリティクラス優先
- カスタムCSSは最小限
- レスポンシブデザイン対応
- アクセシビリティ考慮

### 10.2 ファイル命名規則

#### コンポーネント
- PascalCase: `UserCard.tsx`
- ディレクトリ名: kebab-case: `user-card/`
- テストファイル: `UserCard.test.tsx`
- Storybookファイル: `UserCard.stories.tsx`

#### ページ
- Next.js規約に従う: `page.tsx`, `layout.tsx`
- 動的ルート: `[id]/page.tsx`
- グループルート: `(auth)/layout.tsx`

#### ユーティリティ
- camelCase: `formatDate.ts`
- 定数: UPPER_SNAKE_CASE: `API_ENDPOINTS.ts`

### 10.3 Git運用

#### ブランチ戦略
- `main`: 本番環境
- `local`: 開発環境（最新実装）
- `feature/*`: 機能開発
- `fix/*`: バグ修正
- `docs/*`: ドキュメント更新

#### コミットメッセージ
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードフォーマット
refactor: リファクタリング
test: テスト追加・修正
chore: その他の変更
```

#### プルリクエスト
- 機能単位での作成
- レビュー必須
- CI/CDパス必須
- 適切な説明とスクリーンショット

### 10.4 パフォーマンス最適化

#### 画像最適化
- Next.js Image コンポーネント使用
- WebP形式の使用
- 適切なサイズ指定
- lazy loading対応

#### バンドル最適化
- 動的インポート使用
- Tree shaking対応
- 不要なライブラリ削除
- コード分割

#### レンダリング最適化
- React.memo使用
- useCallback/useMemo適切な使用
- 仮想化（大量データ）
- サーバーコンポーネント活用

### 10.5 セキュリティ

#### 認証・認可
- JWT トークン使用
- 適切な権限チェック
- セッション管理
- CSRF対策

#### データ保護
- 入力値サニタイズ
- XSS対策
- 機密情報の適切な管理
- HTTPS通信

---

## 付録

### A. 用語集

| 用語 | 説明 |
|------|------|
| **RSC** | React Server Components |
| **SSR** | Server-Side Rendering |
| **SSG** | Static Site Generation |
| **ISR** | Incremental Static Regeneration |
| **CRUD** | Create, Read, Update, Delete |
| **API** | Application Programming Interface |
| **UI** | User Interface |
| **UX** | User Experience |

### B. 参考資料

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [shadcn/ui公式ドキュメント](https://ui.shadcn.com/)
- [WCAG 2.1ガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)

### C. 更新履歴

| 日付 | バージョン | 更新内容 | 更新者 |
|------|------------|----------|--------|
| 2025-01-25 | 1.0.0 | 初版作成 | Devin AI |

---

**本ドキュメントは、CareBase-staffプロジェクトの標準設計書として、全ての開発者が参照・遵守すべき指針を定めています。**
**プロジェクトの進行に伴い、継続的に更新・改善を行ってください。**
