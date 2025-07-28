# 個別ポイント編集画面設計書

- 画面名: `個別ポイント編集画面`
- パス: `/residents/[residentId]/individual-points/[pointId]/edit`
- URL: https://carebase-staff.vercel.app/residents/1/individual-points/point-001/edit

## 概要

利用者の個別ポイントを編集する画面設計書です。
既存の個別ポイント情報を読み込み、テキスト・画像・動画の編集機能を提供します。
リッチテキストエディタを使用したユーザーフレンドリーな編集環境で、効率的な情報更新を実現します。

## 全体レイアウト

### 画面構成

```
┌─────────────────────────────────────────────────────────────┐
│ ヘッダー: 利用者名 > 個別ポイント > [ポイント名] > 編集      │
├─────────────────────────────────────────────────────────────┤
│ [戻る] [ページタイトル: 個別ポイント編集]        [保存] [キャンセル]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────┐ ┌─────────────────────────────────────┐ │
│ │ 基本情報        │ │ タグ・メディア                       │ │
│ │                 │ │                                     │ │
│ │ ・タイトル*     │ │ ・タグ管理                          │ │
│ │ ・カテゴリ*     │ │ ・メディアファイルアップロード       │ │
│ │ ・優先度*       │ │ ・既存メディアファイル一覧          │ │
│ │ ・ステータス*   │ │                                     │ │
│ └─────────────────┘ └─────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ リッチテキストエディタ（詳細内容）*                     │ │
│ │                                                         │ │
│ │ ・フォーマットツールバー                                │ │
│ │ ・テキスト編集エリア                                    │ │
│ │ ・文字数カウンター                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 備考（テキストエリア）                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [変更内容の警告表示]                                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │           [キャンセル]              [更新]               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 画面項目

| 項目名                   | コンポーネント         | 必須 | 表示条件     | 初期値                | 備考                                    |
| ------------------------ | ---------------------- | ---- | ------------ | --------------------- | --------------------------------------- |
| パンくずリスト           | Breadcrumb             | -    | 常時         | -                     | 利用者名 > 個別ポイント > 編集         |
| 戻るボタン               | Button                 | -    | 常時         | 戻る                  | ArrowLeftアイコン付き                   |
| ページタイトル           | Heading                | -    | 常時         | 個別ポイント編集      | h1レベル                                |
| タイトル                 | FormField              | ◯    | 常時         | 既存データ            | 100文字以内                             |
| カテゴリ                 | FormSelect             | ◯    | 常時         | 既存データ            | 食事・入浴・服薬・排泄等                |
| 優先度                   | FormSelect             | ◯    | 常時         | 既存データ            | 高・中・低                              |
| ステータス               | FormSelect             | ◯    | 常時         | 既存データ            | 有効・無効・アーカイブ                  |
| 既存タグ一覧             | BadgeGroup             | -    | タグ存在時   | 既存データ            | 削除可能バッジ表示                      |
| タグ追加入力             | Input + Button         | -    | 常時         | -                     | Enterキーで追加可能                     |
| メディアファイル追加     | Button + FileInput     | -    | 常時         | -                     | 画像・動画・文書対応、最大10MB          |
| 既存メディアファイル一覧 | MediaPreviewGrid       | -    | メディア存在時 | 既存データ            | サムネイル表示、削除可能                |
| リッチテキストエディタ   | RichTextEditor         | ◯    | 常時         | 既存データ            | 1000文字以内、フォーマット機能付き      |
| 備考                     | Textarea               | -    | 常時         | 既存データ            | プレーンテキスト、追加情報用            |
| 未保存変更警告           | Alert                  | -    | 変更検出時   | -                     | 黄色の警告表示                          |
| エラーメッセージ         | Alert                  | -    | エラー時     | -                     | 赤色のエラー表示、リトライボタン付き    |
| キャンセルボタン         | Button                 | -    | 常時         | キャンセル            | Outlineスタイル                         |
| 更新ボタン               | Button                 | -    | 常時         | 更新/更新中...        | Primaryスタイル、ローディング状態対応   |

## 機能仕様

### アクション

| 項目名             | 処理内容                                   | 対象API                                                      | 遷移先画面                      |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------ | ------------------------------- |
| 画面表示           | 既存個別ポイントデータ読み込み             | GET /api/residents/[residentId]/individual-points/[pointId]  | -                               |
| タイトル更新       | タイトル値更新、バリデーション実行         | -                                                            | -                               |
| カテゴリ変更       | カテゴリ選択更新                           | -                                                            | -                               |
| 優先度変更         | 優先度選択更新                             | -                                                            | -                               |
| ステータス変更     | ステータス選択更新                         | -                                                            | -                               |
| タグ追加           | 新規タグをタグリストに追加                 | -                                                            | -                               |
| タグ削除           | 選択タグをタグリストから削除               | -                                                            | -                               |
| メディア追加       | ファイル選択、プレビュー表示、バリデーション | -                                                            | -                               |
| メディア削除       | 選択メディアをリストから削除               | -                                                            | -                               |
| リッチテキスト編集 | テキスト内容更新、フォーマット適用         | -                                                            | -                               |
| 備考更新           | 備考内容更新                               | -                                                            | -                               |
| 戻るボタン         | 前画面へ戻る（未保存変更確認）             | -                                                            | 個別ポイント詳細画面            |
| キャンセルボタン   | 編集キャンセル（未保存変更確認）           | -                                                            | 個別ポイント詳細画面            |
| 更新ボタン         | フォームバリデーション、個別ポイント更新   | PUT /api/residents/[residentId]/individual-points/[pointId]  | 個別ポイント詳細画面（成功時）  |

### 入力チェック

| 項目名                 | イベント                | チェック内容                                      | エラーメッセージ                                        |
| ---------------------- | ----------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| タイトル               | onChange, onBlur        | 必須入力、1-100文字                               | 「タイトルは必須です」「タイトルは100文字以内です」     |
| カテゴリ               | onChange                | 必須選択                                          | 「カテゴリは必須です」                                  |
| 優先度                 | onChange                | 必須選択                                          | 「優先度は必須です」                                    |
| ステータス             | onChange                | 必須選択                                          | 「ステータスは必須です」                                |
| タグ追加               | onSubmit                | 重複チェック、文字数制限                          | 「このタグは既に追加されています」                      |
| メディアファイル       | onChange                | ファイルサイズ（10MB以下）、ファイル形式          | 「ファイルサイズが大きすぎます」「対応していない形式です」 |
| リッチテキスト内容     | onChange, onBlur        | 必須入力、1-1000文字                              | 「内容は必須です」「内容は1000文字以内です」            |
| 備考                   | onChange                | 文字数制限（500文字以下）                         | 「備考は500文字以内です」                               |
| フォーム全体           | onSubmit                | 全項目バリデーション、ネットワーク接続確認        | 「入力内容に不備があります」「接続エラーが発生しました」 |

### バリデーション仕様

#### クライアントサイドバリデーション

```typescript
// フォームスキーマ (Zodベース)
const individualPointEditSchema = z.object({
  title: z.string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  content: z.string()
    .min(1, '内容は必須です') 
    .max(1000, '内容は1000文字以内で入力してください'),
  category: z.enum(['meal', 'bathing', 'medication', 'excretion', 'vital', 'exercise', 'communication', 'other'], {
    required_error: 'カテゴリは必須です',
  }),
  priority: z.enum(['high', 'medium', 'low'], {
    required_error: '優先度は必須です',
  }),
  status: z.enum(['active', 'inactive', 'archived'], {
    required_error: 'ステータスは必須です',
  }),
  tags: z.array(z.string()).default([]),
  notes: z.string().max(500, '備考は500文字以内で入力してください').optional(),
});
```

#### リアルタイムバリデーション

- **入力時バリデーション**: onChange イベントで文字数制限をリアルタイムチェック
- **フォーカス離脱時バリデーション**: onBlur イベントで必須項目の入力確認
- **送信時バリデーション**: onSubmit イベントで全項目の総合バリデーション

#### ファイルバリデーション

```typescript
// メディアファイルバリデーション
const validateMediaFile = (file: File): string | null => {
  // ファイルサイズチェック（10MB）
  if (file.size > 10 * 1024 * 1024) {
    return `${file.name} のファイルサイズが大きすぎます（10MB以下にしてください）`;
  }
  
  // ファイル形式チェック
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/quicktime',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return `${file.name} は対応していないファイル形式です`;
  }
  
  return null;
};
```

## UI/UX仕様

### レスポンシブデザイン

#### デスクトップ（1280px以上）
- 2カラムレイアウト（基本情報 + タグ・メディア）
- リッチテキストエディタフル幅表示
- ツールバー全機能表示

#### タブレット（1024px-1279px）
- 2カラムレイアウト維持
- リッチテキストエディタツールバー省略表示
- メディアプレビューグリッド調整

#### モバイル（375px-1023px）
- 1カラムレイアウト（縦積み）
- リッチテキストエディタツールバー最小構成
- タッチ操作最適化

### カラーテーマ

#### プライマリカラー
- **メインブルー**: `#3b82f6` (CareBase Blue)
- **ダークブルー**: `#1d4ed8` (ホバー時)
- **ライトブルー**: `#60a5fa` (フォーカス時)

