import type React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface ImportanceBadgeProps {
  isImportant: boolean;
  className?: string;
}

export const ImportanceBadge: React.FC<ImportanceBadgeProps> = ({ isImportant, className = '' }) => {
  if (!isImportant) return null;

  return (
    <Badge className={`bg-red-100 text-red-700 border-red-200 flex items-center gap-1 ${className}`} variant="outline">
      <AlertTriangle className="h-3 w-3" />
      重要
    </Badge>
  );
};