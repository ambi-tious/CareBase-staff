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
import { AlertCircle, Edit, Edit3, Plus, Trash2 } from 'lucide-react';
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
  initialCategories?: ContactScheduleCategory[];
}

export const ContactScheduleCategoryModal: React.FC<ContactScheduleCategoryModalProps> = ({
  isOpen,
  onClose,
  onCategoryChange,
  initialCategories = [],
}) => {
  const [categories, setCategories] = useState<ContactScheduleCategory[]>(() => {
    // システム標準カテゴリを初期化
    const systemCategories: ContactScheduleCategory[] = [
      { id: 'other', name: 'その他', isSystem: true, isUsed: true },
      { id: 'office-related', name: '事業所関連', isSystem: true, isUsed: false },
      { id: 'company-wide', name: '全社連絡', isSystem: true, isUsed: true },
      { id: 'resident-related', name: '利用者関連', isSystem: true, isUsed: false },
      { id: 'document-related', name: '書類関連', isSystem: true, isUsed: false },
      { id: 'confirmation-request', name: '確認依頼', isSystem: true, isUsed: false },
    ];

    // カスタムカテゴリを追加
    const customCategories = initialCategories.filter((cat) => !cat.isSystem);

    return [...systemCategories, ...customCategories];
  });

  const [isCreating, setIsCreating] = useState(false);
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
    setIsCreating(false);
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
    (category: ContactScheduleCategory) => {
      if (category.isSystem) {
        setError('システム標準カテゴリは削除できません');
        return;
      }

      if (category.isUsed) {
        setError('使用中のカテゴリは削除できません');
        return;
      }

      const updatedCategories = categories.filter((cat) => cat.id !== category.id);
      setCategories(updatedCategories);
      onCategoryChange(updatedCategories);
      setError(null);
    },
    [categories, onCategoryChange]
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

  const cancelCreate = useCallback(() => {
    setIsCreating(false);
    setNewCategoryName('');
    setError(null);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">カテゴリ管理</DialogTitle>
          <DialogDescription>
            連絡・予定で使用するカテゴリを管理します。システム標準カテゴリは参照のみ可能です。
          </DialogDescription>
        </DialogHeader>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Create New Category */}
        {isCreating ? (
          <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900">新規カテゴリ作成</h4>
            <FormField
              label="カテゴリ名"
              id="newCategoryName"
              value={newCategoryName}
              onChange={setNewCategoryName}
              placeholder="カテゴリ名を入力"
              required
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateCategory}
                size="sm"
                className="bg-carebase-blue hover:bg-carebase-blue-dark"
              >
                <Plus className="h-4 w-4 mr-1" />
                カテゴリを作成
              </Button>
              <Button variant="outline" onClick={cancelCreate} size="sm">
                キャンセル
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsCreating(true)} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            新規カテゴリ作成
          </Button>
        )}

        {/* Categories List */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">カテゴリ一覧</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg ${
                  category.isSystem ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{category.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {editingCategory?.id === category.id ? (
                    <div className="flex items-center gap-2">
                      <FormField
                        label=""
                        id="editCategoryName"
                        value={editCategoryName}
                        onChange={setEditCategoryName}
                        placeholder="カテゴリ名を入力"
                        className="w-32"
                      />
                      <Button
                        onClick={handleEditCategory}
                        size="sm"
                        className="bg-carebase-blue hover:bg-carebase-blue-dark"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        カテゴリを更新
                      </Button>
                      <Button variant="outline" onClick={cancelEdit} size="sm">
                        キャンセル
                      </Button>
                    </div>
                  ) : (
                    <>
                      {!category.isSystem && (
                        <Button
                          onClick={() => startEdit(category)}
                          variant="outline"
                          size="sm"
                          disabled={category.isUsed}
                        >
                          <Edit3 className="h-4 w-4" />
                          編集
                        </Button>
                      )}
                      {!category.isSystem && !category.isUsed && (
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
      </DialogContent>
    </Dialog>
  );
};