#### セマンティックカラー
- **成功**: `#10b981` (保存完了)
- **警告**: `#f59e0b` (未保存変更)
- **エラー**: `#ef4444` (バリデーション失敗)
- **情報**: `#3b82f6` (情報表示)

#### カテゴリ別カラー
- **食事**: `#f97316` (オレンジ)
- **入浴**: `#3b82f6` (ブルー)
- **服薬**: `#8b5cf6` (パープル)
- **排泄**: `#6b7280` (グレー)
- **バイタル**: `#ef4444` (レッド)
- **運動**: `#10b981` (グリーン)
- **コミュニケーション**: `#6366f1` (インディゴ)
- **その他**: `#9ca3af` (ライトグレー)

### アニメーション

#### トランジション効果
```css
/* 基本トランジション */
.transition-base {
  transition: all 150ms ease-in-out;
}

/* フォーカス効果 */
.focus-ring {
  @apply focus:ring-2 focus:ring-carebase-blue focus:ring-offset-2 focus:outline-none;
}

/* ホバー効果 */
.hover-lift {
  @apply hover:shadow-md hover:-translate-y-0.5 transition-all;
}
```

#### ローディング状態
- **ボタンローディング**: スピナーアイコン + テキスト変更
- **フォームローディング**: オーバーレイ + プログレスインジケーター
- **メディアアップロード**: プログレスバー表示

