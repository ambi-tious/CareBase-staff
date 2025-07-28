# 個別ポイントタブ設計書

- 画面名: `個別ポイントタブ`
- パス: `/residents/[residentId]` (詳細情報タブ内)
- URL: https://carebase-staff.vercel.app/residents/1

## 概要

利用者詳細画面内の個別ポイントタブ設計書です。
選択された利用者とカテゴリに紐づく個別ポイントの表示、優先度編集、個別ポイント項目のCRUD操作（モーダル操作）機能を提供します。
利用者の個人的な配慮事項や特別な注意点を効率的に管理し、ケア提供時の参考情報として活用できます。

Issue: [#131 [設計] #006 利用者｜利用者詳細（個別ポイント）](https://github.com/ambi-tious/CareBase-staff/issues/131)

## 全体レイアウト

### 画面構成

![個別ポイント画面](https://github.com/user-attachments/assets/803a1524-6de5-45e3-a610-147af282b8a3)

タブ内で完結する個別ポイント管理インターフェース：

- タブヘッダー（個別ポイントタブ選択状態）
- サマリ表示エリア（カテゴリ別統計、追加ボタン）
- フィルタ機能エリア（検索、カテゴリ、優先度、ステータス、タグ）
- 個別ポイント一覧表示エリア（コンパクトリスト形式）
- 空状態メッセージ（データなし時）

### 画面項目

| 項目名                 | コンポーネント                   | 必須 | 表示条件     | 初期値                       | 備考                               |
| ---------------------- | -------------------------------- | ---- | ------------ | ---------------------------- | ---------------------------------- |
| タブヘッダー           | TabsTrigger                      | -    | 常時         | 個別ポイント                 | アクティブ状態で青色表示           |
| カテゴリ統計サマリ     | IndividualPointsSummary          | -    | 常時         | -                            | カテゴリ別件数表示、横スクロール対応 |
| 追加ボタン（サマリ内） | Button                           | -    | 常時         | 追加                         | プラスアイコン付き、青色           |
| カテゴリ管理ボタン     | Button                           | -    | 常時         | カテゴリ管理                 | 設定アイコン付き、アウトライン     |
| 検索入力               | Input                            | -    | 常時         | -                            | プレースホルダー: 検索...          |
| カテゴリフィルタ       | Select                           | -    | 常時         | すべてのカテゴリ             | ドロップダウン選択                 |
| 優先度フィルタ         | Select                           | -    | 常時         | すべての優先度               | ドロップダウン選択                 |
| ステータスフィルタ     | Select                           | -    | 常時         | すべてのステータス           | ドロップダウン選択                 |
| タグフィルタ           | MultiSelect                      | -    | 常時         | -                            | 複数選択可能                       |
| フィルタリセットボタン | Button                           | -    | 常時         | リセット                     | 小さいボタン、グレー色             |
| 追加ボタン（フィルタ） | Button                           | -    | 常時         | 追加                         | プラスアイコン付き、青色           |
| 個別ポイントカード     | IndividualPointCard              | -    | データ存在時 | -                            | 優先度バッジ、カテゴリタグ付き     |
| 空状態メッセージ       | テキスト                         | -    | データなし時 | 個別ポイントはありません。   | 中央配置、グレー文字               |
| 優先度バッジ           | Badge                            | ◯    | カード内     | 高/中/低                     | 赤/黄/青色で区別表示               |
| カテゴリタグ           | Badge                            | ◯    | カード内     | 食事/入浴/服薬等             | カテゴリ別色分け表示               |
| タイトル表示           | CardTitle                        | ◯    | カード内     | -                            | 大きく太字で表示                   |
| 内容表示               | テキスト                         | ◯    | カード内     | -                            | 改行対応、長文時は省略表示         |
| タグ表示               | BadgeList                        | -    | カード内     | -                            | 小さいタグで複数表示               |
| 詳細ボタン             | Button                           | -    | カード内     | 詳細                         | 目アイコン付き                     |
| 編集ボタン             | Button                           | -    | カード内     | 編集                         | 鉛筆アイコン付き                   |
| 削除ボタン             | Button                           | -    | カード内     | 削除                         | ゴミ箱アイコン付き、赤色           |
| 作成者・日時表示       | テキスト                         | ◯    | カード内     | -                            | 小さい文字、グレー色               |
| メディア添付表示       | MediaThumbnail                   | -    | カード内     | -                            | 画像/動画のサムネイル表示          |

## 機能仕様

### アクション

| 項目名                 | 処理内容                             | 対象API                                                                  | 遷移先画面                   |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------------ | ---------------------------- |
| 追加ボタン             | 個別ポイント登録モーダルを表示       | -                                                                        | 同一画面（モーダル表示）     |
| カテゴリ管理ボタン     | カテゴリ管理モーダルを表示           | -                                                                        | 同一画面（モーダル表示）     |
| 詳細ボタン             | 個別ポイント詳細モーダルを表示       | -                                                                        | 同一画面（モーダル表示）     |
| 編集ボタン             | 個別ポイント編集モーダルを表示       | -                                                                        | 同一画面（モーダル表示）     |
| 削除ボタン             | 削除確認モーダルを表示               | -                                                                        | 同一画面（モーダル表示）     |
| カテゴリクリック       | 該当カテゴリでフィルタリング         | -                                                                        | 同一画面（フィルタ適用）     |
| 検索入力               | リアルタイム検索フィルタリング       | -                                                                        | 同一画面（フィルタ適用）     |
| フィルタリセット       | 全フィルタ条件をリセット             | -                                                                        | 同一画面（フィルタリセット） |
| 登録処理               | 新しい個別ポイントを登録             | `/api/v1/residents/{residentId}/individual-points`                       | 同一画面（モーダル閉じる）   |
| 更新処理               | 既存の個別ポイントを更新             | `/api/v1/residents/{residentId}/individual-points/{pointId}`              | 同一画面（モーダル閉じる）   |
| 削除処理               | 既存の個別ポイントを削除             | `/api/v1/residents/{residentId}/individual-points/{pointId}`              | 同一画面（モーダル閉じる）   |
| 優先度変更             | 個別ポイントの優先度を変更           | `/api/v1/residents/{residentId}/individual-points/{pointId}/priority`     | 同一画面（インライン更新）   |
| メディアファイル表示   | メディアビューアーモーダルを表示     | -                                                                        | 同一画面（モーダル表示）     |
| カテゴリ作成           | 新しいカテゴリを作成                 | `/api/v1/point-categories`                                               | 同一画面（モーダル閉じる）   |
| カテゴリ更新           | 既存のカテゴリを更新                 | `/api/v1/point-categories/{categoryId}`                                  | 同一画面（モーダル閉じる）   |
| カテゴリ削除           | 既存のカテゴリを削除                 | `/api/v1/point-categories/{categoryId}`                                  | 同一画面（モーダル閉じる）   |

### モーダル仕様

#### 個別ポイント登録モーダル

| 項目名             | コンポーネント    | 必須 | 初期値                                             | 備考                                                         |
| ------------------ | ----------------- | ---- | -------------------------------------------------- | ------------------------------------------------------------ |
| モーダルタイトル   | DialogTitle       | -    | 個別ポイントの登録                                 | 太字、青色                                                   |
| 説明文             | DialogDescription | -    | {利用者名}様の個別ポイントを登録してください       | 必須項目説明付き                                             |
| タイトル入力       | Input             | ◯    | -                                                  | プレースホルダー: とろみスプーン大を使用                     |
| 内容入力           | Textarea          | ◯    | -                                                  | プレースホルダー: 詳細な内容を入力してください               |
| カテゴリ選択       | Select            | ◯    | -                                                  | ドロップダウン選択、アイコン・色付き                         |
| 優先度選択         | RadioGroup        | ◯    | 中                                                 | 高・中・低から選択、色付きバッジ表示                         |
| ステータス選択     | Select            | -    | 有効                                               | 有効・無効・アーカイブから選択                               |
| タグ入力           | TagInput          | -    | -                                                  | カンマ区切り入力、Enter/Tabで追加                            |
| 備考入力           | Textarea          | -    | -                                                  | プレースホルダー: 補足情報があれば記入してください           |
| メディア添付       | FileUpload        | -    | -                                                  | 画像・動画・文書ファイル対応、ドラッグ&ドロップ対応         |
| キャンセルボタン   | Button            | -    | キャンセル                                         | アウトライン、グレー                                         |
| 登録ボタン         | Button            | -    | 登録                                               | 青色、送信時は「登録中...」                                  |

#### 個別ポイント編集モーダル

登録モーダルと同様の構成で、以下の違いがあります：

| 項目名           | 相違点                           |
| ---------------- | -------------------------------- |
| モーダルタイトル | 個別ポイントの編集               |
| フォーム初期値   | 既存データで各フィールドを初期化 |
| 登録ボタンラベル | 更新                             |

#### 個別ポイント詳細モーダル

| 項目名             | コンポーネント | 必須 | 初期値                                      | 備考                                 |
| ------------------ | -------------- | ---- | ------------------------------------------- | ------------------------------------ |
| モーダルタイトル   | DialogTitle    | -    | 個別ポイント詳細                            | 太字、青色                           |
| タイトル表示       | Heading        | ◯    | -                                           | 大きく太字で表示                     |
| 優先度バッジ       | Badge          | ◯    | -                                           | 高/中/低、色付きバッジ               |
| カテゴリバッジ     | Badge          | ◯    | -                                           | カテゴリ別色分け                     |
| ステータスバッジ   | Badge          | ◯    | -                                           | 有効/無効/アーカイブ                 |
| 内容表示           | テキスト       | ◯    | -                                           | 改行対応、全文表示                   |
| タグ表示           | BadgeList      | -    | -                                           | 小さいタグで複数表示                 |
| 備考表示           | テキスト       | -    | -                                           | 境界線付きで下部表示                 |
| メディア表示       | MediaGallery   | -    | -                                           | サムネイル形式、クリックで拡大表示   |
| 作成情報表示       | InfoSection    | ◯    | -                                           | 作成者・作成日時                     |
| 更新情報表示       | InfoSection    | ◯    | -                                           | 更新者・更新日時                     |
| 編集ボタン         | Button         | -    | 編集                                        | 鉛筆アイコン付き、青色               |
| 削除ボタン         | Button         | -    | 削除                                        | ゴミ箱アイコン付き、赤色             |
| 閉じるボタン       | Button         | -    | 閉じる                                      | アウトライン                         |

#### 削除確認モーダル

| 項目名           | コンポーネント | 必須 | 初期値                                                | 備考                       |
| ---------------- | -------------- | ---- | ----------------------------------------------------- | -------------------------- |
| モーダルタイトル | DialogTitle    | -    | 削除の確認                                            | 警告アイコン付き、赤色     |
| 警告メッセージ   | Alert          | -    | この操作は取り消すことができません。                  | 上部警告                   |
| 確認メッセージ   | Alert          | -    | {タイトル} の個別ポイントを削除してもよろしいですか？ | 削除対象明示               |
| 注意事項         | テキスト       | -    | 削除されたデータは復元できません。                    | 赤色背景                   |
| キャンセルボタン | Button         | -    | キャンセル                                            | アウトライン、グレー       |
| 削除ボタン       | Button         | -    | 削除する                                              | 赤色、ゴミ箱アイコン付き   |

#### カテゴリ管理モーダル

| 項目名             | コンポーネント | 必須 | 初期値                                     | 備考                                   |
| ------------------ | -------------- | ---- | ------------------------------------------ | -------------------------------------- |
| モーダルタイトル   | DialogTitle    | -    | カテゴリ管理                               | 太字、青色                             |
| 新規作成ボタン     | Button         | -    | 新しいカテゴリを作成                       | プラスアイコン付き、青色               |
| カテゴリ一覧       | CategoryList   | -    | -                                          | 編集・削除ボタン付きリスト表示         |
| カテゴリ名入力     | Input          | ◯    | -                                          | プレースホルダー: カテゴリ名           |
| 説明入力           | Textarea       | -    | -                                          | プレースホルダー: カテゴリの説明       |
| アイコン選択       | IconPicker     | ◯    | -                                          | アイコン一覧から選択                   |
| 色選択             | ColorPicker    | ◯    | -                                          | カラーパレットから選択                 |
| システム標準表示   | Badge          | -    | システム標準                               | システム標準カテゴリに表示             |
| 保存ボタン         | Button         | -    | 保存                                       | 青色                                   |
| キャンセルボタン   | Button         | -    | キャンセル                                 | アウトライン                           |

#### メディアビューアーモーダル

| 項目名           | コンポーネント | 必須 | 初期値 | 備考                             |
| ---------------- | -------------- | ---- | ------ | -------------------------------- |
| メディア表示     | MediaViewer    | ◯    | -      | 画像・動画・文書の表示           |
| ファイル名表示   | テキスト       | ◯    | -      | 上部に表示                       |
| ファイルサイズ   | テキスト       | ◯    | -      | 下部に表示                       |
| アップロード情報 | テキスト       | ◯    | -      | アップロード者・日時             |
| ダウンロードボタン| Button        | -    | ダウンロード | ダウンロードアイコン付き         |
| 閉じるボタン     | Button         | -    | 閉じる | 右上のXボタン                    |

### 入力チェック

| 項目名         | イベント | チェック内容                  | エラーメッセージ                                 |
| -------------- | -------- | ----------------------------- | ------------------------------------------------ |
| タイトル入力   | blur     | 必須入力チェック              | タイトルは必須です                               |
| タイトル入力   | blur     | 文字数チェック（100文字以内） | タイトルは100文字以内で入力してください          |
| 内容入力       | blur     | 必須入力チェック              | 内容は必須です                                   |
| 内容入力       | blur     | 文字数チェック（1000文字以内）| 内容は1000文字以内で入力してください            |
| カテゴリ選択   | change   | 必須選択チェック              | カテゴリは必須です                               |
| 優先度選択     | change   | 必須選択チェック              | 優先度は必須です                                 |
| タグ入力       | blur     | 個別タグ文字数チェック        | 各タグは20文字以内で入力してください             |
| タグ入力       | blur     | タグ数チェック（10個以内）    | タグは10個以内で入力してください                 |
| 備考入力       | blur     | 文字数チェック（500文字以内） | 備考は500文字以内で入力してください              |
| メディア添付   | change   | ファイルサイズチェック        | ファイルサイズは10MB以下にしてください           |
| メディア添付   | change   | ファイル形式チェック          | 対応していないファイル形式です                   |
| メディア添付   | change   | ファイル数チェック（5個以内） | メディアファイルは5個以内で添付してください     |
| フォーム送信   | submit   | 全必須項目チェック            | 必須項目をすべて入力してください                 |

### バリデーション仕様

#### 入力形式

- **タイトル**: 1文字以上100文字以内
- **内容**: 1文字以上1000文字以内、改行可
- **カテゴリ**: 定義済みカテゴリから選択必須
- **優先度**: 高・中・低から選択必須、デフォルト「中」
- **ステータス**: 有効・無効・アーカイブから選択、デフォルト「有効」
- **タグ**: カンマ区切り、各タグ20文字以内、全体10個以内
- **備考**: 500文字以内、改行可
- **メディア**: 画像・動画・文書対応、5個以内、各10MB以下

#### 表示制御

- 必須項目には赤いアスタリスク（*）を表示
- エラー時は該当フィールドを赤枠で強調
- 送信中はフォーム全体を無効化
- ネットワークエラー時はリトライボタンを表示
- 優先度は色付きバッジで視覚的に区別表示
- カテゴリは専用アイコンと色で視覚的に区別表示
- 長い内容は省略表示し、詳細モーダルで全文表示

#### エラーハンドリング

- バリデーションエラーの個別表示
- ネットワークエラーの統一表示
- 削除処理エラーの表示
- ファイルアップロードエラーの表示
- 楽観的更新とエラー時のロールバック

## UI/UX仕様

### レスポンシブデザイン

- **モバイル（〜768px）**:
  - サマリカードを横スクロール表示
  - フィルタを折り畳み式で表示
  - 個別ポイントカードを1列で表示
  - モーダルフォームを1列レイアウト
- **タブレット（768px〜1024px）**:
  - サマリカードを2-3列グリッド表示
  - フィルタを横並びで表示
  - 個別ポイントカードを2列で表示
  - モーダルフォームを2列レイアウト
- **デスクトップ（1024px〜）**:
  - サマリカードを4-5列グリッド表示
  - フィルタを横並びで表示
  - 個別ポイントカードを3列で表示
  - モーダルフォームを2列レイアウト

### カラーテーマ

#### 優先度バッジ
- **高**: `bg-red-100 text-red-700 border-red-200`
- **中**: `bg-yellow-100 text-yellow-700 border-yellow-200`
- **低**: `bg-blue-100 text-blue-700 border-blue-200`

#### カテゴリタグ
- **食事**: `bg-orange-100 text-orange-700 border-orange-200`
- **入浴**: `bg-blue-100 text-blue-700 border-blue-200`
- **服薬**: `bg-purple-100 text-purple-700 border-purple-200`
- **排泄**: `bg-brown-100 text-brown-700 border-brown-200`
- **バイタル**: `bg-red-100 text-red-700 border-red-200`
- **運動**: `bg-green-100 text-green-700 border-green-200`
- **コミュニケーション**: `bg-indigo-100 text-indigo-700 border-indigo-200`
- **その他**: `bg-gray-100 text-gray-700 border-gray-200`

#### ボタン・操作要素
- **追加ボタン**: `bg-carebase-blue hover:bg-carebase-blue-dark text-white`
- **編集ボタン**: `border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light`
- **削除ボタン**: `border-red-300 text-red-600 hover:bg-red-50`
- **詳細ボタン**: `border-gray-300 text-gray-600 hover:bg-gray-50`
- **カテゴリ管理ボタン**: `border-gray-300 text-gray-600 hover:bg-gray-50`

### アイコン使用

- **個別ポイント**: `FileText` アイコン（青色背景のサークル内）
- **追加ボタン**: `PlusCircle` アイコン
- **編集ボタン**: `Edit3` アイコン
- **削除ボタン**: `Trash2` アイコン
- **詳細ボタン**: `Eye` アイコン
- **検索入力**: `Search` アイコン
- **フィルタリセット**: `X` アイコン
- **カテゴリ管理**: `Settings` アイコン
- **優先度高**: `AlertCircle` アイコン
- **優先度中**: `Minus` アイコン
- **優先度低**: `Circle` アイコン
- **メディア添付**: `Paperclip` アイコン
- **カレンダー**: `Calendar` アイコン
- **タグ**: `Tag` アイコン

### アニメーション

- **モーダル表示**: フェードイン・スケールアニメーション
- **カード追加**: スムーズな挿入アニメーション
- **フィルタ適用**: リスト更新時のトランジション
- **削除処理**: ローディングスピナー表示
- **ホバー効果**: ボタンの背景色変更トランジション
- **タブ切り替え**: スムーズなトランジション効果

### アクセシビリティ

- **キーボードナビゲーション**: Tabキーでの要素移動対応
- **フォーカス管理**: モーダル内でのキーボードナビゲーション
- **スクリーンリーダー対応**: 適切なaria-label設定
- **エラー表示**: role="alert"でエラーメッセージを通知
- **必須項目表示**: 視覚的・音声的な必須項目の明示
- **コントラスト**: WCAG AA準拠の色彩設計
- **メディアファイル**: alt属性・キャプション対応

## 技術仕様

### 使用コンポーネント

#### 既存実装済みコンポーネント

- **IndividualPointsTabContent**: メインタブコンテンツ
  - パス: `components/3_organisms/individual-points/individual-points-tab-content.tsx`
  - 機能: 個別ポイント一覧表示、CRUD操作、フィルタリング
  - プロパティ: residentId, residentName, className
  - 公開メソッド: openCreateModal, openCategoryModal

- **IndividualPointsSummary**: サマリ表示コンポーネント
  - パス: `components/2_molecules/individual-points/individual-points-summary.tsx`
  - 機能: カテゴリ別統計表示、追加ボタン、カテゴリ選択
  - プロパティ: points, onCreatePoint, onCategoryClick, selectedCategory, onCategoryManagement

- **IndividualPointsFilters**: フィルタ機能コンポーネント
  - パス: `components/2_molecules/individual-points/individual-points-filters.tsx`
  - 機能: 検索、カテゴリ、優先度、ステータス、タグフィルタ
  - プロパティ: searchQuery, selectedCategory, selectedPriority, selectedStatus, selectedTags, availableTags, onCreatePoint, onSearchChange, onCategoryChange, onPriorityChange, onStatusChange, onTagsChange, onReset

- **IndividualPointsCompactList**: コンパクトリスト表示
  - パス: `components/2_molecules/individual-points/individual-points-compact-list.tsx`
  - 機能: 個別ポイント一覧のコンパクト表示
  - プロパティ: points, selectedCategory, onEdit, onDelete, onViewDetails

- **IndividualPointCard**: 個別ポイントカード
  - パス: `components/2_molecules/individual-points/individual-point-card.tsx`
  - 機能: 個別ポイント情報の表示、編集・削除ボタン
  - プロパティ: point, onEdit, onDelete, onViewDetails

- **IndividualPointForm**: 個別ポイントフォーム
  - パス: `components/2_molecules/individual-points/individual-point-form.tsx`
  - 機能: 個別ポイントの登録・編集フォーム
  - プロパティ: initialData, onSubmit, isSubmitting

- **IndividualPointModal**: 個別ポイント登録・編集モーダル
  - パス: `components/3_organisms/modals/individual-point-modal.tsx`
  - 機能: 個別ポイントの登録・編集フォームモーダル
  - プロパティ: isOpen, onClose, onSubmit, point, residentName, mode

- **IndividualPointDetailModal**: 個別ポイント詳細モーダル
  - パス: `components/3_organisms/modals/individual-point-detail-modal.tsx`
  - 機能: 個別ポイントの詳細表示、編集・削除操作
  - プロパティ: isOpen, onClose, point, onEdit, onDelete, onMediaView, residentName

- **CategoryManagementModal**: カテゴリ管理モーダル
  - パス: `components/3_organisms/modals/category-management-modal.tsx`
  - 機能: カテゴリの作成・編集・削除管理
  - プロパティ: isOpen, onClose, categories, onCreateCategory, onUpdateCategory, onDeleteCategory

- **MediaViewerModal**: メディアビューアーモーダル
  - パス: `components/3_organisms/modals/media-viewer-modal.tsx`
  - 機能: 画像・動画・文書ファイルの表示
  - プロパティ: isOpen, onClose, media

- **GenericDeleteModal**: 汎用削除確認モーダル
  - パス: `components/3_organisms/modals/generic-delete-modal.tsx`
  - 機能: 削除確認ダイアログ
  - プロパティ: isOpen, onClose, onConfirm, itemName, itemType, isDeleting, error

#### サービスクラス

- **individualPointService**: 個別ポイントのCRUD操作
  - パス: `services/individualPointService.ts`
  - メソッド: getIndividualPoints, createIndividualPoint, updateIndividualPoint, deleteIndividualPoint, getPointCategories, createPointCategory
  - モック機能: 開発時のデータ操作シミュレーション

#### 型定義

- **IndividualPoint**: 個別ポイントエンティティ型
  - パス: `types/individual-point.ts`
  - プロパティ: id, residentId, title, content, category, priority, status, tags, notes, mediaAttachments, createdAt, updatedAt, createdBy, createdByName, isSystemDefault

- **IndividualPointFormData**: フォームデータ型
  - パス: `types/individual-point.ts`
  - バリデーション: Zodスキーマによる入力検証

- **PointCategory**: カテゴリエンティティ型
  - パス: `types/individual-point.ts`
  - プロパティ: id, name, description, icon, color, isSystemDefault, isActive, createdAt, updatedAt

- **MediaAttachment**: メディア添付ファイル型
  - パス: `types/individual-point.ts`
  - プロパティ: id, fileName, fileType, fileSize, url, thumbnailUrl, uploadedAt, uploadedBy

### API エンドポイント

| メソッド | エンドポイント                                                            | 説明                             |
| -------- | ------------------------------------------------------------------------- | -------------------------------- |
| GET      | `/api/v1/residents/{residentId}/individual-points`                        | 利用者の個別ポイント一覧取得     |
| POST     | `/api/v1/residents/{residentId}/individual-points`                        | 個別ポイントの新規登録           |
| GET      | `/api/v1/residents/{residentId}/individual-points/{pointId}`              | 個別ポイントの詳細取得           |
| PUT      | `/api/v1/residents/{residentId}/individual-points/{pointId}`              | 個別ポイントの更新               |
| DELETE   | `/api/v1/residents/{residentId}/individual-points/{pointId}`              | 個別ポイントの削除               |
| PUT      | `/api/v1/residents/{residentId}/individual-points/{pointId}/priority`     | 個別ポイントの優先度変更         |
| GET      | `/api/v1/point-categories`                                                | ポイントカテゴリ一覧取得         |
| POST     | `/api/v1/point-categories`                                                | ポイントカテゴリの新規作成       |
| PUT      | `/api/v1/point-categories/{categoryId}`                                   | ポイントカテゴリの更新           |
| DELETE   | `/api/v1/point-categories/{categoryId}`                                   | ポイントカテゴリの削除           |

### 状態管理

#### ローカル状態

- 個別ポイント一覧の表示状態
- フィルタ条件の状態（検索、カテゴリ、優先度、ステータス、タグ）
- モーダルの開閉状態（作成、編集、削除、詳細、カテゴリ管理、メディアビューアー）
- フォームの送信状態
- エラー状態
- ローディング状態

#### 楽観的更新

- 登録時: 即座にUIに反映、エラー時はロールバック
- 更新時: 即座にUIに反映、エラー時はロールバック
- 削除時: 即座にUIから削除、エラー時は復元
- 優先度変更時: インライン更新、エラー時は元の値に戻す

#### データフェッチング

- 初回ロード時の個別ポイント一覧取得
- カテゴリ情報の取得
- 楽観的更新失敗時のリフェッチ
- 定期的なデータ同期（オプション）

## 参考資料

- [利用者詳細画面実装](../page.tsx)
- [ResidentDetailTabs コンポーネント](../../../../components/3_organisms/resident/resident-detail-tabs.tsx)
- [IndividualPointsTabContent コンポーネント](../../../../components/3_organisms/individual-points/individual-points-tab-content.tsx)
- [IndividualPointsSummary コンポーネント](../../../../components/2_molecules/individual-points/individual-points-summary.tsx)
- [IndividualPointsFilters コンポーネント](../../../../components/2_molecules/individual-points/individual-points-filters.tsx)
- [IndividualPointsCompactList コンポーネント](../../../../components/2_molecules/individual-points/individual-points-compact-list.tsx)
- [IndividualPointCard コンポーネント](../../../../components/2_molecules/individual-points/individual-point-card.tsx)
- [IndividualPointForm コンポーネント](../../../../components/2_molecules/individual-points/individual-point-form.tsx)
- [IndividualPointModal コンポーネント](../../../../components/3_organisms/modals/individual-point-modal.tsx)
- [IndividualPointDetailModal コンポーネント](../../../../components/3_organisms/modals/individual-point-detail-modal.tsx)
- [CategoryManagementModal コンポーネント](../../../../components/3_organisms/modals/category-management-modal.tsx)
- [MediaViewerModal コンポーネント](../../../../components/3_organisms/modals/media-viewer-modal.tsx)
- [GenericDeleteModal コンポーネント](../../../../components/3_organisms/modals/generic-delete-modal.tsx)
- [IndividualPoint Types](../../../../types/individual-point.ts)
- [IndividualPoint Service](../../../../services/individualPointService.ts)
- [IndividualPoints Mock Data](../../../../mocks/individual-points-data.ts)
- [Issue #131: [設計] #006 利用者｜利用者詳細（個別ポイント）](https://github.com/ambi-tious/CareBase-staff/issues/131)
- [親Issue #133: 利用者詳細（基本情報）](https://github.com/ambi-tious/CareBase-staff/issues/133)
- [FlutterFlow参考画面](https://carebase.flutterflow.app/customerPointsShow?selectedCustomerPoints=L5WGq4OsqRkHBDN3o9Zn&selectedCustomer=sample21)
- [お薬情報タブ設計書](../medications/README.md)
- [ご家族情報タブ設計書](../family-info/README.md)