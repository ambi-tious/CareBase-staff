'use client';

import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import type React from 'react';

export interface ActionButtonConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  disabled?: boolean;
}

interface ActionButtonGroupProps {
  actions: ActionButtonConfig[];
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  actions,
  size = 'sm',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            variant={action.variant || 'outline'}
            size={size}
            onClick={action.onClick}
            className={action.className}
            disabled={action.disabled}
          >
            <Icon className="h-3 w-3 mr-1" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
};