### アクセシビリティ

#### キーボードナビゲーション
- **Tab順序**: 論理的な順序でのフォーカス移動
- **ショートカット**: 
  - `Ctrl/Cmd + S`: 保存
  - `Escape`: キャンセル
  - `Ctrl/Cmd + Z`: 元に戻す（リッチテキストエディタ内）

#### スクリーンリーダー対応
```tsx
// ARIAラベル例
<button 
  aria-label="個別ポイントを更新"
  aria-describedby="update-help-text"
>
  更新
</button>

<div id="update-help-text" className="sr-only">
  入力内容を保存して個別ポイントを更新します
</div>
```

#### カラーコントラスト
- **AA準拠**: 4.5:1以上のコントラスト比
- **カラーブラインド対応**: アイコンと組み合わせた情報表示

## 技術仕様

### 使用コンポーネント

#### Atomsレベル
```typescript
// フォーム関連
import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// UI関連
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// アイコン
import { ArrowLeft, Upload, X, Save, AlertCircle } from 'lucide-react';
```

#### Moleculesレベル
```typescript
// 個別ポイント専用コンポーネント
import { CategoryBadge } from '@/components/1_atoms/individual-points/category-badge';
import { PriorityBadge } from '@/components/1_atoms/individual-points/priority-badge';
import { StatusBadge } from '@/components/1_atoms/individual-points/status-badge';
import { MediaThumbnail } from '@/components/1_atoms/individual-points/media-thumbnail';

// リッチテキストエディタ（新規作成予定）
import { RichTextEditor } from '@/components/2_molecules/forms/rich-text-editor';
```

#### Organismsレベル
```typescript
// フォーム本体
import { IndividualPointEditForm } from '@/components/3_organisms/individual-points/individual-point-edit-form';
```

### データ型定義

#### 基本型
```typescript
// 編集フォーム用型
interface IndividualPointEditFormData extends IndividualPointFormData {
  id: string;
  residentId: string;
  existingMediaAttachments: MediaAttachment[];
  removedMediaIds: string[];
}

// 編集画面プロパティ
interface IndividualPointEditPageProps {
  params: {
    residentId: string;
    pointId: string;
  };
}

// フォーム状態管理
interface EditFormState {
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof IndividualPointEditFormData, string>>;
}
```

#### リッチテキストエディタ型
```typescript
// エディタ設定
interface RichTextEditorConfig {
  toolbar: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    bulletList: boolean;
    numberedList: boolean;
    link: boolean;
    undo: boolean;
    redo: boolean;
  };
  maxLength: number;
  placeholder: string;
  autoFocus: boolean;
}

// エディタ内容型
interface RichTextContent {
  html: string;
  text: string;
  length: number;
}
```

