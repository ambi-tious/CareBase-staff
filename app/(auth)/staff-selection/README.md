# 職員選択画面設計書

## 画面概要

### 目的
ログイン後に、グループ・チーム・職員の3段階選択により、実際に業務を行う職員を特定し、その職員でシステムにログインする画面です。

### 対象ユーザー
- 介護施設の職員（介護職員、看護師、施設長、事務職員など）
- 共有端末を使用する職員

### 主要機能
- 3段階の階層選択（グループ → チーム → 職員）
- 進捗表示とステップナビゲーション
- 選択状態の永続化（localStorage）
- エラーハンドリングと入力検証

## レイアウト仕様

### 画面構成（ASCII図）

```
┌─────────────────────────────────────────────────────────────┐
│                     職員選択画面                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─ スタッフ選択 ─────────────────────────────── [戻る] ┐    │
│  │                                                     │    │
│  │  ● Step 1: グループ選択    [選択済みグループ名]      │    │
│  │  ● Step 2: チーム選択      [選択済みチーム名]        │    │
│  │  ● Step 3: スタッフ選択    [選択済みスタッフ名]      │    │
│  │                                                     │    │
│  │  ┌─ エラーメッセージ（必要時） ─────────────────┐   │    │
│  │  │ ⚠ エラー内容                                │   │    │
│  │  └─────────────────────────────────────────────┘   │    │
│  │                                                     │    │
│  │  ┌─ 選択コンテンツエリア ─────────────────────────┐   │    │
│  │  │                                               │   │    │
│  │  │  [Step 1] グループ一覧                        │   │    │
│  │  │  ┌─ 介護フロア A ──────────────────────┐      │   │    │
│  │  │  │ 🏥 介護フロア A                      │      │   │    │
│  │  │  │ 1階 介護フロア                       │      │   │    │
│  │  │  │ 3 チーム                             │      │   │    │
│  │  │  └─────────────────────────────────────┘      │   │    │
│  │  │                                               │   │    │
│  │  │  [Step 2] チーム一覧（グループ選択後）         │   │    │
│  │  │  ┌─ 朝番チーム ────────────────────────┐      │   │    │
│  │  │  │ 👥 朝番チーム                        │      │   │    │
│  │  │  │ 早朝・午前担当                       │      │   │    │
│  │  │  │ 3 名のスタッフ                       │      │   │    │
│  │  │  └─────────────────────────────────────┘      │   │    │
│  │  │                                               │   │    │
│  │  │  [Step 3] スタッフ一覧（チーム選択後）         │   │    │
│  │  │  ┌─ 田中 花子 ──────────────────────────┐      │   │    │
│  │  │  │ 田中 花子 (タナカ ハナコ)            │      │   │    │
│  │  │  │ 介護職員 - EMP001                    │      │   │    │
│  │  │  └─────────────────────────────────────┘      │   │    │
│  │  │                                               │   │    │
│  │  │  [Step 4] 選択完了画面                        │   │    │
│  │  │  ┌─ 選択完了 ──────────────────────────┐      │   │    │
│  │  │  │ 以下のスタッフでログインします：      │      │   │    │
│  │  │  │                                     │      │   │    │
│  │  │  │ ┌─ 田中 花子 ─────────────────┐     │      │   │    │
│  │  │  │ │ 田中 花子 (タナカ ハナコ)    │     │      │   │    │
│  │  │  │ │ 介護職員                     │     │      │   │    │
│  │  │  │ │ 介護フロア A - 朝番チーム    │     │      │   │    │
│  │  │  │ └─────────────────────────────┘     │      │   │    │
│  │  │  └─────────────────────────────────────┘      │   │    │
│  │  └───────────────────────────────────────────────┘   │    │
│  │                                                     │    │
│  │  [リセット]                    [このスタッフでログイン] │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### コンポーネント階層

```
StaffSelectionScreen
├── SelectionStep (×3) - 進捗表示
├── Alert - エラーメッセージ
├── GroupSelector - グループ選択
├── TeamSelector - チーム選択
├── StaffSelector - スタッフ選択
└── Button (×2) - リセット・ログインボタン
```

## コンポーネント仕様

### 1. StaffSelectionScreen（メインコンポーネント）
**ファイル**: `components/3_organisms/auth/staff-selection-screen.tsx`

**Props**:
```typescript
interface StaffSelectionScreenProps {
  onStaffSelected: (staff: Staff) => void;
  onBack?: () => void;
  className?: string;
  initialStep?: 'group' | 'team' | 'staff';
}
```

**状態管理**:
- `selectedGroupId: string` - 選択されたグループID
- `selectedTeamId: string` - 選択されたチームID  
- `selectedStaffId: string` - 選択されたスタッフID
- `error: string` - エラーメッセージ

### 2. SelectionStep（進捗表示）
**ファイル**: `components/1_atoms/staff/selection-step.tsx`

**Props**:
```typescript
interface SelectionStepProps {
  stepNumber: number;
  title: string;
  description?: string;
  isActive: boolean;
  isCompleted: boolean;
  className?: string;
}
```

**表示状態**:
- 完了: 緑色背景 + チェックマーク
- アクティブ: 青色背景 + ステップ番号
- 未完了: グレー背景 + ステップ番号

### 3. GroupSelector（グループ選択）
**ファイル**: `components/2_molecules/auth/group-selector.tsx`

**Props**:
```typescript
interface GroupSelectorProps {
  groups: Group[];
  selectedGroupId?: string;
  onGroupSelect: (groupId: string) => void;
  className?: string;
}
```

**表示内容**:
- グループ名、説明、アイコン
- 所属チーム数
- 選択状態のハイライト

### 4. TeamSelector（チーム選択）
**ファイル**: `components/2_molecules/auth/team-selector.tsx`

**Props**:
```typescript
interface TeamSelectorProps {
  teams: Team[];
  selectedTeamId?: string;
  onTeamSelect: (teamId: string) => void;
  className?: string;
}
```

**表示内容**:
- チーム名、説明、アイコン
- 所属スタッフ数
- 選択状態のハイライト

### 5. StaffSelector（スタッフ選択）
**ファイル**: `components/2_molecules/auth/staff-selector.tsx`

**Props**:
```typescript
interface StaffSelectorProps {
  staff: Staff[];
  selectedStaffId?: string;
  onStaffSelect: (staffId: string) => void;
  className?: string;
}
```

**表示内容**:
- アクティブなスタッフのみ表示
- スタッフカード（名前、ふりがな、役職、職員ID）
- 選択状態のハイライト

## 機能仕様

### 選択フロー

1. **グループ選択（Step 1）**
   - 利用可能なグループ一覧を表示
   - グループ選択時、チーム・スタッフ選択をリセット
   - 次のステップ（チーム選択）に進む

2. **チーム選択（Step 2）**
   - 選択されたグループ内のチーム一覧を表示
   - チーム選択時、スタッフ選択をリセット
   - 次のステップ（スタッフ選択）に進む

3. **スタッフ選択（Step 3）**
   - 選択されたチーム内のアクティブなスタッフ一覧を表示
   - スタッフ選択時、確認画面に進む

4. **選択完了（Step 4）**
   - 選択されたスタッフの詳細情報を表示
   - 「このスタッフでログイン」ボタンでログイン実行

### 入力検証

- **スタッフ選択時**:
  - スタッフが選択されているかチェック
  - 選択されたスタッフがアクティブかチェック

- **エラーメッセージ**:
  - `スタッフが選択されていません。`
  - `選択されたスタッフは現在利用できません。`

### 状態管理

- **localStorage連携**:
  - キー: `carebase_selected_staff_data`
  - 保存内容: 選択されたスタッフ、グループ名、チーム名
  - ヘッダーからの遷移時に前回選択を復元

- **初期ステップ判定**:
  - `group`: 初回選択時
  - `staff`: グループ名のみ保存時
  - `team`: チーム名まで保存時

## API連携

### データ構造

```typescript
// グループ構造
interface Group {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  teams: Team[];
}

