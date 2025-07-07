'use client';

import type React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
  className?: string;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items,
  onNavigate,
  className = '',
}) => {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('/')}
        className="h-8 px-2 text-gray-600 hover:text-gray-900"
      >
        <Home className="h-4 w-4" />
      </Button>
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item.path)}
            className={`h-8 px-2 ${
              index === items.length - 1
                ? 'text-gray-900 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.label}
          </Button>
        </React.Fragment>
      ))}
    </nav>
  );
};