# 利用者詳細画面（既往歴）設計書

画面名: `利用者詳細（既往歴）`  
パス: `/residents/[residentId]/medical-history`  
URL: https://carebase-staff.vercel.app/residents/[residentId]/medical-history

## 概要

CareBase-staffアプリケーションの利用者詳細画面の既往歴タブ設計書です。  
利用者の既往歴情報を表示・管理し、複数の既往歴を登録可能で発症年月順でソート表示するインターフェースを提供します。  
既往歴の追加、編集、削除機能を備え、医療従事者が利用者の過去の疾患履歴を効率的に管理できます。

Issue: [#172 [設計] #005-4 利用者｜利用者詳細（既往歴）](https://github.com/ambi-tious/CareBase-staff/issues/172)  
親Issue: [#133 [設計] #005 利用者｜利用者詳細（基本情報）](https://github.com/ambi-tious/CareBase-staff/issues/133)

## 全体レイアウト

### 画面構成

利用者詳細画面のタブ内コンテンツとして以下の要素で構成：

- 右上に「追加」ボタンを配置
- 既往歴一覧表示（発症年月の新しい順でソート）
- 各既往歴カードに編集・削除ボタンを配置
- モーダルでフォーム表示（登録・編集）
- 削除時はアラートモーダル表示
- 既往歴がない場合の空状態表示

### 画面項目

| 項目名             | コンポーネント       | 必須 | 表示条件         | 初期値 | 備考                                  |
| ------------------ | -------------------- | ---- | ---------------- | ------ | ------------------------------------- |
| 追加ボタン         | Button               | -    | 常時             | 追加   | 青色スタイル、Plus アイコン、右上配置 |
| 既往歴カード一覧   | MedicalHistoryCard[] | -    | 既往歴データあり | -      | 発症年月降順でソート表示              |
| 病名               | Text                 | ◯    | カード内         | -      | 大文字、太字、青色                    |
| 治療状況バッジ     | Badge                | ◯    | カード内         | -      | 治療中/完治/経過観察/その他           |
| 発症年月           | InfoRow              | ◯    | カード内         | -      | Calendar アイコン付き                 |
| 治療機関           | InfoRow              | -    | 設定時のみ       | -      | Building2 アイコン付き                |
| 備考               | InfoRow              | -    | 設定時のみ       | -      | 2列幅、上部境界線                     |
| 編集ボタン         | Button               | -    | カード内         | 編集   | アウトライン、Edit3 アイコン          |
| 削除ボタン         | Button               | -    | カード内         | 削除   | 赤色アウトライン、Trash2 アイコン     |
| 空状態表示         | EmptyState           | -    | 既往歴データなし | -      | Stethoscope アイコン付きメッセージ    |
| 登録・編集モーダル | MedicalHistoryModal  | -    | ボタン押下時     | -      | 最大幅4xl、スクロール対応             |
| 削除確認モーダル   | GenericDeleteModal   | -    | 削除ボタン押下時 | -      | 既往歴情報の削除確認                  |

## 機能仕様

### アクション

| 項目名       | 処理内容                     | 対象API                                    | 遷移先画面               |
| ------------ | ---------------------------- | ------------------------------------------ | ------------------------ |
| 追加ボタン   | 新規既往歴登録モーダルを開く | -                                          | モーダル表示             |
| 編集ボタン   | 既往歴編集モーダルを開く     | -                                          | モーダル表示             |
| 削除ボタン   | 削除確認モーダルを開く       | -                                          | モーダル表示             |
| 新規登録実行 | 既往歴情報を新規作成         | `residentDataService.createMedicalHistory` | モーダル閉じる、一覧更新 |
| 編集実行     | 既往歴情報を更新             | `residentDataService.updateMedicalHistory` | モーダル閉じる、一覧更新 |
| 削除実行     | 既往歴情報を削除             | `residentDataService.deleteMedicalHistory` | モーダル閉じる、一覧更新 |
| カード表示   | 既往歴詳細情報の表示         | -                                          | 同一画面                 |

### 入力チェック

| 項目名   | イベント | チェック内容                  | エラーメッセージ                        |
| -------- | -------- | ----------------------------- | --------------------------------------- |
| 病名     | blur     | 必須チェック                  | 病名は必須です                          |
| 病名     | blur     | 文字数チェック（100文字以内） | 病名は100文字以内で入力してください     |
| 発症年月 | blur     | 必須チェック                  | 発症年月は必須です                      |
| 発症年月 | blur     | 形式チェック（YYYY-MM）       | 有効な年月を入力してください（YYYY-MM） |
| 発症年月 | blur     | 過去日付チェック              | 発症年月は過去の日付を入力してください  |
| 治療状況 | change   | 必須チェック                  | 治療状況は必須です                      |
| 治療状況 | change   | 選択肢チェック                | 有効な治療状況を選択してください        |
| 治療機関 | blur     | 文字数チェック（100文字以内） | 治療機関は100文字以内で入力してください |
| 備考     | blur     | 文字数チェック（500文字以内） | 備考は500文字以内で入力してください     |

### バリデーション仕様

#### 表示制御

- **既往歴ソート**: 発症年月の新しい順（降順）で表示
- **治療状況バッジ**:
  - 治療中: `bg-blue-100 text-blue-700`
  - 完治: `bg-green-100 text-green-700`
  - 経過観察: `bg-yellow-100 text-yellow-700`
  - その他: `bg-gray-100 text-gray-700`
- **空状態**: 既往歴が登録されていない場合の案内表示
- **条件表示**: 治療機関、備考は入力されている場合のみ表示

#### データ変換

- **発症年月**: フォーム入力（YYYY-MM）→ 表示（YYYY/MM）
- **日付validation**: 現在日時より過去の日付のみ許可
- **文字制限**: 各項目の最大文字数制限

#### エラーハンドリング

- **API通信エラー**: ネットワークエラー時のリトライ機能
- **削除エラー**: 削除失敗時のエラーメッセージ表示
- **フォームエラー**: 入力値検証エラーの項目別表示
- **同時編集制御**: 楽観的ロック制御

## UI/UX仕様

### レスポンシブデザイン

- **モバイル（〜768px）**:
  - 既往歴カードを1列で縦並び表示
  - 追加ボタンを上部に固定配置
  - カード内情報を縦積み表示
- **タブレット（768px〜1024px）**:
  - 既往歴カードを1列で表示
  - カード内情報を2列グリッドで表示
  - ボタンエリアは右寄せ表示
- **デスクトップ（1024px〜）**:
  - 既往歴カードを1列で表示
  - カード内情報を2列グリッドで表示
  - モーダルは最大幅4xlで中央表示

### カラーテーマ

- **追加ボタン**: `bg-carebase-blue hover:bg-carebase-blue-dark text-white`
- **編集ボタン**: `border-gray-300 text-gray-700 hover:bg-gray-50`
- **削除ボタン**: `border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400`
- **病名**: `text-carebase-blue font-bold text-xl`
- **治療状況バッジ**: 状況に応じた色分け（上記参照）
- **情報ラベル**: `text-gray-500 text-sm font-medium`
- **情報値**: `text-carebase-text-primary`

### アニメーション

- **カードホバー**: `hover:shadow-md transition-shadow duration-200`
- **ボタンホバー**: カラー変更アニメーション
- **モーダル表示**: フェードイン・アウト効果
- **削除処理**: ローディングスピナー表示

### アクセシビリティ

- **キーボードナビゲーション**: Tab キーでの要素移動対応
- **スクリーンリーダー**: 適切な aria-label 設定
  - 追加ボタン: `aria-label="新しい既往歴を追加"`
  - 編集ボタン: `aria-label="${病名}の既往歴を編集"`
  - 削除ボタン: `aria-label="${病名}の既往歴を削除"`
- **コントラスト**: WCAG 2.1 AA レベル準拠
- **フォーカス表示**: 明確なフォーカスインジケーター

## 実装済みコンポーネント

### MedicalHistoryCard

- **ファイル**: `components/2_molecules/resident/medical-history-card.tsx`
- **機能**: 既往歴情報表示カード
- **主要Props**:
  - `history`: 既往歴データ
  - `residentId`: 利用者ID
  - `residentName`: 利用者名（モーダル表示用）
  - `onHistoryUpdate`: 更新時コールバック
  - `onHistoryDelete`: 削除時コールバック

### MedicalHistoryModal

- **ファイル**: `components/3_organisms/modals/medical-history-modal.tsx`
- **機能**: 既往歴情報登録・編集モーダル
- **主要Props**:
  - `isOpen`: モーダル表示状態
  - `onClose`: モーダル閉じる処理
  - `onSubmit`: フォーム送信処理
  - `history`: 既往歴データ（編集時）
  - `mode`: 'create' | 'edit'

### MedicalHistoryForm

- **ファイル**: `components/2_molecules/forms/medical-history-form.tsx`
- **機能**: 既往歴情報入力フォーム
- **バリデーション**: Zodスキーマによる入力検証

### ResidentDataService

- **ファイル**: `services/residentDataService.ts`
- **機能**: 既往歴情報のCRUD操作
- **主要メソッド**:
  - `createMedicalHistory(residentId, data)`: 新規作成
  - `updateMedicalHistory(residentId, historyId, data)`: 更新
  - `deleteMedicalHistory(residentId, historyId)`: 削除

## データ型定義

### MedicalHistory (表示用)

```typescript
interface MedicalHistory {
  id: string;
  date: string; // YYYY/MM 形式
  diseaseName: string;
  treatmentStatus: '治療中' | '完治' | '経過観察' | 'その他';
  treatmentInstitution?: string;
  notes?: string;
}
```

### MedicalHistoryFormData (入力用)

```typescript
interface MedicalHistoryFormData {
  diseaseName: string; // 必須、100文字以内
  onsetDate: string; // 必須、YYYY-MM 形式、過去日付
  treatmentStatus: '治療中' | '完治' | '経過観察' | 'その他'; // 必須
  treatmentInstitution?: string; // 任意、100文字以内
  notes?: string; // 任意、500文字以内
}
```

## 完了条件

- [x] 既往歴タブ設計書が作成されている
- [x] 既存の設計書フォーマットに準拠している
- [x] 親Issue #133の仕様と整合性が取れている
- [x] 実装済みコンポーネントとの連携が明確に定義されている
- [x] 機能要件（複数登録、発症年月ソート等）が仕様化されている
- [x] UI/UX仕様（レスポンシブ、アクセシビリティ）が定義されている

## 参考資料

- [Issue #172: [設計] #005-4 利用者｜利用者詳細（既往歴）](https://github.com/ambi-tious/CareBase-staff/issues/172)
- [親Issue #133: [設計] #005 利用者｜利用者詳細（基本情報）](https://github.com/ambi-tious/CareBase-staff/issues/133)
- [利用者詳細画面（基本情報）設計書](../README.md)
- [MedicalHistoryCard コンポーネント](../../../../components/2_molecules/resident/medical-history-card.tsx)
- [MedicalHistoryModal コンポーネント](../../../../components/3_organisms/modals/medical-history-modal.tsx)
- [MedicalHistoryForm コンポーネント](../../../../components/2_molecules/forms/medical-history-form.tsx)
- [ResidentDataService](../../../../services/residentDataService.ts)
- [既往歴データ型定義](../../../../types/resident-data.ts)
- [画面一覧](../../../../docs/screen-list.md#利用者管理)
