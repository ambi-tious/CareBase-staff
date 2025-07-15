import type React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  className,
}) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn('h-8 px-2 py-1', isActive && 'bg-muted text-carebase-blue', className)}
      title={label}
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};