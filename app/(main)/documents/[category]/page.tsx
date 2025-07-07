import { notFound } from 'next/navigation';
import { DocumentList } from '@/components/3_organisms/documents/document-list';
import {
  documentCategories,
  getDocumentsByCategory,
  getCategoryByKey,
} from '@/mocks/documents-data';

interface DocumentCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function DocumentCategoryPage({ params }: DocumentCategoryPageProps) {
  const { category: categoryKey } = await params;
  const category = getCategoryByKey(categoryKey);

  if (!category) {
    notFound();
  }

  const documents = getDocumentsByCategory(categoryKey);

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <category.icon className="h-8 w-8 text-carebase-blue" />
          <h1 className="text-3xl font-bold text-carebase-text-primary">{category.name}</h1>
        </div>
        <p className="text-gray-600">{category.description}</p>
      </div>

      <DocumentList
        items={documents}
        categoryName={category.name}
      />
    </div>
  );
}

// Generate static params for all document categories
export function generateStaticParams() {
  return documentCategories.map((category) => ({
    category: category.key,
  }));
}