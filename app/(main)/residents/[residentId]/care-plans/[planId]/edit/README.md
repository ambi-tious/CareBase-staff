# ケアプラン編集画面設計書

- 画面名: `ケアプラン編集`
- パス: `/residents/[residentId]/care-plans/[planId]/edit`
- URL: https://carebase-staff.vercel.app/residents/[residentId]/care-plans/[planId]/edit

## 概要

ケアプラン編集画面設計書です。
既存のケアプランの内容を編集・更新する機能を提供し、介護現場でのケアプラン修正や追記を効率的に行えます。
ケアプラン登録画面と基本的に同じ構成で、編集機能特有の差分（既存データの初期表示、更新処理、削除機能）を追加した設計です。

## 全体レイアウト

<img width="2160" src="https://github.com/user-attachments/assets/b8d4319e-7849-49e9-8942-259b100fdee2" />

### 画面構成

ケアプラン編集のメイン画面として以下の要素で構成：

- ページヘッダー（画面タイトル、説明文、戻るボタン）
- 成功・エラーメッセージ表示エリア
- ケアプラン編集フォーム（最大幅6xl、カード形式）
- アクションボタン（キャンセル、下書き保存、更新）

### ケアプラン登録画面との主な差分

| 項目               | 登録画面               | 編集画面                       | 差分詳細                   |
| ------------------ | ---------------------- | ------------------------------ | -------------------------- |
| **画面タイトル**   | 新規ケアプラン作成     | ケアプラン編集                 | アイコン: FileText → Edit3 |
| **説明文**         | 新しいケアプランを作成 | ケアプラン「[タイトル]」を編集 | 対象プラン名を表示         |
| **フォーム初期値** | 空の状態               | 既存データで初期化             | 全項目に既存値を設定       |
| **送信ボタン**     | 作成                   | 更新                           | ボタンテキストの変更       |
| **成功時遷移**     | 新規作成した詳細画面   | 編集対象の詳細画面             | 遷移先の違い               |
| **データ読み込み** | 利用者情報のみ         | ケアプラン + 利用者情報        | 既存プラン取得処理を追加   |

### 画面項目

