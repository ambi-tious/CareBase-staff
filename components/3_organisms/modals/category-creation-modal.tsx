'use client';

import { useState } from 'react';
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
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { IconName } from '@/lib/lucide-icon-registry';

interface CategoryCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { category: string; icon: IconName }) => Promise<void>;
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

export const CategoryCreationModal: React.FC<CategoryCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState<IconName>('FileText');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setCategory('');
      setIcon('FileText');
      onClose();
    } catch (error) {
      console.error('Failed to create category:', error);
      setError('カテゴリの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            個別ポイントカテゴリの追加
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            新しい個別ポイントのカテゴリを作成します。
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">カテゴリ名 <span className="text-red-500">*</span></Label>
            <Input
              id="category-name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="例: 食事、入浴、服薬など"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-icon">アイコン <span className="text-red-500">*</span></Label>
            <Select
              value={icon}
              onValueChange={(value) => setIcon(value as IconName)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="category-icon">
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

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              {isSubmitting ? '作成中...' : '作成'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};