'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Edit, Trash2, AlertCircle } from 'lucide-react';
import type { Resident, IndividualPoint } from '@/mocks/care-board-data';
import { getLucideIcon } from '@/lib/lucide-icon-registry';

interface IndividualPointDetailPageProps {
  resident: Resident;
  category: string;
  individualPoint: IndividualPoint;
}

export const IndividualPointDetailPage: React.FC<IndividualPointDetailPageProps> = ({
  resident,
  category,
  individualPoint,
}) => {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    const initialContent = mockPointContents[category] || '';
    setContent(initialContent);
  }, [category]);

  const handleBack = () => {
    router.push(`/residents/${resident.id}`);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    // Reset content to original
    const originalContent = mockPointContents[category] || '';
    setContent(originalContent);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In production, this would call an API to save the content
      // await individualPointService.updateContent(resident.id, category, content);
      
      setIsEditing(false);
      
      // Update mock data
      mockPointContents[category] = content;
      
    } catch (error) {
      console.error('Failed to save content:', error);
      setError('保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In production, this would call an API to delete the content
      // await individualPointService.deleteContent(resident.id, category);
      
      // Clear content
      setContent('');
      setShowDeleteConfirm(false);
      
      // Update mock data
      delete mockPointContents[category];
      
    } catch (error) {
      console.error('Failed to delete content:', error);
      setError('削除に失敗しました。もう一度お試しください。');
    } finally {
      setIsDeleting(false);
    }
  };

  const hasContent = content.trim().length > 0;

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
            disabled={isSaving || isDeleting}
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-carebase-blue-light">
              <Icon className="h-5 w-5 text-carebase-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-carebase-text-primary">{category}の詳細</h1>
              <p className="text-gray-600">{resident.name}様の個別ポイント</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Delete Confirmation Alert */}
      {showDeleteConfirm && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            本当にこの個別ポイント詳細情報を削除しますか？この操作は元に戻せません。
          </AlertDescription>
          <div className="flex gap-2 mt-4">
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting}
              size="sm"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {isDeleting ? '削除中...' : '削除'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              size="sm"
            >
              キャンセル
            </Button>
          </div>
        </Alert>
      )}

      {/* Main Content */}
      <Card className="max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-carebase-blue" />
              {category}の詳細情報
            </CardTitle>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    size="sm"
                  >
                    キャンセル
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-carebase-blue hover:bg-carebase-blue-dark"
                    size="sm"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {isSaving ? '保存中...' : '保存'}
                  </Button>
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
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  詳細内容
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`${category}に関する詳細情報を入力してください...`}
                  className="w-full h-96 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-carebase-blue focus:border-carebase-blue resize-none"
                  disabled={isSaving}
                />
              </div>
              <p className="text-xs text-gray-500">
                改行は自動的に反映されます。詳細な情報を記録してください。
              </p>
            </div>
          ) : (
            <div className="min-h-96">
              {hasContent ? (
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                  {content}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <div className="text-center">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">詳細情報がありません</p>
                    <p className="text-sm">
                      「編集」ボタンをクリックして{category}に関する詳細情報を追加してください。
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