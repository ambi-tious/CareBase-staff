import type React from 'react';
import { cn } from '@/lib/utils';

interface DocumentInfoRowProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export const DocumentInfoRow: React.FC<DocumentInfoRowProps> = ({ label, value, className }) => {
  return (
    <div className={cn('grid grid-cols-3 gap-4 py-3 border-b border-gray-100', className)}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 col-span-2">{value || '-'}</dd>
    </div>
  );
};
