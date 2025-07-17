# お薬情報タブ設計書

画面名: `お薬情報タブ`  
パス: `/residents/[residentId]` (詳細情報タブ内)  
URL: https://carebase-staff.vercel.app/residents/[residentId]

## 概要

利用者詳細画面内のお薬情報タブ設計書です。  
利用者のお薬情報の表示、登録、編集、削除機能を提供します。  
薬剤名、用法用量、処方医療機関、服用期間を管理し、複数の薬剤情報を効率的に管理できます。

Issue: [#173 [設計] #005-5 利用者｜利用者詳細（お薬情報）](https://github.com/ambi-tious/CareBase-staff/issues/173)

## 全体レイアウト

<img width="1055" height="557" alt="image" src="https://github.com/user-attachments/assets/8fd06c99-db5a-4a20-b574-92f949bcb8a1" />

### 画面構成

タブ内で完結するお薬情報管理インターフェース：

- タブヘッダー（お薬情報タブ選択状態）
- 追加ボタン（右上配置）
- 薬剤情報カード一覧（服用中・服用終了別表示）
- 空状態メッセージ（データなし時）

### 画面項目

| 項目名           | コンポーネント | 必須 | 表示条件     | 初期値                 | 備考                         |
| ---------------- | -------------- | ---- | ------------ | ---------------------- | ---------------------------- |
| タブヘッダー     | TabsTrigger    | -    | 常時         | お薬情報               | アクティブ状態で青色表示     |
| 追加ボタン       | Button         | -    | 常時         | 追加                   | 右上配置、プラスアイコン付き |
| 薬剤情報カード   | MedicationCard | -    | データ存在時 | -                      | 服用状況バッジ付きカード表示 |
| 空状態メッセージ | テキスト       | -    | データなし時 | お薬情報はありません。 | 中央配置、グレー文字         |
| 服用状況バッジ   | Badge          | ◯    | カード内     | 服用中/服用終了        | 緑色/グレー色で区別表示      |
| 薬剤名表示       | CardTitle      | ◯    | カード内     | -                      | 大きく太字で表示             |
| 編集ボタン       | Button         | -    | カード内     | 編集                   | 鉛筆アイコン付き             |
| 削除ボタン       | Button         | -    | カード内     | 削除                   | ゴミ箱アイコン付き、赤色     |
| 用法用量表示     | テキスト       | ◯    | カード内     | -                      | 改行対応で表示               |
| 処方医療機関表示 | テキスト       | ◯    | カード内     | -                      | 病院アイコン付き             |
| 服用開始日表示   | テキスト       | ◯    | カード内     | -                      | カレンダーアイコン付き       |
| 服用終了日表示   | テキスト       | -    | カード内     | -                      | 終了日設定時のみ表示         |
| メモ表示         | テキスト       | -    | カード内     | -                      | 境界線付きで下部表示         |

## 機能仕様

### アクション

| 項目名     | 処理内容                   | 対象API                                             | 遷移先画面                 |
| ---------- | -------------------------- | --------------------------------------------------- | -------------------------- |
| 追加ボタン | お薬情報登録モーダルを表示 | -                                                   | 同一画面（モーダル表示）   |
| 編集ボタン | お薬情報編集モーダルを表示 | -                                                   | 同一画面（モーダル表示）   |
| 削除ボタン | 削除確認モーダルを表示     | -                                                   | 同一画面（モーダル表示）   |
| 登録処理   | 新しいお薬情報を登録       | `/api/v1/residents/{id}/medications`                | 同一画面（モーダル閉じる） |
| 編集処理   | 既存のお薬情報を更新       | `/api/v1/residents/{id}/medications/{medicationId}` | 同一画面（モーダル閉じる） |
| 削除処理   | 既存のお薬情報を削除       | `/api/v1/residents/{id}/medications/{medicationId}` | 同一画面（モーダル閉じる） |

### モーダル仕様

<img height="350" alt="image" src="https://github.com/user-attachments/assets/f2253143-5571-49e7-9bbf-359b097e75c0" />
<img height="350" alt="image" src="https://github.com/user-attachments/assets/8fae7242-241d-44cf-abf4-4bec72348a4d" />

#### 登録モーダル

| 項目名           | コンポーネント    | 必須 | 初期値                                   | 備考                                                       |
| ---------------- | ----------------- | ---- | ---------------------------------------- | ---------------------------------------------------------- |
| モーダルタイトル | DialogTitle       | -    | お薬情報の登録                           | 太字、青色                                                 |
| 説明文           | DialogDescription | -    | {利用者名}様のお薬情報を登録してください | 必須項目説明付き                                           |
| 薬剤名入力       | Input             | ◯    | -                                        | プレースホルダー: アムロジピン錠5mg                        |
| 用法用量入力     | Textarea          | ◯    | -                                        | プレースホルダー: 1回1錠、1日1回、朝食後服用               |
| 服用開始日入力   | DatePicker        | ◯    | -                                        | カレンダー選択形式                                         |
| 服用終了日入力   | DatePicker        | -    | -                                        | カレンダー選択形式、空欄可                                 |
| 処方医療機関入力 | Input             | ◯    | -                                        | プレースホルダー: ○○病院 内科                              |
| メモ入力         | Textarea          | -    | -                                        | プレースホルダー: 副作用や注意事項があれば記入してください |
| キャンセルボタン | Button            | -    | キャンセル                               | アウトライン、グレー                                       |
| 登録ボタン       | Button            | -    | 登録                                     | 青色、送信時は「登録中...」                                |

#### 編集モーダル

登録モーダルと同様の構成で、以下の違いがあります：

| 項目名           | 相違点                           |
| ---------------- | -------------------------------- |
| モーダルタイトル | お薬情報の編集                   |
| フォーム初期値   | 既存データで各フィールドを初期化 |
| 登録ボタンラベル | 更新                             |

#### 削除確認モーダル

<img height="200" alt="image" src="https://github.com/user-attachments/assets/d80f28f1-b90f-4b19-8cfb-b6cdcc7bedd6" />

| 項目名           | コンポーネント | 必須 | 初期値                                          | 備考                     |
| ---------------- | -------------- | ---- | ----------------------------------------------- | ------------------------ |
| モーダルタイトル | DialogTitle    | -    | 削除の確認                                      | 警告アイコン付き、赤色   |
| 警告メッセージ   | Alert          | -    | この操作は取り消すことができません。            | 上部警告                 |
| 確認メッセージ   | Alert          | -    | {薬剤名} のお薬情報を削除してもよろしいですか？ | 削除対象明示             |
| 注意事項         | テキスト       | -    | 削除されたデータは復元できません。              | 赤色背景                 |
| キャンセルボタン | Button         | -    | キャンセル                                      | アウトライン、グレー     |
| 削除ボタン       | Button         | -    | 削除する                                        | 赤色、ゴミ箱アイコン付き |

### 入力チェック

| 項目名           | イベント | チェック内容                  | エラーメッセージ                                   |
| ---------------- | -------- | ----------------------------- | -------------------------------------------------- |
| 薬剤名入力       | blur     | 必須入力チェック              | 薬剤名は必須です                                   |
| 薬剤名入力       | blur     | 文字数チェック（100文字以内） | 薬剤名は100文字以内で入力してください              |
| 用法用量入力     | blur     | 必須入力チェック              | 用法・用量は必須です                               |
| 用法用量入力     | blur     | 文字数チェック（200文字以内） | 用法・用量は200文字以内で入力してください          |
| 服用開始日入力   | change   | 必須選択チェック              | 服用開始日は必須です                               |
| 服用開始日入力   | change   | 日付形式チェック              | 有効な日付を入力してください                       |
| 服用終了日入力   | change   | 日付形式チェック              | 有効な日付を入力してください                       |
| 服用終了日入力   | change   | 開始日との関係チェック        | 服用終了日は服用開始日以降の日付を入力してください |
| 処方医療機関入力 | blur     | 必須入力チェック              | 処方医療機関は必須です                             |
| 処方医療機関入力 | blur     | 文字数チェック（100文字以内） | 処方医療機関は100文字以内で入力してください        |
| メモ入力         | blur     | 文字数チェック（500文字以内） | メモは500文字以内で入力してください                |
| フォーム送信     | submit   | 全必須項目チェック            | 必須項目をすべて入力してください                   |

### バリデーション仕様

#### 入力形式

- **薬剤名**: 1文字以上100文字以内
- **用法・用量**: 1文字以上200文字以内、改行可
- **服用開始日**: YYYY-MM-DD形式の有効な日付
- **服用終了日**: YYYY-MM-DD形式の有効な日付（任意）
- **処方医療機関**: 1文字以上100文字以内
- **メモ**: 500文字以内、改行可

#### 表示制御

- 必須項目には赤いアスタリスク（\*）を表示
- エラー時は該当フィールドを赤枠で強調
- 送信中はフォーム全体を無効化
- ネットワークエラー時はリトライボタンを表示
- 服用終了日が未設定の場合は「服用中」バッジを緑色で表示
- 服用終了日が設定済みの場合は「服用終了」バッジをグレー色で表示

#### エラーハンドリング

- バリデーションエラーの個別表示
- ネットワークエラーの統一表示
- 削除処理エラーの表示
- 楽観的更新とエラー時のロールバック

## UI/UX仕様

### レスポンシブデザイン

- **薬剤情報カード**: 1列（モバイル）→ 1列（タブレット・デスクトップ）
- **フォームレイアウト**: 1列（モバイル）→ 2列（タブレット以上）
- **カード内情報**: 1列（モバイル）→ 2列（タブレット以上）

### カラーテーマ

- **服用中バッジ**: `bg-green-100 text-green-700`
- **服用終了バッジ**: `bg-gray-100 text-gray-700`
- **追加ボタン**: `border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light`
- **編集ボタン**: `variant="outline"` デフォルトスタイル
- **削除ボタン**: `border-red-300 text-red-600 hover:bg-red-50`
- **登録ボタン**: `bg-carebase-blue hover:bg-carebase-blue-dark`
- **薬剤名表示**: `text-carebase-blue font-bold text-xl`

### アイコン使用

- **薬剤アイコン**: `Pill` アイコン（青色背景のサークル内）
- **追加ボタン**: `PlusCircle` アイコン
- **編集ボタン**: `Edit3` アイコン
- **削除ボタン**: `Trash2` アイコン
- **処方医療機関**: `Building2` アイコン
- **服用開始日**: `Calendar` アイコン
- **服用終了日**: `Calendar` アイコン
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
- **コントラスト**: WCAG AA準拠の色彩設計

## 技術仕様

### 使用コンポーネント

#### 既存実装済みコンポーネント

- **MedicationCard**: 薬剤情報表示カード
  - パス: `components/2_molecules/medication/medication-card.tsx`
  - 機能: 薬剤情報の表示、編集・削除ボタン
  - プロパティ: medication, residentId, residentName, onUpdate, onDelete

- **MedicationRegistrationModal**: 薬剤情報登録・編集モーダル
  - パス: `components/3_organisms/modals/medication-registration-modal.tsx`
  - 機能: 薬剤情報の登録・編集フォーム
  - プロパティ: isOpen, onClose, onSubmit, residentName

- **GenericDeleteModal**: 汎用削除確認モーダル
  - パス: `components/3_organisms/modals/generic-delete-modal.tsx`
  - 機能: 削除確認ダイアログ
  - プロパティ: isOpen, onClose, onConfirm, itemName, itemType

#### サービスクラス

- **medicationService**: 薬剤情報のCRUD操作
  - パス: `services/medicationService.ts`
  - メソッド: createMedication, updateMedication, deleteMedication
  - モック機能: 開発時のデータ操作シミュレーション

#### 型定義

- **Medication**: 薬剤情報エンティティ型
  - パス: `types/medication.ts`
  - プロパティ: id, medicationName, dosageInstructions, startDate, endDate, prescribingInstitution, notes

- **MedicationFormData**: フォームデータ型
  - パス: `types/medication.ts`
  - バリデーション: Zodスキーマによる入力検証

### API エンドポイント

| メソッド | エンドポイント                                      | 説明                     |
| -------- | --------------------------------------------------- | ------------------------ |
| GET      | `/api/v1/residents/{id}/medications`                | 利用者の薬剤情報一覧取得 |
| POST     | `/api/v1/residents/{id}/medications`                | 薬剤情報の新規登録       |
| PUT      | `/api/v1/residents/{id}/medications/{medicationId}` | 薬剤情報の更新           |
| DELETE   | `/api/v1/residents/{id}/medications/{medicationId}` | 薬剤情報の削除           |

### 状態管理

#### ローカル状態

- 薬剤情報一覧の表示状態
- モーダルの開閉状態
- フォームの送信状態
- エラー状態

#### 楽観的更新

- 登録時: 即座にUIに反映、エラー時はロールバック
- 更新時: 即座にUIに反映、エラー時はロールバック
- 削除時: 即座にUIから削除、エラー時は復元

## 参考資料

- [利用者詳細画面実装](../page.tsx)
- [ResidentDetailTabs コンポーネント](../../../../components/3_organisms/resident/resident-detail-tabs.tsx)
- [MedicationCard コンポーネント](../../../../components/2_molecules/medication/medication-card.tsx)
- [MedicationForm コンポーネント](../../../../components/2_molecules/forms/medication-form.tsx)
- [MedicationRegistrationModal コンポーネント](../../../../components/3_organisms/modals/medication-registration-modal.tsx)
- [MedicationModal コンポーネント](../../../../components/3_organisms/modals/medication-modal.tsx)
- [GenericDeleteModal コンポーネント](../../../../components/3_organisms/modals/generic-delete-modal.tsx)
- [Medication Types](../../../../types/medication.ts)
- [Medication Service](../../../../services/medicationService.ts)
- [Issue #173: [設計] #005-5 利用者｜利用者詳細（お薬情報）](https://github.com/ambi-tious/CareBase-staff/issues/173)
- [親Issue #133: 利用者詳細（基本情報）](https://github.com/ambi-tious/CareBase-staff/issues/133)
- [ご家族情報タブ設計書](../family-info/README.md)