// チーム構造
interface Team {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  staff: Staff[];
}

// スタッフ構造
interface Staff {
  id: string;
  name: string;
  furigana: string;
  role: string;
  employeeId: string;
  avatar?: string;
  isActive: boolean;
}
```

### 組織データ（モック）

**ファイル**: `mocks/staff-data.ts`

**グループ構成**:
- 介護フロア A（1階 介護フロア）
  - 朝番チーム（早朝・午前担当）
  - 日勤チーム（日中担当）
  - 夜勤チーム（夜間担当）
- 介護フロア B（2階 介護フロア）
  - 朝番チーム（早朝・午前担当）
  - 日勤チーム（日中担当）
- 管理部門（施設管理・事務）
  - 管理チーム（施設長・事務）

**関係性**:
- グループ : チーム = 1 : N
- チーム : スタッフ = N : N

### ヘルパー関数

```typescript
// グループ取得
getGroupById(groupId: string): Group | undefined

// チーム取得
getTeamById(groupId: string, teamId: string): Team | undefined

// スタッフ取得
getStaffById(groupId: string, teamId: string, staffId: string): Staff | undefined

// 全スタッフ取得
getAllStaff(): Staff[]
```

## 状態管理

### ページレベル状態

**ファイル**: `app/(auth)/staff-selection/page.tsx`

```typescript
const [initialStep, setInitialStep] = useState<'group' | 'staff' | 'team'>('group');
```

### コンポーネント状態

```typescript
const [selectedGroupId, setSelectedGroupId] = useState<string>('');
const [selectedTeamId, setSelectedTeamId] = useState<string>('');
const [selectedStaffId, setSelectedStaffId] = useState<string>('');
const [error, setError] = useState<string>('');
```

### localStorage統合

```typescript
// 保存
const selectedStaffData = {
  staff,
  groupName: getGroupNameByStaff(staff),
  teamName: getTeamNameByStaff(staff),
};
localStorage.setItem('carebase_selected_staff_data', JSON.stringify(selectedStaffData));

