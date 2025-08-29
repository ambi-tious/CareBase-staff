/**
 * Resident Data Service
 *
 * Service layer for resident-related data API calls
 */

import type {
  HomeCareOffice,
  MedicalHistory,
  MedicalInstitution,
  MedicationInfo,
} from '@/mocks/care-board-data';

import type {
  HomeCareOfficeFormData,
  MedicalHistoryFormData as MedicalHistoryFormDataType,
  MedicalInstitutionFormData,
  MedicationInfoFormData,
} from '@/validations/resident-data-validation';

class ResidentDataService {
  private readonly STORAGE_KEY = 'carebase_home_care_offices_master';
  private readonly RESIDENT_OFFICES_KEY = 'carebase_resident_home_care_offices';

  // Home Care Office Master Data Methods
  private getStoredMasterOffices(): HomeCareOffice[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load stored home care offices:', error);
    }

    // 初回のデフォルトマスタデータ
    const defaultOffices: HomeCareOffice[] = [
      {
        id: '1',
        businessName: '渋谷ケアプランセンター',
        address: '東京都渋谷区渋谷1-1-1',
        phone: '03-1234-5678',
        fax: '03-1234-5679',
        careManager: '田中太郎',
        notes: '渋谷エリア専門のケアプランセンター',
      },
      {
        id: '2',
        businessName: '新宿ライフケアサポート',
        address: '東京都新宿区新宿2-2-2',
        phone: '03-2345-6789',
        fax: '03-2345-6790',
        careManager: '佐藤花子',
        notes: '新宿区在宅介護支援事業所',
      },
      {
        id: '3',
        businessName: '港区ホームケアサービス',
        address: '東京都港区港3-3-3',
        phone: '03-3456-7890',
        fax: '03-3456-7891',
        careManager: '鈴木一郎',
        notes: '港区地域密着型ケアサービス',
      },
      {
        id: '4',
        businessName: '品川ケアライフサポート',
        address: '東京都品川区品川4-4-4',
        phone: '03-4567-8901',
        fax: '03-4567-8902',
        careManager: '高橋美咲',
        notes: '品川区在宅介護支援センター',
      },
      {
        id: '5',
        businessName: '目黒サポートケアセンター',
        address: '東京都目黒区目黒5-5-5',
        phone: '03-5678-9012',
        fax: '03-5678-9013',
        careManager: '渡辺健太',
        notes: '目黒区専門のケアプランセンター',
      },
    ];

