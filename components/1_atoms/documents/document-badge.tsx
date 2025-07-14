import type React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type DocumentStatus = 'draft' | 'published' | 'archived';

interface DocumentBadgeProps {
  status: DocumentStatus;
  className?: string;
}

export const DocumentBadge: React.FC<DocumentBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'draft':
        return '下書き';
      case 'published':
        return '公開済み';
      case 'archived':
        return 'アーカイブ';
      default:
        return '不明';
    }
  };

  return (
    <Badge className={cn(getStatusStyles(), className)} variant="outline">
      {getStatusLabel()}
    </Badge>
  );
};