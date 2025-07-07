'use client';

import type React from 'react';
import { useState } from 'react';
import type { DocumentItem } from '@/mocks/documents-data';
import { DocumentItemCard } from '@/components/2_molecules/documents/document-item-card';
import { DocumentToolbar } from '@/components/2_molecules/documents/document-toolbar';
import { BreadcrumbNavigation } from '@/components/2_molecules/documents/breadcrumb-navigation';

interface DocumentListProps {
  items: DocumentItem[];
  categoryName: string;
  onItemClick?: (item: DocumentItem) => void;
  className?: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  items,
  categoryName,
  onItemClick,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

  const breadcrumbItems = [{ label: categoryName, path: '/' }];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const handleCreateFolder = () => {
    // TODO: Implement folder creation
    console.log('Create folder');
  };

  const handleUploadFile = () => {
    // TODO: Implement file upload
    console.log('Upload file');
  };

  const handleNavigate = (path: string) => {
    // TODO: Implement navigation
    console.log('Navigate to:', path);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <BreadcrumbNavigation items={breadcrumbItems} onNavigate={handleNavigate} />

      <DocumentToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onCreateFolder={handleCreateFolder}
        onUploadFile={handleUploadFile}
      />

      {sortedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? '検索結果が見つかりませんでした。' : 'ファイルがありません。'}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
              : 'space-y-2'
          }
        >
          {sortedItems.map((item) => (
            <DocumentItemCard
              key={item.id}
              item={item}
              onItemClick={onItemClick}
              className={viewMode === 'list' ? 'w-full' : ''}
            />
          ))}
        </div>
      )}
    </div>
  );
};