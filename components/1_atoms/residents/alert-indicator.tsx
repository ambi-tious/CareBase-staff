import type React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type AlertLevel = 'high' | 'medium' | 'low';

interface AlertIndicatorProps {
  level: AlertLevel;
  count: number;
  className?: string;
}

export const AlertIndicator: React.FC<AlertIndicatorProps> = ({ level, count, className = '' }) => {
  const getAlertConfig = () => {
    switch (level) {
      case 'high':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          label: '緊急',
        };
      case 'medium':
        return {
          icon: AlertCircle,
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-200',
          label: '注意',
        };
      case 'low':
        return {
          icon: Info,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          label: '情報',
        };
    }
  };

  const config = getAlertConfig();
  const Icon = config.icon;

  if (count === 0) return null;

  return (
    <Badge
      className={`${config.bgColor} ${config.textColor} ${config.borderColor} flex items-center gap-1 ${className}`}
      variant="outline"
    >
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium">{config.label}</span>
      <span className="text-xs font-bold">{count}</span>
    </Badge>
  );
};
