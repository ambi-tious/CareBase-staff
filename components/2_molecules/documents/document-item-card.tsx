'use client';

import type React from 'react';
import type { DocumentItem } from '@/mocks/documents-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, MoreVertical, Download, Edit, Trash2 } from 'lucide-react';
import { FileIcon } from '@/components/1_atoms/documents/file-icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentItemCardProps {
  item: DocumentItem;
  onItemClick?: (item: DocumentItem) => void;
  className?: string;
}

export const DocumentItemCard: React.FC<DocumentItemCardProps> = ({
  item,
  onItemClick,
  className = '',
}) => {
  const handleCardClick = () => {
    onItemClick?.(item);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${className}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-1">
              {item.type === 'folder' ? (
                <Folder className="h-8 w-8 text-blue-500" />
              ) : (
                <FileIcon fileType={item.fileType} className="h-8 w-8" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-gray-900 truncate mb-1">{item.name}</h3>
              <div className="text-xs text-gray-500 space-y-1">
                {item.type === 'folder' ? (
                  <p>{item.itemCount} 個のアイテム</p>
                ) : (
                  <>
                    <p>{item.size}</p>
                    <p>作成者: {item.createdBy}</p>
                  </>
                )}
                <p>更新日: {new Date(item.updatedAt).toLocaleDateString('ja-JP')}</p>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleMenuClick}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {item.type === 'file' && (
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  ダウンロード
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                名前を変更
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};