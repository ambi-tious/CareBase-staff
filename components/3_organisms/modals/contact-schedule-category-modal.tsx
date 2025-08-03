'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Edit, Edit3, Plus, Settings, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

interface ContactScheduleCategory {
  id: string;
  name: string;
  isSystem: boolean;
  isUsed: boolean;
}

interface ContactScheduleCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryChange: (categories: ContactScheduleCategory[]) => void;
  onDeleteCategory?: (categoryId: string) => Promise<boolean>;
  initialCategories?: ContactScheduleCategory[];
}

export const ContactScheduleCategoryModal: React.FC<ContactScheduleCategoryModalProps> = ({
  isOpen,
  onClose,
  onCategoryChange,
  onDeleteCategory,
  initialCategories = [],
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [categories, setCategories] = useState<ContactScheduleCategory[]>(() => {
    const systemCategories: ContactScheduleCategory[] = [
      { id: 'other', name: 'その他', isSystem: true, isUsed: true },
      { id: 'office-related', name: '事業所関連', isSystem: true, isUsed: false },
      { id: 'company-wide', name: '全社連絡', isSystem: true, isUsed: true },
      { id: 'resident-related', name: '利用者関連', isSystem: true, isUsed: false },
      { id: 'document-related', name: '書類関連', isSystem: true, isUsed: false },
      { id: 'confirmation-request', name: '確認依頼', isSystem: true, isUsed: false },
    ];

    const customCategories = initialCategories.filter((cat) => !cat.isSystem);

    return [...systemCategories, ...customCategories];
  });

  const [editingCategory, setEditingCategory] = useState<ContactScheduleCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateCategory = useCallback(() => {
    if (!newCategoryName.trim()) {
      setError('カテゴリ名を入力してください');
      return;
    }

    if (categories.some((cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      setError('同じ名前のカテゴリが既に存在します');
      return;
    }

    const newCategory: ContactScheduleCategory = {
      id: `custom-${Date.now()}`,
      name: newCategoryName.trim(),
      isSystem: false,
      isUsed: false,
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    onCategoryChange(updatedCategories);
    setNewCategoryName('');
    setActiveTab('list');
    setError(null);
  }, [newCategoryName, categories, onCategoryChange]);

  const handleEditCategory = useCallback(() => {
    if (!editingCategory || !editCategoryName.trim()) {
      setError('カテゴリ名を入力してください');
      return;
    }

    if (
      categories.some(
        (cat) =>
          cat.id !== editingCategory.id &&
          cat.name.toLowerCase() === editCategoryName.trim().toLowerCase()
      )
    ) {
      setError('同じ名前のカテゴリが既に存在します');
      return;
    }

    const updatedCategories = categories.map((cat) =>
      cat.id === editingCategory.id ? { ...cat, name: editCategoryName.trim() } : cat
    );

    setCategories(updatedCategories);
    onCategoryChange(updatedCategories);
    setEditingCategory(null);
    setEditCategoryName('');
    setError(null);
  }, [editingCategory, editCategoryName, categories, onCategoryChange]);

  const handleDeleteCategory = useCallback(
    async (category: ContactScheduleCategory) => {
      if (category.isSystem) {
        setError('システム標準のカテゴリは削除できません。');
        return;
      }

      if (window.confirm(`「${category.name}」カテゴリを削除してもよろしいですか？`)) {
        try {
          let success = true;

          if (onDeleteCategory) {
            success = await onDeleteCategory(category.id);
          }

          if (success) {
            const updatedCategories = categories.filter((cat) => cat.id !== category.id);
            setCategories(updatedCategories);
            onCategoryChange(updatedCategories);
            setError(null);
          } else {
            setError('カテゴリの削除に失敗しました。');
          }
        } catch (error) {
          console.error('Category deletion error:', error);
          setError('ネットワークエラーが発生しました。');
        }
      }
    },
    [categories, onCategoryChange, onDeleteCategory]
  );

  const startEdit = useCallback((category: ContactScheduleCategory) => {
    if (category.isSystem) {
      setError('システム標準カテゴリは編集できません');
      return;
    }

    setEditingCategory(category);
    setEditCategoryName(category.name);
    setError(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingCategory(null);
    setEditCategoryName('');
    setError(null);
  }, []);

  const handleCreateNew = useCallback(() => {
    setNewCategoryName('');
    setError(null);
    setActiveTab('create');
  }, []);

  const systemCategories = categories.filter((cat) => cat.isSystem);
  const customCategories = categories.filter((cat) => !cat.isSystem);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            カテゴリ管理
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            連絡・予定で使用するカテゴリを管理します。システム標準カテゴリは参照のみ、新規作成したカテゴリのみ編集・削除が可能です。
          </DialogDescription>
        </DialogHeader>

        <div className="tablet:mt-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'list' | 'create')}
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  カテゴリ一覧
                </TabsTrigger>
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  カテゴリ作成
                </TabsTrigger>
              </TabsList>
            </div>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            <TabsContent value="list">
              <div className="space-y-6">
                {systemCategories.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">システム標準カテゴリ</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {systemCategories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{category.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customCategories.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">カスタムカテゴリ</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customCategories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            {editingCategory?.id === category.id ? (
                              <FormField
                                label=""
                                id="editCategoryName"
                                value={editCategoryName}
                                onChange={setEditCategoryName}
                                placeholder="カテゴリ名を入力"
                                className="w-32"
                              />
                            ) : (
                              <span className="text-base">{category.name}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {editingCategory?.id === category.id ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={handleEditCategory}
                                  size="sm"
                                  className="bg-carebase-blue hover:bg-carebase-blue-dark"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  更新
                                </Button>
                                <Button variant="outline" onClick={cancelEdit} size="sm">
                                  キャンセル
                                </Button>
                              </div>
                            ) : (
                              <>
                                <Button
                                  onClick={() => startEdit(category)}
                                  variant="outline"
                                  size="sm"
                                  disabled={category.isUsed}
                                >
                                  <Edit3 className="h-4 w-4" />
                                  編集
                                </Button>
                                {!category.isUsed && (
                                  <Button
                                    onClick={() => handleDeleteCategory(category)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    削除
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {customCategories.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <Plus className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      カスタムカテゴリがありません
                    </h3>
                    <p className="text-gray-500 mb-4">
                      新しいカテゴリを作成して、連絡・予定の分類を拡張しましょう。
                    </p>
                    <Button
                      onClick={handleCreateNew}
                      className="bg-carebase-blue hover:bg-carebase-blue-dark"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      最初のカテゴリを作成
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="create">
              {/* カテゴリ作成タブ */}
              <div className="space-y-6">
                <div className="max-w-ld">
                  <div className="space-y-4">
                    <FormField
                      label="カテゴリ名"
                      id="newCategoryName"
                      value={newCategoryName}
                      onChange={setNewCategoryName}
                      placeholder="カテゴリ名を入力"
                      required
                    />

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                      <Button type="button" variant="outline" onClick={() => setActiveTab('list')}>
                        キャンセル
                      </Button>

                      <Button
                        onClick={handleCreateCategory}
                        className="bg-carebase-blue hover:bg-carebase-blue-dark"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        カテゴリを作成
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
