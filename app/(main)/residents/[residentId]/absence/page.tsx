import { AbsenceTabContent } from '@/components/3_organisms/absence/absence-tab-content';
import { Button } from '@/components/ui/button';
import { getResidentById } from '@/mocks/care-board-data';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function ResidentAbsencePage({
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href={`/residents/${resident.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              利用者詳細に戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">
              {resident.name}様の不在情報
            </h1>
          </div>
        </div>
      </div>
      
      <AbsenceTabContent residentId={resident.id} residentName={resident.name} />
    </div>
  );
}