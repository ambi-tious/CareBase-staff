'use client';

import { DocumentItemCard } from '@/components/2_molecules/documents/document-item-card';
import { DocumentToolbar } from '@/components/2_molecules/documents/document-toolbar';
import type { DocumentItem } from '@/mocks/documents-data';
import type React from 'react';
import { useState } from 'react';

interface DocumentListProps {
  items: DocumentItem[];
  onItemClick?: (item: DocumentItem) => void;
  className?: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  items,
  onItemClick,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

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
  };

  const handleUploadFile = () => {
    // TODO: Implement file upload
  };

  return (
    <div className={`space-y-6 ${className}`}>
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
