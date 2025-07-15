'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { DocumentDetail } from '@/components/3_organisms/documents/document-detail';
import { useRouter } from 'next/navigation';

interface DocumentViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DocumentViewPage({ params: paramsPromise }: DocumentViewPageProps) {
  const router = useRouter();
  const params = React.use(paramsPromise);
  const [document, setDocument] = useState<any>(null);
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
            <h2>会議概要</h2>
            <p>日時：2025年4月15日 14:00～16:00</p>
            <p>場所：会議室A</p>
            <p>出席者：田中部長、佐藤課長、鈴木主任、山田係長、伊藤さん</p>
            
            <h2>議題</h2>
            <ol>
              <li>前回議事録の確認</li>
              <li>2025年度事業計画について</li>
              <li>新システム導入について</li>
              <li>その他</li>
            </ol>
            
            <h2>議事内容</h2>
            <h3>1. 前回議事録の確認</h3>
            <p>前回議事録を確認し、全員の承認を得た。</p>
            
            <h3>2. 2025年度事業計画について</h3>
            <p>田中部長より2025年度の事業計画案が提示された。主な内容は以下の通り：</p>
            <ul>
              <li>第1四半期：新サービスの企画・開発</li>
              <li>第2四半期：新サービスのテスト運用</li>
              <li>第3四半期：新サービスの本格展開</li>
              <li>第4四半期：評価・改善</li>
            </ul>
            <p>佐藤課長より、第2四半期のスケジュールがタイトであるとの指摘があり、検討の結果、テスト期間を2週間延長することとなった。</p>
            
            <h3>3. 新システム導入について</h3>
            <p>山田係長より新システム導入の進捗状況が報告された。現在、3社からの見積もりを比較検討中。</p>
            <p>次回会議までに選定を完了し、導入スケジュールを確定させる。</p>
            
            <h3>4. その他</h3>
            <p>伊藤さんより、社内研修の実施について提案があった。人事部と連携して詳細を詰めることとなった。</p>
            
            <h2>次回会議</h2>
            <p>日時：2025年5月20日 14:00～16:00</p>
            <p>場所：会議室A</p>
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
      <DocumentDetail document={document} />
    </div>
  );
}
