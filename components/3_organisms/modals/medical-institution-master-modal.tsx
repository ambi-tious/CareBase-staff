'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { medicalMasterService } from '@/services/medicalMasterService';
import type {
  MedicalInstitutionMaster,
  MedicalInstitutionMasterFormData,
} from '@/types/medical-master';
import {
  Building2,
  Edit3,
  FileText,
  MapPin,
  Phone,
  Plus,
  Printer,
  Search,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { GenericDeleteModal } from './generic-delete-modal';
import { MedicalInstitutionMasterFormModal } from './medical-institution-master-form-modal';

interface MedicalInstitutionMasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const MedicalInstitutionMasterModal: React.FC<MedicalInstitutionMasterModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [institutions, setInstitutions] = useState<MedicalInstitutionMaster[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<MedicalInstitutionMaster[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<MedicalInstitutionMaster | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingInstitution, setDeletingInstitution] = useState<MedicalInstitutionMaster | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // マスタデータ取得
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setIsLoading(true);
        const fetchedInstitutions = await medicalMasterService.getMedicalInstitutions();
        setInstitutions(fetchedInstitutions);
        setFilteredInstitutions(fetchedInstitutions);
      } catch (error) {
        console.error('Failed to fetch medical institutions:', error);
        setInstitutions([]);
        setFilteredInstitutions([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchInstitutions();
    }
  }, [isOpen]);

  // 検索フィルター
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInstitutions(institutions);
    } else {
      const filtered = institutions.filter(
        (institution) =>
          institution.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (institution.address &&
            institution.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (institution.phone && institution.phone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredInstitutions(filtered);
    }
  }, [searchTerm, institutions]);

  const handleEdit = (institution: MedicalInstitutionMaster) => {
    setEditingInstitution(institution);
    setIsEditModalOpen(true);
  };

  const handleDelete = (institution: MedicalInstitutionMaster) => {
    setDeletingInstitution(institution);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    if (!deletingInstitution) return false;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await medicalMasterService.deleteMedicalInstitution(deletingInstitution.id);
      setInstitutions((prev) => prev.filter((i) => i.id !== deletingInstitution.id));
      onRefresh();
      return true;
    } catch (error) {
      console.error('Failed to delete medical institution:', error);
      setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = async (data: MedicalInstitutionMasterFormData): Promise<boolean> => {
    if (!editingInstitution) return false;

    try {
      const updatedInstitution = await medicalMasterService.updateMedicalInstitution(
        editingInstitution.id,
        data
      );
      setInstitutions((prev) =>
        prev.map((institution) =>
          institution.id === editingInstitution.id ? updatedInstitution : institution
        )
      );
      setEditingInstitution(null);
      setIsEditModalOpen(false);
      onRefresh();
      return true;
    } catch (error) {
      console.error('Failed to update medical institution:', error);
      return false;
    }
  };

  const handleCreateSubmit = async (data: MedicalInstitutionMasterFormData): Promise<boolean> => {
    try {
      const newInstitution = await medicalMasterService.createMedicalInstitution(data);
      setInstitutions((prev) => [...prev, newInstitution]);
      setIsCreateModalOpen(false);
      onRefresh();

      // 登録時はマスタのみ保存し、このモーダル（フォームモーダル）だけを閉じる
      // 親モーダル（マスタ一覧モーダル）は開いたまま保持
      return true;
    } catch (error) {
      console.error('Failed to create medical institution:', error);
      return false;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold py-3">医療機関マスタ管理</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 検索と新規作成 */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="医療機関名、住所、電話番号で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => {
                  setIsCreateModalOpen(true);
                }}
                className="bg-carebase-blue hover:bg-carebase-blue-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規登録
              </Button>
            </div>

            {/* 医療機関一覧 */}
            <div className="border rounded-lg">
              <ScrollArea className="h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">読み込み中...</div>
                  </div>
                ) : filteredInstitutions.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">
                      {searchTerm
                        ? '検索条件に一致する医療機関が見つかりません'
                        : '登録済みの医療機関がありません'}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredInstitutions.map((institution) => (
                      <div key={institution.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Building2 className="h-5 w-5 text-carebase-blue mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900">
                                {institution.institutionName}
                              </div>
                              <div className="text-sm text-gray-600 mt-1 grid grid-cols-2 gap-2">
                                {institution.address && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="truncate">{institution.address}</span>
                                  </div>
                                )}
                                {institution.phone && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span>{institution.phone}</span>
                                  </div>
                                )}
                                {institution.fax && (
                                  <div className="flex items-center gap-1">
                                    <Printer className="h-4 w-4 text-gray-400" />
                                    <span>{institution.fax}</span>
                                  </div>
                                )}
                                {institution.notes && (
                                  <div className="flex items-center gap-1">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    <span className="truncate">{institution.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(institution)}
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              編集
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(institution)}
                              disabled={isDeleting}
                              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              削除
                            </Button>
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
      {editingInstitution && (
        <MedicalInstitutionMasterFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingInstitution(null);
          }}
          onSubmit={handleEditSubmit}
          institution={editingInstitution}
          mode="edit"
        />
      )}

      {/* 新規作成モーダル */}
      <MedicalInstitutionMasterFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        mode="create"
      />

      {/* 削除確認モーダル */}
      {deletingInstitution && (
        <GenericDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingInstitution(null);
            setDeleteError(null);
          }}
          onConfirm={handleDeleteConfirm}
          itemName={deletingInstitution.institutionName}
          itemType="医療機関"
          isDeleting={isDeleting}
          error={deleteError}
        />
      )}
    </>
  );
};
