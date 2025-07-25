# スタッフ選択画面設計書

画面名: `スタッフ選択`  
パス: `/staff-selection`  
URL: https://carebase-staff.vercel.app/staff-selection

## 概要

CareBase-staffアプリケーションのスタッフ選択画面設計書です。  
グループとチームを選択してチームにひもづくスタッフを表示し、選択したスタッフでログインする機能を提供します。  
ログイン画面での認証成功後、または既存セッションからのスタッフ変更時に使用されます。

### 主要機能

- **自動選択ロジック**: グループ・チームが単一の場合の自動選択
- **ヘッダーナビゲーション連携**: アプリヘッダーからのスタッフ変更機能
- **localStorage永続化**: 選択されたスタッフ情報の保存・復元
- **スムーズスクロール**: 選択後の自動スクロール機能
- **URLパラメータ制御**: 遷移元に応じた動作制御

## 全体レイアウト

### 画面構成

<img width="923" height="616" alt="image" src="https://github.com/user-attachments/assets/31790f60-95c5-4baf-a2ff-6c51d313cc9c" />


1画面で完結するスタッフ選択インターフェース：

- グループ選択エリア（複数グループがある場合のみ表示）
- チーム選択エリア（複数チームがある場合のみ表示）
- スタッフ選択エリア
- ログインボタン
- ログアウトボタン

### 画面項目

| 項目名               | コンポーネント | 必須 | 表示条件           | 初期値                     | 備考                     |
| -------------------- | -------------- | ---- | ------------------ | -------------------------- | ------------------------ |
| ページタイトル       | CardTitle      | -    | 常時               | スタッフ選択               | カード内ヘッダー         |
| ログアウトボタン     | Button         | -    | 常時               | ログアウト                 | 右上に配置、赤色スタイル |
| エラーメッセージ     | Alert          | -    | エラー時           | -                          | 選択エラー時に表示       |
| グループ選択エリア   | GroupSelector  | ◯    | 複数グループ存在時 | -                          | 2列（モバイル）→4列グリッド |
| チーム選択エリア     | TeamSelector   | ◯    | 複数チーム存在時   | -                          | 2列（モバイル）→4列グリッド |
| スタッフ選択エリア   | StaffSelector  | ◯    | チーム選択後       | -                          | 2列（モバイル）→4列グリッド |
| ローディング表示     | div            | -    | スタッフ選択処理中 | ログイン処理中...          | 青色背景、スピナー付き   |

## 機能仕様

### URLパラメータ仕様

| パラメータ名      | 型      | 説明                                   | 使用例                                    |
| ----------------- | ------- | -------------------------------------- | ----------------------------------------- |
| `from`            | string  | 遷移元の識別子                         | `header` - ヘッダーからの遷移             |
| `staff`           | string  | スタッフクリックフラグ                 | `true` - スタッフ名クリックからの遷移     |
| `group`           | string  | グループクリックフラグ                 | `true` - グループ・チーム名クリックから   |
| `autoSelectStaff` | string  | スタッフ自動選択制御                   | `false` - 自動選択を無効化               |
| `autoSelectTeam`  | string  | チーム自動選択制御                     | `false` - 自動選択を無効化               |

#### URLパラメータの使用例

```
# ヘッダーのスタッフ名クリック時
/staff-selection?from=header&staff=true&autoSelectStaff=false

# ヘッダーのグループ・チーム名クリック時  
/staff-selection?from=header&group=true&autoSelectTeam=false
```

### アクション

| 項目名           | 処理内容                               | 対象API                    | 遷移先画面                         |
| ---------------- | -------------------------------------- | -------------------------- | ---------------------------------- |
| グループ選択     | グループを選択し、チーム一覧を更新     | -                          | 同一画面（チーム選択エリア表示）   |
| チーム選択       | チームを選択し、スタッフ一覧を更新     | -                          | 同一画面（スタッフ選択エリア表示） |
| スタッフ選択     | スタッフを選択し、自動ログイン処理実行 | -                          | ダッシュボード画面 (`/`)           |
| ログアウトボタン | 認証情報をクリアしてログアウト         | -                          | ログイン画面 (`/login`)            |

### 入力チェック

| 項目名         | イベント | チェック内容       | エラーメッセージ                                   |
| -------------- | -------- | ------------------ | -------------------------------------------------- |
| グループ選択   | click    | 必須選択チェック   | グループを選択してください                         |
| チーム選択     | click    | 必須選択チェック   | チームを選択してください                           |
| スタッフ選択   | click    | 必須選択チェック   | スタッフを選択してください                         |
| スタッフ選択   | click    | 有効性チェック     | 有効なスタッフを選択してください                   |
| ログインボタン | click    | 全項目選択チェック | グループ、チーム、スタッフをすべて選択してください |

### バリデーション仕様

#### 自動選択ロジック

- **グループ自動選択**: 組織に1つのグループしかない場合、自動的に選択状態にする
- **チーム自動選択**: 選択されたグループに1つのチームしかない場合、自動的に選択状態にする
- **自動ログイン処理**: スタッフ選択後、500ms待機してから自動的にログイン処理を実行

#### ヘッダーナビゲーション連携

- **スタッフ名クリック時**: 現在のグループ・チームを選択状態にし、スタッフ自動選択を無効化
- **グループ・チーム名クリック時**: 現在のグループ・チームを選択状態にし、チーム自動選択を無効化
- **選択状態復元**: localStorageから`selectedStaffData`を読み込み、適切な選択状態を復元

#### localStorage連携

