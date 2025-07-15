'use client';

import { DocumentItemCard } from '@/components/2_molecules/documents/document-item-card';
import { DocumentToolbar } from '@/components/2_molecules/documents/document-toolbar';
import type { DocumentFolder, DocumentItem } from '@/mocks/documents-data';
import { FolderCreateModal } from '@/components/3_organisms/modals/folder-create-modal';
import { FolderEditModal } from '@/components/3_organisms/modals/folder-edit-modal';
import { FolderDeleteModal } from '@/components/3_organisms/modals/folder-delete-modal';
import { useFolderManagement } from '@/hooks/useFolderManagement';
import type React from 'react';
import { useState, useMemo } from 'react';

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

  // フォルダ管理
  const folders = useMemo(() => {
    return items.filter((item): item is DocumentFolder => item.type === 'folder');
  }, [items]);

  const {
    folderNames,
    selectedFolder,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    createFolder,
    updateFolder,
    deleteFolder,
    getFolderItemCount,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
  } = useFolderManagement({
    initialFolders: folders,
    categoryKey: 'documents',
  });

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
        onCreateFolder={openCreateModal}
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
              onEditFolder={(folder) => openEditModal(folder as DocumentFolder)}
              onDeleteFolder={(folder) => openDeleteModal(folder as DocumentFolder)}
              className={viewMode === 'list' ? 'w-full' : ''}
            />
          ))}
        </div>
      )}

      {/* フォルダ管理モーダル */}
      <FolderCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreateFolder={createFolder}
        existingFolders={folderNames}
      />

      <FolderEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onUpdateFolder={updateFolder}
        folder={selectedFolder}
        existingFolders={folderNames}
      />

      <FolderDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDeleteFolder={deleteFolder}
        folder={selectedFolder}
        hasItems={selectedFolder ? selectedFolder.itemCount > 0 : false}
      />
    </div>
  );
};
