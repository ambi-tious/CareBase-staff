'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface PushNotificationToggleProps {
  className?: string;
}

export function PushNotificationToggle({ className }: PushNotificationToggleProps) {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    requestPermission,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  // エラーが発生した時にトーストで表示
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleToggle = async (checked: boolean) => {
    if (!isSupported) {
      toast.error('お使いのブラウザはプッシュ通知をサポートしていません');
      return;
    }

    if (checked) {
      // プッシュ通知を有効にする
      if (permission !== 'granted') {
        const permissionGranted = await requestPermission();
        if (!permissionGranted) {
          toast.error('プッシュ通知の許可が拒否されました');
          return;
        }
      }

      const subscribed = await subscribe();
      if (subscribed) {
        toast.success('プッシュ通知が有効になりました');
      }
    } else {
      // プッシュ通知を無効にする
      const unsubscribed = await unsubscribe();
      if (unsubscribed) {
        toast.success('プッシュ通知が無効になりました');
      }
    }
  };

  const getStatusText = () => {
    if (!isSupported) {
      return 'お使いのブラウザではサポートされていません';
    }
    if (permission === 'denied') {
      return 'ブラウザでプッシュ通知が拒否されています';
    }
    if (isSubscribed) {
      return 'ブラウザでプッシュ通知を受信します';
    }
    return 'ブラウザでプッシュ通知を受信します';
  };

  const showManualPermissionButton = permission === 'denied' && isSupported;

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="push-notifications" className="flex items-center gap-2">
            {isSubscribed ? (
              <Bell className="h-4 w-4 text-green-600" />
            ) : (
              <BellOff className="h-4 w-4 text-gray-400" />
            )}
            プッシュ通知
          </Label>
          <p className="text-sm text-gray-500">{getStatusText()}</p>
        </div>

        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}

          {showManualPermissionButton ? (
            <Button variant="outline" size="sm" onClick={requestPermission} disabled={isLoading}>
              許可する
            </Button>
          ) : (
            <Switch
              id="push-notifications"
              checked={isSubscribed}
              onCheckedChange={handleToggle}
              disabled={!isSupported || permission === 'denied' || isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
