# 記録データ一覧画面設計書

画面名: `記録データ一覧`  
パス: `/residents/[residentId]/records`  
URL: https://carebase-staff.vercel.app/residents/1/records

## 概要

CareBase-staffアプリケーションの記録データ一覧画面設計書です。  
利用者の記録データ（ケア記録・介護記録・申し送り）を日次・月次で表示し、効率的な記録管理を提供します。  
利用者詳細画面の「記録データ」ボタンから遷移し、日次表示では詳細な記録内容を、月次表示では数値統計を表示します。

## 全体レイアウト

### 画面構成

記録データ管理のメイン画面として以下の要素で構成：

- ページヘッダー（戻るボタン、利用者名、画面タイトル）
- 利用者情報表示エリア
- 表示形式切り替えタブ（日次・月次）
- 日付ナビゲーション（前日/前月・翌日/翌月ボタン、日付選択）
- メインコンテンツエリア（日次表示または月次表示）

### 画面項目

| 項目名               | コンポーネント | 必須 | 表示条件     | 初期値     | 備考                                 |
| -------------------- | -------------- | ---- | ------------ | ---------- | ------------------------------------ |
| 戻るボタン           | Button         | -    | 常時         | 戻る       | ArrowLeft アイコン付き               |
| 画面タイトル         | Heading        | -    | 常時         | 記録データ | FileText アイコン付き                |
| 利用者情報表示       | Card           | -    | 常時         | -          | 利用者名・要介護度・部屋情報         |
| 表示切り替えタブ     | TabsList       | -    | 常時         | 日次表示   | 日次表示/月次表示の切り替え          |
| 日付ナビゲーション   | ButtonGroup    | -    | 常時         | 今日の日付 | 前日/前月・翌日/翌月ボタン           |
| 日付選択             | DatePicker     | -    | 常時         | 今日の日付 | カレンダーポップオーバー             |
| 日次表示             | DailyView      | -    | 日次選択時   | -          | ケア記録・申し送りの詳細表示         |
| 月次表示             | MonthlyView    | -    | 月次選択時   | -          | カテゴリ別統計・カレンダーヒートマップ |

## 機能仕様

### 表示モード

#### 日次表示

- 選択した日のケア記録と申し送りを時系列で表示
- 各記録の詳細情報（時間・記録者・分類・内容）を表示
- チェックボックスによる複数選択機能
- 選択削除機能
- 新規作成ボタン

#### 月次表示

- 選択した月の記録統計を表示
- カテゴリ別記録数の集計
- 日別記録数のカレンダーヒートマップ
- 月間サマリー（総記録数・平均記録数・記録日数）

### アクション

| 項目名             | 処理内容                       | 対象API | 遷移先画面                         |
| ------------------ | ------------------------------ | ------- | ---------------------------------- |
| 戻るボタン         | 利用者詳細画面に戻る           | -       | 利用者詳細画面 (`/residents/{id}`) |
| 表示切り替え       | 日次/月次表示の切り替え        | -       | 同一画面（表示モード変更）         |
| 日付ナビゲーション | 日/月単位での日付移動          | -       | 同一画面（表示データ更新）         |
| 日付選択           | カレンダー表示の日付変更       | -       | 同一画面（表示データ更新）         |
| 記録詳細表示       | 選択した記録の詳細画面に遷移   | -       | 記録詳細画面                       |
| 新規作成           | 新規記録作成画面に遷移         | -       | 新規作成画面                       |
| 選択削除           | 選択した記録を一括削除         | -       | 同一画面（記録削除）               |

### データ型定義

```typescript
interface RecordDataViewProps {
  resident: Resident;
}

interface DailyViewProps {
  resident: Resident;
  selectedDate: Date | null;
  careRecords: CareRecord[];
  handovers: Handover[];
}

interface MonthlyViewProps {
  resident: Resident;
  selectedDate: Date | null;
  careRecords: CareRecord[];
}
```

## UI/UX仕様

### レスポンシブデザイン

- **モバイル（〜768px）**:
  - タブとナビゲーションを縦積み表示
  - テーブルを横スクロール対応
- **タブレット（768px〜1024px）**:
  - タブとナビゲーションを横並び表示
  - 統計カードを2列グリッド表示
- **デスクトップ（1024px〜）**:
  - 全機能を横並びで表示
  - 統計カードを3列グリッド表示

### カラーテーマ

- **日次表示タブ**: アクティブ時 `bg-carebase-blue text-white`
- **月次表示タブ**: アクティブ時 `bg-carebase-blue text-white`
- **ケア記録セクション**: `text-orange-600` アイコン
- **申し送りセクション**: `text-blue-600` アイコン
- **新規作成ボタン**: `border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light`
- **選択削除ボタン**: `border-red-300 text-red-600 hover:bg-red-50`

### アニメーション

- **タブ切り替え**: スムーズなトランジション
- **カレンダーセル**: `hover:scale-105` ホバー効果
- **テーブル行**: `hover:bg-gray-50` ホバー効果

### アクセシビリティ

- **キーボードナビゲーション**: Tab キーでの操作対応
- **スクリーンリーダー**: 適切な aria-label 設定
- **コントラスト比**: WCAG 2.1 AA レベル準拠

## 技術仕様

### 使用コンポーネント

#### 3_organisms層

- **RecordDataView**: メイン画面コンポーネント
- **RecordDataDailyView**: 日次表示コンポーネント
- **RecordDataMonthlyView**: 月次表示コンポーネント

#### 1_atoms層

- **CategoryBadge**: 記録種別バッジ表示
- **PriorityBadge**: 重要度バッジ表示
- **StatusBadge**: ステータスバッジ表示

### 状態管理

- **表示モード**: 日次/月次の切り替え状態
- **選択日付**: カレンダー表示での選択日付
- **選択記録**: チェックボックスによる記録選択状態

### データソース

- `careRecordData`: ケア記録データ
- `handoverData`: 申し送りデータ
- 利用者IDによるフィルタリング

## 参考資料

- [記録データ一覧画面実装](./page.tsx)
- [RecordDataView コンポーネント](../../../../components/3_organisms/resident/record-data-view.tsx)
- [RecordDataDailyView コンポーネント](../../../../components/3_organisms/resident/record-data-daily-view.tsx)
- [RecordDataMonthlyView コンポーネント](../../../../components/3_organisms/resident/record-data-monthly-view.tsx)
- [利用者詳細画面設計書](../README.md)
- [Care Record Types](../../../../types/care-record.ts)
- [Handover Types](../../../../types/handover.ts)
- [画面一覧](../../../../docs/screen-list.md#利用者管理)