// 読み込み
const selectedStaffData = JSON.parse(
  localStorage.getItem('carebase_selected_staff_data') || '{}'
);
```

## UI/UX仕様

### デザインシステム

- **カラーパレット**:
  - プライマリ: `carebase-blue`
  - 背景: `carebase-bg`
  - テキスト: `carebase-text-primary`
  - 選択状態: `carebase-blue-light`

- **コンポーネント**:
  - Card: 選択可能アイテムの表示
  - Button: アクション実行
  - Alert: エラーメッセージ表示

### インタラクション

- **ホバー効果**: カード要素にシャドウ追加
- **選択状態**: 青色のリング表示
- **進捗表示**: ステップ番号とチェックマーク
- **トランジション**: スムーズな状態変化

### レスポンシブ対応

- **最大幅**: `max-w-2xl`
- **グリッドレイアウト**: 縦並び配置
- **タブレット対応**: タッチ操作に適したサイズ

### アクセシビリティ

- **キーボード操作**: Tab/Enterキーでの選択
- **スクリーンリーダー**: 適切なaria-label
- **コントラスト**: WCAG準拠の色彩設計
- **フォーカス表示**: 明確なフォーカスリング

## 技術実装

### TypeScript型定義

```typescript
// バリデーション
import { staffSelectionSchema, type StaffSelectionData } from '@/validations/auth-validation';

// 型定義
interface StaffSelectionScreenProps {
  onStaffSelected: (staff: Staff) => void;
  onBack?: () => void;
  className?: string;
  initialStep?: 'group' | 'team' | 'staff';
}
```

### Hooks使用

```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
```

### アイコンシステム

```typescript
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { ArrowLeft, AlertCircle, Check, ChevronRight } from 'lucide-react';
```

### エラーハンドリング

```typescript
try {
  const data = localStorage.getItem('carebase_selected_staff_data');
  // 処理
} catch (error) {
  console.error('Failed to load previous selection:', error);
}
```

## ナビゲーション

### 画面遷移

1. **ログイン画面** → **職員選択画面**
   - ログイン成功後の自動遷移
   - `router.push('/staff-selection')`

2. **職員選択画面** → **ダッシュボード**
   - スタッフ選択完了後の遷移
   - `router.push('/')`

3. **ヘッダー** → **職員選択画面**
   - 職員名クリック時の遷移
   - 前回選択状態を復元

### 戻るボタン

- **表示条件**: `onBack` propsが提供された場合
- **動作**: ログイン画面への遷移
- **アイコン**: ArrowLeft

## テスト仕様

### 単体テスト

1. **コンポーネントレンダリング**
   - 各選択ステップの正常表示
   - プロパティの正しい受け渡し

2. **状態管理**
   - 選択状態の更新
   - エラー状態の管理
   - localStorage連携

3. **イベントハンドリング**
   - 選択イベントの発火
   - バリデーション実行
   - ナビゲーション処理

### 統合テスト

1. **選択フロー**
   - グループ → チーム → スタッフの順次選択
   - 各ステップでの状態更新
   - 最終的なスタッフ選択完了

2. **エラーケース**
   - 非アクティブスタッフの選択
   - 空のチーム表示
   - localStorage読み込みエラー

3. **ナビゲーション**
   - ログイン画面からの遷移
   - ダッシュボードへの遷移
   - ヘッダーからの復帰

### E2Eテスト

1. **完全な選択フロー**
   - ログインから職員選択完了まで
   - 実際のユーザー操作シミュレーション

2. **ブラウザ互換性**
   - Chrome, Firefox, Safari対応
   - タブレット端末での動作確認

3. **パフォーマンス**
   - 初期読み込み時間
   - 選択操作のレスポンス時間

## 実装ファイル一覧

### ページファイル
- `app/(auth)/staff-selection/page.tsx` - メインページ

### コンポーネントファイル
- `components/3_organisms/auth/staff-selection-screen.tsx` - メイン画面
- `components/2_molecules/auth/group-selector.tsx` - グループ選択
- `components/2_molecules/auth/team-selector.tsx` - チーム選択
- `components/2_molecules/auth/staff-selector.tsx` - スタッフ選択
- `components/1_atoms/staff/selection-step.tsx` - 進捗表示
- `components/1_atoms/staff/staff-card.tsx` - スタッフカード

### データファイル
- `mocks/staff-data.ts` - 組織・スタッフデータ

### 型定義ファイル
- `types/auth.ts` - 認証関連型定義
- `validations/auth-validation.ts` - バリデーション定義

---

## 更新履歴

| 日付 | 更新者 | 更新内容 |
|------|--------|----------|
| 2025-07-11 | Devin AI | 初版作成 |
