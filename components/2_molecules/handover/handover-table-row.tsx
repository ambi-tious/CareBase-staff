'use client';

import type React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/1_atoms/handover/priority-badge';
import { StatusBadge } from '@/components/1_atoms/handover/status-badge';
import { CategoryBadge } from '@/components/1_atoms/handover/category-badge';
import type { Handover } from '@/types/handover';
import { Eye, User } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface HandoverTableRowProps {
  handover: Handover;
  onStatusUpdate?: (handoverId: string, status: 'read' | 'completed') => void;
}

export const HandoverTableRow: React.FC<HandoverTableRowProps> = ({
  handover,
  onStatusUpdate,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd HH:mm', { locale: ja });
  };

  const handleMarkAsRead = () => {
    if (handover.status === 'unread' && onStatusUpdate) {
      onStatusUpdate(handover.id, 'read');
    }
  };

  return (
    <TableRow className={handover.status === 'unread' ? 'bg-blue-50' : ''}>
      <TableCell className="font-mono text-sm">{handover.id}</TableCell>
      <TableCell className="text-sm">{formatDate(handover.createdAt)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{handover.createdByName}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <CategoryBadge category={handover.category} />
          </div>
          <Link
            href={`/handovers/${handover.id}`}
            className="text-sm font-medium text-carebase-blue hover:underline"
            onClick={handleMarkAsRead}
          >
            {handover.title}
          </Link>
          {handover.residentName && (
            <div className="text-xs text-gray-500">対象: {handover.residentName}</div>
          )}
          {handover.scheduledDate && handover.scheduledTime && (
            <div className="text-xs text-gray-500">
              予定: {handover.scheduledDate} {handover.scheduledTime}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <PriorityBadge priority={handover.priority} />
      </TableCell>
      <TableCell>
        <StatusBadge status={handover.status} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/handovers/${handover.id}`} onClick={handleMarkAsRead}>
              <Eye className="h-3 w-3 mr-1" />
              詳細
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};