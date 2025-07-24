'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { category: string; icon: string }) => Promise<void>;
  currentCategory: string;
  currentIcon: string;
  title: string;
  description: string;
  submitLabel: string;
}

export const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentCategory,
  currentIcon,
  title,
  description,
  submitLabel,
}) => {
  const [category, setCategory] = useState(currentCategory);
  const [icon, setIcon] = useState(currentIcon);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useState(() => {
    if (isOpen) {
      setCategory(currentCategory);
      setIcon(currentIcon);
      setError(null);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.trim()) {
      setError('カテゴリ名を入力してください');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({ category, icon });
      onClose();
    } catch (error) {
      console.error('Failed to update category:', error);
      setError('カテゴリの更新に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">{description}</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">
              カテゴリ名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="category-name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="例: 食事、入浴、服薬など"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-icon">
              アイコン名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="category-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="例: Utensils, Bath, Pillなど"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              {isSubmitting ? '更新中...' : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
