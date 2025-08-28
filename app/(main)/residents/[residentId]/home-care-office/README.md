# 居宅介護支援事業所タブ設計書

- 画面名: `居宅介護支援事業所タブ`
- パス: `/residents/[residentId]` (詳細情報タブ内)
- URL: https://carebase-staff.vercel.app/residents/1

## 概要

利用者詳細画面内の居宅介護支援事業所タブ設計書です。
利用者の居宅介護支援事業所情報の表示、登録、編集、紐付け解除機能を提供します。
1利用者につき複数事業所の登録を可能にし、マスタデータ管理により事業所情報の一元管理を実現しています。
事業所名、ケアマネージャー名、連絡先情報を効率的に管理でき、ケアマネージャーはコンボボックスでの選択または直接入力が可能です。

## 全体レイアウト

<img width="1047" height="274" alt="image" src="https://github.com/user-attachments/assets/a78d37d7-7b2d-494b-87f7-ca4ed1301938" />

### 画面構成

タブ内で完結する居宅介護支援事業所情報管理インターフェース：

- タブヘッダー（居宅介護支援事業所タブ選択状態）
- 追加ボタン（右上配置）
- 事業所情報表示カード（登録済み時）
- 空状態メッセージ（未登録時）

### 画面項目

| 項目名               | コンポーネント     | 必須 | 表示条件   | 初期値                               | 備考                         |
| -------------------- | ------------------ | ---- | ---------- | ------------------------------------ | ---------------------------- |
| タブヘッダー         | TabsTrigger        | -    | 常時       | 居宅介護支援事業所                   | アクティブ状態で青色表示     |
| 追加ボタン           | Button             | -    | 常時       | 追加                                 | 右上配置、プラスアイコン付き |
| 事業所情報カード     | HomeCareOfficeCard | -    | 登録済み時 | -                                    | 事業所情報表示カード         |
| 空状態メッセージ     | テキスト           | -    | 未登録時   | 居宅介護支援事業所情報はありません。 | 中央配置、グレー文字         |
| 事業所名表示         | CardTitle          | ◯    | カード内   | -                                    | 青色で強調表示               |
| 編集ボタン           | Button             | -    | カード内   | 編集                                 | 鉛筆アイコン付き             |
| 紐付け解除ボタン     | Button             | -    | カード内   | 紐付け解除                           | アンリンクアイコン付き、赤色 |
| ケアマネージャー表示 | テキスト           | ◯    | カード内   | -                                    | 担当者情報                   |
| 電話番号表示         | テキスト           | ◯    | カード内   | -                                    | 電話アイコン付き             |
| FAX番号表示          | テキスト           | -    | カード内   | -                                    | FAX情報                      |
| 住所表示             | テキスト           | ◯    | カード内   | -                                    | 位置アイコン付き             |
| 備考表示             | テキスト           | -    | カード内   | -                                    | 境界線付きで下部表示         |

## 機能仕様

### アクション

| 項目名           | 処理内容                                   | 対象API                                                     | 遷移先画面                 |
| ---------------- | ------------------------------------------ | ----------------------------------------------------------- | -------------------------- |
| 追加ボタン       | 居宅介護支援事業所登録モーダルを表示       | -                                                           | 同一画面（モーダル表示）   |
| 編集ボタン       | 居宅介護支援事業所編集モーダルを表示       | -                                                           | 同一画面（モーダル表示）   |
| 紐付け解除ボタン | 紐付け解除確認モーダルを表示               | -                                                           | 同一画面（モーダル表示）   |
| 登録処理         | 新しい居宅介護支援事業所情報を登録         | `/v1/residents/{id}/home-care-office`                       | 同一画面（モーダル閉じる） |
| 編集処理         | 既存の居宅介護支援事業所情報を更新         | `/v1/residents/{id}/home-care-office/{officeId}`            | 同一画面（モーダル閉じる） |
| 紐付け解除処理   | 利用者からの居宅介護支援事業所紐付けを解除 | `/v1/residents/{id}/home-care-office/{officeId}/dissociate` | 同一画面（モーダル閉じる） |

