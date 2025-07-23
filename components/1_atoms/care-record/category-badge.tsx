'use client';

import { Badge } from '@/components/ui/badge';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import type { CareRecordCategory } from '@/types/care-record';
import { categoryOptions } from '@/types/care-record';
import type React from 'react';

interface CategoryBadgeProps {
  category: CareRecordCategory;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className = '' }) => {
  const categoryConfig = categoryOptions.find((option) => option.value === category);

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