### API仕様

#### 個別ポイント取得
```typescript
// GET /api/residents/[residentId]/individual-points/[pointId]
interface GetIndividualPointResponse {
  success: boolean;
  data: IndividualPoint;
  error?: string;
}
```

#### 個別ポイント更新
```typescript
// PUT /api/residents/[residentId]/individual-points/[pointId]
interface UpdateIndividualPointRequest {
  title: string;
  content: string; // リッチテキストHTML
  category: IndividualPointCategory;
  priority: IndividualPointPriority;
  status: IndividualPointStatus;
  tags: string[];
  notes?: string;
  removedMediaIds: string[]; // 削除するメディアID
}

interface UpdateIndividualPointResponse {
  success: boolean;
  data: IndividualPoint;
  error?: string;
}
```

#### メディアファイルアップロード
```typescript
// POST /api/residents/[residentId]/individual-points/[pointId]/media
// FormData with files

interface MediaUploadResponse {
  success: boolean;
  data: MediaAttachment[];
  error?: string;
}
```

### 状態管理

#### カスタムフック使用
```typescript
// 編集フォーム用フック
const useIndividualPointEditForm = (initialData: IndividualPoint) => {
  // 既存のuseIndividualPointFormを拡張
  const baseForm = useIndividualPointForm({
    initialData,
    mode: 'edit',
    onSubmit: handleUpdate,
  });

  // 編集特有の機能追加
  const [existingMedia, setExistingMedia] = useState(initialData.mediaAttachments);
  const [removedMediaIds, setRemovedMediaIds] = useState<string[]>([]);

  const removeExistingMedia = (mediaId: string) => {
    setExistingMedia(prev => prev.filter(media => media.id !== mediaId));
    setRemovedMediaIds(prev => [...prev, mediaId]);
  };

  return {
    ...baseForm,
    existingMedia,
    removedMediaIds,
    removeExistingMedia,
  };
};
```

#### 未保存変更検出
```typescript
// ページ離脱時の確認処理
useBeforeUnload(
  hasUnsavedChanges,
  '未保存の変更があります。このページを離れますか？'
);

// ルート変更時の確認処理
useEffect(() => {
  const handleRouteChange = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('未保存の変更があります。このページを離れますか？');
      if (!confirmed) {
        router.events.emit('routeChangeError');
        throw 'Route change aborted.';
      }
    }
  };

  router.events.on('beforeHistoryChange', handleRouteChange);
  return () => {
    router.events.off('beforeHistoryChange', handleRouteChange);
  };
}, [hasUnsavedChanges]);
```

### パフォーマンス最適化

#### 遅延読み込み
```typescript
// リッチテキストエディタの動的インポート
const RichTextEditor = dynamic(
  () => import('@/components/2_molecules/forms/rich-text-editor'),
  {
    loading: () => <div>エディタを読み込み中...</div>,
    ssr: false, // クライアントサイドのみ
  }
);
```

#### メモ化
```typescript
// 選択肢のメモ化
const categoryOptions = useMemo(() => 
  categoryData.map(cat => ({ value: cat.id, label: cat.name })),
  [categoryData]
);

// バリデーション結果のメモ化
const validationErrors = useMemo(() => 
  validateForm(formData),
  [formData]
);
```

## セキュリティ仕様

### 入力サニタイゼーション
```typescript
// HTMLサニタイゼーション（リッチテキスト）
import DOMPurify from 'dompurify';

const sanitizeRichText = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};
```

### ファイルアップロードセキュリティ
```typescript
// ファイル検証
const validateUploadSecurity = (file: File): boolean => {
  // MIMEタイプ検証
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm',
    'application/pdf', 'text/plain'
  ];
  
  // ファイル拡張子検証
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.pdf', '.txt'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  return allowedMimes.includes(file.type) && allowedExtensions.includes(fileExtension);
};
```

### 認証・認可
```typescript
// ページレベルでの認証確認
export default function IndividualPointEditPage({ params }: IndividualPointEditPageProps) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    redirect('/login');
  }
  
  // 利用者アクセス権限確認
  const hasAccess = useResidentAccess(params.residentId);
  if (!hasAccess) {
    redirect('/unauthorized');
  }
  
  // 編集権限確認
  const canEdit = useIndividualPointPermission(params.pointId, 'edit');
  if (!canEdit) {
    redirect(`/residents/${params.residentId}/individual-points/${params.pointId}`);
  }
  
  return <IndividualPointEditForm ... />;
}
```