| 項目名                 | コンポーネント | 必須 | 表示条件     | 初期値                 | 備考                                     |
| ---------------------- | -------------- | ---- | ------------ | ---------------------- | ---------------------------------------- |
| 戻るボタン             | Button         | -    | 常時         | 戻る                   | ケアプラン詳細画面へ遷移                 |
| 画面タイトル           | Heading        | -    | 常時         | ケアプラン編集         | Edit3 アイコン付き                       |
| 説明文                 | Text           | -    | 常時         | 編集説明               | 利用者名とプランタイトルを表示           |
| 成功メッセージ         | Alert          | -    | 更新成功時   | -                      | 緑色背景、CheckCircle アイコン           |
| エラーアラート         | Alert          | -    | 更新エラー時 | -                      | 赤色背景、エラーメッセージ表示           |
| ローディング表示       | Text           | -    | データ取得中 | 読み込み中...          | データ取得完了まで表示                   |
| プラン未発見表示       | Text           | -    | データ未発見 | プランが見つかりません | ケアプラン取得失敗時                     |
| **フォーム項目**       |                |      |              |                        | CarePlanFormコンポーネント内で定義       |
| プランタイトル         | FormField      | ◯    | 常時         | 既存データ             | 既存のplanTitleで初期化                  |
| プラン種別             | FormSelect     | ◯    | 常時         | 既存データ             | 既存のplanTypeで初期化                   |
| 要介護度               | FormSelect     | ◯    | 常時         | 既存データ             | 既存のcareLevelで初期化                  |
| 認定日                 | FormField      | ◯    | 常時         | 既存データ             | 既存のcertificationDateで初期化          |
| 認定有効期間開始日     | FormField      | ◯    | 常時         | 既存データ             | 既存のcertValidityStartで初期化          |
| 認定有効期間終了日     | FormField      | ◯    | 常時         | 既存データ             | 既存のcertValidityEndで初期化            |
| 認定状況               | FormSelect     | ◯    | 常時         | 既存データ             | 既存のcertificationStatusで初期化        |
| ケアマネジャー名       | FormField      | ◯    | 常時         | 既存データ             | 既存のcareManagerで初期化                |
| 居宅介護支援事業所     | FormField      | ◯    | 常時         | 既存データ             | 既存のcareManagerOfficeで初期化          |
| 次回見直し日           | FormField      | -    | 常時         | 既存データ             | 既存のnextReviewDateで初期化             |
| 医師意見書対応         | Checkbox       | -    | 常時         | 既存データ             | 既存のisReferralで初期化                 |
| 利用者の意向           | Textarea       | -    | 常時         | 既存データ             | 既存のresidentIntentionで初期化          |
| 家族の意向             | Textarea       | -    | 常時         | 既存データ             | 既存のfamilyIntentionで初期化            |
| 認定審査会の意見       | Textarea       | -    | 常時         | 既存データ             | 既存のassessmentCommitteeOpinionで初期化 |
| 総合的な援助の方針     | Textarea       | -    | 常時         | 既存データ             | 既存のcomprehensiveGuidanceで初期化      |
| 同意確認               | Checkbox       | -    | 常時         | 既存データ             | 既存のconsentObtainedで初期化            |
| 目標設定セクション     | DynamicSection | -    | 常時         | 既存データ配列         | 既存のgoalsで初期化                      |
| サービス設定セクション | DynamicSection | -    | 常時         | 既存データ配列         | 既存のservicesで初期化                   |
| 備考                   | Textarea       | -    | 常時         | 既存データ             | 既存のnotesで初期化                      |
| キャンセルボタン       | Button         | -    | 常時         | キャンセル             | アウトライン                             |
| 下書き保存ボタン       | Button         | -    | 常時         | 下書き保存             | アウトライン、Save アイコン              |
| 更新ボタン             | Button         | -    | 常時         | 更新                   | 青色スタイル、Send アイコン              |

## 機能仕様

### データ取得・初期化処理

| 処理項目           | 処理内容                                  | 実行タイミング           | エラーハンドリング             |
| ------------------ | ----------------------------------------- | ------------------------ | ------------------------------ |
| **パラメータ解析** | URL params から residentId, planId を抽出 | コンポーネントマウント時 | 無効なIDの場合はエラー表示     |
| **利用者情報取得** | getResidentById で利用者データ取得        | パラメータ解析後         | 利用者未発見時は画面表示       |
| **ケアプラン取得** | getCarePlanById で既存プラン取得          | パラメータ解析後         | プラン未発見時は専用メッセージ |
| **フォーム初期化** | 既存データを CarePlanFormData 形式に変換  | データ取得完了後         | 必須項目の自動補完             |
| **画面状態更新**   | residentName, carePlan 状態を更新         | データ取得完了後         | ローディング状態を解除         |

#### データ変換仕様

```typescript
// ケアプランデータからフォームデータへの変換
const initialData: Partial<CarePlanFormData> = {
  planTitle: carePlan.planTitle,
  planType: carePlan.planType,
  careLevel: carePlan.careLevel,
  certificationDate: carePlan.certificationDate,
  certValidityStart: carePlan.certValidityStart,
  certValidityEnd: carePlan.certValidityEnd,
  certificationStatus: carePlan.certificationStatus,
  careManager: carePlan.careManager,
  careManagerOffice: carePlan.careManagerOffice,
  nextReviewDate: carePlan.nextReviewDate,
  isReferral: carePlan.isReferral,
  residentIntention: carePlan.residentIntention,
  familyIntention: carePlan.familyIntention,
  assessmentCommitteeOpinion: carePlan.assessmentCommitteeOpinion,
  comprehensiveGuidance: carePlan.comprehensiveGuidance,
  consentObtained: carePlan.consentObtained,
  goals: carePlan.goals,
  services: carePlan.services.map((service) => ({
    ...service,
    endDate: service.endDate || '',
    notes: service.notes || '',
  })),
  notes: carePlan.notes || '',
};
```

