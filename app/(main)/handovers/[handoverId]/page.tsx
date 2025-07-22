import React, { useState } from 'react';
import { getHandoverById } from '@/mocks/handover-data';
import { HandoverDetail } from '@/components/3_organisms/handover/handover-detail';
import type { Handover } from '@/types/handover';

export default function HandoverDetailPage({
  params,
}: {
  params: Promise<{ handoverId: string }>;
}) {
  const [handover, setHandover] = useState<Handover | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load handover data
  React.useEffect(() => {
    const loadHandover = async () => {
      const resolvedParams = await params;
      const foundHandover = getHandoverById(resolvedParams.handoverId);
      setHandover(foundHandover || null);
      setIsLoading(false);
    };

    loadHandover();
  }, [params]);

  const handleHandoverUpdate = (updatedHandover: Handover) => {
    setHandover(updatedHandover);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!handover) {
    return (
      <div className="p-6 text-center text-red-500">
        申し送りが見つかりません。
      </div>
    );
  }

  return <HandoverDetail handover={handover} onUpdate={handleHandoverUpdate} />;
}