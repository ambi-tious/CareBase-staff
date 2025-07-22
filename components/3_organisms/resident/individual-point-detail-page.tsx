'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import type { IndividualPoint, Resident } from '@/mocks/care-board-data';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $getRoot } from 'lexical';
import { AlertCircle, ArrowLeft, Edit, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface IndividualPointDetailPageProps {
  resident: Resident;
  category: string;
  individualPoint: IndividualPoint;
  isNewCreation?: boolean;
}

export const IndividualPointDetailPage: React.FC<IndividualPointDetailPageProps> = ({
  resident,
  category,
  individualPoint,
  isNewCreation = false,
}) => {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(isNewCreation);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeletedAlert, setShowDeletedAlert] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // カテゴリ編集用state
  const [isCategoryEditing, setIsCategoryEditing] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState(individualPoint.category);
  const [editIcon, setEditIcon] = useState(individualPoint.icon);
  const [editError, setEditError] = useState('');

  // カテゴリ編集モーダル用state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(individualPoint.category);
  const [categoryError, setCategoryError] = useState('');

  // アイコン選択肢例
  const iconOptions = [
    { value: 'Activity', label: '活動' },
    { value: 'Users', label: '接遇' },
    { value: 'Bath', label: '入浴' },
    { value: 'Utensils', label: '食事' },
    { value: 'Pill', label: '服薬' },
    { value: 'Tooth', label: '口腔ケア' },
    { value: 'Eye', label: '点眼' },
    { value: 'GlassWater', label: '飲水' },
    { value: 'ExcretionIcon', label: '排泄' },
    { value: 'FileText', label: 'その他' },
  ];

  // カテゴリ保存処理
  const handleCategorySave = async () => {
    setEditError('');
    if (!editCategoryName.trim()) {
      setEditError('カテゴリ名は必須です');
      return;
    }
    if (!editIcon) {
      setEditError('アイコンを選択してください');
      return;
    }
    // TODO: API連携や重複チェック
    // await api.updateCategory({ id: individualPoint.id, category: editCategoryName, icon: editIcon });
    setIsCategoryEditing(false);
    // stateを更新
    individualPoint.category = editCategoryName;
    individualPoint.icon = editIcon;
  };

  // キャンセル処理
  const handleCategoryCancel = () => {
    setEditCategoryName(individualPoint.category);
    setEditIcon(individualPoint.icon);
    setEditError('');
    setIsCategoryEditing(false);
  };

  const Icon = getLucideIcon(individualPoint.icon);

  // Mock content data - in production this would come from API
  const mockPointContents: Record<string, string> = {
    食事: `食事に関する個別ポイント

朝食：全粥・常菜・常食
昼食：全粥・常菜・常食
夕食：全粥・常菜・常食

• 嚥下機能は良好
• 自力摂取可能
• 食事の際は前かがみの姿勢を保持
• 水分とろみ剤使用（中間のとろみ）`,
    移乗介助: `移乗介助に関する個別ポイント

基本的に見守りで自立
疲労時は一部介助が必要

• ベッドから車椅子への移乗は見守り
• 立ち上がり時にふらつきあり
• 手すりを使用して安全に移乗`,
    服薬: `服薬に関する個別ポイント

自己管理は難しいため、職員管理
薬は粉砕して提供
水分はとろみをつけて提供

• 朝食後、夕食後の2回服薬
• 血圧薬は継続服用中
• 副作用の確認を定期的に実施`,
    接遇: `接遇に関する個別ポイント

耳が遠いため、大きな声でゆっくり話す
目線を合わせて話しかける

• 右耳の聞こえが特に悪い
• 筆談も併用することがある
• 笑顔での対応を心がける`,
    入浴: `入浴に関する個別ポイント

一般浴槽使用
洗身は部分介助
洗髪は全介助
浴室内は見守り

• 週2回の入浴
• 皮膚の状態を確認
• 転倒リスクに注意`,
  };

  // Load content on component mount
  useEffect(() => {
    const initialContent = isNewCreation ? '' : mockPointContents[category] || '';
    setContent(initialContent);
    setOriginalContent(initialContent);
  }, [category]);

  // Handle beforeunload event to warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '編集中の内容が保存されていません。ページを離れてもよろしいですか？';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        isNewCreation
          ? '入力中の内容が保存されていません。ページを離れてもよろしいですか？'
          : '編集中の内容が保存されていません。ページを離れてもよろしいですか？'
      );
      if (!confirmLeave) {
        return;
      }
    }
    router.push(`/residents/${resident.id}?tab=points`);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setHasUnsavedChanges(false);
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm(
        isNewCreation
          ? '入力中の内容が保存されていません。入力を破棄してもよろしいですか？'
          : '編集中の内容が保存されていません。編集を破棄してもよろしいですか？'
      );
      if (!confirmCancel) {
        return;
      }
    }

    setIsEditing(false);
    setError(null);
    setValidationError(null);
    setHasUnsavedChanges(false);

    if (isNewCreation) {
      // 新規作成の場合は個別ポイントタブに戻る
      router.push(`/residents/${resident.id}?tab=points`);
    } else {
      const originalContent = mockPointContents[category] || '';
      setContent(originalContent);
    }
  };

  const handleSave = async () => {
    // バリデーション: 必須入力チェック
    if (!content.trim()) {
      setValidationError('詳細情報は必須入力です。内容を入力してください。');
      return;
    }

    setIsSaving(true);
    setError(null);
    setValidationError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production, this would call an API to save the content
      // await individualPointService.updateContent(resident.id, category, content);

      // Update mock data
      mockPointContents[category] = content;

      setHasUnsavedChanges(false);
      setOriginalContent(content);

      if (isNewCreation) {
        // 新規作成の場合は詳細画面に遷移
        router.push(`/residents/${resident.id}/individual-points/${encodeURIComponent(category)}`);
      } else {
        // 編集の場合は編集モードを終了
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      setError('保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm(
        '入力中の内容が保存されていません。入力を破棄してもよろしいですか？'
      );
      if (!confirmCancel) {
        return;
      }
    }
    router.push(`/residents/${resident.id}?tab=points`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In production, this would call an API to delete the content
      // await individualPointService.deleteContent(resident.id, category);
      setContent('');
      setShowDeleteConfirm(false);
      delete mockPointContents[category];
      setHasUnsavedChanges(false);
      setOriginalContent('');
      setShowDeletedAlert(true);
      router.push(`/residents/${resident.id}?tab=points`);
    } catch (error) {
      console.error('Failed to delete content:', error);
      setError('削除に失敗しました。もう一度お試しください。');
    } finally {
      setIsDeleting(false);
    }
  };

  const hasContent = content.trim().length > 0;

  // Lexicalエディタの初期設定
  const lexicalConfig = {
    namespace: 'IndividualPointEditor',
    theme: {
      paragraph: 'mb-2',
    },
    onError(error: Error) {
      console.error(error);
    },
  };

  // Lexicalエディタの内容をstateに反映
  const handleLexicalChange = (editorState: any) => {
    editorState.read(() => {
      const html = $getRoot().getTextContent();
      setContent(html);
      setHasUnsavedChanges(html !== originalContent);
    });
  };

  // Lexical用のエラーバウンダリ
  function LexicalErrorBoundary(props: any) {
    return <div className="p-2 text-red-600 bg-red-50">エディタでエラーが発生しました</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* タイトル・利用者名を左寄せ */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-carebase-blue-light">
              <Icon className="h-5 w-5 text-carebase-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-carebase-text-primary">
                {isNewCreation ? `${category}の新規作成` : `${category}の詳細`}
              </h1>
              <p className="text-gray-600">
                {resident.name}様の個別ポイント
                {isNewCreation && ' - 新規作成'}
              </p>
            </div>
          </div>
          {/* 右端にカテゴリの編集ボタンと戻るボタンを並べる */}
          <div className="flex items-center gap-2">
            {!isNewCreation && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsCategoryEditing(true)}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                カテゴリの編集
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
              disabled={isSaving || isDeleting}
            >
              <ArrowLeft className="h-4 w-4" />
              戻る
            </Button>
          </div>
        </div>
      </div>

      {/* --- カテゴリ編集モーダル --- */}
      <Dialog open={isCategoryEditing} onOpenChange={setIsCategoryEditing}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>カテゴリの編集</DialogTitle>
            <DialogDescription>カテゴリ名を編集してください。</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!categoryName.trim()) {
                setCategoryError('カテゴリ名は必須です');
                return;
              }
              // TODO: 保存処理（API連携やstate更新）
              individualPoint.category = categoryName;
              setIsCategoryEditing(false);
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="categoryName">カテゴリ名</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  setCategoryError('');
                }}
                required
                aria-required="true"
                className="w-full"
              />
              {categoryError && <div className="text-red-600 text-sm mt-1">{categoryError}</div>}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCategoryEditing(false)}>
                キャンセル
              </Button>
              <Button type="submit" className="bg-carebase-blue text-white">
                登録
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Validation Error Alert */}
      {validationError && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{validationError}</AlertDescription>
        </Alert>
      )}

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            編集中の内容が保存されていません。変更を保存するか、編集をキャンセルしてください。
          </AlertDescription>
        </Alert>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
              <span className="text-lg font-semibold text-red-700">削除の確認</span>
            </div>
            <div className="mb-6 text-gray-700">
              本当にこの個別ポイント詳細情報（{category}）を削除しますか？この操作は元に戻せません。
            </div>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                キャンセル
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? '削除中...' : '削除'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Card className="max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  {!isNewCreation && (
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      size="sm"
                    >
                      キャンセル
                    </Button>
                  )}
                  {!isNewCreation && (
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-carebase-blue hover:bg-carebase-blue-dark"
                      size="sm"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      {isSaving ? '登録中...' : '登録'}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
                    size="sm"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    編集
                  </Button>
                  {hasContent && (
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isDeleting}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      size="sm"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      削除
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              {isNewCreation && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <p className="text-sm font-medium">
                      {category}に関する詳細情報を入力してください（必須）
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    この情報は利用者様のケアに重要な参考情報として活用されます。
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <span className="text-base font-semibold text-gray-800">
                    詳細内容 <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
                  <LexicalComposer initialConfig={lexicalConfig}>
                    <RichTextPlugin
                      contentEditable={
                        <ContentEditable className="min-h-[400px] p-4 outline-none" />
                      }
                      placeholder={
                        <div className="p-4 text-gray-400 text-sm">
                          {!isNewCreation && `${category}に関する詳細情報を入力してください`}
                        </div>
                      }
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <OnChangePlugin onChange={handleLexicalChange} />
                  </LexicalComposer>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {hasUnsavedChanges && (
                  <p className="text-xs text-yellow-600 font-medium">未保存の変更があります</p>
                )}
              </div>
              {/* 新規作成時の登録ボタンをカード内右下に配置（位置は変更なし） */}
              {isNewCreation && (
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-carebase-blue hover:bg-carebase-blue-dark"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? '登録中...' : '登録'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="min-h-96">
              {hasContent && !isNewCreation ? (
                <div
                  className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <div className="text-center">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">詳細情報がありません</p>
                    <p className="text-sm">
                      {isNewCreation
                        ? `編集モードで${category}に関する詳細情報を入力してください。`
                        : `「編集」ボタンをクリックして${category}に関する詳細情報を追加してください。`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
