'use client';

import { FileCategoryBadge } from '@/components/1_atoms/resident-files/file-category-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ResidentFile } from '@/types/resident-file';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  Calendar,
  Download,
  Edit3,
  File,
  MoreVertical,
  Trash2,
  User,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';

interface ResidentFileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: ResidentFile | null;
  onEdit?: (file: ResidentFile) => void;
  onDelete?: (file: ResidentFile) => void;
  onDownload?: (file: ResidentFile) => void;
}

export const ResidentFileViewerModal: React.FC<ResidentFileViewerModalProps> = ({
  isOpen,
  onClose,
  file,
  onEdit,
  onDelete,
  onDownload,
}) => {
  const [zoom, setZoom] = useState(1);

  if (!file) return null;

  const handleDownload = () => {
    if (onDownload) {
      onDownload(file);
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.originalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEdit = () => {
    onEdit?.(file);
  };

  const handleDelete = () => {
    onDelete?.(file);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold truncate">
                <div className="flex items-center gap-2">
                  {file.fileName}
                  <FileCategoryBadge category={file.category} />
                </div>
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                {file.description && <p className="text-sm text-gray-700">{file.description}</p>}

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
            <div className="flex items-center gap-2 ml-4 mr-[60px]">
              {file.isImage && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetZoom} className="px-3">
                    {Math.round(zoom * 100)}%
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                    <Download className="h-4 w-4 mr-2" />
                    ダウンロード
                  </DropdownMenuItem>
                  {onEdit && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                        <Edit3 className="h-4 w-4 mr-2" />
                        編集
                      </DropdownMenuItem>
                    </>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        削除
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-0">
          {/* File content */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {file.isImage ? (
              <div className="flex items-center justify-center min-h-[400px] p-4">
                <div
                  style={{ transform: `scale(${zoom})` }}
                  className="transition-transform duration-200"
                >
                  <Image
                    src={file.url}
                    alt={file.originalFileName}
                    width={600}
                    height={400}
                    style={{ objectFit: 'contain' }}
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{file.originalFileName}</h3>
                <p className="text-gray-500 mb-4">このファイル形式はプレビューできません。</p>
                <Button
                  onClick={handleDownload}
                  className="bg-carebase-blue hover:bg-carebase-blue-dark"
                >
                  <Download className="h-4 w-4 mr-2" />
                  ダウンロードして開く
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
