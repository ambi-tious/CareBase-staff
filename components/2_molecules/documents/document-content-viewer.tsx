'use client';

import type React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DocumentContentViewerProps {
  content: string;
  fontFamily?: string;
  fontSize?: string;
  className?: string;
}

export const DocumentContentViewer: React.FC<DocumentContentViewerProps> = ({
  content,
  fontFamily = 'Arial, sans-serif',
  fontSize = '16px',
  className,
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div
          className={cn('prose max-w-none')}
          style={{ fontFamily, fontSize }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  );
};
