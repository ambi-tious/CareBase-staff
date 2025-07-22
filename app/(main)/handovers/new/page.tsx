'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquarePlus } from 'lucide-react';
import Link from 'next/link';

export default function NewHandoverPage() {
  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href="/handovers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              申し送り一覧に戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <MessageSquarePlus className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">新規申し送り作成</h1>
          </div>
        </div>
        <p className="text-gray-600">
          新しい申し送りを作成してください。必須項目（
          <span className="text-red-500">*</span>）は必ず入力してください。
        </p>
      </div>

      {/* Form Placeholder */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5" />
            申し送り情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquarePlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">申し送り作成フォーム</h3>
            <p className="text-gray-500 mb-4">
              この画面では申し送り作成フォームが表示されます。
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 件名、内容、重要度の入力</p>
              <p>• 申し送り先スタッフの選択</p>
              <p>• 対象利用者の選択（任意）</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}