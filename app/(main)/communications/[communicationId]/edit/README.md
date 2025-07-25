# 連絡・予定（連絡編集）画面設計書

画面名: `連絡・予定（連絡編集）`  
パス: `/communications/[communicationId]/edit`  
URL: https://carebase-staff.vercel.app/communications/[communicationId]/edit

## 概要

CareBase-staffアプリケーションの連絡・予定編集画面設計書です。  
既存の連絡事項の編集機能を提供し、介護現場での情報管理を効率的に行えます。  
Googleカレンダー風のフォームデザインを採用し、種別・カテゴリ設定、通知対象選択、下書き・確認必須機能、詳細画面・コメント機能を備えています。

## 全体レイアウト

### 画面構成

連絡・予定編集のメイン画面として以下の要素で構成：

- ページヘッダー（画面タイトル、説明文、戻るボタン）
- 成功・エラーメッセージ表示エリア
- 連絡・予定編集フォーム（Googleカレンダー風レイアウト）
- カテゴリ管理セクション（種別に応じて動的表示）
- 通知対象選択セクション
- アクションボタン（キャンセル、下書き保存、確認必須設定、更新）

### 画面項目

| 項目名               | コンポーネント | 必須 | 表示条件       | 初期値             | 備考                                                       |
| -------------------- | -------------- | ---- | -------------- | ------------------ | ---------------------------------------------------------- |
| 戻るボタン           | Button         | -    | 常時           | 戻る               | アウトライン、ArrowLeft アイコン                           |
| 画面タイトル         | Heading        | -    | 常時           | 連絡・予定編集     | Edit3 アイコン付き                                         |
| 説明文               | Text           | -    | 常時           | 編集説明           | 必須項目マークの説明含む                                   |
| 成功メッセージ       | Alert          | -    | 更新成功時     | -                  | 緑色背景、CheckCircle アイコン                             |
| エラーアラート       | Alert          | -    | 更新エラー時   | -                  | 赤色背景、エラーメッセージ表示                             |
| 作成者表示           | InfoDisplay    | -    | 常時           | ログインユーザー名 | 青色背景、User アイコン付き                                |
| タイトル入力         | FormField      | ◯    | 常時           | 既存データ         | テキスト入力、プレースホルダー「重要なお知らせについて」   |
| 種別選択             | FormSelect     | ◯    | 常時           | 既存データ         | インフォメーション/イベント/タスク/その他                  |
| カテゴリ選択         | FormSelect     | ◯    | 種別選択後     | 既存データ         | 種別に応じたカテゴリ一覧                                   |
| カテゴリ管理ボタン   | Button         | -    | 種別選択後     | カテゴリ管理       | Settings アイコン、カテゴリ管理モーダル表示                |
| 重要度選択           | FormSelect     | ◯    | 常時           | 既存データ         | 高/中/低                                                   |
| 通知対象選択         | FormCheckbox   | ◯    | 常時           | 既存データ         | 全職員/グループ別/個別選択                                 |
| 対象者詳細選択       | FormMultisel   | -    | 個別選択時     | 既存データ         | 職員一覧から複数選択                                       |
| 実施日入力           | FormField      | ◯    | 常時           | 既存データ         | 日付入力、Googleカレンダー風デザイン                       |
| 開始時刻入力         | FormField      | -    | 常時           | 既存データ         | 時刻入力                                                   |
| 終了時刻入力         | FormField      | -    | 常時           | 既存データ         | 時刻入力                                                   |
| 関連利用者選択       | FormSelect     | -    | 常時           | 既存データ         | 利用者一覧から選択                                         |
| タグ入力             | FormField      | -    | 常時           | 既存データ         | カンマ区切りテキスト                                       |
| 内容入力             | Textarea       | ◯    | 常時           | 既存データ         | 大きなテキストエリア、1000文字制限                         |
| 下書き設定           | Switch         | -    | 常時           | 既存データ         | 下書き状態のトグル                                         |
| 確認必須設定         | Switch         | -    | 常時           | 既存データ         | 確認必須フラグのトグル                                     |
| 未保存変更警告       | Alert          | -    | 変更あり時     | -                  | 黄色背景、AlertCircle アイコン                             |
| キャンセルボタン     | Button         | -    | 常時           | キャンセル         | アウトライン                                               |
| 下書き保存ボタン     | Button         | -    | 常時           | 下書き保存         | アウトライン、Save アイコン                                |
| 更新ボタン           | Button         | -    | 常時           | 更新               | 青色スタイル、Send アイコン                                |
| 詳細表示ボタン       | Button         | -    | 常時           | 詳細表示           | アウトライン、Eye アイコン                                 |

