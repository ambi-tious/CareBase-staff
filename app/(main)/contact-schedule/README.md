# 連絡・予定画面設計書

- 画面名: `連絡・予定`
- パス: `/contact-schedule`
- URL: https://carebase-staff.vercel.app/contact-schedule

## 概要

連絡・予定画面設計書です。
職員間の連絡事項、予定、申し送りを効率的に管理・表示する機能を提供します。
週間表示と月間表示の2つのカレンダー表示方式を切り替えて使用できます。

## 全体レイアウト

### 画面構成

連絡・予定管理のメイン画面として以下の要素で構成：

- ページヘッダー（タイトル、週間/月間表示切り替え、アクションボタン）
- 日付ナビゲーション（前週/前月・翌週/翌月ボタン、日付選択）
- フィルターパネル（表示時のみ）
- メインコンテンツエリア（週間表示または月間表示）

### 画面項目

| 項目名             | コンポーネント | 必須 | 表示条件     | 初期値     | 備考                                 |
| ------------------ | -------------- | ---- | ------------ | ---------- | ------------------------------------ |
| ページタイトル     | Heading        | -    | 常時         | 連絡・予定 | MessageSquare アイコン付き           |
| 表示切り替えボタン | ButtonGroup    | -    | 常時         | 週間表示   | 週間表示/月間表示の切り替え          |
| フィルターボタン   | Button         | -    | 常時         | フィルター | Filter アイコン付き                  |
| 新規作成ボタン     | Button         | -    | 常時         | 新規作成   | Plus アイコン付き、青色スタイル      |
| 日付ナビゲーション | ButtonGroup    | -    | 常時         | 今日の日付 | 前週/前月・翌週/翌月ボタン           |
| 日付選択           | DatePicker     | -    | 常時         | 今日の日付 | カレンダーポップオーバー             |
| フィルターパネル   | Card           | -    | フィルター時 | -          | 種別・ステータス・重要度でフィルター |
| 週間表示           | WeekView       | -    | 週間選択時   | -          | 日別のタイムライン表示               |
| 月間表示           | MonthView      | -    | 月間選択時   | -          | カレンダーグリッド表示               |

## 機能仕様

### 表示モード

#### 週間表示

<img width="1881" height="800" alt="image" src="https://github.com/user-attachments/assets/6512ffa3-bc7e-49d5-83ab-17f55a192150" />

- 選択した週の7日間を縦に並べて表示
- 各日の予定・連絡事項を時系列で表示
- 今日の日付をハイライト表示
- 選択した日付をリング表示で強調

#### 月間表示

<img width="1882" height="888" alt="image" src="https://github.com/user-attachments/assets/7c04efa2-5c22-4b9e-b169-332161a8496e" />

- 選択した月のカレンダーグリッド表示
- 各日付セルに最大3件の予定を表示
- 3件を超える場合は「+N件」で表示
- 今日の日付を青色でハイライト

### アクション

| 項目名             | 処理内容                       | 対象API                         | 遷移先画面                       |
| ------------------ | ------------------------------ | ------------------------------- | -------------------------------- |
| 表示切り替え       | 週間/月間表示の切り替え        | -                               | 同一画面（表示モード変更）       |
| フィルター表示     | フィルターパネルの表示・非表示 | -                               | 同一画面（フィルターパネル表示） |
| 新規作成           | 新規連絡・予定作成画面に遷移   | -                               | 新規作成画面                     |
| 日付ナビゲーション | 週/月単位での日付移動          | -                               | 同一画面（表示データ更新）       |
| 日付選択           | カレンダー表示の日付変更       | -                               | 同一画面（表示データ更新）       |
| 項目詳細表示       | 選択した項目の詳細画面に遷移   | -                               | 詳細画面                         |
| ステータス変更     | 項目のステータスを更新         | `/api/v1/contact-schedule/{id}` | 同一画面（ステータス更新）       |

### フィルター機能

| フィルター項目 | 選択肢                 | 説明                     |
| -------------- | ---------------------- | ------------------------ |
| 種別           | 連絡事項/予定/申し送り | 項目の種別による絞り込み |
| ステータス     | 未読/確認済み/完了     | 対応状況による絞り込み   |
| 重要度         | 高/中/低               | 重要度による絞り込み     |

### データ型定義

```typescript
interface ContactScheduleItem {
  id: string;
  title: string;
  content: string;
  type: 'contact' | 'schedule' | 'handover';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'confirmed' | 'completed';
  assignedTo: string;
  assignedToId: string;
  dueDate: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags?: string[];
  relatedResidentId?: string;
  relatedResidentName?: string;
}
```

## UI/UX仕様

### レスポンシブデザイン

- **モバイル（〜768px）**:
  - ボード表示は1列で縦並び
  - アクションボタンは縦積み配置
- **タブレット（768px〜1024px）**:
  - ボード表示は2列グリッド
  - アクションボタンは横並び配置
- **デスクトップ（1024px〜）**:
  - ボード表示は3列グリッド
  - 全機能を横並びで表示

### カラーテーマ

- **種別バッジ**:
  - 連絡事項: `bg-green-100 text-green-700 border-green-200`
  - 予定: `bg-blue-100 text-blue-700 border-blue-200`
  - 申し送り: `bg-purple-100 text-purple-700 border-purple-200`
- **重要度バッジ**:
  - 高: `bg-red-100 text-red-700 border-red-200`
  - 中: `bg-yellow-100 text-yellow-700 border-yellow-200`
  - 低: `bg-blue-100 text-blue-700 border-blue-200`
- **ステータス列**:
  - 未対応: `bg-red-100 border-red-200`
  - 確認済み: `bg-yellow-100 border-yellow-200`
  - 完了: `bg-green-100 border-green-200`

### アニメーション

- **カード表示**: `hover:shadow-md transition-shadow`
- **表示切り替え**: スムーズなトランジション
- **ステータス変更**: 楽観的更新による即座のUI反映

### アクセシビリティ

- **キーボードナビゲーション**: Tab キーでの操作対応
- **スクリーンリーダー**: 適切な aria-label 設定
- **コントラスト比**: WCAG 2.1 AA レベル準拠

## 技術仕様

### 使用コンポーネント

#### 3_organisms層

- **ContactScheduleBoard**: メイン画面コンポーネント
- **ContactScheduleCalendarView**: カレンダー表示コンポーネント

#### 1_atoms層

- **Badge**: 種別・重要度・ステータス表示
- **Button**: アクションボタン
- **Card**: 項目表示カード

### 状態管理

- **表示モード**: 週間/月間の切り替え状態
- **選択日付**: カレンダー表示での選択日付
- **フィルター**: フィルター条件の状態
- **データ**: 連絡・予定データの管理

### モックデータ

- `mocks/contact-schedule-data.ts` にサンプルデータを定義
- 種別、重要度、ステータス別のデータを含む
- 検索・フィルター機能のヘルパー関数を提供

## 参考資料

- [連絡・予定画面実装](./page.tsx)
- [ContactScheduleBoard コンポーネント](../../../components/3_organisms/contact-schedule/contact-schedule-board.tsx)
- [ContactScheduleCalendarView コンポーネント](../../../components/3_organisms/contact-schedule/contact-schedule-calendar-view.tsx)
- [Contact Schedule Data](../../../mocks/contact-schedule-data.ts)
- [画面一覧](../../../docs/screen-list.md#連絡予定)
