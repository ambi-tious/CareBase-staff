'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, Edit, Trash2, Save, X, Plus, Check } from 'lucide-react';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import type { IconName } from '@/lib/lucide-icon-registry';
import React from 'react';

export interface CategoryItem {
  id: string;
  category: string;
  icon: IconName;
  count?: number;
  isActive?: boolean;
}

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onAddCategory: (data: { category: string; icon: IconName }) => Promise<void>;
  onUpdateCategory: (id: string, data: { category: string; icon: IconName }) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const iconOptions: { value: IconName; label: string }[] = [
  { value: 'Utensils', label: '食事' },
  { value: 'Bath', label: '入浴' },
  { value: 'Pill', label: '服薬' },
  { value: 'Tooth', label: '口腔ケア' },
  { value: 'Eye', label: '点眼' },
  { value: 'GlassWater', label: '飲水' },
  { value: 'ExcretionIcon', label: '排泄' },
  { value: 'Activity', label: '活動' },
  { value: 'Users', label: '接遇' },
  { value: 'FileText', label: 'その他' },
];

export const CategoryManagementModal: React.FC<CategoryManagementModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [localCategories, setLocalCategories] = useState<CategoryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newIcon, setNewIcon] = useState<IconName>('FileText');
  const [editCategory, setEditCategory] = useState('');
  const [editIcon, setEditIcon] = useState<IconName>('FileText');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Initialize local categories when modal opens or categories change
  useEffect(() => {
    if (isOpen) {
      setLocalCategories([...categories]);
      resetForm();
    }
  }, [isOpen, categories]);

  const resetForm = () => {
    setNewCategory('');
    setNewIcon('FileText');
    setEditCategory('');
    setEditIcon('FileText');
    setEditingId(null);
    setDeleteConfirmId(null);
    setError(null);
    setIsSubmitting(false);
  };

  const handleStartEdit = (category: CategoryItem) => {
    setEditingId(category.id);
    setEditCategory(category.category);
    setEditIcon(category.icon);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditCategory('');
    setEditIcon('FileText');
  };

  const validateCategoryName = (name: string, currentId?: string): boolean => {
    if (!name.trim()) {
      setError('カテゴリ名を入力してください');
      return false;
    }

    // Check for duplicates, excluding the current category being edited
    const isDuplicate = localCategories.some(
      (cat) => cat.category.toLowerCase() === name.toLowerCase() && cat.id !== currentId
    );

    if (isDuplicate) {
      setError('同じ名前のカテゴリが既に存在します');
      return false;
    }

    return true;
  };

  const handleAddSubmit = async () => {
    if (!validateCategoryName(newCategory)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onAddCategory({ category: newCategory, icon: newIcon });

      // Optimistically update local state
      const newId = `temp_${Date.now()}`;
      setLocalCategories((prev) => [
        ...prev,
        { id: newId, category: newCategory, icon: newIcon, isActive: true, count: 0 },
      ]);

      setNewCategory('');
      setNewIcon('FileText');
    } catch (error) {
      console.error('Failed to add category:', error);
      setError('カテゴリの追加に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (id: string) => {
    if (!validateCategoryName(editCategory, id)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onUpdateCategory(id, { category: editCategory, icon: editIcon });

      // Optimistically update local state
      setLocalCategories((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, category: editCategory, icon: editIcon } : cat
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error('Failed to update category:', error);
      setError('カテゴリの更新に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onDeleteCategory(id);

      // Optimistically update local state
      setLocalCategories((prev) => prev.filter((cat) => cat.id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
      setError('カテゴリの削除に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            個別ポイントカテゴリの管理
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            カテゴリの追加、編集、削除ができます。
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Add new category form */}
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-md font-semibold mb-3">新規カテゴリの追加</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="new-category-name">
                カテゴリ名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="new-category-name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="例: 食事、入浴、服薬など"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-category-icon">
                アイコン <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newIcon}
                onValueChange={(value) => setNewIcon(value as IconName)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="new-category-icon">
                  <SelectValue placeholder="アイコンを選択" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleAddSubmit}
              disabled={isSubmitting || !newCategory.trim()}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              <Plus className="h-4 w-4 mr-1" />
              追加
            </Button>
          </div>
        </div>

        {/* Categories list */}
        <div>
          <h3 className="text-md font-semibold mb-3">カテゴリ一覧</h3>
          {localCategories.length === 0 ? (
            <p className="text-center py-4 text-gray-500">カテゴリがありません。</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>アイコン</TableHead>
                  <TableHead>カテゴリ名</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {editingId === category.id ? (
                        <Select
                          value={editIcon}
                          onValueChange={(value) => setEditIcon(value as IconName)}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center">
                          {React.createElement(getLucideIcon(category.icon), {
                            className: 'h-5 w-5 text-carebase-blue',
                          })}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === category.id ? (
                        <Input
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          disabled={isSubmitting}
                        />
                      ) : (
                        category.category
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {deleteConfirmId === category.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm text-red-600 mr-2">削除しますか？</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirmId(null)}
                            disabled={isSubmitting}
                          >
                            <X className="h-3 w-3 mr-1" />
                            キャンセル
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            disabled={isSubmitting}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            削除
                          </Button>
                        </div>
                      ) : editingId === category.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={isSubmitting}
                          >
                            <X className="h-3 w-3 mr-1" />
                            キャンセル
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUpdateSubmit(category.id)}
                            disabled={isSubmitting || !editCategory.trim()}
                            className="bg-carebase-blue hover:bg-carebase-blue-dark"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            保存
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartEdit(category)}
                            disabled={isSubmitting}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            編集
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirmId(category.id)}
                            disabled={isSubmitting}
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            削除
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