## 機能仕様

### アクション

| 項目名             | 処理内容                       | 対象API                                      | 遷移先画面                                          |
| ------------------ | ------------------------------ | -------------------------------------------- | --------------------------------------------------- |
| 戻るボタン         | 連絡・予定詳細画面に戻る       | -                                            | 連絡・予定詳細画面 (`/communications/{id}`)         |
| 種別選択           | カテゴリ一覧を動的更新         | `GET /api/v1/categories?type={type}`         | 同一画面（カテゴリ選択肢更新）                      |
| カテゴリ管理       | カテゴリ管理モーダル表示       | -                                            | カテゴリ管理モーダル                                |
| 通知対象選択       | 対象者選択肢の表示制御         | `GET /api/v1/staff?group={group}`            | 同一画面（対象者選択肢更新）                        |
| フォーム入力       | リアルタイムバリデーション実行 | -                                            | 同一画面（エラー表示更新）                          |
| 下書き保存         | 入力内容を下書きとして保存     | `PUT /api/v1/communications/{id}/draft`      | 同一画面（成功メッセージ表示）                      |
| 更新ボタン         | 連絡・予定を確定して更新       | `PUT /api/v1/communications/{id}`            | 連絡・予定詳細画面 (`/communications/{id}`)         |
| キャンセルボタン   | 入力内容を破棄して詳細に戻る   | -                                            | 連絡・予定詳細画面 (`/communications/{id}`)         |
| 詳細表示ボタン     | 詳細画面に遷移                 | -                                            | 連絡・予定詳細画面 (`/communications/{id}`)         |

### 種別・カテゴリ管理機能

#### 種別定義

| 種別               | 説明                 | カテゴリ例                         |
| ------------------ | -------------------- | ---------------------------------- |
| インフォメーション | 情報共有・通知事項   | 重要通知、業務連絡、研修案内       |
| イベント           | 行事・催し物         | 季節行事、誕生日会、外出レク       |
| タスク             | 業務・作業依頼       | 清掃作業、書類作成、物品補充       |
| その他             | 上記以外の項目       | 雑務、相談事項、提案               |

#### カテゴリ管理機能

- **作成**: 種別に応じたカテゴリの新規作成
- **編集**: 既存カテゴリ名の変更
- **削除**: 不要なカテゴリの削除（使用中は削除不可）
- **並び替え**: ドラッグ&ドロップによる表示順変更

### 入力チェック

| 項目名           | イベント | チェック内容                   | エラーメッセージ                           |
| ---------------- | -------- | ------------------------------ | ------------------------------------------ |
| タイトル入力     | blur     | 必須チェック                   | タイトルは必須です                         |
| タイトル入力     | blur     | 文字数チェック（100文字以内）  | タイトルは100文字以内で入力してください    |
| 種別選択         | change   | 必須選択チェック               | 種別は必須です                             |
| カテゴリ選択     | change   | 必須選択チェック               | カテゴリは必須です                         |
| 重要度選択       | change   | 必須選択チェック               | 重要度は必須です                           |
| 通知対象選択     | change   | 最低1つ選択チェック            | 通知対象を選択してください                 |
| 実施日入力       | change   | 必須チェック                   | 実施日は必須です                           |
| 開始時刻入力     | change   | 時刻形式チェック               | 有効な時刻を入力してください               |
| 終了時刻入力     | change   | 時刻形式チェック               | 有効な時刻を入力してください               |
| 終了時刻入力     | change   | 開始時刻との関係チェック       | 終了時刻は開始時刻より後に設定してください |
| 内容入力         | blur     | 必須チェック                   | 内容は必須です                             |
| 内容入力         | input    | 文字数チェック（1000文字以内） | 内容は1000文字以内で入力してください       |
| フォーム送信     | submit   | 全必須項目チェック             | 必須項目をすべて入力してください           |

### バリデーション仕様

#### リアルタイムバリデーション

- **入力時検証**: フォーム項目への入力と同時にバリデーションを実行
- **エラー表示**: 各項目下部に赤色でエラーメッセージを表示
- **送信制御**: バリデーションエラーがある場合は送信ボタンを無効化
- **種別連動**: 種別選択時にカテゴリ選択肢を即座に更新

#### 通知対象選択仕様

