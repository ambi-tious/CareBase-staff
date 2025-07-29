'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Bell, Save, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    handoverNotifications: true,
    contactScheduleNotifications: true,
    systemNotifications: true,
    emailNotifications: false,
    pushNotifications: true,
    highPriorityOnly: false,
    soundEnabled: true,
  });

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // 実際のアプリケーションではAPIに設定を保存
    console.log('Saving notification settings:', settings);
    // TODO: API呼び出しの実装
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href="/notifications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              お知らせ一覧に戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">通知設定</h1>
          </div>
        </div>
        <p className="text-gray-600">
          お知らせの受信設定を管理できます。設定を変更した後は「保存」ボタンを押してください。
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* 通知種別設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              通知種別設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="handover-notifications">申し送り通知</Label>
                <p className="text-sm text-gray-500">新しい申し送りが作成された時に通知します</p>
              </div>
              <Switch
                id="handover-notifications"
                checked={settings.handoverNotifications}
                onCheckedChange={(checked) => handleSettingChange('handoverNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="contact-schedule-notifications">連絡・予定通知</Label>
                <p className="text-sm text-gray-500">
                  新しい連絡事項や予定が作成された時に通知します
                </p>
              </div>
              <Switch
                id="contact-schedule-notifications"
                checked={settings.contactScheduleNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange('contactScheduleNotifications', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-notifications">システム通知</Label>
                <p className="text-sm text-gray-500">
                  システムメンテナンスやアップデート情報を通知します
                </p>
              </div>
              <Switch
                id="system-notifications"
                checked={settings.systemNotifications}
                onCheckedChange={(checked) => handleSettingChange('systemNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 通知方法設定 */}
        <Card>
          <CardHeader>
            <CardTitle>通知方法設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">プッシュ通知</Label>
                <p className="text-sm text-gray-500">ブラウザでプッシュ通知を受信します</p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">メール通知</Label>
                <p className="text-sm text-gray-500">登録されたメールアドレスに通知を送信します</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound-enabled">通知音</Label>
                <p className="text-sm text-gray-500">通知受信時に音を再生します</p>
              </div>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* フィルタ設定 */}
        <Card>
          <CardHeader>
            <CardTitle>フィルタ設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-priority-only">高重要度のみ通知</Label>
                <p className="text-sm text-gray-500">重要度が「高」の通知のみを受信します</p>
              </div>
              <Switch
                id="high-priority-only"
                checked={settings.highPriorityOnly}
                onCheckedChange={(checked) => handleSettingChange('highPriorityOnly', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 保存ボタン */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-carebase-blue hover:bg-carebase-blue-dark">
            <Save className="h-4 w-4 mr-2" />
            設定を保存
          </Button>
        </div>
      </div>
    </div>
  );
}
