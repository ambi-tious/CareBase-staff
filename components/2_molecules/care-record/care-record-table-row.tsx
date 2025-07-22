'use client';

import type React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/1_atoms/care-record/category-badge';
import { PriorityBadge } from '@/components/1_atoms/care-record/priority-badge';
import { StatusBadge } from '@/components/1_atoms/care-record/status-badge';
import type { CareRecord } from '@/types/care-record';
import { Eye, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface CareRecordTableRowProps {
  record: CareRecord;
  onRecordClick?: (recordId: string) => void;
}

export const CareRecordTableRow: React.FC<CareRecordTableRowProps> = ({ 
  record, 
  onRecordClick 
}) => {
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd HH:mm', { locale: ja });
  };

  const handleRowClick = () => {
    if (onRecordClick) {
      onRecordClick(record.id);
    }
  };

  return (
    <TableRow 
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleRowClick}
    >
      <TableCell className="font-mono text-sm">{record.id}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <Link
            href={`/residents/${record.residentId}`}
            className="text-sm font-medium text-carebase-blue hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {record.residentName}
          </Link>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-4 w-4 text-gray-500" />
          {formatDateTime(record.recordedAt)}
        </div>
      </TableCell>
      <TableCell>
        <CategoryBadge category={record.category} />
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900 line-clamp-1">
            {record.title}
          </div>
          <div className="text-xs text-gray-500 line-clamp-2">
            {record.summary}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">{record.createdByName}</div>
      </TableCell>
      <TableCell>
        <PriorityBadge priority={record.priority} />
      </TableCell>
      <TableCell>
        <StatusBadge status={record.status} />
      </TableCell>
      <TableCell>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/care-records/${record.id}`}>
            <Eye className="h-3 w-3 mr-1" />
            詳細
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
};