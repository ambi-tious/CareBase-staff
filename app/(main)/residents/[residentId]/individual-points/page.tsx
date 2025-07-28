import { IndividualPointsManagement } from '@/components/3_organisms/individual-points/individual-points-management';
import { getResidentById } from '@/mocks/care-board-data';

export default async function IndividualPointsPage({
  params,
}: {
  params: Promise<{ residentId: string }>;
}) {
  const resolvedParams = await params;
  const residentIdNum = Number.parseInt(resolvedParams.residentId, 10);
  const resident = getResidentById(residentIdNum);

  if (!resident) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">ご利用者が見つかりません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      <IndividualPointsManagement resident={resident} />
    </div>
  );
}
