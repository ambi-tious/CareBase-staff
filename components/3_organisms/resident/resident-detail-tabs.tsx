'use client';

import { MedicationCard as NewMedicationCard } from '@/components/2_molecules/medication/medication-card';
import { ContactCard } from '@/components/2_molecules/resident/contact-info-card';
import { HomeCareOfficeCard } from '@/components/2_molecules/resident/home-care-office-card';
import { MedicalHistoryCard } from '@/components/2_molecules/resident/medical-history-card';
import { MedicalInstitutionCard } from '@/components/2_molecules/resident/medical-institution-card';
import { MedicationCard as OldMedicationCard } from '@/components/2_molecules/resident/medication-card';
import {
  AbsenceTabContent,
  type AbsenceTabContentRef,
} from '@/components/3_organisms/absence/absence-tab-content';
import {
  IndividualPointsTabContent,
  type IndividualPointsTabContentRef,
} from '@/components/3_organisms/individual-points/individual-points-tab-content';
import { ContactEditModal } from '@/components/3_organisms/modals/contact-edit-modal';
import { HomeCareOfficeMasterModal } from '@/components/3_organisms/modals/home-care-office-master-modal';
import { HomeCareOfficeModal } from '@/components/3_organisms/modals/home-care-office-modal';
import { MedicalHistoryModal } from '@/components/3_organisms/modals/medical-history-modal';
import { MedicalInstitutionMasterModal } from '@/components/3_organisms/modals/medical-institution-master-modal';
import { MedicalInstitutionModal } from '@/components/3_organisms/modals/medical-institution-modal';
import { MedicationModal } from '@/components/3_organisms/modals/medication-modal';
import {
  ResidentFilesTabContent,
  type ResidentFilesTabContentRef,
} from '@/components/3_organisms/resident-files/resident-files-tab-content';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  ContactPerson,
  HomeCareOffice,
  MedicalHistory,
  MedicalInstitution,
  Resident,
} from '@/mocks/care-board-data';
import { contactService } from '@/services/contactService';
import { medicationService } from '@/services/medicationService';
import { residentDataService } from '@/services/residentDataService';
import type { Medication } from '@/types/medication';
import type { ContactFormData } from '@/validations/contact-validation';
import type { MedicationFormData } from '@/validations/medication-validation';
import type {
  HomeCareOfficeFormData,
  MedicalHistoryFormData,
  MedicalInstitutionFormData,
} from '@/validations/resident-data-validation';
import { PlusCircle, Settings } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface ResidentDetailTabsProps {
  resident: Resident;
}