### アクション

| 項目名           | 処理内容                         | 対象API                          | 遷移先画面                                                         |
| ---------------- | -------------------------------- | -------------------------------- | ------------------------------------------------------------------ |
| 戻るボタン       | ケアプラン詳細画面に戻る         | -                                | ケアプラン詳細画面 (`/residents/{residentId}/care-plans/{planId}`) |
| フォーム入力     | リアルタイムバリデーション実行   | -                                | 同一画面（エラー表示更新）                                         |
| 下書き保存       | 入力内容を下書きとして保存       | `carePlanService.updateCarePlan` | 同一画面（成功メッセージ表示）                                     |
| 更新ボタン       | ケアプランを確定して更新         | `carePlanService.updateCarePlan` | ケアプラン詳細画面 (`/residents/{residentId}/care-plans/{planId}`) |
| キャンセルボタン | 入力内容を破棄して詳細画面に戻る | -                                | ケアプラン詳細画面 (`/residents/{residentId}/care-plans/{planId}`) |

### 更新処理仕様

#### 下書き保存 (isDraft: true)

- **バリデーション**: 緩和されたバリデーション（必須項目チェックなし）
- **成功時**: 「下書きを保存しました。」メッセージ表示、画面に留まる
- **失敗時**: 「下書き保存に失敗しました。もう一度お試しください。」エラー表示

#### 確定更新 (isDraft: false)

- **バリデーション**: 完全なバリデーション実行
- **成功時**: 「ケアプランを更新しました。」メッセージ表示後、1.5秒で詳細画面に遷移
- **失敗時**: 「ケアプランの更新に失敗しました。もう一度お試しください。」エラー表示

### 入力チェック

_ケアプラン登録画面と同様のバリデーションを適用_

| 項目名             | イベント | チェック内容                  | エラーメッセージ                                 |
| ------------------ | -------- | ----------------------------- | ------------------------------------------------ |
| プランタイトル     | blur     | 必須チェック                  | プランタイトルは必須です                         |
| プランタイトル     | blur     | 文字数チェック（100文字以内） | プランタイトルは100文字以内で入力してください    |
| プラン種別         | change   | 必須選択チェック              | プラン種別を選択してください                     |
| 要介護度           | change   | 必須選択チェック              | 要介護度を選択してください                       |
| 認定日             | change   | 必須チェック                  | 認定日は必須です                                 |
| 認定有効期間開始日 | change   | 必須チェック                  | 認定有効期間開始日は必須です                     |
| 認定有効期間終了日 | change   | 必須チェック                  | 認定有効期間終了日は必須です                     |
| 認定状況           | change   | 必須選択チェック              | 認定状況を選択してください                       |
| ケアマネジャー名   | blur     | 必須チェック                  | ケアマネジャー名は必須です                       |
| 居宅介護支援事業所 | blur     | 必須チェック                  | 居宅介護支援事業所は必須です                     |
| 期間整合性         | change   | 開始日 ≤ 終了日               | 認定有効期間の開始日は終了日より前にしてください |
| フォーム送信       | submit   | 全必須項目チェック            | 必須項目をすべて入力してください                 |

### バリデーション仕様

#### リアルタイムバリデーション

- **useCarePlanForm フック**: バリデーション状態を一元管理
- **入力時検証**: フォーム項目への入力と同時にバリデーションを実行
- **エラー表示**: 各項目下部に赤色でエラーメッセージを表示
- **送信制御**: バリデーションエラーがある場合は送信ボタンクリック時に送信を阻止

#### 編集特有のバリデーション

