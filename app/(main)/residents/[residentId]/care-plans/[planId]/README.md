# ケアプラン詳細画面設計書

- 画面名: `ケアプラン詳細`
- パス: `/residents/[residentId]/care-plans/[planId]`
- URL: https://carebase-staff.vercel.app/residents/1/care-plans/cp001

## 概要

個別のケアプランの詳細情報を表示・管理する画面です。
ケアプランの基本情報、認定情報、目標、サービス内容を包括的に確認でき、編集画面への遷移も可能です。
利用者のケアプラン管理における中核的な詳細表示機能を提供します。

関連Issue: [#115 [設計] #014 利用者｜利用者詳細（ケアプラン）](https://github.com/ambi-tious/CareBase-staff/issues/115)

## 全体レイアウト

<img width="1037" height="1222" alt="image" src="https://github.com/user-attachments/assets/90d946c7-11d1-40f5-9650-05b654cd6c85" />

### 画面構成

1画面で完結するケアプラン詳細表示インターフェース：

- ページヘッダー（戻るボタン、タイトル、編集ボタン）
- 基本情報カード（ステータス、認定情報、ケアマネージャー、見直し予定、ケア目標）
- 利用者・家族意向カード（利用者の意向、家族の意向、審査会意見、総合的援助指針、備考）
- 利用サービス一覧カード（サービス詳細情報）

### 画面項目

| 項目名             | コンポーネント       | 必須 | 表示条件       | 初期値                  | 備考                               |
| ------------------ | -------------------- | ---- | -------------- | ----------------------- | ---------------------------------- |
| 戻るボタン         | Button + ArrowLeft   | ◯    | 常時           | -                       | アウトライン形式、一覧画面に戻る   |
| ページタイトル     | Heading              | ◯    | 常時           | ケアプラン詳細          | 大文字、太字、FileTextアイコン付き |
| 編集ボタン         | Button + Edit3       | ◯    | 常時           | 編集                    | アウトライン形式、青色テーマ       |
| ステータスバッジ   | StatusBadge          | ◯    | 常時           | -                       | 有効/下書き/アーカイブの状態表示   |
| 期限間近バッジ     | Badge                | -    | 期限30日以内   | 期限間近                | オレンジ色、丸角バッジ             |
| 期限切れバッジ     | Badge                | -    | 期限切れ時     | 期限切れ                | 赤色、丸角バッジ                   |
| 紹介バッジ         | Badge                | -    | 紹介プラン時   | 紹介                    | 青色、丸角バッジ                   |
| プランタイトル     | CardTitle            | ◯    | 常時           | -                       | 大文字、濃いグレー                 |
| プランID           | テキスト             | ◯    | 常時           | プランID: [ID]          | 小文字、グレー                     |
| 作成者情報         | テキスト + User      | ◯    | 常時           | 作成者: [名前]          | ユーザーアイコン付き               |
| 作成日時           | テキスト             | ◯    | 常時           | (作成日: [日時])        | グレー、小文字                     |
| 更新日時           | テキスト + Calendar  | ◯    | 常時           | 更新日: [日時]          | カレンダーアイコン付き             |
| 要介護度           | テキスト             | ◯    | 常時           | -                       | 青色、太字強調                     |
| 認定日             | テキスト             | ◯    | 常時           | -                       | 日本語日付形式                     |
| 有効期間           | テキスト             | ◯    | 常時           | [開始日]〜[終了日]      | 日本語日付形式、チルダ区切り       |
| ケアマネージャー名 | テキスト + User      | ◯    | 常時           | -                       | ユーザーアイコン付き               |
| 居宅介護支援事業所 | テキスト + Building2 | ◯    | 常時           | -                       | ビルディングアイコン付き           |
| 次回見直し日       | テキスト + Calendar  | ◯    | 常時           | -                       | カレンダーアイコン付き             |
| ケア目標           | 番号付きリスト       | ◯    | 常時           | -                       | 青背景、番号バッジ付き             |
| 利用者の意向       | テキストエリア       | ◯    | 常時           | -                       | グレー背景、複数行表示             |
| 家族の意向         | テキストエリア       | ◯    | 常時           | -                       | グレー背景、複数行表示             |
| 審査会意見         | テキストエリア       | ◯    | 常時           | -                       | グレー背景、複数行表示             |
| 総合的援助指針     | テキストエリア       | ◯    | 常時           | -                       | グレー背景、複数行表示             |
| 備考               | テキストエリア       | -    | 入力時         | -                       | グレー背景、複数行表示             |
| 利用サービス件数   | テキスト + Clock     | ◯    | 常時           | 利用サービス ([件数]件) | 時計アイコン付き                   |
| サービス名         | Heading              | ◯    | サービス存在時 | -                       | 中文字、太字                       |
| サービス種類バッジ | Badge                | ◯    | サービス存在時 | -                       | 青背景、サービス種別表示           |
| サービス頻度       | テキスト             | ◯    | サービス存在時 | 頻度: [頻度]            | ラベル付き                         |
| サービス時間       | テキスト             | ◯    | サービス存在時 | 時間: [時間]            | ラベル付き                         |
| 提供事業者         | テキスト             | ◯    | サービス存在時 | 提供事業者: [事業者名]  | ラベル付き                         |
| サービス開始日     | テキスト             | ◯    | サービス存在時 | 開始日: [日付]          | ラベル付き                         |
| サービス終了日     | テキスト             | -    | 設定時         | 終了日: [日付]          | ラベル付き                         |
| サービスメモ       | テキスト             | -    | 入力時         | メモ: [内容]            | グレー背景、ラベル付き             |

## 機能仕様

### アクション

| 項目名         | 処理内容                 | 対象API                          | 遷移先画面                  |
| -------------- | ------------------------ | -------------------------------- | --------------------------- |
| 戻るボタン     | ケアプラン一覧画面に戻る | -                                | ケアプラン一覧画面          |
| 編集ボタン     | ケアプラン編集画面に遷移 | -                                | ケアプラン編集画面（/edit） |
| 初期データ取得 | ケアプラン詳細情報取得   | `/api/v1/care-plans/[planId]`    | -                           |
| 利用者情報取得 | 利用者基本情報取得       | `/api/v1/residents/[residentId]` | -                           |

### 表示制御仕様

#### ステータス表示

| ステータス | 表示スタイル                                      | 条件                  |
| ---------- | ------------------------------------------------- | --------------------- |
| 有効       | `bg-green-100 text-green-700 border-green-200`    | status === 'active'   |
| 下書き     | `bg-gray-100 text-gray-700 border-gray-200`       | status === 'draft'    |
| アーカイブ | `bg-yellow-100 text-yellow-700 border-yellow-200` | status === 'archived' |

#### 期限表示

| 状態     | 表示バッジ                                        | 条件               |
| -------- | ------------------------------------------------- | ------------------ |
| 期限間近 | `bg-orange-100 text-orange-700 border-orange-200` | 終了日まで30日以内 |
| 期限切れ | `bg-red-100 text-red-700 border-red-200`          | 終了日を過ぎている |

#### 条件付き表示

- **紹介バッジ**: `isReferral === true` の場合のみ表示
- **期限間近バッジ**: 認定有効期間終了日まで30日以内かつ未来日の場合表示
- **期限切れバッジ**: 認定有効期間終了日が過去の場合表示
- **サービス終了日**: `endDate` が設定されている場合のみ表示
- **サービスメモ**: `notes` が入力されている場合のみ表示
- **備考**: 常に表示（値が空の場合も表示枠を表示）

### 入力チェック

| 項目名       | イベント     | チェック内容         | エラーメッセージ                             |
| ------------ | ------------ | -------------------- | -------------------------------------------- |
| 利用者ID     | ページロード | 存在チェック         | 指定された利用者が見つかりません             |
| ケアプランID | ページロード | 存在チェック         | 指定されたケアプランが見つかりません         |
| ケアプランID | ページロード | アクセス権限チェック | このケアプランにアクセスする権限がありません |
| データ取得   | ページロード | API接続チェック      | データの取得に失敗しました                   |

### バリデーション仕様

#### 日付表示フォーマット

- **日付形式**: `yyyy年MM月dd日` （例：2024年03月15日）
- **日時形式**: `yyyy年MM月dd日 HH:mm` （例：2024年03月15日 14:30）
- **有効期間**: `[開始日]〜[終了日]` 形式で表示

#### エラーハンドリング

- **ケアプラン不存在エラー**: 無効なプランID指定時の404エラー表示
- **利用者不存在エラー**: 無効な利用者ID指定時の404エラー表示
- **権限不足エラー**: アクセス権限不足時の403エラー表示
- **ネットワークエラー**: 通信失敗時のリトライ機能
- **データ取得エラー**: API接続失敗時の統一エラー表示

## UI/UX仕様

### レスポンシブデザイン

- **モバイル（〜768px）**:
  - ヘッダー要素を縦並び表示
  - 認定情報とケア目標を1列表示
  - 意向・指針情報を縦積み配置
  - サービス情報を1列表示
- **タブレット（768px〜1024px）**:
  - ヘッダー要素を2列表示
  - 認定情報とケア目標を2列表示
  - 意向・指針情報を2列グリッド表示
  - サービス情報を1列表示
- **デスクトップ（1024px〜）**:
  - ヘッダー要素を横並び表示
  - 認定情報とケア目標を2列表示
  - 意向・指針情報を2列グリッド表示
  - サービス情報を1列表示（大きなカード形式）

### カラーテーマ

- **戻るボタン**: `border-gray-300 text-gray-700 hover:bg-gray-50`
- **編集ボタン**: `border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light`
- **要介護度**: `text-carebase-blue font-semibold`
- **ケア目標番号バッジ**: `bg-carebase-blue text-white`
- **ケア目標背景**: `bg-blue-50`
- **情報表示背景**: `bg-gray-50 border-gray-200`
- **ラベル**: `text-gray-600 font-medium`
- **値**: `text-carebase-text-primary`
- **メタ情報**: `text-gray-600`

### アイコン使用

- **ページタイトル**: `FileText` アイコン（青色）
- **戻るボタン**: `ArrowLeft` アイコン
- **編集ボタン**: `Edit3` アイコン
- **作成者**: `User` アイコン
- **更新日**: `Calendar` アイコン
- **ケアマネージャー**: `User` アイコン
- **居宅介護支援事業所**: `Building2` アイコン
- **次回見直し日**: `Calendar` アイコン
- **利用サービス**: `Clock` アイコン

### アニメーション

- **カード表示**: フェードイン効果
- **ボタンホバー**: カラー変更トランジション
- **バッジ表示**: スムーズな色変更効果

### アクセシビリティ

- **キーボードナビゲーション**: Tab キーでの要素移動対応
- **スクリーンリーダー対応**: 適切なaria-label設定
  - 戻るボタン: `aria-label="ケアプラン一覧に戻る"`
  - 編集ボタン: `aria-label="ケアプランを編集"`
  - ステータスバッジ: `aria-label="ケアプランステータス: [ステータス]"`
  - 期限バッジ: `aria-label="認定期限の状態: [状態]"`
- **コントラスト**: WCAG 2.1 AA レベル準拠
- **フォーカス表示**: 明確なフォーカスインジケーター
- **エラー表示**: role="alert"でエラーメッセージを通知

## データ仕様

### ケアプラン詳細情報項目

| 項目名                     | データ型 | 必須 | 備考                    |
| -------------------------- | -------- | ---- | ----------------------- |
| id                         | string   | ◯    | ケアプランID            |
| residentId                 | string   | ◯    | 利用者ID                |
| residentName               | string   | ◯    | 利用者名                |
| planTitle                  | string   | ◯    | ケアプランタイトル      |
| planType                   | string   | ◯    | initial/continuation    |
| careLevel                  | string   | ◯    | 要介護1-5               |
| certificationDate          | string   | ◯    | YYYY-MM-DD形式          |
| certValidityStart          | string   | ◯    | YYYY-MM-DD形式          |
| certValidityEnd            | string   | ◯    | YYYY-MM-DD形式          |
| certificationStatus        | string   | ◯    | certified/pending       |
| careManager                | string   | ◯    | ケアマネージャー名      |
| careManagerOffice          | string   | ◯    | 居宅介護支援事業所名    |
| status                     | string   | ◯    | active/draft/archived   |
| isReferral                 | boolean  | ◯    | 紹介プランフラグ        |
| residentIntention          | string   | ◯    | 利用者の意向            |
| familyIntention            | string   | ◯    | 家族の意向              |
| assessmentCommitteeOpinion | string   | ◯    | 介護認定審査会の意見    |
| comprehensiveGuidance      | string   | ◯    | 総合的な援助の指針      |
| consentObtained            | boolean  | ◯    | 同意取得フラグ          |
| goals                      | string[] | ◯    | ケア目標配列            |
| services                   | array    | ◯    | 利用サービス配列        |
| notes                      | string   | -    | 備考                    |
| createdAt                  | string   | ◯    | YYYY-MM-DD HH:mm:ss形式 |
| updatedAt                  | string   | ◯    | YYYY-MM-DD HH:mm:ss形式 |
| createdBy                  | string   | ◯    | 作成者ID                |
| createdByName              | string   | ◯    | 作成者名                |
| nextReviewDate             | string   | ◯    | YYYY-MM-DD形式          |

### サービス情報項目

| 項目名      | データ型 | 必須 | 備考           |
| ----------- | -------- | ---- | -------------- |
| id          | string   | ◯    | サービスID     |
| serviceName | string   | ◯    | サービス名     |
| serviceType | string   | ◯    | サービス種別   |
| frequency   | string   | ◯    | 利用頻度       |
| duration    | string   | ◯    | 利用時間       |
| provider    | string   | ◯    | 提供事業者名   |
| startDate   | string   | ◯    | YYYY-MM-DD形式 |
| endDate     | string   | -    | YYYY-MM-DD形式 |
| notes       | string   | -    | サービスメモ   |

### API エンドポイント

| メソッド | エンドポイント                   | 説明                   |
| -------- | -------------------------------- | ---------------------- |
| GET      | `/api/v1/care-plans/[planId]`    | ケアプラン詳細情報取得 |
| GET      | `/api/v1/residents/[residentId]` | 利用者基本情報取得     |

## 技術仕様

### 使用コンポーネント

#### 既存実装済みコンポーネント

- **CarePlanDetail**: ケアプラン詳細表示コンポーネント
  - パス: `components/3_organisms/care-plan/care-plan-detail.tsx`
  - 機能: ケアプラン詳細情報の包括的表示
  - プロパティ: carePlan, residentId

- **StatusBadge**: ステータスバッジ表示
  - パス: `components/1_atoms/care-plan/status-badge.tsx`
  - 機能: ケアプランステータスの色分け表示
  - プロパティ: status

#### UIコンポーネント

- **Button**: ボタンコンポーネント（shadcn/ui）
- **Card, CardContent, CardHeader, CardTitle**: カードコンポーネント（shadcn/ui）
- **Badge**: バッジコンポーネント（shadcn/ui）

#### 型定義

- **CarePlan**: ケアプラン情報エンティティ型
  - パス: `types/care-plan.ts`
  - 全項目の型定義

- **CarePlanService**: サービス情報エンティティ型
  - パス: `types/care-plan.ts`
  - サービス詳細の型定義

- **CarePlanStatus**: ケアプランステータス型
  - 値: 'active' | 'draft' | 'archived'

### 状態管理

#### ローカル状態

- ケアプラン詳細情報の表示状態
- ローディング状態
- エラー状態
- 利用者情報の状態

#### データフェッチング

- 初期ローディング時のケアプラン詳細取得
- 利用者情報の取得
- エラー時のリトライ機能

### ページ実装

- **ページコンポーネント**: `app/(main)/residents/[residentId]/care-plans/[planId]/page.tsx`
- **動的ルーティング**: [residentId], [planId] パラメータ対応
- **エラーハンドリング**: ケアプラン不存在時の適切なエラー表示

## 参考資料

- [ケアプラン一覧画面設計書](../README.md)
- [ケアプラン編集画面設計書](https://github.com/ambi-tious/CareBase-staff/issues/111)
- [ケアプラン登録画面設計書](https://github.com/ambi-tious/CareBase-staff/issues/113)
- [CarePlanDetail コンポーネント](../../../../../components/3_organisms/care-plan/care-plan-detail.tsx)
- [StatusBadge コンポーネント](../../../../../components/1_atoms/care-plan/status-badge.tsx)
- [CarePlan Types](../../../../../types/care-plan.ts)
- [ページ実装](./page.tsx)
- [Issue #115: [設計] #014 利用者｜利用者詳細（ケアプラン）](https://github.com/ambi-tious/CareBase-staff/issues/115)
- [親Issue #133: 利用者詳細（基本情報）](https://github.com/ambi-tious/CareBase-staff/issues/133)
- [画面一覧](../../../../../docs/screen-list.md#利用者管理)