    // 初回のみデフォルトデータを保存
    this.storeMasterOffices(defaultOffices);
    return defaultOffices;
  }

  private storeMasterOffices(offices: HomeCareOffice[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(offices));
    } catch (error) {
      console.error('Failed to store home care offices:', error);
    }
  }

  private getResidentOfficesAssociations(): Record<number, string[]> {
    try {
      const stored = localStorage.getItem(this.RESIDENT_OFFICES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load resident office associations:', error);
    }

    // 初回の場合、モックデータから関連付けを生成
    const defaultAssociations = this.generateDefaultAssociations();
    this.storeResidentOfficesAssociations(defaultAssociations);
    return defaultAssociations;
  }

  private generateDefaultAssociations(): Record<number, string[]> {
    // モックデータから居宅介護支援事業所の関連付けを生成
    const associations = {
      1: ['1'], // 佐藤清 -> 渋谷ケアプランセンター
      2: ['2'], // 田中花子 -> 新宿ライフケアサポート
      3: ['3'], // 鈴木太郎 -> 港区ホームケアサービス
      4: ['4'], // 山田みどり -> 品川ケアライフサポート
      5: ['5'], // 鈴木幸子 -> 目黒サポートケアセンター
      6: ['1'], // 高橋茂 -> 渋谷ケアプランセンター
      7: ['2'], // 田中三郎 -> 新宿ライフケアサポート
      8: ['3'], // 佐々木一郎 -> 港区ホームケアサービス
      9: ['4'], // 伊藤和子 -> 品川ケアライフサポート
      10: ['1'], // 渡辺正夫 -> 渋谷ケアプランセンター
      11: ['2'], // 田中花子（11） -> 新宿ライフケアサポート
      12: ['3'], // 山田次郎 -> 港区ホームケアサービス
    };
    return associations;
  }

  private storeResidentOfficesAssociations(associations: Record<number, string[]>): void {
    try {
      localStorage.setItem(this.RESIDENT_OFFICES_KEY, JSON.stringify(associations));
    } catch (error) {
      console.error('Failed to store resident office associations:', error);
    }
  }

  async getHomeCareOffices(): Promise<HomeCareOffice[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return this.getStoredMasterOffices();
  }

  // 利用者の居宅介護支援事業所を取得
  async getResidentHomeCareOffices(residentId: number): Promise<HomeCareOffice[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const associations = this.getResidentOfficesAssociations();
    const officeIds = associations[residentId] || [];
    const allOffices = this.getStoredMasterOffices();

    const result = allOffices.filter((office) => officeIds.includes(office.id));

    return result;
  }

  // 利用者に居宅介護支援事業所を紐付け
  async associateHomeCareOfficeToResident(residentId: number, officeId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const associations = this.getResidentOfficesAssociations();
    if (!associations[residentId]) {
      associations[residentId] = [];
    }

    if (!associations[residentId].includes(officeId)) {
      associations[residentId].push(officeId);
      this.storeResidentOfficesAssociations(associations);
    }
  }

  // 利用者からの居宅介護支援事業所の紐付けを解除
  async dissociateHomeCareOfficeFromResident(residentId: number, officeId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const associations = this.getResidentOfficesAssociations();
    if (associations[residentId]) {
      associations[residentId] = associations[residentId].filter((id) => id !== officeId);
      this.storeResidentOfficesAssociations(associations);
    }
  }

  async createHomeCareOffice(
    residentId: number,
    data: HomeCareOfficeFormData
  ): Promise<HomeCareOffice> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 新しい事業所をマスタに追加
    const newOffice: HomeCareOffice = {
      id: `hco-${Date.now()}`,
      businessName: data.businessName || '',
      careManager: data.careManager || '',
      phone: data.phone || '',
      fax: data.fax || '',
      address: data.address || '',
      notes: data.notes || '',
    };

    // マスタデータに追加
    const allOffices = this.getStoredMasterOffices();
    allOffices.push(newOffice);
    this.storeMasterOffices(allOffices);

    // 利用者に自動紐付け
    await this.associateHomeCareOfficeToResident(residentId, newOffice.id);

    // console.log('Mock created home care office:', newOffice);
    return newOffice;
  }

  async updateHomeCareOffice(
    residentId: number,
    officeId: string,
    data: HomeCareOfficeFormData
  ): Promise<HomeCareOffice> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedOffice: HomeCareOffice = {
      id: officeId,
      businessName: data.businessName || '',
      careManager: data.careManager || '',
      phone: data.phone || '',
      fax: data.fax || '',
      address: data.address || '',
      notes: data.notes || '',
    };

    // console.log('Mock updated home care office:', updatedOffice);
    return updatedOffice;
  }

  async deleteHomeCareOffice(residentId: number, officeId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // console.log('Mock deleted home care office:', { residentId, officeId });
  }

  // マスタデータ管理用メソッド
  async createHomeCareOfficeMaster(data: HomeCareOfficeFormData): Promise<HomeCareOffice> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newOffice: HomeCareOffice = {
      id: `hco-master-${Date.now()}`,
      businessName: data.businessName || '',
      careManager: data.careManager || '',
      phone: data.phone || '',
      fax: data.fax || '',
      address: data.address || '',
      notes: data.notes || '',
    };

    // マスタデータに追加
    const allOffices = this.getStoredMasterOffices();
    allOffices.push(newOffice);
    this.storeMasterOffices(allOffices);

    // console.log('Mock created home care office master:', newOffice);
    return newOffice;
  }

  async updateHomeCareOfficeMaster(
    officeId: string,
    data: HomeCareOfficeFormData
  ): Promise<HomeCareOffice> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedOffice: HomeCareOffice = {
      id: officeId,
      businessName: data.businessName || '',
      careManager: data.careManager || '',
      phone: data.phone || '',
      fax: data.fax || '',
      address: data.address || '',
      notes: data.notes || '',
    };

    // マスタデータを更新
    const allOffices = this.getStoredMasterOffices();
    const index = allOffices.findIndex((office) => office.id === officeId);
    if (index !== -1) {
      allOffices[index] = updatedOffice;
      this.storeMasterOffices(allOffices);
    }

    // console.log('Mock updated home care office master:', updatedOffice);
    return updatedOffice;
  }

  async deleteHomeCareOfficeMaster(officeId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // マスタデータから削除
    const allOffices = this.getStoredMasterOffices();
    const filteredOffices = allOffices.filter((office) => office.id !== officeId);
    this.storeMasterOffices(filteredOffices);

    // 全利用者からの紐付けも削除
    const associations = this.getResidentOfficesAssociations();
    Object.keys(associations).forEach((residentId) => {
      associations[parseInt(residentId)] = associations[parseInt(residentId)].filter(
        (id) => id !== officeId
      );
    });
    this.storeResidentOfficesAssociations(associations);

    // console.log('Mock deleted home care office master:', { officeId });
  }

  // Medical Institution Methods
  async createMedicalInstitution(
    residentId: number,
    data: MedicalInstitutionFormData
  ): Promise<MedicalInstitution> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newInstitution: MedicalInstitution = {
      id: `mi-${Date.now()}`,
      institutionName: data.institutionName,
      doctorName: data.doctorName || '',
      phone: data.phone || '',
      fax: data.fax || '',
      address: data.address || '',
      notes: data.notes || '',
    };

    // console.log('Mock created medical institution:', newInstitution);
    return newInstitution;
  }

  async updateMedicalInstitution(
    residentId: number,
    institutionId: string,
    data: MedicalInstitutionFormData
  ): Promise<MedicalInstitution> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedInstitution: MedicalInstitution = {
      id: institutionId,
      institutionName: data.institutionName,
      doctorName: data.doctorName || '',
      phone: data.phone || '',
      fax: data.fax || '',
      address: data.address || '',
      notes: data.notes || '',
    };

    // console.log('Mock updated medical institution:', updatedInstitution);
    return updatedInstitution;
  }

  async deleteMedicalInstitution(residentId: number, institutionId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // console.log('Mock deleted medical institution:', { residentId, institutionId });
  }

  async dissociateMedicalInstitutionFromResident(
    residentId: number,
    institutionId: string
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 利用者からの医療機関の紐付けを解除（マスタからは削除しない）
    // console.log('Mock dissociated medical institution from resident:', { residentId, institutionId });
  }

  // Medical History Methods
  async createMedicalHistory(
    residentId: number,
    data: MedicalHistoryFormDataType
  ): Promise<MedicalHistory> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newHistory: MedicalHistory = {
      id: `mh-${Date.now()}`,
      date: data.onsetDate?.replace('-', '/') || '', // Convert YYYY-MM to YYYY/MM
      diseaseName: data.diseaseName,
      treatmentStatus: data.treatmentStatus || false,
      treatmentInstitution: data.treatmentInstitution,
      notes: data.notes,
    };

    // console.log('Mock created medical history:', newHistory);
    return newHistory;
  }

  async updateMedicalHistory(
    residentId: number,
    historyId: string,
    data: MedicalHistoryFormDataType
  ): Promise<MedicalHistory> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedHistory: MedicalHistory = {
      id: historyId,
      date: data.onsetDate?.replace(/-/g, '/') || '', // Convert YYYY-MM to YYYY/MM
      diseaseName: data.diseaseName,
      treatmentStatus: data.treatmentStatus || false,
      treatmentInstitution: data.treatmentInstitution,
      notes: data.notes,
    };

    // console.log('Mock updated medical history:', updatedHistory);
    return updatedHistory;
  }

  async deleteMedicalHistory(residentId: number, historyId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // console.log('Mock deleted medical history:', { residentId, historyId });
  }

  // Medication Info Methods
  async createMedicationInfo(
    residentId: number,
    data: MedicationInfoFormData
  ): Promise<MedicationInfo> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newMedication: MedicationInfo = {
      id: `med-${Date.now()}`,
      medicationName: data.medicationName,
      dosageInstructions: data.dosageInstructions || '',
      startDate: data.startDate || '',
      prescribingInstitution: data.prescribingInstitution || '',
      institution: data.institution,
      prescriptionDate: data.prescriptionDate,
      notes: data.notes,
      imageUrl: data.imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // console.log('Mock created medication info:', newMedication);
    return newMedication;
  }

  async updateMedicationInfo(
    residentId: number,
    medicationId: string,
    data: MedicationInfoFormData
  ): Promise<MedicationInfo> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedMedication: MedicationInfo = {
      id: medicationId,
      medicationName: data.medicationName,
      dosageInstructions: data.dosageInstructions,
      startDate: data.startDate,
      prescribingInstitution: data.prescribingInstitution,
      institution: data.institution,
      prescriptionDate: data.prescriptionDate,
      notes: data.notes,
      imageUrl: data.imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // console.log('Mock updated medication info:', updatedMedication);
    return updatedMedication;
  }

  async deleteMedicationInfo(residentId: number, medicationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // console.log('Mock deleted medication info:', { residentId, medicationId });
  }
}

export const residentDataService = new ResidentDataService();
