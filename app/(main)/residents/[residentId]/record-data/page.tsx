import { RecordDataTabs } from '@/components/3_organisms/record-data/record-data-tabs';
import { ResidentProfileHeader } from '@/components/3_organisms/resident/resident-profile-header';
import { getResidentById } from '@/mocks/care-board-data';

export default async function RecordDataPage({
  params,
}: {
  params: Promise<{ residentId: string }>;
}) {
  const resolvedParams = await params;
  const residentIdNum = Number.parseInt(resolvedParams.residentId, 10);
  const resident = getResidentById(residentIdNum);

  if (!resident) {
    return <div className="p-6 text-center text-red-500">ご利用者が見つかりません。</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      <ResidentProfileHeader resident={resident} />
      <div className="mt-6">
        <RecordDataTabs residentId={resolvedParams.residentId} />
      </div>
    </div>
  );
}
