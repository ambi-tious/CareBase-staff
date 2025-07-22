'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface DocumentHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  createdAt: Date;
  updatedAt: Date;
  className?: string;
  disabled?: boolean;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  title,
  onTitleChange,
  createdAt,
  updatedAt,
  className,
  disabled = false,
}) => {
  const [isTitleEmpty, setIsTitleEmpty] = useState(false);

  useEffect(() => {
    setIsTitleEmpty(!title.trim());
  }, [title]);

  const formatDate = (date: Date) => {
    return format(date, 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  return (
    <div className={cn('space-y-2 pb-4', className)}>
      <div>
        <Label htmlFor="document-title" className="text-sm font-medium">
          文書タイトル <span className="text-red-500">*</span>
        </Label>
        <Input
          id="document-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="文書タイトルを入力してください"
          className={cn(
            'text-lg font-semibold',
            isTitleEmpty && 'border-red-300 focus:ring-red-500'
          )}
          disabled={disabled}
        />
        {isTitleEmpty && <p className="text-sm text-red-500 mt-1">タイトルは必須項目です</p>}
      </div>
      <div className="flex flex-wrap justify-between text-xs text-muted-foreground">
        <span>作成日時: {formatDate(createdAt)}</span>
        <span>最終更新: {formatDate(updatedAt)}</span>
      </div>
    </div>
  );
};
