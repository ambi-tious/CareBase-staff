'use client';

import { ContactScheduleDetail } from '@/components/3_organisms/contact-schedule/contact-schedule-detail';
import { useToast } from '@/components/ui/use-toast';
import { getContactScheduleById } from '@/mocks/contact-schedule-data';
import type { ContactScheduleItem } from '@/types/contact-schedule';
import { useEffect, useState } from 'react';

interface ContactScheduleDetailPageProps {
  params: Promise<{ itemId: string }>;
}

export default function ContactScheduleDetailPage({ params }: ContactScheduleDetailPageProps) {
  const { toast } = useToast();
  const [item, setItem] = useState<ContactScheduleItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const resolvedParams = await params;
        const contactScheduleItem = getContactScheduleById(resolvedParams.itemId);
        setItem(contactScheduleItem || null);
      } catch (error) {
        console.error('Failed to load contact schedule:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [params]);

  const handleDelete = async (itemId: string): Promise<boolean> => {
    try {
      // 実際のアプリケーションではAPIを呼び出して削除します
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // モックの削除成功処理
      toast({
        title: '連絡・予定を削除しました',
      });

      return true;
    } catch (error) {
      console.error('Failed to delete contact schedule:', error);
      toast({
        title: 'エラーが発生しました',
        description: '削除に失敗しました。もう一度お試しください。',
        variant: 'destructive',
      });
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">連絡・予定が見つかりません。</p>
        </div>
      </div>
    );
  }

  return <ContactScheduleDetail item={item} onDelete={handleDelete} />;
}
