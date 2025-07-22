import { CareRecordList } from '@/components/3_organisms/care-record/care-record-list';
import { careRecordData } from '@/mocks/care-record-data';

export default function CareRecordsPage() {
  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      <CareRecordList records={careRecordData} />
    </div>
  );
}