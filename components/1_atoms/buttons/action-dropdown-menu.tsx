'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { LucideIcon } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import type React from 'react';

export interface ActionDropdownConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: (e?: React.MouseEvent | React.MouseEvent<Element, MouseEvent>) => void;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
}

interface ActionDropdownMenuProps {
  actions: ActionDropdownConfig[];
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  triggerLabel?: string;
  triggerIcon?: LucideIcon;
}

export const ActionDropdownMenu: React.FC<ActionDropdownMenuProps> = ({
  actions,
  size = 'sm',
  className = '',
  triggerLabel,
  triggerIcon: TriggerIcon = MoreHorizontal,
}) => {
  if (actions.length === 0) {
    return null;
  }

  const handleItemClick = (action: ActionDropdownConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    action.onClick(e);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={size} className={`${className}`}>
          <TriggerIcon className="h-3 w-3" />
          {triggerLabel && <span className="ml-1">{triggerLabel}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <DropdownMenuItem
              key={action.id}
              onClick={(e) => handleItemClick(action, e)}
              disabled={action.disabled}
              className={`cursor-pointer ${
                action.variant === 'destructive'
                  ? 'text-red-600 focus:text-red-600 focus:bg-red-50'
                  : ''
              } ${action.className || ''}`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