- **データ整合性**: 既存データとの整合性チェック
- **変更検知**: hasUnsavedChanges で未保存変更を検知
- **下書き保存**: バリデーションを緩和して部分的な保存を許可

## UI/UX仕様

### レスポンシブデザイン

_ケアプラン登録画面と同様の設計を踏襲_

- **モバイル（〜768px）**: フォーム項目を1列で縦並び表示、ボタンを全幅で縦積み配置
- **タブレット（768px〜1024px）**: フォーム項目を2列グリッドで表示、ボタンを右寄せで横並び配置
- **デスクトップ（1024px〜）**: フォーム全体の最大幅を6xlに制限、2列グリッドレイアウトを維持

### 編集画面特有のUI仕様

#### データ読み込み状態

- **ローディング表示**: 「読み込み中...」テキストを中央表示
- **エラー状態**: 「ケアプランが見つかりません。」を赤色で表示
- **背景**: `bg-carebase-bg min-h-screen` で画面全体をカバー

#### 成功・エラーメッセージ

- **成功メッセージ**: 緑色背景 (`border-green-200 bg-green-50`)、CheckCircle アイコン
- **エラーメッセージ**: 赤色背景 (`border-red-200 bg-red-50`)、テキストカラー `text-red-700`
- **表示位置**: フォームカードの上部、ヘッダーの下部
- **自動消去**: 成功時は1.5秒後にページ遷移でメッセージが消去

#### フォーム初期化状態

- **プレフィル表示**: 全フィールドに既存データが初期表示
- **変更検知**: 初期データから変更があった場合のみ保存ボタンを有効化
- **リセット機能**: キャンセル時に初期データに戻す

### カラーテーマ

_ケアプラン登録画面と同様のテーマを使用_

- **背景色**: `bg-carebase-bg` - アプリケーション標準背景色
- **更新ボタン**: `bg-carebase-blue hover:bg-carebase-blue-dark` - メインアクション
- **戻る・キャンセルボタン**: `border-gray-300 text-gray-700` - セカンダリアクション
- **エラーアラート**: `bg-red-50 border-red-200 text-red-700` - エラー状態
- **成功アラート**: `bg-green-50 border-green-200 text-green-700` - 成功状態
- **必須マーク**: `text-red-500` - 必須項目表示

### アニメーション

- **ボタンホバー**: スムーズなカラートランジション
- **フォーム送信**: ローディング状態の表示（「更新中...」）
- **メッセージ表示**: フェードイン効果でアラート表示
- **データ読み込み**: ローディングスピナー（実装予定）

### アクセシビリティ

_ケアプラン登録画面と同様の対応_

- **キーボードナビゲーション**: Tabキーでの順次フォーカス移動
- **スクリーンリーダー**:
  - 適切なlabel要素の関連付け
  - 必須項目のaria-required属性
  - エラーメッセージのaria-describedby属性
- **コントラスト比**: WCAG 2.1 AA レベル準拠
- **フォーカス表示**: 明確なフォーカスリング表示

### ローディング・無効化状態

#### データ取得中状態 (isLoading: true)

- **画面表示**: 「読み込み中...」テキストを中央配置
- **フォーム非表示**: データ取得完了まで入力フォームを表示しない
- **背景**: 標準背景色を維持

#### 送信中状態 (isSubmitting: true)

- **フォーム無効化**: `disabled={isSubmitting}` で全入力フィールドを無効化
- **ボタン制御**:
  - 戻るボタン: クリック無効化
  - キャンセルボタン: クリック無効化
  - 更新ボタン: テキスト変更「更新」→「更新中...」、クリック無効化

#### 下書き保存中状態 (isSavingDraft: true)

- **下書きボタン**: テキスト変更「下書き保存」→「保存中...」
- **その他ボタン**: 操作可能状態を維持
- **フォーム**: 入力継続可能

#### 未保存変更警告 (hasUnsavedChanges: true)

