'use client';

import { MedicationCard as NewMedicationCard } from '@/components/2_molecules/medication/medication-card';
import { MedicationStatusCard } from '@/components/2_molecules/medication/medication-status-card';
import { ContactCard } from '@/components/2_molecules/resident/contact-info-card';
import { HomeCareOfficeCard } from '@/components/2_molecules/resident/home-care-office-card';
import { IndividualPointCard } from '@/components/2_molecules/resident/individual-point-card';
import { MedicalHistoryCard } from '@/components/2_molecules/resident/medical-history-card';
import { MedicalInstitutionCard } from '@/components/2_molecules/resident/medical-institution-card';
import { MedicationCard as OldMedicationCard } from '@/components/2_molecules/resident/medication-card';
import { ContactEditModal } from '@/components/3_organisms/modals/contact-edit-modal';
import { HomeCareOfficeModal } from '@/components/3_organisms/modals/home-care-office-modal';
import { MedicalHistoryModal } from '@/components/3_organisms/modals/medical-history-modal';
import { MedicalInstitutionModal } from '@/components/3_organisms/modals/medical-institution-modal';
import { MedicationModal } from '@/components/3_organisms/modals/medication-modal';
import { MedicationStatusModal } from '@/components/3_organisms/modals/medication-status-modal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { IconName } from '@/lib/lucide-icon-registry';
import type {
  ContactPerson,
  HomeCareOffice,
  MedicalHistory,
  MedicalInstitution,
  Resident,
} from '@/mocks/care-board-data';
import { contactService } from '@/services/contactService';
import { medicationService } from '@/services/medicationService';
import { medicationStatusService } from '@/services/medicationStatusService';
import { residentDataService } from '@/services/residentDataService';
import type { ContactFormData } from '@/types/contact';
import type { Medication, MedicationFormData } from '@/types/medication';
import type { MedicationStatus, MedicationStatusFormData } from '@/types/medication-status';
import type {
  HomeCareOfficeFormData,
  MedicalHistoryFormData,
  MedicalInstitutionFormData,
} from '@/types/resident-data';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

interface ResidentDetailTabsProps {
  resident: Resident;
}

