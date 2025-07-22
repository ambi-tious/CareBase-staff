'use client';

import { HandoverList } from '@/components/3_organisms/handover/handover-list';
import { handoverData } from '@/mocks/handover-data';
import { useState } from 'react';

export default function HandoversPage() {
  const [handovers, setHandovers] = useState(handoverData);

  const handleStatusUpdate = (handoverId: string, status: 'read' | 'completed') => {
    setHandovers((prev) =>
      prev.map((handover) =>
        handover.id === handoverId
          ? {
              ...handover,
              status,
              readAt: status === 'read' ? new Date().toISOString() : handover.readAt,
              completedAt: status === 'completed' ? new Date().toISOString() : handover.completedAt,
              updatedAt: new Date().toISOString(),
            }
          : handover
      )
    );
  };

  return <HandoverList handovers={handovers} onStatusUpdate={handleStatusUpdate} />;
}