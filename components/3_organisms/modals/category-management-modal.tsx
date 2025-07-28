'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import type { CategoryFormData, PointCategory } from '@/types/individual-point';
import { categoryFormSchema } from '@/types/individual-point';
import { AlertCircle, Edit3, FolderPlus, Palette, Plus, Settings, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: PointCategory[];
  onCreateCategory: (data: CategoryFormData) => Promise<boolean>;
  onUpdateCategory: (categoryId: string, data: CategoryFormData) => Promise<boolean>;
  onDeleteCategory: (categoryId: string) => Promise<boolean>;
}

const iconOptions = [
  { value: 'Utensils', label: '食事' },
  { value: 'Bath', label: '入浴' },
  { value: 'Pill', label: '服薬' },
  { value: 'Activity', label: 'バイタル' },
  { value: 'Dumbbell', label: '運動' },
  { value: 'MessageCircle', label: 'コミュニケーション' },
  { value: 'FileText', label: 'その他' },
  { value: 'Heart', label: 'ケア' },
  { value: 'Shield', label: '安全' },
  { value: 'Clock', label: '時間' },
];

const colorOptions = [
  { value: '#f97316', label: 'オレンジ', color: '#f97316' },
  { value: '#3b82f6', label: '青', color: '#3b82f6' },
  { value: '#8b5cf6', label: '紫', color: '#8b5cf6' },
  { value: '#ef4444', label: '赤', color: '#ef4444' },
  { value: '#10b981', label: '緑', color: '#10b981' },
  { value: '#f59e0b', label: '黄', color: '#f59e0b' },
  { value: '#6b7280', label: 'グレー', color: '#6b7280' },
  { value: '#ec4899', label: 'ピンク', color: '#ec4899' },
];

