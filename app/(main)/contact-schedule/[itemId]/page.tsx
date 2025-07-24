import { getContactScheduleById } from '@/mocks/contact-schedule-data';
import { ContactScheduleDetail } from '@/components/3_organisms/contact-schedule/contact-schedule-detail';

export default async function ContactScheduleDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const resolvedParams = await params;
  const item = getContactScheduleById(resolvedParams.itemId);

  if (!item) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">連絡・予定が見つかりません。</p>
        </div>
      </div>
    );
  }

  return <ContactScheduleDetail item={item} />;
}