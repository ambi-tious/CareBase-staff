import { getHandoverById } from '@/mocks/handover-data';
import { HandoverDetail } from '@/components/3_organisms/handover/handover-detail';

export default async function HandoverDetailPage({
  params,
}: {
  params: Promise<{ handoverId: string }>;
}) {
  const resolvedParams = await params;
  const handover = getHandoverById(resolvedParams.handoverId);

  if (!handover) {
    return (
      <div className="p-6 text-center text-red-500">
        申し送りが見つかりません。
      </div>
    );
  }

  return <HandoverDetail handover={handover} />;
}