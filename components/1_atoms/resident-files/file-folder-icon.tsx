'use client';

import { Button } from '@/components/ui/button';
import { Folder } from 'lucide-react';
import type React from 'react';

interface FileFolderIconProps {
  onClick: () => void;
  fileCount?: number;
  className?: string;
}

export const FileFolderIcon: React.FC<FileFolderIconProps> = ({
  onClick,
  fileCount = 0,
  className = '',
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`relative p-2 h-auto hover:bg-blue-50 hover:text-blue-600 transition-colors ${className}`}
      title={`ファイルを表示 (${fileCount}件)`}
    >
      <Folder className="h-5 w-5" />
      {fileCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] font-medium">
          {fileCount > 99 ? '99+' : fileCount}
        </span>
      )}
    </Button>
  );
};
