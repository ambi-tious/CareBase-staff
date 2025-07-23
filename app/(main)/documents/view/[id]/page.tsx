'use client';

import { DocumentDetail } from '@/components/3_organisms/documents/document-detail';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface DocumentViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface DocumentData {
  id: string;
  title: string;
  content: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  category: string;
  tags?: string[];
  fontFamily?: string;
  fontSize?: string;
  folderId: string | null; // 書類が保存されているフォルダID
}

export default function DocumentViewPage({ params: paramsPromise }: DocumentViewPageProps) {
  const router = useRouter();
  const params = React.use(paramsPromise);
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 文書データの取得
  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 実際のアプリケーションではAPIを呼び出してデータを取得します
        // ここではモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 500));

        // モックデータ
        setDocument({
          id: params.id,
          title: '議事録：2025年度第1回運営会議',
          content: `
<h2>2025年度第1回運営会議 議事録</h2>

<h3>開催概要</h3>
<ul>
  <li><strong>日時:</strong> 2025年1月15日（水）14:00〜16:00</li>
  <li><strong>場所:</strong> 会議室A</li>
  <li><strong>参加者:</strong> 田中管理者、山田主任、佐藤職員、高橋職員</li>
</ul>

<h3>議題</h3>
<ol>
  <li>2024年度振り返り</li>
  <li>2025年度事業計画について</li>
  <li>新人研修計画</li>
  <li>設備更新について</li>
</ol>

<h3>決定事項</h3>
<ul>
  <li>新人研修を4月に実施する</li>
  <li>エアコンの更新を3月に行う</li>
  <li>次回会議は2月15日（木）14:00〜</li>
</ul>

<h3>その他</h3>
<p>利用者様の安全確保を第一に、質の高いサービス提供を心がけてまいります。</p>
          `,
          status: 'published',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1週間前
          updatedAt: new Date(),
          createdBy: {
            id: 'user-001',
            name: '田中 花子',
            role: '介護職員',
          },
          category: '議事録',
          tags: ['運営会議', '2025年度', '事業計画'],
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          folderId: 'folder-1-1', // 議事録 > 運営会議
        });
      } catch (error) {
        console.error('Failed to fetch document:', error);
        setError('文書の読み込みに失敗しました。もう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [params.id]);

  // 書類更新時のハンドラー
  const handleDocumentUpdate = (updatedDocument: DocumentData) => {
    setDocument(updatedDocument);
    // 実際のアプリケーションではAPIを呼び出して更新を保存
    // console.log('Document updated:', updatedDocument);
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

  if (error || !document) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error || '文書が見つかりませんでした'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      <DocumentDetail document={document} onDocumentUpdate={handleDocumentUpdate} />
    </div>
  );
}