- **全職員**: すべての職員に通知
- **グループ別**: 選択したグループの職員に通知
- **個別選択**: 個別に選択した職員に通知
- **権限チェック**: 通知権限の確認

#### 下書き・確認必須機能

- **下書き保存**: バリデーション緩和で途中保存可能
- **確認必須設定**: 受信者による確認を必須とするフラグ
- **自動保存**: 一定時間ごとの自動下書き保存（将来実装予定）
- **復元機能**: 下書きからの復元機能

#### エラーハンドリング

- **API通信エラー**: 「ネットワークエラーが発生しました。接続を確認してもう一度お試しください。」
- **バリデーションエラー**: 「入力内容に不備があります。必須項目を確認してください。」
- **更新エラー**: 「連絡・予定の更新に失敗しました。もう一度お試しください。」
- **カテゴリ取得エラー**: 「カテゴリ情報の取得に失敗しました。」

## UI/UX仕様

### Googleカレンダー風デザイン

- **フォームレイアウト**: Googleカレンダーの予定作成画面を参考
- **日時入力**: カレンダーピッカーとタイムピッカーの組み合わせ
- **色分け**: 種別・重要度による色分け表示
- **インタラクション**: スムーズなアニメーションと直感的な操作感

### レスポンシブデザイン

- **モバイル（〜768px）**:
  - フォーム項目を1列で縦並び表示
  - カテゴリ管理を簡略化
  - ボタンを全幅で縦積み配置
- **タブレット（768px〜1024px）**:
  - フォーム項目を2列グリッドで表示
  - カテゴリ管理モーダルを適切なサイズで表示
  - ボタンを右寄せで横並び配置
- **デスクトップ（1024px〜）**:
  - フォーム全体の最大幅を制限
  - サイドバー形式でのカテゴリ管理表示
  - 余白を十分に確保

### カラーテーマ

- **種別カラー**:
  - インフォメーション: `bg-blue-100 text-blue-700 border-blue-200`
  - イベント: `bg-green-100 text-green-700 border-green-200`
  - タスク: `bg-orange-100 text-orange-700 border-orange-200`
  - その他: `bg-gray-100 text-gray-700 border-gray-200`
- **重要度カラー**:
  - 高: `bg-red-100 text-red-700 border-red-200`
  - 中: `bg-yellow-100 text-yellow-700 border-yellow-200`
  - 低: `bg-blue-100 text-blue-700 border-blue-200`
- **アクションボタン**:
  - 更新: `bg-carebase-blue hover:bg-carebase-blue-dark`
  - 下書き保存: `border-gray-400 text-gray-700 hover:bg-gray-50`
  - キャンセル: `border-gray-300 text-gray-700`

### アニメーション

- **種別選択時**: カテゴリ選択肢のスムーズな切り替え
- **フォーム送信**: ローディング状態の表示
- **カテゴリ管理**: ドラッグ&ドロップのビジュアルフィードバック
- **バリデーション**: リアルタイムでエラーメッセージ表示・非表示

### アクセシビリティ

- **キーボードナビゲーション**: Tabキーでの順次フォーカス移動
- **スクリーンリーダー**:
  - 適切なlabel要素の関連付け
  - 必須項目のaria-required属性
  - エラーメッセージのaria-describedby属性
- **コントラスト比**: WCAG 2.1 AA レベル準拠
- **フォーカス表示**: 明確なフォーカスリング表示

## 詳細画面・コメント機能

### 詳細画面仕様

- **基本情報表示**: タイトル、種別、カテゴリ、重要度、作成者、日時
- **内容表示**: 連絡・予定の詳細内容
- **ステータス表示**: 下書き/確認必須/完了状態
- **通知対象表示**: 通知先一覧と確認状況
- **編集権限表示**: 編集可能かどうかの表示

### コメント機能

- **コメント投稿**: 連絡・予定に対するコメント投稿
- **コメント一覧**: 投稿日時順での表示
- **編集・削除**: 自分のコメントの編集・削除
- **通知機能**: コメント投稿時の関係者への通知
- **リアルタイム更新**: 新しいコメントの自動更新

### 編集権限管理

- **作成者**: 全項目編集可能
- **管理者**: 全項目編集可能
- **一般職員**: 自分が作成したもののみ編集可能（設定により変更可能）
- **権限チェック**: 編集画面アクセス時の権限確認

## 技術仕様

### 使用コンポーネント

#### 3_organisms層

