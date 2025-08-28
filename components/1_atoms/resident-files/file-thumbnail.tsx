import type { ResidentFile } from '@/types/resident-file';
import { FileText } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';

interface FileThumbnailProps {
  file: ResidentFile;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FileThumbnail: React.FC<FileThumbnailProps> = ({
  file,
  onClick,
  className = '',
  size = 'md',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-24 h-24';
      case 'lg':
        return 'w-40 h-40';
      default:
        return 'w-32 h-32';
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
    <div className={`relative group cursor-pointer ${className}`} onClick={onClick}>
      <div className="flex items-center justify-center">
        <div
          className={`${getSizeClasses()} rounded-lg border border-gray-200 overflow-hidden bg-gray-50`}
        >
          {file.isImage && file.thumbnailUrl ? (
            <Image
              src={file.thumbnailUrl}
              alt={file.originalFileName}
              width={128}
              height={128}
              className="object-contain rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* File info */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        <div className="truncate" title={file.originalFileName}>
          {file.originalFileName}
        </div>
        <div>{formatFileSize(file.fileSize)}</div>
      </div>
    </div>
  );
};
