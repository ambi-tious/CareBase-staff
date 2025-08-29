'use client';

import { FileCategoryBadge } from '@/components/1_atoms/resident-files/file-category-badge';
import { FileThumbnail } from '@/components/1_atoms/resident-files/file-thumbnail';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ResidentFile, ResidentFileCategory } from '@/types/resident-file';
import { fileCategoryOptions } from '@/types/resident-file';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, File, Search, User } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';

interface ResidentFilesQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  residentId: string;
  residentName: string;
  files: ResidentFile[];
  onFileView?: (file: ResidentFile) => void;
}

export const ResidentFilesQuickViewModal: React.FC<ResidentFilesQuickViewModalProps> = ({
  isOpen,
  onClose,
  residentId,
  residentName,
  files,
  onFileView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResidentFileCategory | 'all'>('all');

  // Filter files based on search and category
  const filteredFiles = useMemo(() => {
    let filtered = files;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (file) =>
          file.originalFileName.toLowerCase().includes(query) ||
          file.description?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((file) => file.category === selectedCategory);
    }

    // Sort by upload date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }, [files, searchQuery, selectedCategory]);

  // Group files by category for stats
  const fileStats = useMemo(() => {
    const stats = fileCategoryOptions.reduce(
      (acc, category) => {
        acc[category.value] = files.filter((file) => file.category === category.value).length;
        return acc;
      },
      {} as Record<ResidentFileCategory, number>
    );
    return stats;
  }, [files]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy/MM/dd', { locale: ja });
  };

  const handleFileClick = (file: ResidentFile) => {
    if (onFileView) {
      onFileView(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">
                {residentName}さんのファイル
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">全{files.length}件のファイル</p>
            </div>
            <div className="flex items-center gap-2"></div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ファイル名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as ResidentFileCategory | 'all')}
          >
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-4">
              <TabsTrigger value="all" className="text-xs">
                すべて ({files.length})
              </TabsTrigger>
              {fileCategoryOptions.map((category) => (
                <TabsTrigger key={category.value} value={category.value} className="text-xs">
                  {category.label} ({fileStats[category.value]})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-0">
              <ScrollArea className="h-[400px]">
                {filteredFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <File className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchQuery ? '該当するファイルがありません' : 'ファイルがありません'}
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery
                        ? '検索条件を変更してください'
                        : 'ファイルをアップロードしてください'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleFileClick(file)}
                      >
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          <FileThumbnail file={file} size="sm" />
                        </div>

                        {/* File info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FileCategoryBadge category={file.category} />
                          </div>

                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {file.originalFileName}
                            </h4>
                          </div>

                          {file.description && (
                            <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                              {file.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <File className="h-3 w-3" />
                              <span>{formatFileSize(file.fileSize)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{file.uploadedByName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(file.uploadedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