```typescript
interface SelectedStaffData {
  staff: Staff;
  groupName: string;
  teamName: string;
}
```

- **保存キー**: `carebase_selected_staff_data`
- **保存タイミング**: スタッフ選択完了時
- **読み込みタイミング**: 画面初期化時、ヘッダーナビゲーション時

#### スムーズスクロール機能

- **グループ選択後**: チーム選択エリアへ自動スクロール（100ms遅延）
- **チーム選択後**: スタッフ選択エリアへ自動スクロール（100ms遅延）
- **画面初期化時**: スタッフ選択エリアへ自動スクロール（300ms遅延）

#### エラーハンドリング

- 無効なスタッフ選択時のエラー表示: `有効なスタッフを選択してください`
- localStorage操作エラーのコンソール出力
- 選択処理中のローディング状態表示

## UI/UX仕様

### レスポンシブデザイン

- **グループ選択**: 2列（モバイル）→ 4列
- **チーム選択**: 2列（モバイル）→ 4列
- **スタッフ選択**: 2列（モバイル）→ 4列

### カラーテーマ

- **選択状態**: `ring-2 ring-carebase-blue bg-carebase-blue text-white shadow-lg`
- **ホバー状態**: `hover:ring-1 hover:ring-carebase-blue-light hover:shadow-md`
- **無効状態**: `cursor-not-allowed opacity-50`
- **ログアウトボタン**: `text-red-600 border-red-300 hover:bg-red-50`

### アニメーション

- **スムーズスクロール**: 選択後に次のエリアへ自動スクロール（`behavior: 'smooth', block: 'start'`）
- **トランジション**: 選択状態変更時のカラー変更アニメーション（`transition-colors`）
- **ローディング**: スタッフ選択処理中の500ms待機とスピナー表示

### ローディング状態

```html
<div className="flex flex-col items-center justify-center py-4 bg-blue-50 rounded-lg border border-blue-200">
  <div className="flex items-center gap-2 mb-2">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
    <p className="text-blue-800 font-semibold">ログイン処理中...</p>
  </div>
  <p className="text-blue-600 text-sm">少々お待ちください</p>
</div>
```

## コンポーネント仕様

### StaffSelectionScreen

**ファイル**: `components/3_organisms/auth/staff-selection-screen.tsx`

```typescript
interface StaffSelectionScreenProps {
  onStaffSelected: (staff: Staff) => void;
  onLogout?: () => void;
  fromHeader?: boolean;
  fromStaffClick?: boolean;
  fromGroupClick?: boolean;
  autoSelectStaff?: boolean;
  autoSelectTeam?: boolean;
  selectedStaffData?: SelectedStaffData;
  className?: string;
}
```

### GroupSelector

**ファイル**: `components/2_molecules/auth/group-selector.tsx`

- **表示内容**: グループ名、説明、チーム数、アイコン
- **レイアウト**: `grid-cols-2 md:grid-cols-4`
- **選択状態**: `ring-2 ring-carebase-blue bg-carebase-blue text-white`
- **disabled対応**: クリック無効化、透明度50%

### TeamSelector

**ファイル**: `components/2_molecules/auth/team-selector.tsx`

- **表示内容**: チーム名、説明、スタッフ数、アイコン
- **レイアウト**: `grid-cols-2 md:grid-cols-4`
- **選択状態**: `ring-2 ring-carebase-blue bg-carebase-blue text-white`
- **disabled対応**: クリック無効化、透明度50%

### StaffSelector

**ファイル**: `components/2_molecules/auth/staff-selector.tsx`

- **表示内容**: アクティブなスタッフのみ表示
- **レイアウト**: `grid-cols-2 md:grid-cols-4`
- **空状態**: `このチームには現在利用可能なスタッフがいません。`

### StaffCard

**ファイル**: `components/1_atoms/staff/staff-card.tsx`

```typescript
interface StaffCardProps {
  staff: Staff;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
```

- **表示内容**: アバター、役職バッジ、名前、ふりがな
- **役職バッジ色**:
  - 施設長: `bg-purple-100 text-purple-700`
  - 主任介護職員: `bg-blue-100 text-blue-700`
  - 看護師: `bg-green-100 text-green-700`
  - 介護職員: `bg-orange-100 text-orange-700`
  - 事務職員: `bg-gray-100 text-gray-700`

## API仕様

### データ構造

```typescript
interface SelectedStaffData {
  staff: Staff;
  groupName: string;
  teamName: string;
}

interface Staff {
  id: string;
  name: string;
  furigana: string;
  role: string;
  avatar?: string;
  isActive: boolean;
}
```

### localStorage操作

```typescript
// 保存
localStorage.setItem('carebase_selected_staff_data', JSON.stringify(selectedStaffData));

// 読み込み
const data = localStorage.getItem('carebase_selected_staff_data');
const selectedStaffData = data ? JSON.parse(data) : null;

// クリア（ログアウト時）
localStorage.removeItem('carebase_selected_staff_data');
localStorage.removeItem('carebase_token');
localStorage.removeItem('carebase_user');
```

## 参考資料

- [ログイン画面設計書](../login/README.md)
- [Issue #139: （認証）｜スタッフ選択](https://github.com/ambi-tious/CareBase-staff/issues/139)
- [画面一覧](../../../docs/screen-list.md#認証関連)
- [スタッフ選択画面実装](./page.tsx)
- [StaffSelectionScreen コンポーネント](../../../components/3_organisms/auth/staff-selection-screen.tsx)
- [AppHeader コンポーネント](../../../components/3_organisms/layout/app-header.tsx)
