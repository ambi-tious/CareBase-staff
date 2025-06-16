import type React from 'react';

interface InfoRowProps {
  label: string;
  value?: string | number | null;
  className?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, className = '' }) => (
  <div className={`grid grid-cols-3 gap-2 py-2 border-b border-gray-100 ${className}`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="text-sm text-gray-900 col-span-2">{value || '-'}</dd>
  </div>
);