## テスト仕様

### 単体テスト
```typescript
// フォームコンポーネントテスト
describe('IndividualPointEditForm', () => {
  it('既存データが正しく表示される', () => {
    const mockData = createMockIndividualPoint();
    render(<IndividualPointEditForm initialData={mockData} />);
    
    expect(screen.getByDisplayValue(mockData.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockData.content)).toBeInTheDocument();
  });

  it('必須フィールドのバリデーションが動作する', async () => {
    render(<IndividualPointEditForm />);
    
    fireEvent.click(screen.getByRole('button', { name: '更新' }));
    
    await waitFor(() => {
      expect(screen.getByText('タイトルは必須です')).toBeInTheDocument();
    });
  });

  it('メディアファイルの追加・削除が動作する', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    render(<IndividualPointEditForm />);
    
    const fileInput = screen.getByLabelText('ファイルを追加');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText('test.jpg')).toBeInTheDocument();
  });
});
```

### 統合テスト
```typescript
// API連携テスト
describe('Individual Point Edit Integration', () => {
  it('個別ポイント更新フローが正常に動作する', async () => {
    const mockPoint = createMockIndividualPoint();
    server.use(
      rest.get('/api/residents/:residentId/individual-points/:pointId', (req, res, ctx) => {
        return res(ctx.json({ success: true, data: mockPoint }));
      }),
      rest.put('/api/residents/:residentId/individual-points/:pointId', (req, res, ctx) => {
        return res(ctx.json({ success: true, data: { ...mockPoint, title: 'Updated Title' } }));
      })
    );

    render(<IndividualPointEditPage params={{ residentId: '1', pointId: 'point-1' }} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockPoint.title)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByRole('button', { name: '更新' }));

    await waitFor(() => {
      expect(screen.getByText('個別ポイントを更新しました')).toBeInTheDocument();
    });
  });
});
```

### E2Eテスト
```typescript
// Playwright E2Eテスト
test('個別ポイント編集画面の操作フロー', async ({ page }) => {
  await page.goto('/residents/1/individual-points/point-001/edit');
  
  // データ読み込み確認
  await expect(page.locator('[data-testid="title-input"]')).toHaveValue('とろみスプーン大を使用');
  
  // 編集操作
  await page.fill('[data-testid="title-input"]', '更新されたタイトル');
  await page.click('[data-testid="rich-text-editor"]');
  await page.type('[data-testid="rich-text-editor"]', '追加のテキスト内容');
  
  // 保存
  await page.click('button:has-text("更新")');
  
  // 成功確認
  await expect(page.locator('text=個別ポイントを更新しました')).toBeVisible();
  await expect(page).toHaveURL('/residents/1/individual-points/point-001');
});
```

## 参考資料

### FlutterFlow参考デザイン
![個別ポイント編集画面](https://github.com/user-attachments/assets/311a83ef-40f6-4160-ac04-9fd8500ac220)

### 既存設計書
- [標準設計書](/docs/standard-design-document.md)
- [利用者詳細画面設計書](/app/(main)/residents/[residentId]/README.md)
- [既往歴タブ設計書](/app/(main)/residents/[residentId]/medical-history/README.md)

### 技術仕様
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### リッチテキストエディタ候補
- [Tiptap](https://tiptap.dev/) - Prosemirrorベース、軽量
- [Quill](https://quilljs.com/) - 多機能、カスタマイズ性高
- [React Quill](https://github.com/zenoamaro/react-quill) - React用Quillラッパー

## 実装優先度

### Phase 1 (高優先度)
- [x] 基本フォーム構造の実装
- [x] 既存データ読み込み機能
- [x] バリデーション機能
- [ ] リッチテキストエディタ統合
- [ ] メディアファイル管理機能

### Phase 2 (中優先度)
- [ ] 未保存変更検出・警告
- [ ] アクセシビリティ対応
- [ ] レスポンシブデザイン調整
- [ ] パフォーマンス最適化

### Phase 3 (低優先度)
- [ ] 高度なリッチテキスト機能
- [ ] ドラッグ&ドロップファイルアップロード
- [ ] オフライン対応
- [ ] 自動保存機能

---

**この設計書は、CareBase-staff個別ポイント編集機能の完全な仕様を定義し、開発チームの実装指針として活用されます。**