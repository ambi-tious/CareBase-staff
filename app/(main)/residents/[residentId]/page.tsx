import { ResidentDetailTabs } from '@/components/3_organisms/resident/resident-detail-tabs';
import { ResidentProfileHeader } from '@/components/3_organisms/resident/resident-profile-header';
import { Button } from '@/components/ui/button';
import { getResidentById } from '@/mocks/care-board-data';
import { Edit } from 'lucide-react';
import Link from 'next/link';

export default async function ResidentDetailPage({
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
        <Link
          href="/residents"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          利用者一覧に戻る
        </Link>
        <Button
          variant="outline"
          asChild
          className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
        >
          <Link href={`/residents/${resident.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            編集
          </Link>
        </Button>
      </div>
      <ResidentProfileHeader resident={resident} />
      <ResidentDetailTabs resident={resident} />
    </div>
  );
}
