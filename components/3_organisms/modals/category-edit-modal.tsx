import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { IconName } from '@/lib/lucide-icon-registry';

interface Category {
  id: string;
  category: string;
  icon: IconName;
  count?: number;
  isActive?: boolean;
}

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onUpdate: (updated: Category) => void;
  onDelete: (id: string) => void;
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

export const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  isOpen,
  onClose,
  categories,
  onUpdate,
  onDelete,
}) => {
  // 3フォームの状態
  const [selectedId, setSelectedId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [icon, setIcon] = useState<IconName | ''>('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedId('');
      setCategoryName('');
      setIcon('');
      setDeleteConfirm(false);
      setError('');
    }
  }, [isOpen]);

  // カテゴリ選択時やcategoriesが変化したときにカテゴリ名・アイコンをセット
  React.useEffect(() => {
    if (selectedId) {
      const cat = categories.find((c) => c.id === selectedId);
      if (cat) {
        setCategoryName(cat.category);
        setIcon(cat.icon);
      }
    } else {
      setCategoryName('');
      setIcon('');
    }
  }, [selectedId, categories]);

  const handleSave = () => {
    setError('');
    if (!selectedId || !categoryName.trim() || !icon) {
      setError('すべての項目を入力してください');
      return;
    }
    onUpdate({ ...categories.find((c) => c.id === selectedId)!, category: categoryName, icon });
    onClose(); // 保存後にモーダルを閉じる
  };
  const handleDelete = () => {
    if (!selectedId) return;
    onDelete(selectedId);
    setSelectedId('');
    setCategoryName('');
    setIcon('');
    setDeleteConfirm(false);
    onClose(); // 削除後にモーダルを閉じる
  };

  const isSaveDisabled = !selectedId || !categoryName.trim() || !icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            カテゴリの編集
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            カテゴリを選択・編集してください。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {selectedId && deleteConfirm && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4">
              本当にこのカテゴリを削除しますか？この操作は元に戻せません。
            </div>
          )}
          <div>
            <Label>
              カテゴリ選択 <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 && (
                  <SelectItem value="" disabled>
                    カテゴリがありません
                  </SelectItem>
                )}
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>
              カテゴリ名 <span className="text-red-500">*</span>
            </Label>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="カテゴリ名を入力"
              disabled={!selectedId}
            />
          </div>
          <div>
            <Label>
              アイコン名 <span className="text-red-500">*</span>
            </Label>
            <Select
              value={icon}
              onValueChange={(v) => setIcon(v as IconName)}
              disabled={!selectedId}
            >
              <SelectTrigger>
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
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {selectedId &&
            (deleteConfirm ? (
              <div className="flex gap-2 pt-2">
                <Button variant="destructive" onClick={handleDelete}>
                  削除
                </Button>
                <Button type="button" variant="outline" onClick={() => setDeleteConfirm(false)}>
                  キャンセル
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="text-carebase-blue border-carebase-blue"
                  onClick={handleSave}
                  disabled={isSaveDisabled}
                >
                  登録
                </Button>
                <Button variant="destructive" onClick={() => setDeleteConfirm(true)}>
                  削除
                </Button>
              </div>
            ))}
        </div>
        <div className="flex justify-end pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
