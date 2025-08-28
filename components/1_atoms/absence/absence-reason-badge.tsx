import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { AbsenceReason } from '@/types/absence';
import { absenceReasonOptions } from '@/types/absence';
import { getLucideIcon } from '@/lib/lucide-icon-registry';

interface AbsenceReasonBadgeProps {
  reason: AbsenceReason;
  customReason?: string;
  className?: string;
}

export const AbsenceReasonBadge: React.FC<AbsenceReasonBadgeProps> = ({
  reason,
  customReason,
  className = '',
}) => {
  const reasonConfig = absenceReasonOptions.find((option) => option.value === reason);

  if (!reasonConfig) {
    return null;
  }

  const Icon = getLucideIcon(reasonConfig.icon);
  const displayText = reason === 'other' && customReason ? customReason : reasonConfig.label;

  return (
    <Badge
      className={`${reasonConfig.color} ${className} flex items-center gap-1`}
      variant="outline"
    >
      <Icon className="h-3 w-3" />
      {displayText}
    </Badge>
  );
};
