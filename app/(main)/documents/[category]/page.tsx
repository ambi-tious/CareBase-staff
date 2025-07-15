import { notFound } from 'next/navigation';
import { FolderContentsView } from '@/components/3_organisms/documents/folder-contents-view';
import { FolderBreadcrumb } from '@/components/2_molecules/documents/folder-breadcrumb';
import { Button } from '@/components/ui/button';
import { FileUploadModal } from '@/components/3_organisms/modals/file-upload-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { useToast } from '@/components/ui/use-toast';
import { getDocumentsByCategory, getCategoryByKey } from '@/mocks/documents-data';
import { FileText, FolderPlus, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface DocumentCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function DocumentCategoryPage({ params }: DocumentCategoryPageProps) {
  const resolvedParams = await params;
  const categoryKey = resolvedParams.category;
  const category = getCategoryByKey(categoryKey);
  const breadcrumbPath = [
    { id: 'root', name: 'ホーム', path: '/documents' },
    { id: categoryKey, name: category?.name || categoryKey, path: `/documents/${categoryKey}` }
  ];

  if (!category) {
    notFound();
  }

  const documents = getDocumentsByCategory(categoryKey);

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
          <p className="text-gray-600">
            {documents.length}個のアイテム
          </p>
          <div className="flex items-center gap-2">
            <Link href="/documents/edit">
              <Button className="bg-carebase-blue hover:bg-carebase-blue-dark">
                <FileText className="h-4 w-4 mr-2" />
                新規{category.name}
              </Button>
            </Link>
            <Button
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              新しいフォルダ
            </Button>
          </div>
        </div>
      </div>

      {/* フォルダ内容表示 */}
      <FolderContentsView
        items={documents}
        selectedItems={[]}
        onItemSelection={() => {}}
        onSelectAll={() => {}}
      />
    </div>
  );
}
