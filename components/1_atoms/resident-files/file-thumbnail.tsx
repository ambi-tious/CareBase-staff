import { Button } from '@/components/ui/button';
import type { ResidentFile } from '@/types/resident-file';
import { Download, Eye, FileText, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';

interface FileThumbnailProps {
  file: ResidentFile;
  onView?: () => void;
  onDownload?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FileThumbnail: React.FC<FileThumbnailProps> = ({
  file,
  onView,
  onDownload,
  className = '',
  size = 'md',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16';
      case 'lg':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`relative group ${className}`}>
      <div
        className={`${getSizeClasses()} rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center`}
      >
        {file.isImage && file.thumbnailUrl ? (
          <Image
            src={file.thumbnailUrl}
            alt={file.originalFileName}
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <FileText className="h-8 w-8 text-gray-400" />
        )}
      </div>

      {/* Hover overlay with actions */}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
        {onView && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onView}
            className="h-8 w-8 p-0 text-white hover:bg-white hover:bg-opacity-20"
            aria-label="プレビュー"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="h-8 w-8 p-0 text-white hover:bg-white hover:bg-opacity-20"
            aria-label="ダウンロード"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* File info */}
      <div className="mt-1 text-xs text-gray-500 text-center">
        <div className="truncate" title={file.originalFileName}>
          {file.originalFileName}
        </div>
        <div>{formatFileSize(file.fileSize)}</div>
      </div>
    </div>
  );
};