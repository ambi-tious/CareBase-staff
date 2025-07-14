import { notFound } from 'next/navigation';
import { DocumentList } from '@/components/3_organisms/documents/document-list';
import { getDocumentsByCategory, getCategoryByKey } from '@/mocks/documents-data';
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

  if (!category) {
    notFound();
  }

  const documents = getDocumentsByCategory(categoryKey);

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      <DocumentList items={documents} />
    </div>
  );
}
