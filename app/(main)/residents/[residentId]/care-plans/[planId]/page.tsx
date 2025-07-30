import { CarePlanDetail } from '@/components/3_organisms/care-plan/care-plan-detail';
import { getCarePlanById } from '@/mocks/care-plan-data';

export default async function CarePlanDetailPage({
  params,
}: {
  params: Promise<{ residentId: string; planId: string }>;
}) {
  const resolvedParams = await params;
  const carePlan = getCarePlanById(resolvedParams.planId);

  if (!carePlan) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">ケアプランが見つかりません。</p>
        </div>
      </div>
    );
  }

  return <CarePlanDetail carePlan={carePlan} residentId={resolvedParams.residentId} />;
}