### モーダル仕様

<img height="300" alt="image" src="https://github.com/user-attachments/assets/71cc6461-62ed-465b-8786-95f829fb324b" />
<img height="300" alt="image" src="https://github.com/user-attachments/assets/386a9fdf-8ea7-4a4a-bd64-baa884c480a8" />

#### 登録モーダル

| 項目名                    | コンポーネント      | 必須 | 初期値                                                 | 備考                                                           |
| ------------------------- | ------------------- | ---- | ------------------------------------------------------ | -------------------------------------------------------------- |
| モーダルタイトル          | DialogTitle         | -    | 居宅介護支援事業所の登録                               | 太字、青色                                                     |
| 説明文                    | DialogDescription   | -    | {利用者名}様の居宅介護支援事業所情報を登録してください | 必須項目説明付き                                               |
| フォームセクション見出し1 | h3                  | -    | 基本情報                                               | 左列上部、境界線付き                                           |
| 事業所名入力              | Input               | ◯    | -                                                      | プレースホルダー: ハートケアプランセンター神戸西               |
| ケアマネージャー選択      | CareManagerCombobox | -    | -                                                      | プレースホルダー: ケアマネージャーを選択または入力してください |
| 電話番号入力              | Input               | -    | -                                                      | プレースホルダー: 078-000-0000                                 |
| フォームセクション見出し2 | h3                  | -    | 連絡先情報                                             | 右列上部、境界線付き                                           |
| FAX番号入力               | Input               | -    | -                                                      | プレースホルダー: 078-0000-0000                                |
| 住所入力                  | Input               | -    | -                                                      | プレースホルダー: 兵庫県神戸市西区糸井2-14-9                   |
| 備考入力                  | Textarea            | -    | -                                                      | プレースホルダー: その他の情報があれば記入してください         |
| キャンセルボタン          | Button              | -    | キャンセル                                             | アウトライン、グレー                                           |
| 登録ボタン                | Button              | -    | 登録                                                   | 青色、送信時は「登録中...」                                    |

#### 編集モーダル

登録モーダルと同様の構成で、以下の違いがあります：

| 項目名           | 相違点                           |
| ---------------- | -------------------------------- |
| モーダルタイトル | 居宅介護支援事業所の編集         |
| フォーム初期値   | 既存データで各フィールドを初期化 |
| 登録ボタンラベル | 更新                             |

#### 紐付け解除確認モーダル

<img height="200" alt="image" src="https://github.com/user-attachments/assets/348b6cbd-8f99-4781-ac26-20aeeaa8365a" />

| 項目名           | コンポーネント | 必須 | 初期値                                             | 備考                         |
| ---------------- | -------------- | ---- | -------------------------------------------------- | ---------------------------- |
| モーダルタイトル | DialogTitle    | -    | 紐付け解除の確認                                   | 警告アイコン付き、赤色       |
| 警告メッセージ   | Alert          | -    | この操作は取り消すことができません。               | 上部警告                     |
| 確認メッセージ   | Alert          | -    | {事業所名} の紐付けを解除してもよろしいですか？    | 紐付け解除対象明示           |
| 注意事項         | テキスト       | -    | 紐付けを解除すると、この利用者からは削除されます。 | 赤色背景                     |
| キャンセルボタン | Button         | -    | キャンセル                                         | アウトライン、グレー         |
| 紐付け解除ボタン | Button         | -    | 紐付け解除する                                     | 赤色、アンリンクアイコン付き |

### 入力チェック

