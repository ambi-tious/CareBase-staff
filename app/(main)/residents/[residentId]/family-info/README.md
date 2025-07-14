# ご家族情報タブ設計書

画面名: `ご家族情報タブ`  
パス: `/residents/[residentId]` (詳細情報タブ内)  
URL: https://carebase-staff.vercel.app/residents/[residentId]

## 概要

CareBase-staffアプリケーションの利用者詳細画面内のご家族情報タブ設計書です。  
利用者のご家族・連絡先情報の表示、登録、編集、削除機能を提供します。  
緊急連絡先と一般連絡先を区別して管理し、各連絡先の詳細情報を効率的に管理できます。

## 全体レイアウト

### 画面構成

<img width="1200" height="600" alt="ご家族情報タブ画面" src="/home/ubuntu/attachments/a3694b25-7969-4cfc-9605-ca7c791109b1/image.png" />

タブ内で完結するご家族情報管理インターフェース：
- タブヘッダー（ご家族情報タブ選択状態）
- 追加ボタン（右上配置）
- 連絡先カード一覧（緊急連絡先・連絡先別表示）
- 空状態メッセージ（データなし時）

### 画面項目

| 項目名 | コンポーネント | 必須 | 表示条件 | 初期値 | 備考 |
| --- | --- | --- | --- | --- | --- |
| タブヘッダー | TabsTrigger | - | 常時 | ご家族情報 | アクティブ状態で青色表示 |
| 追加ボタン | Button | - | 常時 | 追加 | 右上配置、プラスアイコン付き |
| 連絡先カード | ContactInfoCard | - | データ存在時 | - | 種別バッジ付きカード表示 |
| 空状態メッセージ | テキスト | - | データなし時 | ご家族情報はありません。 | 中央配置、グレー文字 |
| 種別バッジ | Badge | ◯ | カード内 | 緊急連絡先/連絡先 | 赤色/青色で区別表示 |
| 氏名表示 | CardTitle | ◯ | カード内 | - | フリガナ併記 |
| 編集ボタン | Button | - | カード内 | 編集 | 鉛筆アイコン付き |
| 削除ボタン | Button | - | カード内 | 削除 | ゴミ箱アイコン付き、赤色 |
| 続柄表示 | テキスト | ◯ | カード内 | - | 関係性表示 |
| 電話番号表示 | テキスト | ◯ | カード内 | - | 電話アイコン付き |
| メールアドレス表示 | テキスト | - | カード内 | - | メールアイコン付き |
| 住所表示 | テキスト | - | カード内 | - | 位置アイコン付き |
| 備考表示 | テキスト | - | カード内 | - | 境界線付きで下部表示 |

## 機能仕様

### アクション

| 項目名 | 処理内容 | 対象API | 遷移先画面 |
| --- | --- | --- | --- |
| 追加ボタン | ご家族情報登録モーダルを表示 | - | 同一画面（モーダル表示） |
| 編集ボタン | ご家族情報編集モーダルを表示 | - | 同一画面（モーダル表示） |
| 削除ボタン | 削除確認モーダルを表示 | - | 同一画面（モーダル表示） |
| 登録処理 | 新しいご家族情報を登録 | `/api/v1/residents/{id}/contacts` | 同一画面（モーダル閉じる） |
| 編集処理 | 既存のご家族情報を更新 | `/api/v1/residents/{id}/contacts/{contactId}` | 同一画面（モーダル閉じる） |
| 削除処理 | 既存のご家族情報を削除 | `/api/v1/residents/{id}/contacts/{contactId}` | 同一画面（モーダル閉じる） |

### モーダル仕様

#### 登録モーダル

<img width="800" height="600" alt="ご家族情報登録モーダル" src="/home/ubuntu/attachments/1b9d5120-f16c-436d-a443-04971f4f7e4b/image.png" />

