'use client';

import type React from 'react';
import { DocumentBadge } from '@/components/1_atoms/documents/document-badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface DocumentDetailHeaderProps {
  documentId: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  onPrint: () => void;
  className?: string;
}

export const DocumentDetailHeader: React.FC<DocumentDetailHeaderProps> = ({
  documentId,
  title,
  status,
  createdAt,
  onPrint,
  className,
}) => {
  const formatDate = (date: Date) => {
    return format(date, 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/documents/minutes">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              一覧へ戻る
            </Button>
          </Link>
          <DocumentBadge status={status} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrint} className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            印刷
          </Button>
          <Link href={`/documents/edit/${documentId}`}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
            >
              <Edit className="h-4 w-4" />
              編集
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-carebase-text-primary">{title}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-gray-500">
          <div>書類番号: {documentId}</div>
          <div>作成日時: {formatDate(createdAt)}</div>
        </div>
      </div>
    </div>
  );
};
