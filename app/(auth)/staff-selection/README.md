# スタッフ選択画面設計書

- 画面名: `スタッフ選択`
- パス: `/staff-selection`
- URL: <https://carebase-staff.vercel.app/staff-selection>

## 概要

スタッフ選択画面設計書です。
グループとチームを選択してチームにひもづくスタッフを表示し、選択したスタッフでログインする機能を提供します。
ログイン画面での認証成功後、または既存セッションからのスタッフ変更時に使用されます。

### 主要機能

- **自動選択ロジック**: グループ・チームが単一の場合の自動選択
- **ヘッダーナビゲーション連携**: アプリヘッダーからのスタッフ変更機能
- **localStorage永続化**: 選択されたスタッフ情報の保存・復元
- **スムーズスクロール**: 選択後の自動スクロール機能
- **URLパラメータ制御**: 遷移元に応じた動作制御
- **グループ・チーム変更モード**: 現在のスタッフを維持したままグループ・チームのみ変更
- **現在所属表示**: 各セレクタで現在の所属グループ・チームを視覚的に表示
- **職員マスタ管理連携**: 職員の役職・バッジ色のカスタマイズ対応

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

| 項目名             | コンポーネント | 必須 | 表示条件                   | 初期値                            | 備考                               |
| ------------------ | -------------- | ---- | -------------------------- | --------------------------------- | ---------------------------------- |
| ページタイトル     | CardTitle      | -    | 常時                       | スタッフ選択/グループ・チーム変更 | モードにより動的変更               |
| ログアウトボタン   | Button         | -    | 常時                       | ログアウト                        | 右上に配置、赤色スタイル           |
| 現在スタッフ表示   | Alert          | -    | グループ・チーム変更モード | 現在のスタッフ: {名前}            | 青色背景、現在選択中のスタッフ表示 |
| 変更モード説明     | Alert          | -    | グループ・チーム変更モード | 新しいグループとチームを選択...   | 緑色背景、操作説明                 |
| エラーメッセージ   | Alert          | -    | エラー時                   | -                                 | 選択エラー時に表示                 |
| グループ選択エリア | GroupSelector  | ◯    | 複数グループ存在時         | -                                 | 1列（モバイル）→4列グリッド        |
| チーム選択エリア   | TeamSelector   | ◯    | 複数チーム存在時           | -                                 | 1列（モバイル）→4列グリッド        |
| スタッフ選択エリア | StaffSelector  | ◯    | チーム選択後               | -                                 | 1列（モバイル）→4列グリッド        |
| 変更確定ボタン     | Button         | -    | グループ・チーム変更モード | 変更を確定してメイン画面に戻る    | 緑色背景、変更完了時               |
| ローディング表示   | div            | -    | 処理中                     | ログイン処理中.../更新中...       | 青色/緑色背景、スピナー付き        |

## 機能仕様

### URLパラメータ仕様

| パラメータ名      | 型     | 説明                   | 使用例                                  |
| ----------------- | ------ | ---------------------- | --------------------------------------- |
| `from`            | string | 遷移元の識別子         | `header` - ヘッダーからの遷移           |
| `staff`           | string | スタッフクリックフラグ | `true` - スタッフ名クリックからの遷移   |
| `group`           | string | グループクリックフラグ | `true` - グループ・チーム名クリックから |
| `autoSelectStaff` | string | スタッフ自動選択制御   | `false` - 自動選択を無効化              |
| `autoSelectTeam`  | string | チーム自動選択制御     | `false` - 自動選択を無効化              |

#### URLパラメータの使用例

```bash
# ヘッダーのスタッフ名クリック時
/staff-selection?from=header&staff=true&autoSelectStaff=false

# ヘッダーのグループ・チーム名クリック時
/staff-selection?from=header&group=true&autoSelectTeam=false
```

### アクション

| 項目名                   | 処理内容                                     | 対象API | 遷移先画面                         |
| ------------------------ | -------------------------------------------- | ------- | ---------------------------------- |
| グループ選択             | グループを選択し、チーム一覧を更新           | -       | 同一画面（チーム選択エリア表示）   |
| チーム選択               | チームを選択し、スタッフ一覧を更新           | -       | 同一画面（スタッフ選択エリア表示） |
| スタッフ選択             | スタッフを選択し、自動ログイン処理実行       | -       | ダッシュボード画面 (`/`)           |
| 変更確定ボタン           | グループ・チーム変更情報をlocalStorageに保存 | -       | ダッシュボード画面 (`/`)           |
| ログアウトボタン         | 認証情報をクリアしてログアウト               | -       | ログイン画面 (`/login`)            |
| 現在所属グループクリック | 該当グループを選択状態にする                 | -       | 同一画面                           |
| 現在所属チームクリック   | 該当チームを選択状態にする                   | -       | 同一画面                           |

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
- **グループ・チーム名クリック時**: グループ・チーム変更モードを有効化し、現在のスタッフを維持
- **選択状態復元**: localStorageから`selectedStaffData`を読み込み、適切な選択状態を復元
- **現在所属表示**: 各セレクタで現在の所属グループ・チームを緑色の枠線とバッジで強調表示

