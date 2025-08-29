import type { Resident } from '@/mocks/care-board-data';
import { careBoardData } from '@/mocks/care-board-data';
import { useCallback, useEffect, useState } from 'react';

// カスタムイベントを使用してデータの変更を通知
const RESIDENTS_UPDATED_EVENT = 'residentsUpdated';

// データ変更を通知するヘルパー関数
export const notifyResidentsUpdated = () => {
  window.dispatchEvent(new CustomEvent(RESIDENTS_UPDATED_EVENT));
};

// 利用者データを管理するカスタムフック
export const useResidents = () => {
  const [residents, setResidents] = useState<Resident[]>(careBoardData);
  const [isLoading, setIsLoading] = useState(false);

  // データの再読み込み
  const refreshResidents = useCallback(async () => {
    setIsLoading(true);
    try {
      // 動的インポートでモジュールを再読み込み
      const { careBoardData: freshData } = await import('@/mocks/care-board-data');
      setResidents([...freshData]); // 新しい配列として設定
    } catch (error) {
      console.error('Failed to refresh residents data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // カスタムイベントリスナーを設定
  useEffect(() => {
    const handleResidentsUpdated = () => {
      refreshResidents();
    };

    window.addEventListener(RESIDENTS_UPDATED_EVENT, handleResidentsUpdated);

    return () => {
      window.removeEventListener(RESIDENTS_UPDATED_EVENT, handleResidentsUpdated);
    };
  }, [refreshResidents]);

  // 初回ロード時にデータを取得
  useEffect(() => {
    refreshResidents();
  }, [refreshResidents]);

  return {
    residents,
    isLoading,
    refreshResidents,
  };
};