| 項目名               | イベント | チェック内容                     | エラーメッセージ                                 |
| -------------------- | -------- | -------------------------------- | ------------------------------------------------ |
| 事業所名入力         | blur     | 必須入力チェック                 | 事業所名は必須です                               |
| 事業所名入力         | blur     | 文字数チェック（100文字以内）    | 事業所名は100文字以内で入力してください          |
| ケアマネージャー選択 | blur     | 文字数チェック（50文字以内）     | ケアマネージャー名は50文字以内で入力してください |
| 電話番号入力         | blur     | 形式チェック（任意項目）         | 有効な電話番号を入力してください                 |
| FAX番号入力          | blur     | 形式チェック（任意項目）         | 有効なFAX番号を入力してください                  |
| 住所入力             | blur     | 文字数チェック（200文字以内）    | 住所は200文字以内で入力してください              |
| フォーム送信         | submit   | 必須項目チェック（事業所名のみ） | 事業所名は必須です                               |

### バリデーション仕様

#### 入力形式

- **電話番号・FAX番号**: 数字、ハイフン、プラス、括弧、スペースのみ許可
- **事業所名**: 1文字以上100文字以内（必須）
- **ケアマネージャー名**: 1文字以上50文字以内（任意、コンボボックスで選択または入力）
- **住所**: 1文字以上200文字以内（任意）
- **備考**: 任意入力

#### 表示制御

- 必須項目には赤いアスタリスク（\*）を表示
- エラー時は該当フィールドを赤枠で強調
- 送信中はフォーム全体を無効化
- ネットワークエラー時はリトライボタンを表示

#### エラーハンドリング

- バリデーションエラーの個別表示
- ネットワークエラーの統一表示
- 紐付け解除処理エラーの表示
- 楽観的更新とエラー時のロールバック
- 事業所重複紐付けの防止

## UI/UX仕様

### レスポンシブデザイン

- **事業所情報カード**: 全幅表示（全デバイス共通）
- **フォームレイアウト**: 1列（モバイル）→ 2列（タブレット以上）
- **カード内情報**: 1列（モバイル）→ 2列グリッド（タブレット以上）
- **ボタン配置**: 縦並び（モバイル）→ 横並び（タブレット以上）

### カラーテーマ

- **追加ボタン**: `border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light`
- **事業所名**: `text-carebase-blue font-bold` - 青色で強調
- **編集ボタン**: `variant="outline"` デフォルトスタイル
- **紐付け解除ボタン**: `border-red-300 text-red-600 hover:bg-red-50`
- **登録ボタン**: `bg-carebase-blue hover:bg-carebase-blue-dark`
- **情報ラベル**: `text-gray-500 font-medium`
- **情報値**: `text-carebase-text-primary`

### アイコン使用

- **追加ボタン**: `PlusCircle` アイコン
- **編集ボタン**: `Edit3` アイコン
- **紐付け解除ボタン**: `Unlink` アイコン
- **電話番号**: `Phone` アイコン
- **住所**: `MapPin` アイコン
- **エラー表示**: `AlertCircle` アイコン
- **リトライボタン**: `RefreshCw` アイコン

### アニメーション

- **モーダル表示**: フェードイン・スケールアニメーション
- **カード表示**: スムーズな挿入アニメーション
- **紐付け解除処理**: ローディングスピナー表示
- **ホバー効果**: ボタンの背景色変更トランジション
- **カードホバー**: `hover:shadow-md transition-shadow`

### アクセシビリティ

- **フォーカス管理**: モーダル内でのキーボードナビゲーション
- **スクリーンリーダー対応**: 適切なaria-label設定
- **エラー表示**: role="alert"でエラーメッセージを通知
- **必須項目表示**: 視覚的・音声的な必須項目の明示
- **コントラスト**: WCAG AA準拠の色彩設計
- **キーボード操作**: Tab キーでの要素移動対応

## 業務要件

### 機能要件

- 居宅介護支援事業所の情報を表示・管理
- 事業所名、ケアマネージャー名の管理（マスタデータとの連携）
- 連絡先情報（電話番号、FAX、住所等）の管理
- 利用者との紐付け管理（複数事業所対応）

