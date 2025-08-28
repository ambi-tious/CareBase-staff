# かかりつけ医療機関タブ設計書

- 画面名: `かかりつけ医療機関タブ`
- パス: `/residents/[residentId]` (詳細情報タブ内)
- URL: https://carebase-staff.vercel.app/residents/1

## 概要

利用者詳細画面内のかかりつけ医療機関タブ設計書です。
利用者のかかりつけ医療機関情報の表示、登録、編集、削除機能を提供します。
複数の医療機関を登録可能で、医療機関名、医師名、連絡先情報を効率的に管理できます。

Issue: [#133 [設計] #005 利用者｜利用者詳細（基本情報）](https://github.com/ambi-tious/CareBase-staff/issues/133)

## 全体レイアウト

<img width="1046" height="514" alt="image" src="https://github.com/user-attachments/assets/a7ae73c3-4d5e-4e14-82be-605e26d38602" />

### 画面構成

タブ内で完結するかかりつけ医療機関管理インターフェース：

- タブヘッダー（かかりつけ医療機関タブ選択状態）
- 追加ボタン（右上配置）
- 医療機関カード一覧（医療機関別表示）
- 空状態メッセージ（データなし時）

### 画面項目

| 項目名           | コンポーネント         | 必須 | 表示条件     | 初期値                           | 備考                         |
| ---------------- | ---------------------- | ---- | ------------ | -------------------------------- | ---------------------------- |
| タブヘッダー     | TabsTrigger            | -    | 常時         | かかりつけ医療機関               | アクティブ状態で青色表示     |
| 追加ボタン       | Button                 | -    | 常時         | 追加                             | 右上配置、プラスアイコン付き |
| 医療機関カード   | MedicalInstitutionCard | -    | データ存在時 | -                                | 医療機関情報表示カード       |
| 空状態メッセージ | テキスト               | -    | データなし時 | かかりつけ医療機関はありません。 | 中央配置、グレー文字         |
| 病院名表示       | CardTitle              | ◯    | カード内     | -                                | 青色、太字で表示             |
| 編集ボタン       | Button                 | -    | カード内     | 編集                             | 鉛筆アイコン付き             |
| 削除ボタン       | Button                 | -    | カード内     | 削除                             | ゴミ箱アイコン付き、赤色     |
| 医師名表示       | テキスト               | ◯    | カード内     | -                                | 基本情報として表示           |
| 電話番号表示     | テキスト               | ◯    | カード内     | -                                | 電話アイコン付き             |
| FAX表示          | テキスト               | -    | カード内     | -                                | 連絡先情報として表示         |
| 住所表示         | テキスト               | ◯    | カード内     | -                                | 位置アイコン付き             |
| 備考表示         | テキスト               | -    | カード内     | -                                | 境界線付きで下部表示         |

## 機能仕様

### アクション

| 項目名     | 処理内容                             | 対象API                                                   | 遷移先画面                 |
| ---------- | ------------------------------------ | --------------------------------------------------------- | -------------------------- |
| 追加ボタン | かかりつけ医療機関登録モーダルを表示 | -                                                         | 同一画面（モーダル表示）   |
| 編集ボタン | かかりつけ医療機関編集モーダルを表示 | -                                                         | 同一画面（モーダル表示）   |
| 削除ボタン | 削除確認モーダルを表示               | -                                                         | 同一画面（モーダル表示）   |
| 登録処理   | 新しいかかりつけ医療機関を登録       | `/v1/residents/{id}/medical-institutions`                 | 同一画面（モーダル閉じる） |
| 編集処理   | 既存のかかりつけ医療機関を更新       | `/v1/residents/{id}/medical-institutions/{institutionId}` | 同一画面（モーダル閉じる） |
| 削除処理   | 既存のかかりつけ医療機関を削除       | `/v1/residents/{id}/medical-institutions/{institutionId}` | 同一画面（モーダル閉じる） |

### モーダル仕様

<img height="350" alt="image" src="https://github.com/user-attachments/assets/dc902764-82d7-43d2-9278-d4866efc5bd7" />
<img height="350" alt="image" src="https://github.com/user-attachments/assets/7b976ac0-972c-4d6d-81cc-941125feff50" />

#### 登録モーダル

| 項目名                 | コンポーネント             | 必須 | 初期値                                                 | 備考                                                         |
| ---------------------- | -------------------------- | ---- | ------------------------------------------------------ | ------------------------------------------------------------ |
| モーダルタイトル       | DialogTitle                | -    | かかりつけ医療機関の登録                               | 太字、青色                                                   |
| 説明文                 | DialogDescription          | -    | {利用者名}様のかかりつけ医療機関情報を登録してください | 必須項目説明付き                                             |
| 医療機関選択           | MedicalInstitutionCombobox | ◯    | -                                                      | プレースホルダー: 医療機関を選択してください                 |
| 医療機関管理ボタン     | Button                     | -    | 医療機関管理                                           | 歯車アイコン付き、青色アウトライン                           |
| 医療機関情報表示エリア | Card                       | -    | -                                                      | 選択された医療機関の詳細情報表示                             |
| 医師名選択             | DoctorCombobox             | ◯    | -                                                      | プレースホルダー: 医師を選択してください                     |
| 電話番号表示           | テキスト                   | -    | -                                                      | 医療機関の電話番号（自動設定）                               |
| FAX表示                | テキスト                   | -    | -                                                      | 医療機関のFAX番号（自動設定）                                |
| 住所表示               | テキスト                   | -    | -                                                      | 医療機関の住所（自動設定）                                   |
| 備考入力               | Textarea                   | -    | -                                                      | プレースホルダー: 診療科目や特記事項があれば記入してください |
| キャンセルボタン       | Button                     | -    | キャンセル                                             | アウトライン、グレー                                         |
| 登録ボタン             | Button                     | -    | 登録                                                   | 青色、送信時は「登録中...」                                  |

#### 編集モーダル

登録モーダルと同様の構成で、以下の違いがあります：

| 項目名           | 相違点                           |
| ---------------- | -------------------------------- |
| モーダルタイトル | かかりつけ医療機関の編集         |
| フォーム初期値   | 既存データで各フィールドを初期化 |
| 登録ボタンラベル | 更新                             |

#### 削除確認モーダル

<img height="200" alt="image" src="https://github.com/user-attachments/assets/f58dd0da-ada0-4e3c-8b0e-38b523ff342c" />

| 項目名           | コンポーネント | 必須 | 初期値                                                  | 備考                     |
| ---------------- | -------------- | ---- | ------------------------------------------------------- | ------------------------ |
| モーダルタイトル | DialogTitle    | -    | 削除の確認                                              | 警告アイコン付き、赤色   |
| 警告メッセージ   | Alert          | -    | この操作は取り消すことができません。                    | 上部警告                 |
| 確認メッセージ   | Alert          | -    | {医療機関名} の医療機関情報を削除してもよろしいですか？ | 削除対象明示             |
| 注意事項         | テキスト       | -    | 削除されたデータは復元できません。                      | 赤色背景                 |
| キャンセルボタン | Button         | -    | キャンセル                                              | アウトライン、グレー     |
| 削除ボタン       | Button         | -    | 削除する                                                | 赤色、ゴミ箱アイコン付き |

### 入力チェック

| 項目名       | イベント | チェック内容                  | エラーメッセージ                          |
| ------------ | -------- | ----------------------------- | ----------------------------------------- |
| 医療機関選択 | blur     | 必須入力チェック              | 医療機関を選択してください                |
| 医療機関名   | blur     | 文字数チェック（100文字以内） | 医療機関名は100文字以内で入力してください |
| 医師名選択   | blur     | 必須入力チェック              | 医師を選択してください                    |
| 医師名       | blur     | 文字数チェック（50文字以内）  | 医師名は50文字以内で入力してください      |
| 備考入力     | blur     | 文字数チェック（500文字以内） | 備考は500文字以内で入力してください       |
| フォーム送信 | submit   | 必須項目チェック              | 医療機関と医師の選択は必須です            |

### バリデーション仕様

#### 入力形式

- **医療機関選択**: 必須、コンボボックスまたは新規作成により選択
- **医療機関名**: 1文字以上100文字以内（医療機関選択後に自動設定）
- **医師名選択**: 必須、コンボボックスまたは新規作成により選択
- **医師名**: 1文字以上50文字以内（医師選択後に自動設定）
- **電話番号・FAX・住所**: 医療機関選択後に自動設定（マスタデータから）
- **備考**: 任意入力、500文字以内

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

- **医療機関カード**: 1列（モバイル）→ 1列（タブレット・デスクトップ）
- **フォームレイアウト**: 1列（モバイル）→ 2列（タブレット以上）
- **カード内情報**: 1列（モバイル）→ 2列（タブレット以上）

### カラーテーマ

- **追加ボタン**: `border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light`
- **編集ボタン**: `variant="outline"` デフォルトスタイル
- **削除ボタン**: `border-red-300 text-red-600 hover:bg-red-50`
- **登録ボタン**: `bg-carebase-blue hover:bg-carebase-blue-dark`
- **病院名**: `text-carebase-blue` 青色で強調表示

### アイコン使用

- **追加ボタン**: `PlusCircle` アイコン
- **編集ボタン**: `Edit3` アイコン
- **削除ボタン**: `Trash2` アイコン
- **電話番号**: `Phone` アイコン
- **住所**: `MapPin` アイコン
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

## 実装済みコンポーネント連携

### MedicalInstitutionCard

- **役割**: 医療機関情報の表示とアクションボタン提供
- **Props**: institution, residentId, residentName, onInstitutionUpdate, onInstitutionDelete
- **機能**: 編集・削除ボタンによるモーダル表示制御

### MedicalInstitutionModal

- **役割**: 医療機関情報の登録・編集モーダル表示
- **Props**: isOpen, onClose, onSubmit, institution, residentName, mode
- **機能**: 作成・編集モードの切り替え、フォーム表示

### MedicalInstitutionForm

- **役割**: 医療機関情報の入力フォーム
- **Props**: onSubmit, onCancel, initialData, className
- **機能**: バリデーション、エラー表示、リトライ機能

### ResidentDataService

- **役割**: 医療機関情報のCRUD操作
- **メソッド**:
  - `createMedicalInstitution(residentId, data)`
  - `updateMedicalInstitution(residentId, institutionId, data)`
  - `deleteMedicalInstitution(residentId, institutionId)`

### MedicalMasterService

- **役割**: 医療機関マスタデータの管理
- **メソッド**:
  - `getMedicalInstitutions()`: 医療機関一覧取得
  - `createMedicalInstitution(data)`: 医療機関新規作成
  - `updateMedicalInstitution(id, data)`: 医療機関更新
  - `deleteMedicalInstitution(id)`: 医療機関削除
  - `getDoctorsByInstitution(institutionId)`: 医療機関別医師一覧取得
  - `createDoctor(data)`: 医師新規作成
  - `updateDoctor(id, data)`: 医師更新

## データ型定義

### MedicalInstitution

```typescript
interface MedicalInstitution {
  id: string;
  institutionName: string;
  doctorName: string;
  phone: string;
  fax: string;
  address: string;
  notes?: string;
}
```

### MedicalInstitutionFormData

```typescript
type MedicalInstitutionFormData = {
  institutionName: string;
  doctorName: string;
  phone: string;
  fax?: string;
  address: string;
  notes?: string;
};
```

### MedicalInstitutionMaster

```typescript
interface MedicalInstitutionMaster {
  id: string;
  institutionName: string;
  phone: string;
  fax?: string;
  address: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### DoctorMaster

```typescript
interface DoctorMaster {
  id: string;
  doctorName: string;
  institutionId?: string;
  institutionName?: string;
  speciality?: string;
  createdAt: string;
  updatedAt: string;
}
```

## 参考資料

- [利用者詳細画面実装](../page.tsx)
- [ResidentDetailTabs コンポーネント](../../../../components/3_organisms/resident/resident-detail-tabs.tsx)
- [MedicalInstitutionCard コンポーネント](../../../../components/2_molecules/resident/medical-institution-card.tsx)
- [MedicalInstitutionForm コンポーネント](../../../../components/2_molecules/forms/medical-institution-form.tsx)
- [MedicalInstitutionModal コンポーネント](../../../../components/3_organisms/modals/medical-institution-modal.tsx)
- [GenericDeleteModal コンポーネント](../../../../components/3_organisms/modals/generic-delete-modal.tsx)
- [Resident Data Types](../../../../types/resident-data.ts)
- [Resident Data Service](../../../../services/residentDataService.ts)
- [Care Board Data Types](../../../../mocks/care-board-data.ts)
- [Issue #133: 利用者詳細（基本情報）](https://github.com/ambi-tious/CareBase-staff/issues/133)
- [ご家族情報タブ設計書](../family-info/README.md)
- [利用者詳細画面設計書](../README.md)