#### グループ・チーム変更モード

- **変更モード有効化**: `fromGroupClick=true`時にグループ・チーム変更モードを開始
- **スタッフ維持**: 現在のスタッフ情報を維持し、所属グループ・チームのみ変更
- **変更確定**: 新しいグループ・チーム選択後、localStorageの`selectedStaffData`を更新
- **自動リダイレクト**: 変更確定後、自動的にメイン画面（`/`）にリダイレクト

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

- **グループ選択**: 1列（モバイル）→ 4列
- **チーム選択**: 1列（モバイル）→ 4列
- **スタッフ選択**: 1列（モバイル）→ 4列

### カラーテーマ

- **選択状態**: `ring-2 ring-carebase-blue bg-carebase-blue text-white shadow-lg`
- **現在所属状態**: `ring-2 ring-green-500 bg-green-50 border-green-200`
- **現在所属バッジ**: `bg-green-100 text-green-700 border-green-300`
- **ホバー状態**: `hover:ring-1 hover:ring-carebase-blue-light hover:shadow-md`
- **無効状態**: `cursor-not-allowed opacity-50`
- **ログアウトボタン**: `text-red-600 border-red-300 hover:bg-red-50`
- **グループ・チーム変更モード**:
  - **現在スタッフ表示**: `bg-blue-50 border-blue-200 text-blue-800`
  - **変更説明**: `bg-green-50 border-green-200 text-green-700`
  - **変更確定ボタン**: `bg-green-600 hover:bg-green-700 text-white`
  - **変更処理中**: `bg-green-50 border-green-200 text-green-800`

### アニメーション

- **スムーズスクロール**: 選択後に次のエリアへ自動スクロール（`behavior: 'smooth', block: 'start'`）
- **トランジション**: 選択状態変更時のカラー変更アニメーション（`transition-colors`）
- **ローディング**: スタッフ選択処理中の500ms待機とスピナー表示

### ローディング状態

```html
<div
  className="flex flex-col items-center justify-center py-4 bg-blue-50 rounded-lg border border-blue-200"
>
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
- **現在所属状態**: `ring-2 ring-green-500 bg-green-50 border-green-200` + "現在の所属"バッジ
- **disabled対応**: クリック無効化、透明度50%
- **現在所属表示**: 現在のグループには緑色の枠線と専用バッジを表示

### TeamSelector

**ファイル**: `components/2_molecules/auth/team-selector.tsx`

- **表示内容**: チーム名、説明、スタッフ数、アイコン
- **レイアウト**: `grid-cols-2 md:grid-cols-4`
- **選択状態**: `ring-2 ring-carebase-blue bg-carebase-blue text-white`
- **現在所属状態**: `ring-2 ring-green-500 bg-green-50 border-green-200` + "現在の所属"バッジ
- **disabled対応**: クリック無効化、透明度50%
- **現在所属表示**: 現在のチームには緑色の枠線と専用バッジを表示

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
- **役職バッジ色**: 職員マスタ管理でカスタマイズ可能
  - **デフォルト色**:
    - 施設長: `bg-purple-100 text-purple-700`
    - 主任介護職員: `bg-blue-100 text-blue-700`
    - 看護師: `bg-green-100 text-green-700`
    - 介護職員: `bg-orange-100 text-orange-700`
    - 事務職員: `bg-gray-100 text-gray-700`
  - **カスタマイズ対応**: 職員マスタで役職ごとのバッジ色を設定可能
  - **選択時色調整**: 選択状態時は自動的に色を濃く調整（例: `bg-purple-200 text-purple-900`）

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
  employeeId: string;
  avatar?: string;
  isActive: boolean;
  roleBadgeColor?: RoleBadgeColor; // 職員マスタ管理でカスタマイズされたバッジ色
}

interface RoleBadgeColor {
  normal: string; // 通常時のTailwind CSSクラス（例: "bg-purple-100 text-purple-700"）
  selected: string; // 選択時のTailwind CSSクラス（例: "bg-purple-200 text-purple-900"）
}

interface RoleMaster {
  id: string;
  name: string; // 役職名
  badgeColor: RoleBadgeColor;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StaffMaster {
  id: string;
  name: string;
  furigana: string;
  roleId: string; // RoleMasterのID
  employeeId: string;
  avatar?: string;
  isActive: boolean;
  groupId: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
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

### 職員マスタ管理API

```typescript
// 役職マスタ取得
GET /api/roles
Response: RoleMaster[]