| 項目名 | コンポーネント | 必須 | 初期値 | 備考 |
| --- | --- | --- | --- | --- |
| モーダルタイトル | DialogTitle | - | ご家族情報の登録 | 太字、青色 |
| 説明文 | DialogDescription | - | {利用者名}様のご家族・連絡先情報を登録してください | 必須項目説明付き |
| 種別選択 | Select | ◯ | 連絡先 | 緊急連絡先/連絡先/その他 |
| 氏名入力 | Input | ◯ | - | プレースホルダー: 山田 太郎 |
| フリガナ入力 | Input | - | - | プレースホルダー: ヤマダ タロウ |
| 続柄選択 | Select | ◯ | - | 配偶者/長男/長女等の選択肢 |
| 電話番号1入力 | Input | ◯ | - | プレースホルダー: 078-000-0000 |
| 電話番号2入力 | Input | - | - | プレースホルダー: 080-0000-0000 |
| メールアドレス入力 | Input | - | - | プレースホルダー: example@email.com |
| 住所入力 | Input | - | - | プレースホルダー: 東京都渋谷区... |
| 備考入力 | Textarea | - | - | プレースホルダー: その他の情報があれば記入してください |
| キャンセルボタン | Button | - | キャンセル | アウトライン、グレー |
| 登録ボタン | Button | - | 登録 | 青色、送信時は「登録中...」 |

#### 編集モーダル

<img width="800" height="600" alt="ご家族情報編集モーダル" src="/home/ubuntu/attachments/d658b28a-65f3-4b7c-93b6-887693a3ba63/image.png" />

登録モーダルと同様の構成で、以下の違いがあります：

| 項目名 | 相違点 |
| --- | --- |
| モーダルタイトル | ご家族情報の編集 |
| フォーム初期値 | 既存データで各フィールドを初期化 |
| 登録ボタンラベル | 更新 |

#### 削除確認モーダル

<img width="500" height="300" alt="削除確認モーダル" src="/home/ubuntu/attachments/16d6e5ce-2760-4069-a1ee-5cdcc72ba3cd/image.png" />

| 項目名 | コンポーネント | 必須 | 初期値 | 備考 |
| --- | --- | --- | --- | --- |
| モーダルタイトル | DialogTitle | - | 削除の確認 | 警告アイコン付き、赤色 |
| 警告メッセージ | Alert | - | この操作は取り消すことができません。 | 上部警告 |
| 確認メッセージ | Alert | - | {氏名} の連絡先情報を削除してもよろしいですか？ | 削除対象明示 |
| 注意事項 | テキスト | - | 削除されたデータは復元できません。 | 赤色背景 |
| キャンセルボタン | Button | - | キャンセル | アウトライン、グレー |
| 削除ボタン | Button | - | 削除する | 赤色、ゴミ箱アイコン付き |

### 入力チェック

| 項目名 | イベント | チェック内容 | エラーメッセージ |
| --- | --- | --- | --- |
| 種別選択 | change | 必須選択チェック | 種別を選択してください |
| 氏名入力 | blur | 必須入力チェック | 氏名は必須です |
| 氏名入力 | blur | 文字数チェック（50文字以内） | 氏名は50文字以内で入力してください |
| 続柄選択 | change | 必須選択チェック | 続柄を選択してください |
| 続柄選択 | change | 文字数チェック（30文字以内） | 続柄は30文字以内で入力してください |
| 電話番号1入力 | blur | 必須入力チェック | 連絡先は必須です |
| 電話番号1入力 | blur | 形式チェック | 有効な電話番号を入力してください |
| 電話番号2入力 | blur | 形式チェック | 有効な電話番号を入力してください |
| メールアドレス入力 | blur | 形式チェック | 有効なメールアドレスを入力してください |
| フォーム送信 | submit | 全必須項目チェック | 必須項目をすべて入力してください |

### バリデーション仕様

#### 入力形式

- **電話番号**: 数字、ハイフン、プラス、括弧、スペースのみ許可
- **メールアドレス**: RFC準拠のメールアドレス形式
- **氏名**: 1文字以上50文字以内
- **続柄**: 1文字以上30文字以内

#### 表示制御

- 必須項目には赤いアスタリスク（*）を表示
- エラー時は該当フィールドを赤枠で強調
- 送信中はフォーム全体を無効化
- ネットワークエラー時はリトライボタンを表示

#### エラーハンドリング

- バリデーションエラーの個別表示
- ネットワークエラーの統一表示
- 削除処理エラーの表示
- 楽観的更新とエラー時のロールバック

## データ構造

