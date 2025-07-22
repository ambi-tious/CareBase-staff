# 服薬状況タブ設計書

画面名: `服薬状況タブ`  
パス: `/residents/[residentId]` (詳細情報タブ内)  
URL: https://carebase-staff.vercel.app/residents/[residentId]

## 概要

利用者詳細画面内の服薬状況タブ設計書です。  
利用者の服薬状況記録の表示、登録、編集、削除機能を提供します。  
複数の服薬状況記録を管理し、登録日順でソート表示することで、服薬の経過を効率的に追跡できます。

Issue: [#174 [設計] #005-6 利用者｜利用者詳細（服薬状況）](https://github.com/ambi-tious/CareBase-staff/issues/174)

## 全体レイアウト

<img width="1051" height="266" alt="image" src="https://github.com/user-attachments/assets/aa16f3d2-1ea3-423d-a90f-4e2e7f3ef81b" />

### 画面構成

タブ内で完結する服薬状況記録管理インターフェース：

- タブヘッダー（服薬状況タブ選択状態）
- 追加ボタン（右上配置）
- 服薬状況記録カード一覧（登録日の新しい順で表示）
- 空状態メッセージ（データなし時）

### 画面項目

| 項目名             | コンポーネント       | 必須 | 表示条件     | 初期値                     | 備考                              |
| ------------------ | -------------------- | ---- | ------------ | -------------------------- | --------------------------------- |
| タブヘッダー       | TabsTrigger          | -    | 常時         | 服薬状況                   | アクティブ状態で青色表示          |
| 追加ボタン         | Button               | -    | 常時         | 追加                       | 右上配置、プラスアイコン付き      |
| 服薬状況記録カード | MedicationStatusCard | -    | データ存在時 | -                          | 登録日の新しい順で表示            |
| 空状態メッセージ   | テキスト             | -    | データなし時 | 服薬状況記録はありません。 | 中央配置、グレー文字              |
| 記録アイコン       | Icon                 | ◯    | カード内     | FileText                   | 緑色背景の円形アイコン            |
| 登録日表示         | CardHeader           | ◯    | カード内     | -                          | Calendar アイコン付き、日本語形式 |
| 編集ボタン         | Button               | -    | カード内     | 編集                       | 鉛筆アイコン付き                  |
| 削除ボタン         | Button               | -    | カード内     | 削除                       | ゴミ箱アイコン付き、赤色          |
| 内容表示           | CardContent          | ◯    | カード内     | -                          | 改行対応テキスト表示              |
| メモ表示           | CardContent          | -    | カード内     | -                          | 境界線付きで下部表示              |

## 機能仕様

### アクション

| 項目名     | 処理内容                       | 対象API                                               | 遷移先画面                 |
| ---------- | ------------------------------ | ----------------------------------------------------- | -------------------------- |
| 追加ボタン | 服薬状況記録登録モーダルを表示 | -                                                     | 同一画面（モーダル表示）   |
| 編集ボタン | 服薬状況記録編集モーダルを表示 | -                                                     | 同一画面（モーダル表示）   |
| 削除ボタン | 削除確認モーダルを表示         | -                                                     | 同一画面（モーダル表示）   |
| 登録処理   | 新しい服薬状況記録を登録       | `/api/v1/residents/{id}/medication-status`            | 同一画面（モーダル閉じる） |
| 編集処理   | 既存の服薬状況記録を更新       | `/api/v1/residents/{id}/medication-status/{statusId}` | 同一画面（モーダル閉じる） |
| 削除処理   | 既存の服薬状況記録を削除       | `/api/v1/residents/{id}/medication-status/{statusId}` | 同一画面（モーダル閉じる） |

### ソート機能仕様

- **表示順序**: 登録日（date）の新しい順（降順）
- **自動ソート**: 新規登録時は自動的に最上位に表示
- **更新時**: 編集時は登録日が変更されない限り表示順序を維持

### モーダル仕様

<img height="350" alt="image" src="https://github.com/user-attachments/assets/ac04e5e8-0bf0-4183-8269-e9675c40826c" />
<img height="350" alt="image" src="https://github.com/user-attachments/assets/7dafaa34-febb-4e89-8a6c-04268b88916c" />

#### 登録モーダル

| 項目名           | コンポーネント    | 必須 | 初期値                                   | 備考                                                         |
| ---------------- | ----------------- | ---- | ---------------------------------------- | ------------------------------------------------------------ |
| モーダルタイトル | DialogTitle       | -    | 服薬状況の登録                           | 太字、青色                                                   |
| 説明文           | DialogDescription | -    | {利用者名}様の服薬状況を登録してください | 必須項目説明付き                                             |
| 登録日入力       | Input             | ◯    | 今日の日付                               | date形式、今日以前の日付のみ                                 |
| 内容入力         | Textarea          | ◯    | -                                        | プレースホルダー: 例：朝食後の薬を服用済み、副作用なし       |
| メモ入力         | Textarea          | -    | -                                        | プレースホルダー: 特記事項や観察内容があれば記入してください |
| キャンセルボタン | Button            | -    | キャンセル                               | アウトライン、グレー                                         |
| 登録ボタン       | Button            | -    | 登録                                     | 青色、送信時は「登録中...」                                  |

#### 編集モーダル

登録モーダルと同様の構成で、以下の違いがあります：

| 項目名           | 相違点                           |
| ---------------- | -------------------------------- |
| モーダルタイトル | 服薬状況の編集                   |
| フォーム初期値   | 既存データで各フィールドを初期化 |
| 登録ボタンラベル | 更新                             |

#### 削除確認モーダル

<img height="200" alt="image" src="https://github.com/user-attachments/assets/d772a534-f66a-4d7e-82f8-f70cac62aade" />

| 項目名           | コンポーネント | 必須 | 初期値                                             | 備考                     |
| ---------------- | -------------- | ---- | -------------------------------------------------- | ------------------------ |
| モーダルタイトル | DialogTitle    | -    | 削除の確認                                         | 警告アイコン付き、赤色   |
| 警告メッセージ   | Alert          | -    | この操作は取り消すことができません。               | 上部警告                 |
| 確認メッセージ   | Alert          | -    | {登録日}の服薬状況記録を削除してもよろしいですか？ | 削除対象明示             |
| 注意事項         | テキスト       | -    | 削除されたデータは復元できません。                 | 赤色背景                 |
| キャンセルボタン | Button         | -    | キャンセル                                         | アウトライン、グレー     |
| 削除ボタン       | Button         | -    | 削除する                                           | 赤色、ゴミ箱アイコン付き |

### 入力チェック

| 項目名       | イベント | チェック内容                   | エラーメッセージ                           |
| ------------ | -------- | ------------------------------ | ------------------------------------------ |
| 登録日入力   | blur     | 必須入力チェック               | 登録日は必須です                           |
| 登録日入力   | blur     | 日付形式チェック               | 有効な日付を入力してください（YYYY-MM-DD） |
| 登録日入力   | blur     | 未来日チェック                 | 登録日は今日以前の日付を入力してください   |
| 内容入力     | blur     | 必須入力チェック               | 内容は必須です                             |
| 内容入力     | blur     | 文字数チェック（500文字以内）  | 内容は500文字以内で入力してください        |
| メモ入力     | blur     | 文字数チェック（1000文字以内） | メモは1000文字以内で入力してください       |
| フォーム送信 | submit   | 全必須項目チェック             | 必須項目をすべて入力してください           |

### バリデーション仕様

#### 入力形式

- **登録日**: YYYY-MM-DD形式、今日以前の日付
- **内容**: 1文字以上500文字以内
- **メモ**: 1000文字以内（任意）

#### 表示制御

- 必須項目には赤いアスタリスク（\*）を表示
- エラー時は該当フィールドを赤枠で強調
- 送信中はフォーム全体を無効化
- ネットワークエラー時はリトライボタンを表示

#### エラーハンドリング

- バリデーションエラーの個別表示
- ネットワークエラーの統一表示
- 削除処理エラーの表示
- 楽観的更新とエラー時のロールバック

## UI/UX仕様

### レスポンシブデザイン

- **服薬状況記録カード**: 1列（モバイル）→ 1列（タブレット・デスクトップ）
- **フォームレイアウト**: 1列（モバイル）→ 2列（タブレット以上）
- **カード内情報**: 1列（モバイル）→ 2列（タブレット以上）

### カラーテーマ

- **追加ボタン**: `border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light`
- **編集ボタン**: `variant="outline"` デフォルトスタイル
- **削除ボタン**: `border-red-300 text-red-600 hover:bg-red-50`
- **登録ボタン**: `bg-carebase-blue hover:bg-carebase-blue-dark`
- **記録アイコン背景**: `bg-green-100 text-green-600`
- **登録日表示**: `text-gray-500`

### アイコン使用

- **追加ボタン**: `PlusCircle` アイコン
- **編集ボタン**: `Edit3` アイコン
- **削除ボタン**: `Trash2` アイコン
- **記録アイコン**: `FileText` アイコン
- **登録日表示**: `Calendar` アイコン
- **エラー表示**: `AlertCircle` アイコン
- **リトライボタン**: `RefreshCw` アイコン

### アニメーション

- **モーダル表示**: フェードイン・スケールアニメーション
- **カード追加**: スムーズな挿入アニメーション
- **削除処理**: ローディングスピナー表示
- **ホバー効果**: ボタンの背景色変更トランジション

### アクセシビリティ

- **フォーカス管理**: モーダル内でのキーボードナビゲーション
- **スクリーンリーダー対応**: 適切なaria-label設定
- **エラー表示**: role="alert"でエラーメッセージを通知
- **必須項目表示**: 視覚的・音声的な必須項目の明示

## 実装済みコンポーネント

### 2_molecules層

- **MedicationStatusCard**: 服薬状況記録表示カード
  - パス: `components/2_molecules/medication/medication-status-card.tsx`
  - 機能: 記録内容表示、編集・削除ボタン、日付フォーマット
- **MedicationStatusForm**: 服薬状況記録入力フォーム
  - パス: `components/2_molecules/forms/medication-status-form.tsx`
  - 機能: バリデーション、エラー表示、リトライ機能

### 3_organisms層

- **MedicationStatusRegistrationModal**: 服薬状況記録登録モーダル
  - パス: `components/3_organisms/modals/medication-status-registration-modal.tsx`
  - 機能: 新規登録専用モーダル

- **MedicationStatusModal**: 服薬状況記録編集モーダル
  - パス: `components/3_organisms/modals/medication-status-modal.tsx`
  - 機能: 編集・新規登録モード対応

- **GenericDeleteModal**: 汎用削除確認モーダル
  - パス: `components/3_organisms/modals/generic-delete-modal.tsx`
  - 機能: 削除確認、エラー表示、項目名のカスタマイズ

### サービス層

- **medicationStatusService**: 服薬状況記録のCRUD操作
  - パス: `services/medicationStatusService.ts`
  - 機能: API通信、モック実装、エラーハンドリング

### 型定義

- **MedicationStatus**: 服薬状況記録エンティティ型
- **MedicationStatusFormData**: フォームデータ型
- **medicationStatusFormSchema**: バリデーションスキーマ
  - パス: `types/medication-status.ts`

## API仕様

### エンドポイント

| メソッド | エンドポイント                                        | 説明                     |
| -------- | ----------------------------------------------------- | ------------------------ |
| POST     | `/api/v1/residents/{id}/medication-status`            | 新しい服薬状況記録を作成 |
| PUT      | `/api/v1/residents/{id}/medication-status/{statusId}` | 既存の服薬状況記録を更新 |
| DELETE   | `/api/v1/residents/{id}/medication-status/{statusId}` | 服薬状況記録を削除       |

### リクエスト形式

```typescript
// POST, PUT リクエストボディ
{
  date: string;        // YYYY-MM-DD形式
  content: string;     // 500文字以内
  notes?: string;      // 1000文字以内（任意）
}
```

### レスポンス形式

```typescript
// POST, PUT レスポンス
{
  id: string;
  date: string;
  content: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

## 参考資料

- [利用者詳細画面実装](../page.tsx)
- [ResidentDetailTabs コンポーネント](../../../../components/3_organisms/resident/resident-detail-tabs.tsx)
- [MedicationStatusCard コンポーネント](../../../../components/2_molecules/medication/medication-status-card.tsx)
- [MedicationStatusForm コンポーネント](../../../../components/2_molecules/forms/medication-status-form.tsx)
- [MedicationStatusRegistrationModal コンポーネント](../../../../components/3_organisms/modals/medication-status-registration-modal.tsx)
- [MedicationStatusModal コンポーネント](../../../../components/3_organisms/modals/medication-status-modal.tsx)
- [GenericDeleteModal コンポーネント](../../../../components/3_organisms/modals/generic-delete-modal.tsx)
- [Medication Status Types](../../../../types/medication-status.ts)
- [Medication Status Service](../../../../services/medicationStatusService.ts)
- [Issue #174: [設計] #005-6 利用者｜利用者詳細（服薬状況）](https://github.com/ambi-tious/CareBase-staff/issues/174)
- [Issue #133: 利用者詳細（基本情報）](https://github.com/ambi-tious/CareBase-staff/issues/133)
- [ご家族情報タブ設計書](../family-info/README.md)