// 役職マスタ作成/更新
POST /api/roles
PUT /api/roles/{roleId}
Request: Omit<RoleMaster, 'id' | 'createdAt' | 'updatedAt'>

// 職員マスタ取得
GET /api/staff
Response: StaffMaster[]

// 職員マスタ作成/更新
POST /api/staff
PUT /api/staff/{staffId}
Request: Omit<StaffMaster, 'id' | 'createdAt' | 'updatedAt'>

// バッジ色の動的取得
GET /api/staff/{staffId}/badge-color
Response: RoleBadgeColor
```

## 職員マスタ管理機能

### 役職マスタ管理

- **役職作成**: 新しい役職の作成（名前、バッジ色、表示順の設定）
- **バッジ色カスタマイズ**: 役職ごとにTailwind CSSクラスを指定してバッジ色を設定
- **表示順管理**: 役職の表示順序を設定
- **有効/無効切り替え**: 役職の有効・無効状態を管理

#### バッジ色設定例

```typescript
const roleBadgeColors = {
  "施設長": {
    normal: "bg-purple-100 text-purple-700 border-purple-200",
    selected: "bg-purple-200 text-purple-900 border-purple-300"
  },
  "主任介護職員": {
    normal: "bg-blue-100 text-blue-700 border-blue-200",
    selected: "bg-blue-200 text-blue-900 border-blue-300"
  },
  "看護師": {
    normal: "bg-green-100 text-green-700 border-green-200",
    selected: "bg-green-200 text-green-900 border-green-300"
  },
  // カスタム役職例
  "ケアマネージャー": {
    normal: "bg-indigo-100 text-indigo-700 border-indigo-200",
    selected: "bg-indigo-200 text-indigo-900 border-indigo-300"
  }
};
```

### 職員マスタ管理

- **職員登録**: 新しい職員の登録（基本情報、役職、所属グループ・チーム）
- **所属管理**: 職員の所属グループ・チームの変更
- **役職変更**: 職員の役職変更（バッジ色も自動的に反映）
- **有効/無効切り替え**: 職員の有効・無効状態を管理
- **プロフィール画像管理**: アバター画像のアップロード・変更

### StaffCardでの色適用ロジック

```typescript
const getRoleBadgeColor = (staff: Staff, isSelected: boolean) => {
  // カスタマイズされたバッジ色があれば使用
  if (staff.roleBadgeColor) {
    return isSelected ? staff.roleBadgeColor.selected : staff.roleBadgeColor.normal;
  }
  
  // デフォルトの色を使用
  const defaultColors = {
    '施設長': { normal: 'bg-purple-100 text-purple-700', selected: 'bg-purple-200 text-purple-900' },
    '主任介護職員': { normal: 'bg-blue-100 text-blue-700', selected: 'bg-blue-200 text-blue-900' },
    '看護師': { normal: 'bg-green-100 text-green-700', selected: 'bg-green-200 text-green-900' },
    '介護職員': { normal: 'bg-orange-100 text-orange-700', selected: 'bg-orange-200 text-orange-900' },
    '事務職員': { normal: 'bg-gray-100 text-gray-700', selected: 'bg-gray-200 text-gray-900' },
  };
  
  const roleColor = defaultColors[staff.role] || defaultColors['事務職員'];
  return isSelected ? roleColor.selected : roleColor.normal;
};
```

## 参考資料

- [ログイン画面設計書](../login/README.md)
- [Issue #139: （認証）｜スタッフ選択](https://github.com/ambi-tious/CareBase-staff/issues/139)
- [画面一覧](../../../docs/screen-list.md#認証関連)
- [スタッフ選択画面実装](./page.tsx)
- [StaffSelectionScreen コンポーネント](../../../components/3_organisms/auth/staff-selection-screen.tsx)
- [AppHeader コンポーネント](../../../components/3_organisms/layout/app-header.tsx)