export const ResidentDetailTabs: React.FC<ResidentDetailTabsProps> = ({ resident }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isHomeCareModalOpen, setIsHomeCareModalOpen] = useState(false);

  const [isHomeCareMasterModalOpen, setIsHomeCareMasterModalOpen] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isMedicalMasterModalOpen, setIsMedicalMasterModalOpen] = useState(false);
  const [isMedicalHistoryModalOpen, setIsMedicalHistoryModalOpen] = useState(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);

  const [contacts, setContacts] = useState<ContactPerson[]>(resident.contacts || []);
  const [homeCareOffices, setHomeCareOffices] = useState<HomeCareOffice[]>([]);
  const [medicalInstitutions, setMedicalInstitutions] = useState<MedicalInstitution[]>(
    resident.medicalInstitutions || []
  );
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>(
    resident.medicalHistory || []
  );
  const [medications, setMedications] = useState<Medication[]>(resident.medications || []);
  const [showOngoingOnly, setShowOngoingOnly] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [duplicateData, setDuplicateData] = useState<MedicationFormData | undefined>(undefined);

  // 居宅介護支援事業所データを取得
  useEffect(() => {
    const fetchHomeCareOffices = async () => {
      try {
        const offices = await residentDataService.getResidentHomeCareOffices(resident.id);

        // サービスから空の配列が返された場合、residentデータを使用
        if (
          offices.length === 0 &&
          resident.homeCareOffices &&
          resident.homeCareOffices.length > 0
        ) {
          setHomeCareOffices(resident.homeCareOffices);
        } else {
          setHomeCareOffices(offices);
        }
      } catch (error) {
        console.error('Failed to fetch home care offices:', error);
        // フォールバックとして既存のデータを使用
        setHomeCareOffices(resident.homeCareOffices || []);
      }
    };

    fetchHomeCareOffices();
  }, [resident.id, resident.homeCareOffices]);

  const [activeTab, setActiveTab] = useState('family');
  const individualPointsTabContentRef = useRef<IndividualPointsTabContentRef>(null);
  const absenceTabContentRef = useRef<AbsenceTabContentRef>(null);
  const residentFilesTabContentRef = useRef<ResidentFilesTabContentRef>(null);

  const detailTabs = [
    { value: 'family', label: 'ご家族情報' },
    { value: 'homeCare', label: '居宅介護支援事業所' },
    { value: 'medical', label: 'かかりつけ医療機関' },
    { value: 'history', label: '現病歴＆既往歴' },
    { value: 'medicationInfo', label: 'お薬情報' },
    { value: 'individualPoints', label: '個別ポイント' },
    { value: 'files', label: 'ファイル' },
    { value: 'absence', label: '不在情報' },
  ];

  const handleAddContact = () => {
    setIsContactModalOpen(true);
  };

  const handleAddHomeCareOffice = () => {
    setIsHomeCareModalOpen(true);
  };

  const handleAddMedicalInstitution = () => {
    setIsMedicalModalOpen(true);
  };

  const handleAddMedicalHistory = () => {
    setIsMedicalHistoryModalOpen(true);
  };

  const handleAddMedication = () => {
    setDuplicateData(undefined);
    setIsMedicationModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    setDuplicateData(undefined);
  };

  const handleCreateSubmit = async (data: MedicationFormData): Promise<boolean> => {
    const success = await handleMedicationSubmit(data);
    if (success) {
      setIsCreateModalOpen(false);
      setDuplicateData(undefined);
    }
    return success;
  };

  const handleContactSubmit = async (contactData: ContactFormData): Promise<boolean> => {
    try {
      const newContact = await contactService.createContact(resident.id, contactData);
      setContacts((prev) => [...prev, newContact]);

      // Show success toast
      toast.success('連絡先の登録が完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to create contact:', error);
      return false;
    }
  };

  const handleHomeCareOfficeSubmit = async (data: HomeCareOfficeFormData): Promise<boolean> => {
    try {
      const newOffice = await residentDataService.createHomeCareOffice(resident.id, data);
      setHomeCareOffices((prev) => [...prev, newOffice]);

      // Show success toast
      toast.success('居宅介護支援事業所の登録が完了しました。');

      // 登録完了後、すべてのモーダルを閉じる
      setIsHomeCareModalOpen(false);
      setIsHomeCareMasterModalOpen(false);
      return true;
    } catch (error) {
      console.error('Failed to create home care office:', error);
      return false;
    }
  };

  const handleMedicalInstitutionMasterRefresh = () => {
    // 医療機関マスタが更新された際の処理（必要に応じて実装）
    // マスタデータ更新完了
  };

  const handleHomeCareOfficeMasterRefresh = () => {
    // マスタデータが更新された場合の処理
    // 必要に応じて選択モーダルのデータを再取得
  };

  const handleMedicalInstitutionSubmit = async (
    data: MedicalInstitutionFormData
  ): Promise<boolean> => {
    try {
      const newInstitution = await residentDataService.createMedicalInstitution(resident.id, data);
      setMedicalInstitutions((prev) => [...prev, newInstitution]);

      // Show success toast
      toast.success('かかりつけ医療機関の登録が完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to create medical institution:', error);
      return false;
    }
  };

  const handleMedicalHistorySubmit = async (data: MedicalHistoryFormData): Promise<boolean> => {
    try {
      const newHistory = await residentDataService.createMedicalHistory(resident.id, data);
      setMedicalHistory((prev) => [...prev, newHistory]);

      // Show success toast
      toast.success('現病歴＆既往歴の登録が完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to create medical history:', error);
      return false;
    }
  };

  const handleMedicationSubmit = async (data: MedicationFormData): Promise<boolean> => {
    try {
      const newMedication = await medicationService.createMedication(resident.id, data);
      setMedications((prev) => [...prev, newMedication]);

      // Show success toast
      toast.success('お薬情報の登録が完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to create medication:', error);
      return false;
    }
  };

  const handleMedicationDuplicate = (medication: Medication) => {
    // 複製時は服用終了日をリセットし、開始日を今日に設定
    const duplicateData: MedicationFormData = {
      medicationName: medication.medicationName,
      dosageInstructions: medication.dosageInstructions,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      prescribingInstitution: medication.prescribingInstitution,
      notes: medication.notes || '',
      thumbnailUrl: medication.thumbnailUrl || '',
    };

    // 複製モードで新規登録モーダルを開く
    setIsCreateModalOpen(true);
    setDuplicateData(duplicateData);
  };

  const handleContactUpdate = (updatedContact: ContactPerson) => {
    setContacts((prev) =>
      prev.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact))
    );
  };

  const handleHomeCareOfficeUpdate = (updatedOffice: HomeCareOffice) => {
    setHomeCareOffices((prev) =>
      prev.map((office) => (office.id === updatedOffice.id ? updatedOffice : office))
    );
  };

  const handleMedicalInstitutionUpdate = (updatedInstitution: MedicalInstitution) => {
    setMedicalInstitutions((prev) =>
      prev.map((institution) =>
        institution.id === updatedInstitution.id ? updatedInstitution : institution
      )
    );
  };

  const handleMedicalHistoryUpdate = (updatedHistory: MedicalHistory) => {
    setMedicalHistory((prev) =>
      prev.map((history) => (history.id === updatedHistory.id ? updatedHistory : history))
    );
  };

  const handleMedicationUpdate = (updatedMedication: Medication) => {
    setMedications((prev) =>
      prev.map((medication) =>
        medication.id === updatedMedication.id ? updatedMedication : medication
      )
    );
  };

  const handleContactDelete = (contactId: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
  };

  const handleHomeCareOfficeDelete = async (officeId: string) => {
    try {
      // 利用者からの紐付けを解除
      await residentDataService.dissociateHomeCareOfficeFromResident(resident.id, officeId);
      setHomeCareOffices((prev) => prev.filter((office) => office.id !== officeId));

      // Show success toast
      toast.success('居宅介護支援事業所の紐付けを解除しました。');
    } catch (error) {
      console.error('Failed to dissociate home care office:', error);
      toast.error('居宅介護支援事業所の紐付け解除に失敗しました。');
    }
  };

  const handleMedicalInstitutionDelete = (institutionId: string) => {
    setMedicalInstitutions((prev) =>
      prev.filter((institution) => institution.id !== institutionId)
    );
  };

  const handleMedicalHistoryDelete = (historyId: string) => {
    setMedicalHistory((prev) => prev.filter((history) => history.id !== historyId));
  };

  const handleMedicationDelete = (medicationId: string) => {
    setMedications((prev) => prev.filter((medication) => medication.id !== medicationId));
  };

  const shouldShowAddButton = () => {
    return [
      'family',
      'homeCare',
      'medical',
      'history',
      'medicationInfo',
      'individualPoints',
      'files',
      'absence',
    ].includes(activeTab);
  };

  const getAddButtonHandler = () => {
    switch (activeTab) {
      case 'family':
        return handleAddContact;
      case 'homeCare':
        return handleAddHomeCareOffice;
      case 'medical':
        return handleAddMedicalInstitution;
      case 'history':
        return handleAddMedicalHistory;
      case 'medicationInfo':
        return handleAddMedication;
      case 'individualPoints':
        return () => individualPointsTabContentRef.current?.openCategoryModal();
      case 'files':
        return () => residentFilesTabContentRef.current?.openUploadModal();
      case 'absence':
        return () => absenceTabContentRef.current?.openCreateModal();
      default:
        return undefined;
    }
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case 'family':
        return 'ご家族情報を追加';
      case 'homeCare':
        return '居宅介護支援事業所を追加';
      case 'medical':
        return 'かかりつけ医療機関を追加';
      case 'history':
        return '現病歴＆既往歴を追加';
      case 'medicationInfo':
        return 'お薬情報を追加';
      case 'individualPoints':
        return 'カテゴリ管理';
      case 'files':
        return 'ファイルをアップロード';
      case 'absence':
        return '不在情報を追加';
      default:
        return '追加';
    }
  };

  return (
    <>
      <Tabs defaultValue="family" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-gray-200 p-1.5 rounded-xl">
            {detailTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-carebase-blue data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 px-4 py-2.5 text-sm font-medium rounded-lg"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {shouldShowAddButton() && (
            <Button
              variant="outline"
              onClick={getAddButtonHandler()}
              className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium"
            >
              {activeTab === 'individualPoints' ? (
                <>
                  <Settings className="h-4 w-4 mr-2 text-carebase-blue" />
                  <span>{getAddButtonText()}</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2 text-carebase-blue" />
                  {getAddButtonText()}
                </>
              )}
            </Button>
          )}
        </div>

        <TabsContent value="family">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  residentId={resident.id}
                  residentName={resident.name}
                  onUpdate={handleContactUpdate}
                  onDelete={handleContactDelete}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8 md:col-span-2">
                ご家族情報はありません。
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="homeCare">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {homeCareOffices.length > 0 ? (
              <>
                {homeCareOffices.map((office) => (
                  <HomeCareOfficeCard
                    key={office.id}
                    office={office}
                    residentId={resident.id}
                    residentName={resident.name}
                    onOfficeUpdate={handleHomeCareOfficeUpdate}
                    onOfficeDelete={handleHomeCareOfficeDelete}
                  />
                ))}
              </>
            ) : (
              <p className="text-center text-gray-500 py-8 md:col-span-2">
                居宅介護支援事業所の情報はありません。
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="medical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {medicalInstitutions.length > 0 ? (
              medicalInstitutions.map((institution) => (
                <MedicalInstitutionCard
                  key={institution.id}
                  institution={institution}
                  residentId={resident.id}
                  residentName={resident.name}
                  onInstitutionUpdate={handleMedicalInstitutionUpdate}
                  onInstitutionDelete={handleMedicalInstitutionDelete}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8 md:col-span-2">
                かかりつけ医療機関の情報はありません。
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {medicalHistory.length > 0 ? (
              <>
                {/* Sort by onset date (newest first), then by registration date */}
                {[...medicalHistory]
                  .sort((a, b) => {
                    // First sort by onset date (newest first)
                    const dateA = a.date ? new Date(a.date.replace('/', '-') + '-01') : new Date(0);
                    const dateB = b.date ? new Date(b.date.replace('/', '-') + '-01') : new Date(0);
                    if (dateB.getTime() !== dateA.getTime()) {
                      return dateB.getTime() - dateA.getTime();
                    }
                    // If same onset date, sort by ID (assuming newer IDs are larger)
                    return b.id.localeCompare(a.id);
                  })
                  .map((history) => (
                    <MedicalHistoryCard
                      key={history.id}
                      history={history}
                      residentId={resident.id}
                      residentName={resident.name}
                      medicalInstitutions={medicalInstitutions}
                      onHistoryUpdate={handleMedicalHistoryUpdate}
                      onHistoryDelete={handleMedicalHistoryDelete}
                    />
                  ))}
              </>
            ) : (
              <p className="text-center text-gray-500 py-8 md:col-span-2">
                現病歴＆既往歴の情報はありません。
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="medicationInfo">
          <div className="space-y-4">
            {/* フィルターオプション */}
            {medications.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ongoing-only"
                  checked={showOngoingOnly}
                  onCheckedChange={(checked) => setShowOngoingOnly(checked as boolean)}
                />
                <label
                  htmlFor="ongoing-only"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  服用中のみ表示
                </label>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {medications.length > 0 ? (
                (() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const filteredMedications = showOngoingOnly
                    ? medications.filter((medication) => {
                        const endDate = medication.endDate ? new Date(medication.endDate) : null;
                        if (endDate) {
                          endDate.setHours(23, 59, 59, 999);
                        }
                        return !endDate || endDate >= today;
                      })
                    : medications;

                  return filteredMedications.length > 0 ? (
                    filteredMedications.map((medication) => (
                      <NewMedicationCard
                        key={medication.id}
                        medication={medication}
                        residentId={resident.id}
                        residentName={resident.name}
                        medicalInstitutions={medicalInstitutions}
                        onMedicationUpdate={handleMedicationUpdate}
                        onMedicationDelete={handleMedicationDelete}
                        onMedicationDuplicate={handleMedicationDuplicate}
                        isFiltered={showOngoingOnly}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8 md:col-span-2">
                      {showOngoingOnly
                        ? '服用中のお薬情報はありません。'
                        : 'お薬情報はありません。'}
                    </p>
                  );
                })()
              ) : resident.medicationInfo && resident.medicationInfo.length > 0 ? (
                // Fallback to old medication info for backward compatibility
                resident.medicationInfo.map((medication) => (
                  <OldMedicationCard key={medication.id} medication={medication} />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8 md:col-span-2">
                  お薬情報はありません。
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="absence">
          <div className="space-y-4">
            <AbsenceTabContent
              ref={absenceTabContentRef}
              residentId={resident.id}
              residentName={resident.name}
            />
          </div>
        </TabsContent>

        <TabsContent value="individualPoints">
          <div className="space-y-4">
            <IndividualPointsTabContent
              ref={individualPointsTabContentRef}
              residentId={resident.id}
              residentName={resident.name}
            />
          </div>
        </TabsContent>

        <TabsContent value="files">
          <div className="space-y-4">
            <ResidentFilesTabContent
              ref={residentFilesTabContentRef}
              residentId={resident.id}
              residentName={resident.name}
            />
          </div>
        </TabsContent>
      </Tabs>

      <ContactEditModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmit={handleContactSubmit}
        contact={{
          id: '',
          name: '',
          relationship: '',
          phone1: '',
          address: '',
          type: '連絡先',
        }}
        residentName={resident.name}
      />

      <HomeCareOfficeMasterModal
        isOpen={isHomeCareMasterModalOpen}
        onClose={() => setIsHomeCareMasterModalOpen(false)}
        onRefresh={handleHomeCareOfficeMasterRefresh}
      />

      <HomeCareOfficeModal
        isOpen={isHomeCareModalOpen}
        onClose={() => setIsHomeCareModalOpen(false)}
        onSubmit={handleHomeCareOfficeSubmit}
        residentName={resident.name}
        mode="create"
      />

      <MedicalInstitutionMasterModal
        isOpen={isMedicalMasterModalOpen}
        onClose={() => setIsMedicalMasterModalOpen(false)}
        onRefresh={handleMedicalInstitutionMasterRefresh}
      />

      <MedicalInstitutionModal
        isOpen={isMedicalModalOpen}
        onClose={() => setIsMedicalModalOpen(false)}
        onSubmit={handleMedicalInstitutionSubmit}
        residentName={resident.name}
        mode="create"
      />

      <MedicalHistoryModal
        isOpen={isMedicalHistoryModalOpen}
        onClose={() => setIsMedicalHistoryModalOpen(false)}
        onSubmit={handleMedicalHistorySubmit}
        residentName={resident.name}
        medicalInstitutions={medicalInstitutions}
        mode="create"
      />

      <MedicationModal
        isOpen={isMedicationModalOpen}
        onClose={() => setIsMedicationModalOpen(false)}
        onSubmit={handleMedicationSubmit}
        residentName={resident.name}
        medicalInstitutions={medicalInstitutions}
        mode="create"
      />

      <MedicationModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSubmit={handleCreateSubmit}
        residentName={resident.name}
        medicalInstitutions={medicalInstitutions}
        mode="create"
        initialData={duplicateData}
      />
    </>
  );
};
