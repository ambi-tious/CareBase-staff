# 連絡・予定（連絡登録）画面設計書

画面名: `連絡・予定（連絡登録）`
パス: `/contact-schedule/new`
URL: https://carebase-staff.vercel.app/contact-schedule/new

## 概要

連絡・予定登録画面設計書です。
職員が利用者選択から連絡・予定作成まで、Googleカレンダー風のフォームを使用して効率的に情報を登録できる機能を提供します。
種別・カテゴリ管理、通知対象選択、下書き・確認必須機能を含む包括的な連絡管理システムです。

Issue: [#021 [設計] #021 連絡・予定｜連絡登録](https://github.com/ambi-tious/CareBase-staff/issues/101)

## 全体レイアウト

### 画面構成

連絡・予定登録のメイン画面として以下の要素で構成：

- ページヘッダー（画面タイトル、戻るボタン）
- 利用者選択機能（グループ・チーム別表示）
- 連絡・予定作成フォーム
- 種別・カテゴリ管理機能
- 通知対象選択機能
- 下書き・確認必須設定機能
- アクションボタン（キャンセル、下書き保存、登録）

### 画面項目

| 項目名                   | コンポーネント     | 必須 | 表示条件           | 初期値             | 備考                                             |
| ------------------------ | ------------------ | ---- | ------------------ | ------------------ | ------------------------------------------------ |
| 戻るボタン               | Button             | -    | 常時               | 戻る               | ArrowLeft アイコン                               |
| 画面タイトル             | Heading            | -    | 常時               | 連絡・予定登録     | MessageSquarePlus アイコン付き                   |
| 利用者選択ボタン         | Button             | -    | 常時               | 利用者を選択       | Users アイコン付き                               |
| 利用者選択モーダル       | Modal              | -    | 利用者選択時       | -                  | グループ・チーム階層表示                         |
| グループ選択             | Select             | -    | 利用者選択モーダル | -                  | 所属グループの選択                               |
| チーム選択               | Select             | -    | 利用者選択モーダル | -                  | 所属チームの選択                                 |
| 利用者カード一覧         | Grid               | -    | 利用者選択モーダル | -                  | 利用者情報を3x3グリッドで表示                    |
| 選択利用者表示           | Card               | -    | 利用者選択後       | -                  | 選択済み利用者の確認表示                         |
| タイトル入力             | FormField          | ◯    | 常時               | 空文字             | テキスト入力、プレースホルダー「会議のお知らせ」 |
| 内容入力                 | FormTextarea       | ◯    | 常時               | 空文字             | リッチテキストエディタ                           |
| 種別選択                 | FormRadioGroup     | ◯    | 常時               | インフォメーション | 4つの種別から選択                                |
| カテゴリ選択             | FormSelect         | -    | 常時               | -                  | 種別に応じたカテゴリ一覧                         |
| カテゴリ管理ボタン       | Button             | -    | 常時               | カテゴリ管理       | Settings アイコン付き                            |
| カテゴリ管理モーダル     | Modal              | -    | カテゴリ管理時     | -                  | CRUD操作とドラッグ＆ドロップ並び替え             |
| 開始日時                 | FormDateTimePicker | ◯    | 常時               | 現在日時           | 日時選択                                         |
| 終了日時                 | FormDateTimePicker | -    | 常時               | 開始日時+1時間     | 終日オプション対応                               |
| 終日チェックボックス     | FormCheckbox       | -    | 常時               | false              | チェック時は時刻入力を非表示                     |
| 場所入力                 | FormField          | -    | 常時               | 空文字             | テキスト入力、プレースホルダー「会議室A」        |
| 通知対象選択ボタン       | Button             | -    | 常時               | 通知対象を選択     | Bell アイコン付き                                |
| 通知対象選択モーダル     | Modal              | -    | 通知対象選択時     | -                  | 職員・グループ・チーム単位での選択               |
| 通知対象表示             | Card               | -    | 通知対象選択後     | -                  | 選択済み通知対象の確認表示                       |
| 確認必須チェックボックス | FormCheckbox       | -    | 常時               | false              | チェック時は受信者の確認が必要                   |
| 重要度選択               | FormRadioGroup     | -    | 常時               | 中                 | 高・中・低から選択                               |
| 添付ファイル             | FileUpload         | -    | 常時               | -                  | 複数ファイル対応、5MB制限                        |
| キャンセルボタン         | Button             | -    | 常時               | キャンセル         | アウトライン                                     |
| 下書き保存ボタン         | Button             | -    | 常時               | 下書き保存         | アウトライン、Save アイコン                      |
| 登録ボタン               | Button             | -    | 常時               | 登録               | 青色スタイル、Send アイコン                      |

## 機能仕様

### 利用者選択機能

#### 利用者選択フロー

1. **利用者選択ボタンクリック**: モーダル表示
2. **グループ・チーム選択**: 所属による絞り込み
3. **利用者カード選択**: 複数選択可能
4. **選択確定**: モーダル閉じて選択利用者表示

#### 利用者表示仕様

- **グリッド表示**: 3列×3行の利用者カード配置
- **利用者カード構成**:
  - プロフィール画像（デフォルト: User アイコン）
  - 利用者名（例：サンプル太郎10）
  - 選択状態の視覚的表示（青枠・チェックマーク）
- **複数選択**: チェックボックス式で複数利用者を同時選択可能
- **絞り込み機能**: グループ・チーム単位での表示制御

### 連絡・予定作成フォーム

<img width="1470" height="799" alt="スクリーンショット 2025-07-30 9 54 37" src="https://github.com/user-attachments/assets/a0ce8967-2384-4290-bd20-51b8b5876c96" />

- **日時選択**: カレンダーポップオーバーと時刻ドロップダウン
- **デフォルト設定**:
  - 開始日時: 現在日時
  - 終了日時: --:--
- **バリデーション**: 入力必須
  - タイトル
  - 種別
  - 重要度
  - 対象者
  - 実施日
  - 内容

### 種別・カテゴリ管理機能

#### 種別一覧

| 種別名             | 説明               | カラーテーマ | 用途例                 |
| ------------------ | ------------------ | ------------ | ---------------------- |
| インフォメーション | 情報共有・お知らせ | 青色系       | 会議案内、制度変更通知 |
| イベント           | 行事・催事         | 緑色系       | レクリエーション、行事 |
| タスク             | 作業・業務依頼     | 黄色系       | 清掃依頼、書類作成依頼 |
| その他             | 上記以外の連絡事項 | グレー系     | 自由記載事項           |

#### カテゴリ管理機能

##### CRUD操作

- **作成**: 種別ごとにカテゴリ名を入力して新規作成
- **編集**: 既存カテゴリ名の変更
- **削除**: 使用されていないカテゴリの削除
- **並び替え**: ドラッグ＆ドロップによる順序変更

##### カテゴリ管理モーダル構成

```
┌─ カテゴリ管理 ─────────────────────────────────────┐
│ [インフォメーション] [イベント] [タスク] [その他] │
├────────────────────────────────────────────────────┤
│ 現在の種別: インフォメーション                     │
│                                                    │
│ ┌─ カテゴリ一覧 ─────────────────────────────────┐ │
│ │ ≡ 重要なお知らせ        [編集] [削除]          │ │
│ │ ≡ 研修・講習           [編集] [削除]          │ │
│ │ ≡ システム関連         [編集] [削除]          │ │
│ │ + 新しいカテゴリを追加...                      │ │
│ └────────────────────────────────────────────────┘ │
│                                     [保存] [キャンセル] │
└────────────────────────────────────────────────────┘
```

### 通知対象選択機能

#### 選択単位

- **個別職員**: 職員を個別に選択
- **グループ単位**: フロア・グループ全体
- **チーム単位**: ユニット・チーム全体
- **全職員**: 全職員を対象

#### 通知対象表示

- **選択済み表示**: 選択した対象をカードで表示
- **対象数表示**: 選択人数の動的表示
- **削除機能**: 個別またはまとめて削除可能

### 下書き・確認必須機能

#### 下書き機能

- **自動保存**: 5分間隔での自動下書き保存
- **手動保存**: 「下書き保存」ボタンでの保存
- **復元機能**: 下書きからの編集再開
- **下書き一覧**: 未完了下書きの管理

#### 確認必須機能

- **確認要求**: 受信者に確認アクションを要求
- **確認状況**: 既読・未読・確認済み状況の表示
- **リマインド**: 未確認者への自動リマインド
- **確認期限**: 期限設定と期限切れ通知

### アクション

| 項目名       | 処理内容                     | 対象API                            | 遷移先画面                                |
| ------------ | ---------------------------- | ---------------------------------- | ----------------------------------------- |
| 戻るボタン   | 連絡・予定一覧画面に戻る     | -                                  | 連絡・予定一覧 (`/contact-schedule`)      |
| 利用者選択   | 利用者選択モーダル表示       | `/api/v1/residents`                | 同一画面（モーダル表示）                  |
| カテゴリ管理 | カテゴリ管理モーダル表示     | `/api/v1/communication-categories` | 同一画面（モーダル表示）                  |
| 通知対象選択 | 通知対象選択モーダル表示     | `/api/v1/staff`                    | 同一画面（モーダル表示）                  |
| 下書き保存   | 下書きとして保存             | `/api/v1/contact-schedule/drafts`  | 同一画面（保存完了メッセージ）            |
| 登録         | 連絡・予定を正式登録         | `/api/v1/contact-schedule`         | 連絡・予定詳細 (`/contact-schedule/{id}`) |
| キャンセル   | 入力内容を破棄して一覧に戻る | -                                  | 連絡・予定一覧 (`/contact-schedule`)      |

### 入力チェック

| 項目名       | イベント | チェック内容                    | エラーメッセージ                           |
| ------------ | -------- | ------------------------------- | ------------------------------------------ |
| 利用者選択   | submit   | 最低1名の利用者選択必須         | 利用者を選択してください                   |
| タイトル     | input    | 必須チェック                    | タイトルは必須です                         |
| タイトル     | input    | 文字数制限（100文字以内）       | タイトルは100文字以内で入力してください    |
| 内容         | input    | 必須チェック                    | 内容は必須です                             |
| 内容         | input    | 文字数制限（2000文字以内）      | 内容は2000文字以内で入力してください       |
| 種別         | select   | 必須チェック                    | 種別を選択してください                     |
| 開始日時     | input    | 必須チェック                    | 開始日時を設定してください                 |
| 終了日時     | input    | 開始日時との整合性チェック      | 終了日時は開始日時より後に設定してください |
| 場所         | input    | 文字数制限（200文字以内）       | 場所は200文字以内で入力してください        |
| 添付ファイル | upload   | ファイルサイズチェック（5MB）   | ファイルサイズは5MB以下にしてください      |
| 添付ファイル | upload   | ファイル数制限（最大5ファイル） | 添付ファイルは最大5ファイルまでです        |

### バリデーション仕様

#### リアルタイムバリデーション

- **入力時検証**: フォーム項目への入力と同時にバリデーションを実行
- **エラー表示**: 各項目下部に赤色でエラーメッセージを表示
- **送信制御**: バリデーションエラーがある場合は登録ボタンクリック時に送信を阻止

#### 日時検証

- **日時形式**: ISO 8601形式での日時入力
- **終了日時**: 開始日時より後の日時であることを確認
- **終日設定**: 終日の場合は時刻を00:00-24:00に自動設定

#### ファイル検証

- **対応形式**: 画像・ドキュメント・PDF等の一般的なファイル形式
- **サイズ制限**: 1ファイル最大5MB
- **ウイルススキャン**: アップロード時のセキュリティチェック

## UI/UX仕様

### レスポンシブデザイン

- **モバイル（〜768px）**:
  - フォーム項目を1列で縦並び表示
  - 利用者選択グリッドを2列表示
  - ボタンを全幅で縦積み配置
- **タブレット（768px〜1024px）**:
  - フォーム項目を2列グリッドで表示
  - 利用者選択グリッドを3列表示
  - ボタンを右寄せで横並び配置
- **デスクトップ（1024px〜）**:
  - フォーム全体の最大幅を4xlに制限
  - 2列グリッドレイアウトを維持
  - モーダルサイズを適切に拡大

### カラーテーマ

- **種別カラー**:
  - インフォメーション: `bg-blue-100 text-blue-700 border-blue-200`
  - イベント: `bg-green-100 text-green-700 border-green-200`
  - タスク: `bg-yellow-100 text-yellow-700 border-yellow-200`
  - その他: `bg-gray-100 text-gray-700 border-gray-200`
- **重要度カラー**:
  - 高: `bg-red-100 text-red-700 border-red-200`
  - 中: `bg-yellow-100 text-yellow-700 border-yellow-200`
  - 低: `bg-blue-100 text-blue-700 border-blue-200`
- **アクションボタン**:
  - 登録: `bg-carebase-blue hover:bg-carebase-blue-dark`
  - 下書き保存: `bg-gray-100 hover:bg-gray-200 text-gray-700`
  - キャンセル: `border-gray-300 text-gray-700`

### アニメーション

- **モーダル表示**: フェードイン・スケールアップ効果
- **フォーム遷移**: スムーズな表示切り替え
- **ドラッグ＆ドロップ**: カテゴリ並び替え時の視覚的フィードバック
- **ボタンホバー**: スムーズなカラートランジション

### アクセシビリティ

- **キーボードナビゲーション**: Tab キーでの順次フォーカス移動
- **スクリーンリーダー**:
  - 適切なaria-label設定
  - 必須項目のaria-required属性
  - エラーメッセージのaria-describedby属性
- **コントラスト比**: WCAG 2.1 AA レベル準拠
- **フォーカス表示**: 明確なフォーカスリング表示

## 技術仕様

### 使用コンポーネント

#### 3_organisms層

- **CommunicationRegistrationForm**: メイン登録フォーム
- **UserSelectionModal**: 利用者選択モーダル
- **CategoryManagementModal**: カテゴリ管理モーダル
- **NotificationTargetModal**: 通知対象選択モーダル

#### 2_molecules層

- **UserSelectionGrid**: 利用者カード配置グリッド
- **CategoryCRUDPanel**: カテゴリCRUD操作パネル
- **NotificationTargetSelector**: 通知対象選択コンポーネント
- **CommunicationFormFields**: フォーム入力フィールド群

#### 1_atoms層

- **UserCard**: 利用者情報カード
- **CategoryBadge**: 種別・カテゴリバッジ
- **DateTimePicker**: 日時選択コンポーネント
- **FileUpload**: ファイルアップロードコンポーネント

### データ型定義

```typescript
interface CommunicationRegistration {
  id: string;
  targetResidents: ResidentSummary[];
  title: string;
  content: string;
  type: CommunicationType;
  category?: CommunicationCategory;
  startDateTime: string;
  endDateTime?: string;
  isAllDay: boolean;
  location?: string;
  notificationTargets: NotificationTarget[];
  isConfirmationRequired: boolean;
  priority: CommunicationPriority;
  attachments: FileAttachment[];
  status: CommunicationStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ResidentSummary {
  id: string;
  name: string;
  nameKana: string;
  profileImage?: string;
  groupName: string;
  teamName: string;
  roomInfo?: string;
}

interface CommunicationCategory {
  id: string;
  name: string;
  type: CommunicationType;
  sortOrder: number;
  isActive: boolean;
}

interface NotificationTarget {
  type: 'individual' | 'group' | 'team' | 'all';
  id?: string;
  name: string;
  count: number;
}

type CommunicationType = 'information' | 'event' | 'task' | 'other';
type CommunicationPriority = 'high' | 'medium' | 'low';
type CommunicationStatus = 'draft' | 'published' | 'archived';
```

### 状態管理

- **フォーム状態**: React Hook Form による状態管理
- **モーダル状態**: ローカル状態でのモーダル表示制御
- **選択状態**: 利用者・通知対象の選択状態管理
- **下書き状態**: localStorage による下書き自動保存

### API エンドポイント

| メソッド | エンドポイント                          | 説明               |
| -------- | --------------------------------------- | ------------------ |
| GET      | `/api/v1/residents`                     | 利用者一覧取得     |
| GET      | `/api/v1/staff`                         | 職員一覧取得       |
| GET      | `/api/v1/communication-categories`      | カテゴリ一覧取得   |
| POST     | `/api/v1/communication-categories`      | カテゴリ新規作成   |
| PUT      | `/api/v1/communication-categories/{id}` | カテゴリ更新       |
| DELETE   | `/api/v1/communication-categories/{id}` | カテゴリ削除       |
| POST     | `/api/v1/contact-schedule`              | 連絡・予定新規作成 |
| POST     | `/api/v1/contact-schedule/drafts`       | 下書き保存         |
| GET      | `/api/v1/contact-schedule/drafts`       | 下書き一覧取得     |

## 画面遷移仕様

### 遷移先URL一覧

| 遷移元           | 遷移先             | URL                                | パラメータ             |
| ---------------- | ------------------ | ---------------------------------- | ---------------------- |
| 戻るボタン       | 連絡・予定一覧画面 | `/contact-schedule`                | なし                   |
| キャンセルボタン | 連絡・予定一覧画面 | `/contact-schedule`                | なし                   |
| 下書き保存       | 同一画面           | `/contact-schedule/new`            | なし（成功メッセージ） |
| 登録ボタン       | 連絡・予定詳細画面 | `/contact-schedule/{id}`           | id: 作成された連絡ID   |
| 下書き編集       | 連絡登録画面       | `/contact-schedule/new?draft={id}` | draft: 下書きID        |

### URLパラメータ仕様

#### 下書き編集

```
/contact-schedule/new?draft={draftId}
```

**パラメータ詳細:**

- `draft`: 下書きID（文字列、任意）

#### 利用者事前選択

```
/contact-schedule/new?residents={residentIds}
```

**パラメータ詳細:**

- `residents`: 利用者IDのカンマ区切り（文字列、任意）

## 参考資料

- [Issue #101: [設計] #021 連絡・予定｜連絡登録](https://github.com/ambi-tious/CareBase-staff/issues/101)
- FlutterFlow参考デザイン:
  - [連絡登録画面1](https://github.com/user-attachments/assets/85cadaed-e60b-4020-b624-55ee5f74383d)
  - [連絡登録画面2](https://github.com/user-attachments/assets/40be0717-c09b-48a4-b254-337f1266b13f)
- [連絡登録画面実装](./page.tsx)
- [CommunicationRegistrationForm コンポーネント](../../../../components/3_organisms/communication/communication-registration-form.tsx)
- [UserSelectionModal コンポーネント](../../../../components/2_molecules/communication/user-selection-modal.tsx)
- [CategoryManagementModal コンポーネント](../../../../components/2_molecules/communication/category-management-modal.tsx)
- [Communication Types](../../../../types/communication.ts)
- [画面一覧](../../../../docs/screen-list.md#連絡予定)
