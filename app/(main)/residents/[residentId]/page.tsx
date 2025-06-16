import { getResidentById } from '@/mocks/care-board-data';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { ResidentProfileHeader } from '@/components/3_organisms/resident/resident-profile-header';
import { ResidentDetailTabs } from '@/components/3_organisms/resident/resident-detail-tabs';

export default function ResidentDetailPage({ params }: { params: { residentId: string } }) {
  const residentIdNum = Number.parseInt(params.residentId, 10);
  const resident = getResidentById(residentIdNum);

  if (!resident) {
    return <div className="p-6 text-center text-red-500">ご利用者が見つかりません。</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      <ResidentProfileHeader resident={resident} />
      <ResidentDetailTabs resident={resident} />

      <div className="fixed bottom-6 right-6 z-10">
        <Button className="h-16 w-16 rounded-full bg-carebase-blue shadow-lg hover:bg-carebase-blue-dark md:h-12 md:w-auto md:px-6 md:py-3 font-semibold">
          <Clock className="h-6 w-6 md:mr-2" />
          <span className="hidden md:inline">クイック作成</span>
        </Button>
      </div>
    </div>
  );
}
