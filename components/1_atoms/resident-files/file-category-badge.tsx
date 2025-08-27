import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ResidentFileCategory } from '@/types/resident-file';
import { fileCategoryOptions } from '@/types/resident-file';
import { getLucideIcon } from '@/lib/lucide-icon-registry';

interface FileCategoryBadgeProps {
  category: ResidentFileCategory;
  className?: string;
}

export const FileCategoryBadge: React.FC<FileCategoryBadgeProps> = ({ category, className = '' }) => {
  const categoryConfig = fileCategoryOptions.find((option) => option.value === category);

  if (!categoryConfig) {
    return null;
  }

  const Icon = getLucideIcon(categoryConfig.icon);

  return (
    <Badge
      className={`${categoryConfig.color} ${className} flex items-center gap-1`}
      variant="outline"
    >
      <Icon className="h-3 w-3" />
      {categoryConfig.label}
    </Badge>
  );
};