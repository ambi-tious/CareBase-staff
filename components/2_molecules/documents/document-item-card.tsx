'use client';

import { FileIcon } from '@/components/1_atoms/documents/file-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DocumentItem } from '@/mocks/documents-data';
import { Download, Edit, Folder, FolderEdit, FolderOpen, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface DocumentItemCardProps {
  item: DocumentItem;
  onItemClick?: (item: DocumentItem) => void;
  onEditFolder?: (folder: DocumentItem) => void;
  onDeleteFolder?: (folder: DocumentItem) => void;
  className?: string;
}

export const DocumentItemCard: React.FC<DocumentItemCardProps> = ({
  item,
  onItemClick,
  onEditFolder,
  onDeleteFolder,
  className = '',
}) => {
  const handleCardClick = () => {
    onItemClick?.(item);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleEditFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'folder' && onEditFolder) {
      onEditFolder(item);
    }
  };

  const handleDeleteFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'folder' && onDeleteFolder) {
      onDeleteFolder(item);
    }
  };

  // 書類の場合は詳細画面へのリンクを生成
  const getItemLink = () => {
    if (item.type === 'file') {
      return `/documents/view/${item.id}`;
    } else if (item.type === 'folder') {
      return `/documents?folder=${item.id}`;
    }
    return '#'; // フォルダの場合は現在のページにとどまる
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
              <h3 className="font-medium text-sm text-gray-900 truncate mb-1">
                {item.type === 'file' ? (
                  <Link
                    href={getItemLink()}
                    className="hover:text-carebase-blue hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <Link
                    href={getItemLink()}
                    className="hover:text-carebase-blue hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.name}
                  </Link>
                )}
              </h3>
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
                <>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    ダウンロード
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/documents/edit/${item.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      編集
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              {item.type === 'folder' ? (
                <>
                  <DropdownMenuItem onClick={handleEditFolder}>
                    <FolderEdit className="h-4 w-4 mr-2" />
                    名前を変更
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/documents/${item.id}`}>
                      <FolderOpen className="h-4 w-4 mr-2" />
                      開く
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteFolder} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    名前を変更
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
