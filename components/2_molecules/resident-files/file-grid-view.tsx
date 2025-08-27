'use client';

import { FileCategoryBadge } from '@/components/1_atoms/resident-files/file-category-badge';
import { FileThumbnail } from '@/components/1_atoms/resident-files/file-thumbnail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ResidentFile } from '@/types/resident-file';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Edit3, Trash2, User } from 'lucide-react';
import type React from 'react';

interface FileGridViewProps {
  files: ResidentFile[];
  onFileView?: (file: ResidentFile) => void;
  onFileEdit?: (file: ResidentFile) => void;
  onFileDelete?: (file: ResidentFile) => void;
  onFileDownload?: (file: ResidentFile) => void;
  className?: string;
}

export const FileGridView: React.FC<FileGridViewProps> = ({
  files,
  onFileView,
  onFileEdit,
  onFileDelete,
  onFileDownload,
  className = '',
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy/MM/dd HH:mm', { locale: ja });
  };

  const handleView = (file: ResidentFile) => {
    onFileView?.(file);
  };

  const handleEdit = (e: React.MouseEvent, file: ResidentFile) => {
    e.stopPropagation();
    onFileEdit?.(file);
  };

  const handleDelete = (e: React.MouseEvent, file: ResidentFile) => {
    e.stopPropagation();
    onFileDelete?.(file);
  };

  const handleDownload = (file: ResidentFile) => {
    onFileDownload?.(file);
  };

  if (files.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">ファイルがありません</h3>
        <p className="text-gray-500">
          利用者様に関するファイルをアップロードしてください。
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {files.map((file) => (
        <Card
          key={file.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleView(file)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* File thumbnail */}
              <div className="flex justify-center">
                <FileThumbnail
                  file={file}
                  onView={() => handleView(file)}
                  onDownload={() => handleDownload(file)}
                  size="lg"
                />
              </div>

              {/* File info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileCategoryBadge category={file.category} />
                </div>

                <h4 className="font-medium text-sm text-gray-900 line-clamp-2" title={file.originalFileName}>
                  {file.originalFileName}
                </h4>

                {file.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">{file.description}</p>
                )}

                {/* Tags */}
                {file.tags && file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {file.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {file.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                        +{file.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Meta info */}
                <div className="text-xs text-gray-500 space-y-1">
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

              {/* Action buttons */}
              <div className="flex justify-between gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleEdit(e, file)}
                  className="flex-1 text-xs"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  編集
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleDelete(e, file)}
                  className="flex-1 text-xs border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  削除
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};