export const CategoryManagementModal: React.FC<CategoryManagementModalProps> = ({
  isOpen,
  onClose,
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: 'FileText',
    color: '#6b7280',
  });
  const [editingCategory, setEditingCategory] = useState<PointCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>(
    {}
  );

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab('list');
      resetForm();
    }
  }, [isOpen]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      icon: 'FileText',
      color: '#6b7280',
    });
    setEditingCategory(null);
    setError(null);
    setFieldErrors({});
  }, []);

  const validateForm = useCallback(() => {
    const result = categoryFormSchema.safeParse(formData);

    if (!result.success) {
      const newFieldErrors: Partial<Record<keyof CategoryFormData, string>> = {};

      for (const error of result.error.errors) {
        if (error.path.length > 0) {
          const field = error.path[0] as keyof CategoryFormData;
          newFieldErrors[field] = error.message;
        }
      }

      setFieldErrors(newFieldErrors);
      setError('入力内容に不備があります。必須項目を確認してください。');
      return false;
    }

    setFieldErrors({});
    setError(null);
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let success = false;

      if (editingCategory) {
        success = await onUpdateCategory(editingCategory.id, formData);
      } else {
        success = await onCreateCategory(formData);
      }

      if (success) {
        resetForm();
        setActiveTab('list');
      } else {
        setError(
          editingCategory ? 'カテゴリの更新に失敗しました。' : 'カテゴリの作成に失敗しました。'
        );
      }
    } catch (error) {
      console.error('Category form submission error:', error);
      setError('ネットワークエラーが発生しました。接続を確認してもう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingCategory, validateForm, onCreateCategory, onUpdateCategory, resetForm]);

  const handleEdit = useCallback((category: PointCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon,
      color: category.color,
    });
    setActiveTab('form');
  }, []);

  const handleDelete = useCallback(
    async (category: PointCategory) => {
      if (category.isSystemDefault) {
        setError('システム標準のカテゴリは削除できません。');
        return;
      }

      if (window.confirm(`「${category.name}」カテゴリを削除してもよろしいですか？`)) {
        setIsSubmitting(true);
        try {
          const success = await onDeleteCategory(category.id);
          if (!success) {
            setError('カテゴリの削除に失敗しました。');
          }
        } catch (error) {
          console.error('Category deletion error:', error);
          setError('ネットワークエラーが発生しました。');
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [onDeleteCategory]
  );

  const handleCreateNew = useCallback(() => {
    resetForm();
    setActiveTab('form');
  }, [resetForm]);

  const updateField = useCallback(
    (field: keyof CategoryFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error when user starts typing
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [fieldErrors]
  );

  const customCategories = categories.filter((cat) => !cat.isSystemDefault);
  const systemCategories = categories.filter((cat) => cat.isSystemDefault);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto tablet:max-w-[95vw] tablet:max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary tablet:text-tablet-xl">
            カテゴリ管理
          </DialogTitle>
          <DialogDescription className="text-gray-600 tablet:text-tablet-base tablet:mt-3">
            個別ポイントのカテゴリを管理します。システム標準のカテゴリは参照のみ、新規作成したカテゴリのみ編集・削除が可能です。
          </DialogDescription>
        </DialogHeader>

        <div className="tablet:mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  カテゴリ一覧
                </TabsTrigger>
                <TabsTrigger value="form" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {editingCategory ? 'カテゴリ編集' : 'カテゴリ作成'}
                </TabsTrigger>
              </TabsList>

              {activeTab === 'list' && (
                <Button
                  onClick={handleCreateNew}
                  className="bg-carebase-blue hover:bg-carebase-blue-dark"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  新規カテゴリ作成
                </Button>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="list" className="space-y-6">
              {/* Custom Categories */}
              {customCategories.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-carebase-text-primary mb-4">
                    カスタムカテゴリ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customCategories.map((category) => {
                      const Icon = getLucideIcon(category.icon);
                      return (
                        <Card key={category.id} className="border border-gray-200">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: category.color + '20' }}
                                >
                                  <Icon className="h-5 w-5" style={{ color: category.color }} />
                                </div>
                                <div>
                                  <CardTitle className="text-base">{category.name}</CardTitle>
                                  {category.description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      {category.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(category)}
                                  disabled={isSubmitting}
                                >
                                  <Edit3 className="h-3 w-3 mr-1" />
                                  編集
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(category)}
                                  disabled={isSubmitting}
                                  className="border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  削除
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* System Categories */}
              <div>
                <h3 className="text-lg font-semibold text-carebase-text-primary mb-4">
                  システム標準カテゴリ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systemCategories.map((category) => {
                    const Icon = getLucideIcon(category.icon);
                    return (
                      <Card key={category.id} className="border border-gray-200 bg-gray-50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: category.color + '20' }}
                            >
                              <Icon className="h-5 w-5" style={{ color: category.color }} />
                            </div>
                            <div>
                              <CardTitle className="text-base flex items-center gap-2">
                                {category.name}
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  システム標準
                                </span>
                              </CardTitle>
                              {category.description && (
                                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {customCategories.length === 0 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="text-center py-8">
                    <FolderPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      カスタムカテゴリがありません
                    </h3>
                    <p className="text-gray-500 mb-4">
                      新しいカテゴリを作成して、個別ポイントの分類を拡張しましょう。
                    </p>
                    <Button
                      onClick={handleCreateNew}
                      className="bg-carebase-blue hover:bg-carebase-blue-dark"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      最初のカテゴリを作成
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="form" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
                    基本情報
                  </h3>

                  <FormField
                    label="カテゴリ名"
                    id="name"
                    value={formData.name}
                    onChange={(value) => updateField('name', value)}
                    placeholder="例：リハビリテーション"
                    required
                    error={fieldErrors.name}
                    disabled={isSubmitting}
                  />

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">
                      説明
                    </label>
                    <textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="カテゴリの説明を入力してください"
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-carebase-blue focus:border-carebase-blue disabled:bg-gray-50 disabled:text-gray-500"
                      rows={3}
                    />
                    {fieldErrors.description && (
                      <p className="text-sm text-red-600" role="alert">
                        {fieldErrors.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - Visual Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
                    表示設定
                  </h3>

                  <FormSelect
                    label="アイコン"
                    id="icon"
                    value={formData.icon}
                    onChange={(value) => updateField('icon', value)}
                    options={iconOptions}
                    required
                    error={fieldErrors.icon}
                    disabled={isSubmitting}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      色 <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateField('color', option.value)}
                          disabled={isSubmitting}
                          className={`
                            h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                            ${
                              formData.color === option.value
                                ? 'border-carebase-blue-dark shadow-lg scale-105'
                                : 'border-gray-300 hover:border-gray-400'
                            }
                          `}
                          style={{ backgroundColor: option.color }}
                          title={option.label}
                        >
                          {formData.color === option.value && (
                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-current rounded-full" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {fieldErrors.color && (
                      <p className="text-sm text-red-600" role="alert">
                        {fieldErrors.color}
                      </p>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">プレビュー</label>
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: formData.color + '20' }}
                        >
                          {React.createElement(getLucideIcon(formData.icon), {
                            className: 'h-5 w-5',
                            style: { color: formData.color },
                          })}
                        </div>
                        <div>
                          <p className="font-medium">{formData.name || 'カテゴリ名'}</p>
                          {formData.description && (
                            <p className="text-sm text-gray-500">{formData.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('list')}
                  disabled={isSubmitting}
                >
                  キャンセル
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-carebase-blue hover:bg-carebase-blue-dark"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  {isSubmitting
                    ? '保存中...'
                    : editingCategory
                      ? 'カテゴリを更新'
                      : 'カテゴリを作成'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