- **警告表示**: 「未保存の変更があります」アラートを表示
- **背景色**: 黄色背景 (`bg-yellow-50 border-yellow-200`)
- **アイコン**: AlertCircle アイコン使用

## 技術仕様

### 使用コンポーネント

#### メインコンポーネント

- **EditCarePlanPage**: ページ全体のレイアウトとデータ管理
- **CarePlanForm**: フォーム機能の実装（登録画面と共通）
- **Alert**: 成功・エラーメッセージ表示
- **Button**: 各種アクションボタン
- **Card/CardContent/CardHeader**: フォームコンテナ

#### フォーム内コンポーネント

- **FormField**: テキスト入力フィールド
- **FormSelect**: 選択フィールド
- **Textarea**: 複数行テキスト入力
- **Checkbox**: チェックボックス入力
- **Label**: ラベル表示

### データ型定義

#### ページProps

```typescript
interface EditCarePlanPageProps {
  params: Promise<{ residentId: string; planId: string }>;
}
```

#### 状態管理

```typescript
// ページレベル状態
const [residentId, setResidentId] = useState<string>('');
const [planId, setPlanId] = useState<string>('');
const [residentName, setResidentName] = useState<string>('');
const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [submitError, setSubmitError] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string | null>(null);
```

#### フォームデータ型

```typescript
// useCarePlanForm フックが管理
interface CarePlanFormData {
  planTitle: string;
  planType: string;
  careLevel: string;
  certificationDate: string;
  certValidityStart: string;
  certValidityEnd: string;
  certificationStatus: string;
  careManager: string;
  careManagerOffice: string;
  nextReviewDate?: string;
  isReferral?: boolean;
  residentIntention?: string;
  familyIntention?: string;
  assessmentCommitteeOpinion?: string;
  comprehensiveGuidance?: string;
  consentObtained?: boolean;
  goals: CarePlanGoalFormData[];
  services: CarePlanServiceFormData[];
  notes?: string;
}
```

### API仕様

#### データ取得

- **getResidentById(residentIdNum)**: 利用者情報取得
- **getCarePlanById(planId)**: 既存ケアプラン取得

#### データ更新

- **carePlanService.updateCarePlan(residentId, planId, data)**: ケアプラン更新
  - **引数**: residentId (string), planId (string), data (CarePlanFormData)
  - **戻り値**: Promise<CarePlan>
  - **エラー**: 更新失敗時は Error をスロー

### フック仕様

#### useCarePlanForm

```typescript
const {
  formData,
  updateField,
  isSubmitting,
  isSavingDraft,
  error,
  fieldErrors,
  hasUnsavedChanges,
  submitFinal,
  saveDraft,
  clearError,
} = useCarePlanForm({ onSubmit, initialData, mode: 'edit' });
```

**主要な差分**:

- **initialData**: 既存ケアプランデータで初期化
- **mode**: 'edit' モードで編集機能を有効化
- **hasUnsavedChanges**: 初期データからの変更を検知

## 参考資料

- [ケアプラン編集画面実装](./page.tsx)
- [ケアプラン登録画面実装](../../new/page.tsx)
- [CarePlanForm コンポーネント](../../../../../../components/2_molecules/care-plan/care-plan-form.tsx)
- [useCarePlanForm カスタムフック](../../../../../../hooks/useCarePlanForm.ts) - フォーム状態管理、バリデーション、送信処理
- [carePlanService](../../../../../../services/carePlanService.ts) - ケアプラン更新API
- [ケアプラン詳細画面設計書](../README.md)
- [申し送り編集画面設計書](../../../../handovers/edit/[handoverId]/README.md) - 編集画面の参考実装
- [介護記録編集画面設計書](../../../../care-records/[recordId]/edit/README.md) - 編集画面の参考実装
- [CareBase-staff設計書フォーマット](../../../../../../docs/standard-design-document.md)
- [画面一覧](../../../../../../docs/screen-list.md#ケアプラン管理)
