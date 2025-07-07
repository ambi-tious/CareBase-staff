import type React from 'react';
import { FileText, File, FileSpreadsheet, FileImage } from 'lucide-react';

interface FileIconProps {
  fileType: 'pdf' | 'doc' | 'xlsx' | 'txt' | 'image';
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ fileType, className = 'h-4 w-4' }) => {
  switch (fileType) {
    case 'pdf':
      return <FileText className={`${className} text-red-500`} />;
    case 'doc':
      return <FileText className={`${className} text-blue-500`} />;
    case 'xlsx':
      return <FileSpreadsheet className={`${className} text-green-500`} />;
    case 'image':
      return <FileImage className={`${className} text-purple-500`} />;
    default:
      return <File className={`${className} text-gray-500`} />;
  }
};