### 制約事項

- 事業所情報は必須項目（事業所名のみ必須、その他は任意）の入力が必要
- 紐付け解除時は確認モーダルによる二段階確認が必要
- ネットワークエラー時のリトライ機能を提供

### データ整合性

- 利用者詳細画面の他のタブとの情報連携
- 親Issue #133の利用者詳細画面仕様との整合性確保
- 既存のCRUD操作パターンとの統一

## 技術仕様

### データ型定義

```typescript
// HomeCareOfficeFormData型（validations/resident-data-validation.ts）
interface HomeCareOfficeFormData {
  businessName: string; // 事業所名（必須、100文字以内）
  careManager?: string; // ケアマネージャー名（任意、50文字以内）
  phone?: string; // 電話番号（任意）
  fax?: string; // FAX番号（任意）
  address?: string; // 住所（任意、200文字以内）
  notes?: string; // 備考（任意）
}

// HomeCareOffice型（mocks/care-board-data.ts）
interface HomeCareOffice {
  id: string;
  businessName: string;
  address: string;
  phone: string;
  fax?: string;
  careManager: string;
  notes?: string;
}
```

### サービス層

```typescript
// residentDataService.ts
- createHomeCareOffice(residentId, data): 新規登録
- updateHomeCareOffice(residentId, officeId, data): 更新
- dissociateHomeCareOfficeFromResident(residentId, officeId): 紐付け解除
- associateHomeCareOfficeWithResident(residentId, officeId): 紐付け作成
- searchHomeCareOffices(query): マスタデータ検索
- createOrUpdateHomeCareOfficeMaster(data): マスタデータ作成・更新
```

### コンポーネント構成

```
居宅介護支援事業所タブ
├── HomeCareOfficeCard（事業所情報表示）
│   ├── 事業所基本情報表示
│   ├── 編集ボタン → HomeCareOfficeModal（編集モード）
│   └── 紐付け解除ボタン → GenericDeleteModal
├── 追加ボタン → HomeCareOfficeModal（作成モード）
└── HomeCareOfficeModal
    └── HomeCareOfficeForm（入力フォーム）
        └── CareManagerCombobox（ケアマネージャー選択）
```

### 状態管理

- モーダル表示状態の管理
- フォーム送信中状態の管理
- エラー状態の管理
- 楽観的更新による即座のUI反映

## 参考資料

- [利用者詳細画面設計書](../README.md)
- [ご家族情報タブ設計書](../family-info/README.md)
- [HomeCareOfficeCard コンポーネント](../../../../../../components/2_molecules/resident/home-care-office-card.tsx)
- [HomeCareOfficeModal コンポーネント](../../../../../../components/3_organisms/modals/home-care-office-modal.tsx)
- [HomeCareOfficeForm コンポーネント](../../../../../../components/2_molecules/forms/home-care-office-form.tsx)
- [GenericDeleteModal コンポーネント](../../../../../../components/3_organisms/modals/generic-delete-modal.tsx)
- [Resident Data Types](../../../../../../types/resident-data.ts)
- [Resident Data Service](../../../../../../services/residentDataService.ts)
- [useHomeCareOfficeForm Hook](../../../../../../hooks/useResidentDataForm.ts)
- [CareManagerCombobox コンポーネント](../../../../../../components/1_atoms/care-manager/care-manager-combobox.tsx)
- [Resident Data Validation](../../../../../../validations/resident-data-validation.ts)
- [Issue #133: 利用者詳細（基本情報）](https://github.com/ambi-tious/CareBase-staff/issues/133)
- [Issue #170: [設計] #005-2 利用者｜利用者詳細（居宅介護支援事業所）](https://github.com/ambi-tious/CareBase-staff/issues/170)
- [画面一覧](../../../docs/screen-list.md#利用者管理)
