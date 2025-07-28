# 個別ポイント登録画面設計書

- 画面名: `個別ポイント登録`
- パス: `/residents/[residentId]/individual-points/new`
- URL: https://carebase-staff.vercel.app/residents/1/individual-points/new

## 概要

利用者の個別ポイント登録画面設計書です。
カテゴリと利用者に紐づいた個別ポイントの作成機能、テキスト・画像・動画保存機能を提供します。
リッチテキストエディタを使用することで、従来の項目ごと作成ではなく、より柔軟で効率的な記録作成を実現します。
利用者詳細画面の個別ポイントタブから遷移し、登録完了後は利用者詳細画面に戻ります。

Issue: [#129 [設計] #007 利用者｜個別ポイント登録](https://github.com/ambi-tious/CareBase-staff/issues/129)

## 全体レイアウト

### 画面構成

![個別ポイント登録画面](https://github.com/user-attachments/assets/311a83ef-40f6-4160-ac04-9fd8500ac220)

個別ポイント作成のメイン画面として以下の要素で構成：

- ページヘッダー（画面タイトル、利用者情報、戻るボタン）
- 成功・エラーメッセージ表示エリア
- 個別ポイント作成フォーム（2列レイアウト + リッチテキストエディタ）
- メディアファイルアップロード機能
- アクションボタン（キャンセル、下書き保存、登録）

### 画面項目

| 項目名                 | コンポーネント   | 必須 | 表示条件       | 初期値             | 備考                                                   |
| ---------------------- | ---------------- | ---- | -------------- | ------------------ | ------------------------------------------------------ |
| 戻るボタン             | Button           | -    | 常時           | 戻る               | アウトライン、ArrowLeft アイコン                       |
| 画面タイトル           | Heading          | -    | 常時           | 個別ポイント登録   | UserPlus アイコン付き                                  |
| 利用者情報表示         | ResidentInfo     | -    | 常時           | [利用者名]         | 利用者名、写真、基本情報を表示                         |
| 成功メッセージ         | Alert            | -    | 登録成功時     | -                  | 緑色背景、CheckCircle アイコン                         |
| エラーアラート         | Alert            | -    | 登録エラー時   | -                  | 赤色背景、エラーメッセージ表示                         |
| カテゴリ選択           | FormSelect       | ◯    | 常時           | 空文字             | 身体機能/認知機能/社会性/生活習慣/趣味嗜好/その他      |
| タイトル入力           | FormField        | ◯    | 常時           | 空文字             | テキスト入力、プレースホルダー「散歩時の様子について」 |
| 記録日時               | FormField        | ◯    | 常時           | 現在日時           | 日時入力、デフォルトは現在日時                         |
| 重要度選択             | FormSelect       | ◯    | 常時           | 中                 | 高/中/低                                               |
| 内容入力               | RichTextEditor   | ◯    | 常時           | 空文字             | リッチテキストエディタ、画像・動画埋め込み可能         |
| メディアファイル添付   | FileUpload       | -    | 常時           | 空                 | 画像・動画ファイル、複数選択可、50MB制限               |
| タグ入力               | TagInput         | -    | 常時           | 空配列             | 自由入力可能なタグ、検索・フィルタリング用             |
| 公開範囲設定           | FormSelect       | ◯    | 常時           | チーム内のみ       | チーム内のみ/施設内全体/管理者のみ                     |
| 未保存変更警告         | Alert            | -    | 変更あり時     | -                  | 黄色背景、AlertCircle アイコン                         |
| キャンセルボタン       | Button           | -    | 常時           | キャンセル         | アウトライン                                           |
| 下書き保存ボタン       | Button           | -    | 常時           | 下書き保存         | アウトライン、Save アイコン                            |
| 登録ボタン             | Button           | -    | 常時           | ポイントを登録     | 青色スタイル、Plus アイコン                            |

## 機能仕様

### アクション

| 項目名               | 処理内容                                   | 対象API                                          | 遷移先画面                                    |
| -------------------- | ------------------------------------------ | ------------------------------------------------ | --------------------------------------------- |
| 戻るボタン           | 利用者詳細画面の個別ポイントタブに戻る     | -                                                | 利用者詳細画面個別ポイントタブ                |
| フォーム入力         | リアルタイムバリデーション実行             | -                                                | 同一画面（エラー表示更新）                    |
| メディアファイル添付 | ファイルアップロードとプレビュー表示       | `POST /api/v1/media/upload`                      | 同一画面（ファイル一覧更新）                  |
| タグ入力             | 既存タグの検索・新規タグ作成               | `GET /api/v1/individual-points/tags`             | 同一画面（タグ候補表示）                      |
| 下書き保存           | 入力内容を下書きとして保存                 | `POST /api/v1/individual-points/draft`           | 同一画面（成功メッセージ表示）                |
| 登録ボタン           | 個別ポイントを確定して登録                 | `POST /api/v1/individual-points`                 | 利用者詳細画面個別ポイントタブ                |
| キャンセルボタン     | 入力内容を破棄して利用者詳細画面に戻る     | -                                                | 利用者詳細画面個別ポイントタブ                |

### 入力チェック

| 項目名               | イベント | チェック内容                     | エラーメッセージ                                |
| -------------------- | -------- | -------------------------------- | ----------------------------------------------- |
| カテゴリ選択         | change   | 必須選択チェック                 | カテゴリは必須です                              |
| タイトル入力         | blur     | 必須チェック                     | タイトルは必須です                              |
| タイトル入力         | blur     | 文字数チェック（100文字以内）    | タイトルは100文字以内で入力してください         |
| 記録日時             | input    | 必須チェック                     | 記録日時は必須です                              |
| 記録日時             | input    | 日時形式チェック                 | 正しい日時形式で入力してください                |
| 記録日時             | input    | 未来日チェック                   | 記録日時は現在時刻以前を指定してください        |
| 重要度選択           | change   | 必須選択チェック                 | 重要度は必須です                                |
| 内容入力             | blur     | 必須チェック                     | 内容は必須です                                  |
| 内容入力             | input    | 文字数チェック（5000文字以内）   | 内容は5000文字以内で入力してください            |
| メディアファイル     | upload   | ファイルサイズチェック           | ファイルサイズは50MB以下にしてください          |
| メディアファイル     | upload   | ファイル形式チェック             | 画像・動画ファイルを選択してください            |
| メディアファイル     | upload   | ファイル数チェック               | 添付ファイルは10個まで選択可能です              |
| タグ入力             | input    | 文字数チェック（20文字以内）     | タグは20文字以内で入力してください              |
| タグ入力             | input    | タグ数チェック（10個以内）       | タグは10個まで設定可能です                      |
| 公開範囲設定         | change   | 必須選択チェック                 | 公開範囲は必須です                              |
| フォーム送信         | submit   | 全必須項目チェック               | 必須項目をすべて入力してください                |

### バリデーション仕様

#### リアルタイムバリデーション

- **入力時検証**: フォーム項目への入力と同時にバリデーションを実行
- **エラー表示**: 各項目下部に赤色でエラーメッセージを表示
- **送信制御**: バリデーションエラーがある場合は登録ボタンクリック時に送信を阻止

#### 文字数制限

- **タイトル**: 100文字以内
- **内容**: 5000文字以内、リアルタイム文字数表示
- **タグ**: 1タグ20文字以内、最大10個まで
- **文字数表示**: 入力中の文字数を「xxx/5000文字」形式で表示

#### メディアファイル制限

- **対応形式**:
  - 画像: JPEG, PNG, GIF, WebP
  - 動画: MP4, MOV, AVI, WMV
- **ファイルサイズ**: 1ファイル最大50MB
- **ファイル数**: 最大10ファイル
- **総容量制限**: 全ファイル合計500MBまで

#### カテゴリ・利用者連携仕様

- **利用者情報**: URLパラメータ `[residentId]` から自動取得
- **カテゴリ情報**: マスタデータから選択肢を動的取得
- **関連付け**: 個別ポイント作成時に利用者IDとカテゴリIDを自動設定

#### 下書き保存仕様

- **バリデーション**: 下書き保存時は必須項目チェックを緩和
- **自動保存**: 3分間入力がない場合に自動下書き保存
- **復元機能**: ページ読み込み時に下書きが存在する場合は復元確認
- **保存期間**: 下書きは30日間保持

#### エラーハンドリング

- **API通信エラー**: 「ネットワークエラーが発生しました。接続を確認してもう一度お試しください。」
- **バリデーションエラー**: 「入力内容に不備があります。必須項目を確認してください。」
- **登録エラー**: 「個別ポイントの登録に失敗しました。もう一度お試しください。」
- **ファイルアップロードエラー**: 「ファイルのアップロードに失敗しました。ファイルサイズや形式を確認してください。」
- **下書き保存エラー**: 「下書き保存に失敗しました。もう一度お試しください。」

## UI/UX仕様

### レスポンシブデザイン

- **モバイル（〜768px）**:
  - フォーム項目を1列で縦並び表示
  - リッチテキストエディタをモバイル最適化
  - ボタンを全幅で縦積み配置
  - 利用者情報を簡潔に表示
- **タブレット（768px〜1024px）**:
  - 基本情報フォーム項目を2列グリッドで表示
  - リッチテキストエディタを全幅表示
  - ボタンを右寄せで横並び配置
  - 利用者情報を詳細表示
- **デスクトップ（1024px〜）**:
  - フォーム全体の最大幅を6xlに制限
  - 2列グリッドレイアウトを維持
  - リッチテキストエディタを広々と表示
  - 余白を十分に確保

### カラーテーマ

- **背景色**: `bg-carebase-bg` - アプリケーション標準背景色
- **登録ボタン**: `bg-carebase-blue hover:bg-carebase-blue-dark` - メインアクション
- **下書き保存ボタン**: `border-gray-400 text-gray-700 hover:bg-gray-50` - セカンダリアクション
- **戻る・キャンセルボタン**: `border-gray-300 text-gray-700` - セカンダリアクション
- **成功アラート**: `bg-green-50 border-green-200 text-green-700` - 成功状態
- **エラーアラート**: `bg-red-50 border-red-200 text-red-700` - エラー状態
- **警告アラート**: `bg-yellow-50 border-yellow-200 text-yellow-800` - 警告状態
- **利用者情報表示**: `bg-blue-50 border-blue-200 text-blue-800` - 情報表示

### フォームUI仕様

- **入力フィールド間隔**: `gap-6` - 項目間の適切な間隔
- **セクション分割**: 基本情報・内容・メディア・設定を明確に分離
- **ラベル配置**: 各入力フィールドの上部に配置
- **プレースホルダー**: 入力例を示すサンプルテキスト
- **フォーカス状態**: 青色のアウトライン表示
- **文字数カウンター**: タイトル・内容の下部に表示

### リッチテキストエディタ仕様

#### 機能要件

- **基本書式**: 太字、斜体、下線、取り消し線
- **リスト**: 番号付きリスト、箇条書きリスト
- **インデント**: インデント増加、インデント減少
- **配置**: 左寄せ、中央寄せ、右寄せ
- **リンク**: URLリンク挿入
- **画像・動画挿入**: メディアファイルの直接埋め込み
- **元に戻す・やり直し**: Ctrl+Z/Ctrl+Y対応
- **表挿入**: 簡単な表作成機能

#### エディタUI仕様

- **ツールバー**: 上部固定、スクロール時は画面上部に追従
- **最小高さ**: `min-h-80` - 十分な編集領域確保
- **最大高さ**: `max-h-96` - 適度な高さ制限
- **ボーダー**: `border-2 border-gray-200 focus:border-blue-500` - フォーカス表示
- **パディング**: `p-4` - 適切な内部余白
- **背景**: `bg-white` - 編集領域を明確に区別

#### メディア埋め込み機能

- **画像挿入**: ドラッグ&ドロップまたはツールバーから挿入
- **動画挿入**: 動画ファイルのサムネイル表示とプレイヤー埋め込み
- **サイズ調整**: 画像・動画のサイズ変更ハンドル表示
- **配置設定**: 左寄せ、中央寄せ、右寄せ、テキスト回り込み
- **キャプション**: 画像・動画にキャプション追加可能

### メディアファイル管理仕様

#### アップロード機能

- **ドラッグ&ドロップ**: エディタ内へのファイル直接ドロップ対応
- **ファイル選択**: ツールバーの添付ボタンからファイル選択
- **プログレスバー**: アップロード進捗の視覚的表示
- **プレビュー**: 画像の場合はサムネイル、動画の場合は再生ボタン付きサムネイル

#### ファイル管理UI

- **ファイル一覧**: カード形式でファイル情報表示
- **削除機能**: 各ファイルにXボタンで削除可能
- **編集機能**: 画像の場合は簡単な編集機能（回転、トリミング）
- **並び替え**: ドラッグ&ドロップでファイル順序変更

### タグ機能仕様

#### タグ入力

- **自動補完**: 既存タグからの候補表示
- **新規作成**: 存在しないタグは新規作成確認
- **色分け**: カテゴリ別にタグ色を自動設定
- **削除**: Xボタンまたはバックスペースで削除

#### タグ表示

- **バッジ形式**: 色付きバッジでタグ表示
- **文字数制限**: 長いタグは省略表示（...）
- **ホバー効果**: マウスオーバーで全文表示

### アニメーション

- **ボタンホバー**: スムーズなカラートランジション
- **フォーム送信**: ローディング状態の表示（「登録中...」「保存中...」）
- **アラート表示**: フェードイン効果でアラート表示
- **バリデーション**: リアルタイムでエラーメッセージ表示・非表示
- **ファイルアップロード**: ドラッグ&ドロップ時のハイライト効果
- **タグ追加**: 新しいタグ追加時のスライドイン効果

### アクセシビリティ

- **キーボードナビゲーション**: Tabキーでの順次フォーカス移動
- **スクリーンリーダー**:
  - 適切なlabel要素の関連付け
  - 必須項目のaria-required属性
  - エラーメッセージのaria-describedby属性
  - ランドマークrole属性の適切な配置
- **コントラスト比**: WCAG 2.1 AA レベル準拠
- **フォーカス表示**: 明確なフォーカスリング表示
- **リッチテキストエディタ**: キーボード操作完全対応
- **メディアファイル**: 代替テキスト設定可能

### ローディング・無効化状態

#### 登録中状態（isSubmitting: true）

- **フォーム全体**: `disabled={isSubmitting}` で全入力フィールドを無効化
- **戻るボタン**: クリック無効化で誤操作防止
- **キャンセルボタン**: クリック無効化で誤操作防止
- **登録ボタン**:
  - テキスト変更: 「ポイントを登録」→「登録中...」
  - クリック無効化: `disabled={isSubmitting}`
  - ローディング表示: スピナーアイコン表示
- **下書き保存ボタン**: クリック無効化で重複保存防止

#### 下書き保存中状態（isSavingDraft: true）

- **下書き保存ボタン**:
  - テキスト変更: 「下書き保存」→「保存中...」
  - クリック無効化: `disabled={isSavingDraft}`
  - ローディング表示: スピナーアイコン表示

#### ファイルアップロード中状態

- **アップロード対象ファイル**: プログレスバー表示
- **その他のファイル操作**: 一時的に無効化
- **フォーム送信**: アップロード完了まで無効化

## 技術仕様

### 使用コンポーネント

#### 3_organisms層

- **IndividualPointForm**: 個別ポイント作成・編集フォーム
- **ResidentInfoHeader**: 利用者情報ヘッダー表示

#### 2_molecules層

- **RichTextEditor**: リッチテキストエディタ
- **MediaUploader**: メディアファイルアップロード
- **TagInput**: タグ入力・管理
- **CategorySelector**: カテゴリ選択

#### 1_atoms層

- **CategoryBadge**: カテゴリバッジ表示
- **PriorityBadge**: 重要度バッジ表示
- **MediaPreview**: メディアファイルプレビュー
- **TagBadge**: タグバッジ表示

#### カスタムフック

- **useIndividualPointForm**: フォーム状態管理とバリデーション
- **useMediaUpload**: メディアファイルアップロード管理
- **useTagManagement**: タグ管理機能
- **useAutoSave**: 自動下書き保存機能

### データ型定義

```typescript
interface IndividualPointFormData {
  residentId: string; // 利用者ID（URLパラメータから自動設定）
  categoryId: string; // カテゴリID（必須）
  title: string; // タイトル（必須、100文字以内）
  content: string; // 内容（必須、HTML形式、5000文字以内）
  recordedAt: string; // 記録日時（必須、ISO 8601形式）
  priority: IndividualPointPriority; // 重要度（必須）
  tags: string[]; // タグ（任意、最大10個）
  visibility: IndividualPointVisibility; // 公開範囲（必須）
  mediaFiles: MediaFile[]; // 添付メディアファイル（任意）
}

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  size: number;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  order: number;
}

type IndividualPointCategory = 
  | 'physical_function' // 身体機能
  | 'cognitive_function' // 認知機能
  | 'social_interaction' // 社会性
  | 'lifestyle' // 生活習慣
  | 'hobbies_preferences' // 趣味嗜好
  | 'other'; // その他

type IndividualPointPriority = 'high' | 'medium' | 'low';

type IndividualPointVisibility = 
  | 'team_only' // チーム内のみ
  | 'facility_wide' // 施設内全体
  | 'admin_only'; // 管理者のみ

interface IndividualPointDraft {
  id: string;
  residentId: string;
  formData: Partial<IndividualPointFormData>;
  createdAt: string;
  updatedAt: string;
}
```

### API仕様

```typescript
// 個別ポイント作成
POST /api/v1/individual-points
Request: IndividualPointFormData
Response: ApiResponse<IndividualPoint>

// 下書き保存
POST /api/v1/individual-points/draft
Request: Partial<IndividualPointFormData>
Response: ApiResponse<IndividualPointDraft>

// 下書き取得
GET /api/v1/individual-points/drafts?residentId={residentId}
Response: ApiResponse<IndividualPointDraft[]>

// 下書き削除
DELETE /api/v1/individual-points/drafts/{id}
Response: ApiResponse<void>

// メディアファイルアップロード
POST /api/v1/media/upload
Request: FormData (multipart/form-data)
Response: ApiResponse<MediaFile>

// カテゴリ一覧取得
GET /api/v1/individual-points/categories
Response: ApiResponse<IndividualPointCategory[]>

// タグ一覧・検索
GET /api/v1/individual-points/tags?search={keyword}
Response: ApiResponse<Tag[]>

// タグ作成
POST /api/v1/individual-points/tags
Request: { name: string; categoryId?: string }
Response: ApiResponse<Tag>
```

### セキュリティ仕様

#### 認証・認可

- **利用者アクセス制限**: URLの`residentId`に対するアクセス権限確認
- **公開範囲制御**: 作成者の権限レベルに応じた公開範囲選択肢制限
- **メディアファイル**: アップロード時のウイルススキャン実行

#### データ保護

- **入力値サニタイズ**: XSS攻撃防止のためHTML内容をサニタイズ
- **ファイル検証**: アップロードファイルの形式・サイズ厳密チェック
- **CSRF対策**: フォーム送信時のCSRFトークン検証

## 参考資料

### FlutterFlow参考資料

- [個別ポイント登録画面](https://carebase.flutterflow.app/customerPointsShow?selectedCustomerPoints=L5WGq4OsqRkHBDN3o9Zn&selectedCustomer=sample21)
- ![個別ポイント登録画面参考](https://github.com/user-attachments/assets/311a83ef-40f6-4160-ac04-9fd8500ac220)

### 関連ドキュメント

- [Issue #129: [設計] #007 利用者｜個別ポイント登録](https://github.com/ambi-tious/CareBase-staff/issues/129)
- [利用者詳細画面設計書](../../README.md)
- [標準設計書](../../../../../docs/standard-design-document.md)
- [画面一覧](../../../../../docs/screen-list.md#利用者管理)

### 実装予定ファイル

- [個別ポイント登録画面実装](./page.tsx)
- [IndividualPointForm コンポーネント](../../../../../components/3_organisms/individual-point/individual-point-form.tsx)
- [RichTextEditor コンポーネント](../../../../../components/2_molecules/forms/rich-text-editor.tsx)
- [MediaUploader コンポーネント](../../../../../components/2_molecules/media/media-uploader.tsx)
- [useIndividualPointForm フック](../../../../../hooks/useIndividualPointForm.ts)
- [individualPointService](../../../../../services/individualPointService.ts)
- [個別ポイント登録画面テスト](../../../../../__tests__/app/(main)/residents/[residentId]/individual-points/new/new-individual-point-page.test.tsx)