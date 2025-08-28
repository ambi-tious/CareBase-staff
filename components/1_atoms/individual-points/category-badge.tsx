import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { IndividualPointCategory } from '@/types/individual-point';
import { categoryOptions } from '@/types/individual-point';
import { getLucideIcon } from '@/lib/lucide-icon-registry';

interface CategoryBadgeProps {
  category: IndividualPointCategory;
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