export const ResidentDetailTabs: React.FC<ResidentDetailTabsProps> = ({ resident }) => {
  const router = useRouter();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isHomeCareModalOpen, setIsHomeCareModalOpen] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isMedicalHistoryModalOpen, setIsMedicalHistoryModalOpen] = useState(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [isMedicationStatusModalOpen, setIsMedicationStatusModalOpen] = useState(false);
  const [selectedPointCategory, setSelectedPointCategory] = useState<string | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [pointContents, setPointContents] = useState<Record<string, string>>({
    食事: '<h2>食事に関する個別ポイント</h2><p>朝食：全粥・常菜・常食</p><p>昼食：全粥・常菜・常食</p><p>夕食：全粥・常菜・常食</p><ul><li>嚥下機能は良好</li><li>自力摂取可能</li><li>食事の際は前かがみの姿勢を保持</li><li>水分とろみ剤使用（中間のとろみ）</li></ul>',
    移乗介助:
      '<h2>移乗介助に関する個別ポイント</h2><p>基本的に見守りで自立</p><p>疲労時は一部介助が必要</p>',
    服薬: '<h2>服薬に関する個別ポイント</h2><p>自己管理は難しいため、職員管理</p><p>薬は粉砕して提供</p><p>水分はとろみをつけて提供</p>',
    接遇: '<h2>接遇に関する個別ポイント</h2><p>耳が遠いため、大きな声でゆっくり話す</p><p>目線を合わせて話しかける</p>',
    入浴: '<h2>入浴に関する個別ポイント</h2><p>一般浴槽使用</p><p>洗身は部分介助</p><p>洗髪は全介助</p><p>浴室内は見守り</p>',
  });
  const [showOnlyWithContent, setShowOnlyWithContent] = useState(false);
  const [contacts, setContacts] = useState<ContactPerson[]>(resident.contacts || []);
  const [homeCareOffice, setHomeCareOffice] = useState<HomeCareOffice | undefined>(
    resident.homeCareOffice
  );
  const [medicalInstitutions, setMedicalInstitutions] = useState<MedicalInstitution[]>(
    resident.medicalInstitutions || []
  );
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>(
    resident.medicalHistory || []
  );
  const [medications, setMedications] = useState<Medication[]>(resident.medications || []);
  const [medicationStatuses, setMedicationStatuses] = useState<MedicationStatus[]>(() => {
    // Convert old format to new format for backward compatibility
    if (resident.medicationStatus) {
      return resident.medicationStatus.map((status) => ({
        ...status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
    return [];
  });
  const [individualPoints, setIndividualPoints] = useState(resident.individualPoints || []);
  const [activeTab, setActiveTab] = useState('family');

  const detailTabs = [
    { value: 'family', label: 'ご家族情報' },
    { value: 'homeCare', label: '居宅介護支援事業所' },
    { value: 'medical', label: 'かかりつけ医療機関' },
    { value: 'history', label: '既往歴' },
    { value: 'medicationInfo', label: 'お薬情報' },
    { value: 'medicationStatus', label: '服薬状況' },
    { value: 'points', label: '個別ポイント' },
  ];

  const handleAddContact = () => {
    setIsContactModalOpen(true);
  };

  const handleAddCategory = () => {
    setIsAddCategoryModalOpen(true);
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
    setIsMedicationModalOpen(true);
  };

  const handleAddMedicationStatus = () => {
    setIsMedicationStatusModalOpen(true);
  };

  const handlePointCategoryClick = (category: string) => {
    // Check if content exists for this category
    const hasContent = !!pointContents[category];

    if (hasContent) {
      // Navigate to existing detail page
      router.push(`/residents/${resident.id}/individual-points/${encodeURIComponent(category)}`);
    } else {
      // Navigate to creation page
      router.push(
        `/residents/${resident.id}/individual-points/${encodeURIComponent(category)}?mode=create`
      );
    }
  };

  const handlePointDetailSave = async (content: string) => {
    // In a real application, this would call an API to save the content
    if (selectedPointCategory) {
      setPointContents((prev) => ({
        ...prev,
        [selectedPointCategory]: content,
      }));
    }
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return Promise.resolve();
  };

  const handlePointDetailDelete = async () => {
    // In a real application, this would call an API to delete the content
    if (selectedPointCategory) {
      setPointContents((prev) => {
        const newContents = { ...prev };
        delete newContents[selectedPointCategory];
        return newContents;
      });
    }
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return Promise.resolve();
  };

  const handleCategoryCreate = async (data: { category: string; icon: IconName }) => {
    // In a real application, this would call an API to create a new category
    // Generate a truly unique ID using timestamp and random number
    const uniqueId = `ip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPoint = {
      id: uniqueId,
      category: data.category,
      icon: data.icon,
      count: 0,
      isActive: true,
    };

    // Update local state immutably
    setIndividualPoints((prev) => [...prev, newPoint]);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return Promise.resolve();
  };

  const handleContactSubmit = async (contactData: ContactFormData): Promise<boolean> => {
    try {
      const newContact = await contactService.createContact(resident.id, contactData);
      setContacts((prev) => [...prev, newContact]);
      return true;
    } catch (error) {
      console.error('Failed to create contact:', error);
      return false;
    }
  };

  const handleHomeCareOfficeSubmit = async (data: HomeCareOfficeFormData): Promise<boolean> => {
    try {
      const newOffice = await residentDataService.createHomeCareOffice(resident.id, data);
      setHomeCareOffice(newOffice);
      return true;
    } catch (error) {
      console.error('Failed to create home care office:', error);
      return false;
    }
  };

  const handleMedicalInstitutionSubmit = async (
    data: MedicalInstitutionFormData
  ): Promise<boolean> => {
    try {
      const newInstitution = await residentDataService.createMedicalInstitution(resident.id, data);
      setMedicalInstitutions((prev) => [...prev, newInstitution]);
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
      return true;
    } catch (error) {
      console.error('Failed to create medication:', error);
      return false;
    }
  };

  const handleMedicationStatusSubmit = async (data: MedicationStatusFormData): Promise<boolean> => {
    try {
      const newStatus = await medicationStatusService.createMedicationStatus(resident.id, data);
      setMedicationStatuses((prev) => [...prev, newStatus]);
      return true;
    } catch (error) {
      console.error('Failed to create medication status:', error);
      return false;
    }
  };

  const handleContactUpdate = (updatedContact: ContactPerson) => {
    setContacts((prev) =>
      prev.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact))
    );
  };

  const handleHomeCareOfficeUpdate = (updatedOffice: HomeCareOffice) => {
    setHomeCareOffice(updatedOffice);
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

  const handleMedicationStatusUpdate = (updatedStatus: MedicationStatus) => {
    setMedicationStatuses((prev) =>
      prev.map((status) => (status.id === updatedStatus.id ? updatedStatus : status))
    );
  };

  const handleContactDelete = (contactId: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
  };

  const handleHomeCareOfficeDelete = () => {
    setHomeCareOffice(undefined);
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

  const handleMedicationStatusDelete = (statusId: string) => {
    setMedicationStatuses((prev) => prev.filter((status) => status.id !== statusId));
  };

  const shouldShowAddButton = () => {
    return [
      'family',
      'homeCare',
      'medical',
      'history',
      'medicationInfo',
      'medicationStatus',
      'points',
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
      case 'medicationStatus':
        return handleAddMedicationStatus;
      case 'points':
        return handleAddCategory;
      default:
        return undefined;
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
              <PlusCircle className="h-4 w-4 mr-2 text-carebase-blue" />
              追加
            </Button>
          )}
        </div>

        <TabsContent value="family">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                residentId={resident.id}
                residentName={resident.name}
                onUpdate={() => {
                  // Refresh data logic
                  window.location.reload();
                }}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">ご家族情報はありません。</p>
          )}
        </TabsContent>

        <TabsContent value="homeCare">
          {homeCareOffice ? (
            <HomeCareOfficeCard
              office={homeCareOffice}
              residentId={resident.id}
              residentName={resident.name}
              onOfficeUpdate={handleHomeCareOfficeUpdate}
              onOfficeDelete={handleHomeCareOfficeDelete}
            />
          ) : (
            <p className="text-center text-gray-500 py-8">居宅介護支援事業所の情報はありません。</p>
          )}
        </TabsContent>

        <TabsContent value="medical">
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
            <p className="text-center text-gray-500 py-8">かかりつけ医療機関の情報はありません。</p>
          )}
        </TabsContent>

        <TabsContent value="history">
          {medicalHistory.length > 0 ? (
            <div className="space-y-4">
              {/* Sort by onset date (newest first), then by registration date */}
              {[...medicalHistory]
                .sort((a, b) => {
                  // First sort by onset date (newest first)
                  const dateA = new Date(a.date.replace('/', '-') + '-01');
                  const dateB = new Date(b.date.replace('/', '-') + '-01');
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
                    onHistoryUpdate={handleMedicalHistoryUpdate}
                    onHistoryDelete={handleMedicalHistoryDelete}
                  />
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">既往歴の情報はありません。</p>
          )}
        </TabsContent>

        <TabsContent value="medicationInfo">
          {medications.length > 0 ? (
            medications.map((medication) => (
              <NewMedicationCard
                key={medication.id}
                medication={medication}
                residentId={resident.id}
                residentName={resident.name}
                onMedicationUpdate={handleMedicationUpdate}
                onMedicationDelete={handleMedicationDelete}
              />
            ))
          ) : resident.medicationInfo && resident.medicationInfo.length > 0 ? (
            // Fallback to old medication info for backward compatibility
            resident.medicationInfo.map((medication) => (
              <OldMedicationCard key={medication.id} medication={medication} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">お薬情報はありません。</p>
          )}
        </TabsContent>

        <TabsContent value="medicationStatus">
          {medicationStatuses.length > 0 ? (
            <div className="space-y-4">
              {/* Sort by date (newest first) */}
              {[...medicationStatuses]
                .sort((a, b) => {
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);
                  if (dateB.getTime() !== dateA.getTime()) {
                    return dateB.getTime() - dateA.getTime();
                  }
                  // If same date, sort by ID (assuming newer IDs are larger)
                  return b.id.localeCompare(a.id);
                })
                .map((status) => (
                  <MedicationStatusCard
                    key={status.id}
                    medicationStatus={status}
                    residentId={resident.id}
                    residentName={resident.name}
                    onStatusUpdate={handleMedicationStatusUpdate}
                    onStatusDelete={handleMedicationStatusDelete}
                  />
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">服薬状況の情報はありません。</p>
          )}
        </TabsContent>

        <TabsContent value="points">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={showOnlyWithContent ? 'default' : 'outline'}
                className={
                  showOnlyWithContent ? 'bg-carebase-blue hover:bg-carebase-blue-dark' : 'bg-white'
                }
                onClick={() => setShowOnlyWithContent(true)}
              >
                内容のある項目のみ表示
              </Button>
              <Button
                variant={!showOnlyWithContent ? 'default' : 'outline'}
                className={
                  !showOnlyWithContent ? 'bg-carebase-blue hover:bg-carebase-blue-dark' : 'bg-white'
                }
                onClick={() => setShowOnlyWithContent(false)}
              >
                すべて表示
              </Button>
            </div>
          </div>

          <div className="mb-4 flex justify-end">
            <div className="flex gap-2"></div>
          </div>
          {individualPoints && individualPoints.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {individualPoints
                .filter((point) => !showOnlyWithContent || !!pointContents[point.category])
                .map((point) => (
                  <IndividualPointCard
                    key={point.id}
                    point={point}
                    hasContent={!!pointContents[point.category]}
                    onClick={() => handlePointCategoryClick(point.category)}
                  />
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">個別ポイントの情報はありません。</p>
          )}
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

      <HomeCareOfficeModal
        isOpen={isHomeCareModalOpen}
        onClose={() => setIsHomeCareModalOpen(false)}
        onSubmit={handleHomeCareOfficeSubmit}
        residentName={resident.name}
        mode="create"
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
        mode="create"
      />

      <MedicationModal
        isOpen={isMedicationModalOpen}
        onClose={() => setIsMedicationModalOpen(false)}
        onSubmit={handleMedicationSubmit}
        residentName={resident.name}
        mode="create"
      />

      <MedicationStatusModal
        isOpen={isMedicationStatusModalOpen}
        onClose={() => setIsMedicationStatusModalOpen(false)}
        onSubmit={handleMedicationStatusSubmit}
        residentName={resident.name}
        mode="create"
      />
    </>
  );
};
