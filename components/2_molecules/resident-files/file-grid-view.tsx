'use client';

import { FileThumbnail } from '@/components/1_atoms/resident-files/file-thumbnail';
import type { ResidentFile } from '@/types/resident-file';
import type React from 'react';

interface FileGridViewProps {
  files: ResidentFile[];
  onFileView?: (file: ResidentFile) => void;
  className?: string;
}

export const FileGridView: React.FC<FileGridViewProps> = ({
  files,
  onFileView,
  className = '',
}) => {
  const handleView = (file: ResidentFile) => {
    onFileView?.(file);
  };

  if (files.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">ファイルがありません</h3>
        <p className="text-gray-500">利用者様に関するファイルをアップロードしてください。</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ${className}`}
    >
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-center"
          onClick={() => handleView(file)}
        >
          <FileThumbnail file={file} onClick={() => handleView(file)} size="md" />
        </div>
      ))}
    </div>
  );
};
