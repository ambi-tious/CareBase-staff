'use client';

import { useCallback, useEffect, useState } from 'react';

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  isLoading: boolean;
  error: string | null;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    isSubscribed: false,
    subscription: null,
    isLoading: false,
    error: null,
  });

  // プッシュ通知のサポート状況をチェック
  useEffect(() => {
    const checkSupport = () => {
      const isSupported =
        'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

      setState((prev) => ({
        ...prev,
        isSupported,
        permission: isSupported ? Notification.permission : 'denied',
      }));
    };

    checkSupport();
  }, []);

  // 現在のサブスクリプション状況をチェック
  useEffect(() => {
    const checkSubscription = async () => {
      if (!state.isSupported) return;

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        setState((prev) => ({
          ...prev,
          isSubscribed: !!subscription,
          subscription,
        }));
      } catch (error) {
        console.error('サブスクリプション状況の確認でエラー:', error);
        setState((prev) => ({
          ...prev,
          error: 'サブスクリプション状況の確認に失敗しました',
        }));
      }
    };

    if (state.isSupported) {
      checkSubscription();
    }
  }, [state.isSupported]);

  // プッシュ通知の許可を要求
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      setState((prev) => ({ ...prev, error: 'プッシュ通知がサポートされていません' }));
      return false;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const permission = await Notification.requestPermission();

      setState((prev) => ({ ...prev, permission, isLoading: false }));

      return permission === 'granted';
    } catch (error) {
      console.error('通知許可要求でエラー:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: '通知許可の要求に失敗しました',
      }));
      return false;
    }
  }, [state.isSupported]);

  // プッシュ通知を購読
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported || state.permission !== 'granted') {
      setState((prev) => ({
        ...prev,
        error: 'プッシュ通知の許可が必要です',
      }));
      return false;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
            'BANkjz6pnwS2ba20B7CJHa645sdVPq5HEYgQgz3KrvAF593wNulqcEhw5bRwTw9xa8HTzY8eydo3pzh86RYs0zU'
        ),
      });

      // サーバーにサブスクリプションを送信
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('サーバーへのサブスクリプション登録に失敗しました');
      }

      setState((prev) => ({
        ...prev,
        isSubscribed: true,
        subscription,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('プッシュ通知の購読でエラー:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'プッシュ通知の購読に失敗しました',
      }));
      return false;
    }
  }, [state.isSupported, state.permission]);

  // プッシュ通知の購読を解除
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) {
      return true;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      await state.subscription.unsubscribe();

      setState((prev) => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('プッシュ通知の購読解除でエラー:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'プッシュ通知の購読解除に失敗しました',
      }));
      return false;
    }
  }, [state.subscription]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
  };
};

// VAPID公開キーをUint8Arrayに変換するヘルパー関数
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
