'use client';

import { notFound } from 'next/navigation';
import { FolderContentsView } from '@/components/3_organisms/documents/folder-contents-view';
import { FolderBreadcrumb } from '@/components/2_molecules/documents/folder-breadcrumb';
import { Button } from '@/components/ui/button';
import { getDocumentsByCategory, getCategoryByKey } from '@/mocks/documents-data';
import { FileText, FolderPlus } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import type { DocumentItem } from '@/types/document';

interface DocumentCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function DocumentCategoryPage({ params }: DocumentCategoryPageProps) {
  const [categoryKey, setCategoryKey] = useState<string>('');
  const [category, setCategory] = useState<any>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState<any[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      const resolvedParams = await params;
      const key = resolvedParams.category;
      setCategoryKey(key);

      const cat = getCategoryByKey(key);
      setCategory(cat);

      if (!cat) {
        notFound();
      }

      const docs = getDocumentsByCategory(key);
      setDocuments(docs as unknown as DocumentItem[]);

      setBreadcrumbPath([
        { id: 'root', name: 'ホーム', path: '/documents' },
        { id: key, name: cat?.name || key, path: `/documents/${key}` },
      ]);
    };

    initializeData();
  }, [params]);

  const handleItemSelection = (itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(documents.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  if (!category) {
    return null; // データ読み込み中
  }

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-carebase-blue" />
          <h1 className="text-2xl font-bold text-carebase-text-primary">{category.name}</h1>
        </div>
        {/* パンくずリスト */}
        <FolderBreadcrumb path={breadcrumbPath} className="mb-4" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-600">{documents.length}個のアイテム</p>
          <div className="flex items-center gap-2">
            <Link href="/documents/edit">
              <Button className="bg-carebase-blue hover:bg-carebase-blue-dark">
                <FileText className="h-4 w-4 mr-2" />
                新規{category.name}
              </Button>
            </Link>
            <Button className="bg-carebase-blue hover:bg-carebase-blue-dark">
              <FolderPlus className="h-4 w-4 mr-2" />
              新しいフォルダ
            </Button>
          </div>
        </div>
      </div>
      {/* フォルダ内容表示 */}
      <FolderContentsView
        items={documents}
        selectedItems={selectedItems}
        onItemSelection={handleItemSelection}
        onSelectAll={handleSelectAll}
      />
    </div>
  );
}
