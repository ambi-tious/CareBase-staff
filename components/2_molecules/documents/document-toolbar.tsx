'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Filter,
  FolderPlus,
  Grid3X3,
  List,
  Search,
  Shield,
  SortAsc,
  Upload,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface DocumentToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onCreateFolder: () => void;
  onUploadFile: () => void;
  className?: string;
}

export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onCreateFolder,
  onUploadFile,
  className = '',
}) => {
  // 認証状態のモック（実際のアプリケーションでは認証サービスから取得）
  const isAuthenticated = true;
  const hasCreatePermission = true;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Top row - Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/documents/edit">
            <Button className="bg-carebase-blue hover:bg-carebase-blue-dark">
              <FileText className="h-4 w-4 mr-2" />
              新規書類
            </Button>
          </Link>
          <Button
            onClick={onCreateFolder}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
            disabled={!isAuthenticated || !hasCreatePermission}
            title={
              !isAuthenticated
                ? 'ログインが必要です'
                : !hasCreatePermission
                  ? '権限がありません'
                  : '新しいフォルダを作成'
            }
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            新しいフォルダ
          </Button>
          <Button
            variant="outline"
            onClick={onUploadFile}
            className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
            disabled={!isAuthenticated || !hasCreatePermission}
            title={
              !isAuthenticated
                ? 'ログインが必要です'
                : !hasCreatePermission
                  ? '権限がありません'
                  : 'ファイルをアップロード'
            }
          >
            <Upload className="h-4 w-4 mr-2" />
            ファイルをアップロード
          </Button>
          {!isAuthenticated && (
            <div className="ml-2 flex items-center text-sm text-amber-600">
              <Shield className="h-4 w-4 mr-1" />
              ログインが必要です
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={viewMode === 'grid' ? 'bg-gray-100' : ''}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={viewMode === 'list' ? 'bg-gray-100' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom row - Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ファイルやフォルダを検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48">
            <SortAsc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">名前順</SelectItem>
            <SelectItem value="date">更新日順</SelectItem>
            <SelectItem value="size">サイズ順</SelectItem>
            <SelectItem value="type">種類順</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          フィルター
        </Button>
      </div>
    </div>
  );
};