### ContactFormData（フォームデータ）

```typescript
interface ContactFormData {
  name: string;           // 氏名（必須、50文字以内）
  furigana?: string;      // フリガナ（任意）
  relationship: string;   // 続柄（必須、30文字以内）
  phone1: string;         // 電話番号1（必須、電話番号形式）
  phone2?: string;        // 電話番号2（任意、電話番号形式）
  email?: string;         // メールアドレス（任意、メール形式）
  address?: string;       // 住所（任意）
  notes?: string;         // 備考（任意）
  type: '緊急連絡先' | '連絡先' | 'その他'; // 種別（必須）
}
```

### ContactPerson（表示データ）

```typescript
interface ContactPerson {
  id: string;             // 連絡先ID
  name: string;           // 氏名
  furigana: string;       // フリガナ
  relationship: string;   // 続柄
  phone1: string;         // 電話番号1
  phone2?: string;        // 電話番号2
  email?: string;         // メールアドレス
  address: string;        // 住所
  notes?: string;         // 備考
  type: '緊急連絡先' | '連絡先' | 'その他'; // 種別
}
```

### 選択肢データ

#### 種別選択肢

```typescript
const contactTypeOptions = [
  { value: '緊急連絡先', label: '緊急連絡先' },
  { value: '連絡先', label: '連絡先' },
  { value: 'その他', label: 'その他' },
];
```

#### 続柄選択肢

```typescript
const relationshipOptions = [
  { value: '配偶者', label: '配偶者' },
  { value: '長男', label: '長男' },
  { value: '長女', label: '長女' },
  { value: '次男', label: '次男' },
  { value: '次女', label: '次女' },
  { value: '三男', label: '三男' },
  { value: '三女', label: '三女' },
  { value: '父', label: '父' },
  { value: '母', label: '母' },
  { value: '兄', label: '兄' },
  { value: '姉', label: '姉' },
  { value: '弟', label: '弟' },
  { value: '妹', label: '妹' },
  { value: '孫', label: '孫' },
  { value: 'その他', label: 'その他' },
];
```

## UI/UX仕様

### レスポンシブデザイン

- **連絡先カード**: 1列（モバイル）→ 1列（タブレット・デスクトップ）
- **フォームレイアウト**: 1列（モバイル）→ 2列（タブレット以上）
- **カード内情報**: 1列（モバイル）→ 2列（タブレット以上）

### カラーテーマ

- **緊急連絡先バッジ**: `bg-red-100 text-red-700`
- **連絡先バッジ**: `bg-blue-100 text-blue-700`
- **追加ボタン**: `border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light`
- **編集ボタン**: `variant="outline"` デフォルトスタイル
- **削除ボタン**: `border-red-300 text-red-600 hover:bg-red-50`
- **登録ボタン**: `bg-carebase-blue hover:bg-carebase-blue-dark`

### アイコン使用

- **追加ボタン**: `PlusCircle` アイコン
- **編集ボタン**: `Edit3` アイコン
- **削除ボタン**: `Trash2` アイコン
- **電話番号**: `Phone` アイコン
- **メールアドレス**: `Mail` アイコン
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

## 参考資料

- [利用者詳細画面実装](../page.tsx)
- [ResidentDetailTabs コンポーネント](../../../../components/3_organisms/resident/resident-detail-tabs.tsx)
- [ContactInfoCard コンポーネント](../../../../components/2_molecules/resident/contact-info-card.tsx)
- [ContactForm コンポーネント](../../../../components/2_molecules/forms/contact-form.tsx)
- [ContactRegistrationModal コンポーネント](../../../../components/3_organisms/modals/contact-registration-modal.tsx)
- [ContactEditModal コンポーネント](../../../../components/3_organisms/modals/contact-edit-modal.tsx)
- [ContactDeleteModal コンポーネント](../../../../components/3_organisms/modals/contact-delete-modal.tsx)
- [Contact Types](../../../../types/contact.ts)
- [Contact Service](../../../../services/contactService.ts)
- [Issue #133: 利用者詳細（基本情報）](https://github.com/ambi-tious/CareBase-staff/issues/133)
- [スタッフ選択画面設計書](../../../(auth)/staff-selection/README.md)
