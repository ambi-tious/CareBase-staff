# 利用者一覧画面設計書

- 画面名: `利用者一覧`
- パス: `/residents`
- URL: https://carebase-staff.vercel.app/residents

## 概要

利用者一覧画面設計書です。
ログインしているグループとチームに紐づいた利用者の一覧表示、検索機能、退所済み利用者の表示制御機能を提供します。
利用者の基本情報と入居状況を一目で把握でき、詳細画面への遷移や新規利用者登録が可能です。

## 全体レイアウト

### 画面構成

<img width="998" height="474" alt="image" src="https://github.com/user-attachments/assets/e6fbf920-fce0-4712-90f1-d061bdf6b85f" />

利用者管理のメイン画面として以下の要素で構成：

- 検索・操作ツールバー
- 利用者カード一覧（グリッドレイアウト）
- 空状態表示

### 画面項目

| 項目名             | コンポーネント    | 必須 | 表示条件     | 初期値         | 備考                            |
| ------------------ | ----------------- | ---- | ------------ | -------------- | ------------------------------- |
| 検索バー           | ResidentSearchBar | -    | 常時         | 空文字         | 名前・ふりがなで検索            |
| 新規登録ボタン     | Button            | -    | 常時         | 新規利用者登録 | 青色スタイル、UserPlus アイコン |
| 退所済み表示トグル | Switch            | -    | 常時         | false          | 退所済み利用者も表示            |
| フィルターボタン   | Button            | -    | 常時         | フィルター     | アウトライン、Filter アイコン   |
| エクスポートボタン | Button            | -    | 常時         | エクスポート   | アウトライン、Download アイコン |
| 利用者カード       | ResidentCard      | -    | 検索結果あり | -              | グリッドレイアウト              |
| 空状態表示         | EmptyState        | -    | 検索結果なし | -              | Users アイコン付きメッセージ    |

## 機能仕様

### アクション

| 項目名           | 処理内容                         | 対象API                | 遷移先画面                            |
| ---------------- | -------------------------------- | ---------------------- | ------------------------------------- |
| 検索実行         | 名前・ふりがなでの部分一致検索   | -                      | 同一画面（結果更新）                  |
| 退所済み表示切替 | 退所済み利用者の表示・非表示切替 | -                      | 同一画面（結果更新）                  |
| 新規利用者登録   | 新規利用者登録画面への遷移       | -                      | 新規利用者登録画面 (`/residents/new`) |
| 利用者詳細表示   | 選択した利用者の詳細画面への遷移 | -                      | 利用者詳細画面 (`/residents/{id}`)    |
| フィルター実行   | 詳細条件でのフィルタリング       | `/v1/residents/filter` | 同一画面（結果更新）                  |
| エクスポート実行 | 利用者データのCSV出力            | `/v1/residents/export` | ファイルダウンロード                  |

### 入力チェック

| 項目名       | イベント | チェック内容              | エラーメッセージ                              |
| ------------ | -------- | ------------------------- | --------------------------------------------- |
| 検索バー     | input    | 文字数制限（100文字以内） | 検索キーワードは100文字以内で入力してください |
| 検索バー     | input    | 特殊文字制限              | 使用できない文字が含まれています              |
| フィルター   | submit   | 必須項目チェック          | 必須項目を入力してください                    |
| エクスポート | click    | 権限チェック              | エクスポート権限がありません                  |

### バリデーション仕様

#### 検索ロジック

- **部分一致検索**: 利用者名・ふりがなの両方で部分一致検索を実行
- **大文字小文字無視**: 検索時は大文字小文字を区別しない
- **リアルタイム検索**: 入力と同時に検索結果を更新
- **空文字処理**: 検索キーワードが空の場合は全件表示

#### 表示制御

- 入居中利用者: デフォルトで表示
- 退所済み利用者: トグルON時のみ表示
- グループ・チームフィルター: 選択されたスタッフのグループ・チームに紐づく利用者のみ表示
- ページネーション: 大量データ時の分割表示（将来実装）

