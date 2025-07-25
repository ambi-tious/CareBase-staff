import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ContactScheduleType } from '@/types/contact-schedule';
import { typeOptions } from '@/types/contact-schedule';
import { getLucideIcon } from '@/lib/lucide-icon-registry';

interface TypeBadgeProps {
  type: ContactScheduleType;
  className?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className = '' }) => {
  const typeConfig = typeOptions.find((option) => option.value === type);

  if (!typeConfig) {
    return null;
  }

  const Icon = getLucideIcon(typeConfig.icon);

  return (
    <Badge className={`${typeConfig.color} ${className} flex items-center gap-1`} variant="outline">
      <Icon className="h-3 w-3" />
      {typeConfig.label}
    </Badge>
  );
};