- **CommunicationEditForm**: 連絡・予定編集フォーム
- **CategoryManagementModal**: カテゴリ管理モーダル
- **CommunicationDetail**: 連絡・予定詳細表示
- **CommentSection**: コメント機能セクション

#### 2_molecules層

- **TypeSelector**: 種別選択コンポーネント
- **CategorySelector**: カテゴリ選択コンポーネント
- **NotificationTargetSelector**: 通知対象選択コンポーネント
- **CategoryManagementList**: カテゴリ管理リスト

#### 1_atoms層

- **TypeBadge**: 種別バッジ表示
- **PriorityBadge**: 重要度バッジ表示
- **StatusBadge**: ステータスバッジ表示
- **CategoryTag**: カテゴリタグ表示

### データ型定義

```typescript
interface CommunicationFormData {
  id: string; // 連絡・予定ID
  title: string; // タイトル（必須、100文字以内）
  content: string; // 内容（必須、1000文字以内）
  type: CommunicationType; // 種別（必須）
  categoryId: string; // カテゴリID（必須）
  priority: CommunicationPriority; // 重要度（必須）
  notificationTargets: NotificationTarget[]; // 通知対象（必須）
  dueDate: string; // 実施日（必須）
  startTime?: string; // 開始時刻（任意）
  endTime?: string; // 終了時刻（任意）
  relatedResidentId?: string; // 関連利用者（任意）
  tags?: string[]; // タグ（任意）
  isDraft: boolean; // 下書きフラグ
  isConfirmationRequired: boolean; // 確認必須フラグ
  createdBy: string; // 作成者ID
  createdAt: string; // 作成日時
  updatedAt: string; // 更新日時
}

interface CommunicationType {
  id: string;
  name: 'インフォメーション' | 'イベント' | 'タスク' | 'その他';
  color: string;
}

interface CommunicationCategory {
  id: string;
  name: string;
  typeId: string;
  sortOrder: number;
  isActive: boolean;
}

interface NotificationTarget {
  type: 'all' | 'group' | 'individual';
  targetIds: string[];
  groupName?: string;
}

interface CommunicationComment {
  id: string;
  communicationId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
}
```

### API仕様

| メソッド | エンドポイント                              | 説明                   |
| -------- | ------------------------------------------- | ---------------------- |
| GET      | `/api/v1/communications/{id}`               | 連絡・予定詳細取得     |
| PUT      | `/api/v1/communications/{id}`               | 連絡・予定更新         |
| PUT      | `/api/v1/communications/{id}/draft`         | 下書き保存             |
| GET      | `/api/v1/categories?type={type}`            | カテゴリ一覧取得       |
| POST     | `/api/v1/categories`                        | カテゴリ作成           |
| PUT      | `/api/v1/categories/{id}`                   | カテゴリ更新           |
| DELETE   | `/api/v1/categories/{id}`                   | カテゴリ削除           |
| PUT      | `/api/v1/categories/sort`                   | カテゴリ並び替え       |
| GET      | `/api/v1/staff?group={group}`               | 職員一覧取得           |
| GET      | `/api/v1/communications/{id}/comments`      | コメント一覧取得       |
| POST     | `/api/v1/communications/{id}/comments`      | コメント投稿           |
| PUT      | `/api/v1/communications/{id}/comments/{id}` | コメント更新           |
| DELETE   | `/api/v1/communications/{id}/comments/{id}` | コメント削除           |

### 状態管理

- **フォーム状態**: 入力値、バリデーション状態、送信状態
- **カテゴリ状態**: 種別別カテゴリ一覧、管理モーダル状態
- **通知対象状態**: 選択された通知対象、職員一覧
- **コメント状態**: コメント一覧、投稿中状態
- **エラー状態**: API通信エラー、バリデーションエラー
- **成功状態**: 更新成功、下書き保存成功

## 参考資料

- [連絡・予定一覧画面設計書](../../README.md)
- [連絡・予定詳細画面設計書](../README.md)
- [Contact Schedule Edit 設計書](../../contact-schedule/edit/[itemId]/README.md)
- [CommunicationEditForm コンポーネント](../../../../components/3_organisms/communications/communication-edit-form.tsx)
- [CategoryManagementModal コンポーネント](../../../../components/3_organisms/communications/category-management-modal.tsx)
- [Communication Types](../../../../types/communication.ts)
- [FlutterFlow 参考画像](https://github.com/user-attachments/assets/8e6eae2b-d3ae-49d3-8bc8-103671cace86)
- [画面一覧](../../../../docs/screen-list.md#連絡予定)