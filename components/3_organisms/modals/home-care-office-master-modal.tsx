'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { HomeCareOffice } from '@/mocks/care-board-data';
import { residentDataService } from '@/services/residentDataService';
import type { HomeCareOfficeFormData } from '@/validations/resident-data-validation';
import { Building2, Check, Edit3, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GenericDeleteModal } from './generic-delete-modal';
import { HomeCareOfficeModal } from './home-care-office-modal';

interface HomeCareOfficeMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onSelect?: (office: HomeCareOffice) => void; // 選択機能を追加
  isSelectionMode?: boolean; // 選択モードかどうか
  residentName?: string; // 利用者名（選択モード時）
  onCreateNew?: () => void; // 新規作成ハンドラー
  selectedOfficeIds?: string[]; // 選択済みの事業所IDリスト
}

export const HomeCareOfficeMasterModal: React.FC<HomeCareOfficeMasterModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
  onSelect,
  isSelectionMode = false,
  residentName,
  onCreateNew,
  selectedOfficeIds = [],
}) => {
  const [offices, setOffices] = useState<HomeCareOffice[]>([]);
  const [filteredOffices, setFilteredOffices] = useState<HomeCareOffice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<HomeCareOffice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingOffice, setDeletingOffice] = useState<HomeCareOffice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // マスタデータ取得
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        setIsLoading(true);
        const fetchedOffices = await residentDataService.getHomeCareOffices();
        setOffices(fetchedOffices);
        setFilteredOffices(fetchedOffices);
      } catch (error) {
        console.error('Failed to fetch home care offices:', error);
        setOffices([]);
        setFilteredOffices([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchOffices();
    }
  }, [isOpen]);

  // 検索フィルター
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOffices(offices);
    } else {
      const filtered = offices.filter(
        (office) =>
          office.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          office.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          office.careManager.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOffices(filtered);
    }
  }, [searchTerm, offices]);

  const handleEdit = (office: HomeCareOffice) => {
    setEditingOffice(office);
    setIsEditModalOpen(true);
  };

  const handleDelete = (office: HomeCareOffice) => {
    setDeletingOffice(office);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    if (!deletingOffice) return false;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await residentDataService.deleteHomeCareOfficeMaster(deletingOffice.id);
      setOffices((prev) => prev.filter((o) => o.id !== deletingOffice.id));
      onRefresh();
      return true;
    } catch (error) {
      console.error('Failed to delete home care office:', error);
      setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelect = (office: HomeCareOffice) => {
    if (onSelect) {
      onSelect(office);
      onClose();
    }
  };

  const handleEditSubmit = async (data: HomeCareOfficeFormData): Promise<boolean> => {
    if (!editingOffice) return false;

    try {
      const updatedOffice = await residentDataService.updateHomeCareOfficeMaster(
        editingOffice.id,
        data
      );
      setOffices((prev) =>
        prev.map((office) => (office.id === editingOffice.id ? updatedOffice : office))
      );
      setEditingOffice(null);
      setIsEditModalOpen(false);
      onRefresh();
      return true;
    } catch (error) {
      console.error('Failed to update home care office:', error);
      return false;
    }
  };

  const handleCreateSubmit = async (data: HomeCareOfficeFormData): Promise<boolean> => {
    try {
      const newOffice = await residentDataService.createHomeCareOfficeMaster(data);
      setOffices((prev) => [...prev, newOffice]);
      setIsCreateModalOpen(false);
      onRefresh();

      // 選択モードの場合は、新規作成した事業所を自動選択
      if (isSelectionMode && onSelect) {
        onSelect(newOffice);
        onClose();
      }
      return true;
    } catch (error) {
      console.error('Failed to create home care office:', error);
      return false;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold py-3">
              {isSelectionMode
                ? `${residentName}さんの居宅介護支援事業所を選択`
                : '居宅介護支援事業所マスタ管理'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 検索と新規作成 */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="事業所名、住所、担当者名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => {
                  if (onCreateNew) {
                    onCreateNew();
                  } else {
                    setIsCreateModalOpen(true);
                  }
                }}
                className="bg-carebase-blue hover:bg-carebase-blue-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規登録
              </Button>
            </div>

            {/* 事業所一覧 */}
            <div className="border rounded-lg">
              <ScrollArea className="h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">読み込み中...</div>
                  </div>
                ) : filteredOffices.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">
                      {searchTerm
                        ? '検索条件に一致する事業所が見つかりません'
                        : '登録済みの事業所がありません'}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredOffices.map((office) => (
                      <div key={office.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Building2 className="h-5 w-5 text-carebase-blue mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900">{office.businessName}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                <div>住所: {office.address}</div>
                                <div>電話: {office.phone}</div>
                                <div>担当者: {office.careManager}</div>
                                {office.notes && <div>備考: {office.notes}</div>}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2 ml-4">
                            <Button
                              onClick={() => handleSelect(office)}
                              className={`w-full ${
                                selectedOfficeIds.includes(office.id)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-carebase-blue hover:bg-carebase-blue-dark'
                              }`}
                              size="sm"
                              disabled={selectedOfficeIds.includes(office.id)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              {selectedOfficeIds.includes(office.id) ? '選択済み' : '選択'}
                            </Button>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(office)}
                              >
                                <Edit3 className="h-3 w-3 mr-1" />
                                編集
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(office)}
                                disabled={isDeleting}
                                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                削除
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {deleteError && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{deleteError}</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 編集モーダル */}
      {editingOffice && (
        <HomeCareOfficeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingOffice(null);
          }}
          onSubmit={handleEditSubmit}
          office={editingOffice}
          mode="edit"
        />
      )}

      {/* 新規作成モーダル */}
      <HomeCareOfficeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        mode="create"
      />

      {/* 削除確認モーダル */}
      {deletingOffice && (
        <GenericDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingOffice(null);
            setDeleteError(null);
          }}
          onConfirm={handleDeleteConfirm}
          itemName={deletingOffice.businessName}
          itemType="居宅介護支援事業所"
          isDeleting={isDeleting}
          error={deleteError}
        />
      )}
    </>
  );
};