#### エラーハンドリング

- 検索結果0件時の適切なメッセージ表示
- API通信エラー時のフォールバック表示
- 画像読み込み失敗時のプレースホルダー表示

## UI/UX仕様

### レスポンシブデザイン

- **利用者カード**: 1列（モバイル）→ 2列（タブレット）→ 3列（デスクトップ）
- **ツールバー**: 縦積み（モバイル）→ 横並び（タブレット以上）
- **検索バー**: 全幅（モバイル）→ 最大幅制限（デスクトップ）

### カラーテーマ

- **ステータスバッジ**:
  - 入居中: `bg-green-100 text-green-700 border-green-200`
  - 退所済: `bg-gray-100 text-gray-700 border-gray-200`
- **新規登録ボタン**: `bg-carebase-blue hover:bg-carebase-blue-dark`

### アニメーション

- **カードホバー**: `hover:shadow-md transition-shadow`
- **検索結果更新**: リアルタイム更新
- **ローディング**: スケルトンローディング表示（将来実装）

### アクセシビリティ

- **キーボードナビゲーション**: Tab キーでの操作対応
- **スクリーンリーダー**: 適切な aria-label 設定
- **コントラスト比**: WCAG 2.1 AA レベル準拠
- **フォーカス表示**: 明確なフォーカスインジケーター

## 実装詳細

### コンポーネント構成

```
ResidentsPage (page.tsx)
└── ResidentsList (organisms/resident/residents-list.tsx)
    ├── ResidentsToolbar (molecules/resident/residents-toolbar.tsx)
    │   ├── ResidentSearchBar (molecules/resident/resident-search-bar.tsx)
    │   ├── Button (新規登録)
    │   ├── Switch (退所済み表示)
    │   ├── Button (フィルター)
    │   └── Button (エクスポート)
    └── ResidentCard (molecules/resident/resident-card.tsx)
        └── ResidentStatusBadge (atoms/residents/resident-status-badge.tsx)
```

### データソース

- **利用者データ**: `mocks/residents-data.ts` の `careBoardData`
- **スタッフ情報**: `localStorage` の `carebase_selected_staff_data`
- **検索・フィルター**: クライアントサイドでのリアルタイム処理

### 状態管理

- **検索クエリ**: `useState` で管理
- **退所済み表示**: `useState` で管理
- **選択スタッフデータ**: `useState` + `useEffect` で管理
- **フィルタリング結果**: `useMemo` で計算

### 主要機能

1. **リアルタイム検索**: 入力と同時に結果を更新
2. **グループ・チームフィルター**: 選択されたスタッフの担当範囲のみ表示
3. **退所済み表示制御**: トグルで退所済み利用者の表示・非表示を切り替え
4. **利用者詳細遷移**: カードクリックで詳細画面へ遷移
5. **新規登録遷移**: ボタンクリックで新規登録画面へ遷移

## 参考資料

- [利用者詳細画面設計書](./[residentId]/README.md)
- [新規利用者登録画面設計書](./new/README.md)
- [Issue #137: [設計] #003 利用者｜利用者一覧](https://github.com/ambi-tious/CareBase-staff/issues/137)
- [画面一覧](../../../docs/screen-list.md#利用者管理)
- [利用者一覧画面実装](./page.tsx)
- [ResidentsList コンポーネント](../../../components/3_organisms/resident/residents-list.tsx)
- [ResidentCard コンポーネント](../../../components/2_molecules/resident/resident-card.tsx)
- [ResidentsToolbar コンポーネント](../../../components/2_molecules/resident/residents-toolbar.tsx)
- [ResidentSearchBar コンポーネント](../../../components/2_molecules/resident/resident-search-bar.tsx)
- [ResidentStatusBadge コンポーネント](../../../components/1_atoms/residents/resident-status-badge.tsx)
