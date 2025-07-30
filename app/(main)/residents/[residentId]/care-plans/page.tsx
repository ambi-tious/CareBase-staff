import { CarePlanList } from '@/components/3_organisms/care-plan/care-plan-list';
import { getCarePlansByResident } from '@/mocks/care-plan-data';
import { getResidentById } from '@/mocks/care-board-data';

export default async function CarePlansPage({
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

  const carePlans = getCarePlansByResident(resolvedParams.residentId);

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      <CarePlanList
        carePlans={carePlans}
        residentId={resolvedParams.residentId}
        residentName={resident.name}
      />
    </div>
  );
}