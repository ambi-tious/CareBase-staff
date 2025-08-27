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
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // Home Care Office Methods
  async getHomeCareOffices(): Promise<HomeCareOffice[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // モックデータ - 実際の実装ではAPIから取得
    const mockOffices: HomeCareOffice[] = [
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

    return mockOffices;
  }

  async createHomeCareOffice(
    residentId: number,
    data: HomeCareOfficeFormData
  ): Promise<HomeCareOffice> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.1) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    const newOffice: HomeCareOffice = {
      id: `hco-${Date.now()}`,
      businessName: data.businessName || '',
      careManager: data.careManager || '',
      phone: data.phone || '',
      fax: data.fax || '',
      address: data.address || '',
      notes: data.notes || '',
    };

    // console.log('Mock created home care office:', newOffice);
    return newOffice;
  }

  async updateHomeCareOffice(
    residentId: number,
    officeId: string,
    data: HomeCareOfficeFormData
  ): Promise<HomeCareOffice> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

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

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // console.log('Mock deleted home care office:', { residentId, officeId });
  }

  // マスタデータ管理用メソッド
  async createHomeCareOfficeMaster(data: HomeCareOfficeFormData): Promise<HomeCareOffice> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.1) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    const newOffice: HomeCareOffice = {
      id: `hco-master-${Date.now()}`,
      businessName: data.businessName || '',
      careManager: data.careManager || '',
      phone: data.phone || '',
      fax: data.fax || '',
      address: data.address || '',
      notes: data.notes || '',
    };

    // console.log('Mock created home care office master:', newOffice);
    return newOffice;
  }

  async updateHomeCareOfficeMaster(
    officeId: string,
    data: HomeCareOfficeFormData
  ): Promise<HomeCareOffice> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    const updatedOffice: HomeCareOffice = {
      id: officeId,
      businessName: data.businessName || '',
      careManager: data.careManager || '',
      phone: data.phone || '',
      fax: data.fax || '',
      address: data.address || '',
      notes: data.notes || '',
    };

    // console.log('Mock updated home care office master:', updatedOffice);
    return updatedOffice;
  }

  async deleteHomeCareOfficeMaster(officeId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // console.log('Mock deleted home care office master:', { officeId });
  }

  // Medical Institution Methods
  async createMedicalInstitution(
    residentId: number,
    data: MedicalInstitutionFormData
  ): Promise<MedicalInstitution> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.1) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    const newInstitution: MedicalInstitution = {
      id: `mi-${Date.now()}`,
      institutionName: data.institutionName,
      doctorName: data.doctorName,
      phone: data.phone,
      fax: data.fax || '',
      address: data.address,
      notes: data.notes,
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

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    const updatedInstitution: MedicalInstitution = {
      id: institutionId,
      institutionName: data.institutionName,
      doctorName: data.doctorName,
      phone: data.phone,
      fax: data.fax || '',
      address: data.address,
      notes: data.notes,
    };

    // console.log('Mock updated medical institution:', updatedInstitution);
    return updatedInstitution;
  }

  async deleteMedicalInstitution(residentId: number, institutionId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // console.log('Mock deleted medical institution:', { residentId, institutionId });
  }

  // Medical History Methods
  async createMedicalHistory(
    residentId: number,
    data: MedicalHistoryFormDataType
  ): Promise<MedicalHistory> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.1) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    const newHistory: MedicalHistory = {
      id: `mh-${Date.now()}`,
      date: data.onsetDate.replace('-', '/'), // Convert YYYY-MM to YYYY/MM
      diseaseName: data.diseaseName,
      treatmentStatus: data.treatmentStatus,
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

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    const updatedHistory: MedicalHistory = {
      id: historyId,
      date: data.onsetDate.replace(/-/g, '/'), // Convert YYYY-MM to YYYY/MM
      diseaseName: data.diseaseName,
      treatmentStatus: data.treatmentStatus,
      treatmentInstitution: data.treatmentInstitution,
      notes: data.notes,
    };

    // console.log('Mock updated medical history:', updatedHistory);
    return updatedHistory;
  }

  async deleteMedicalHistory(residentId: number, historyId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // console.log('Mock deleted medical history:', { residentId, historyId });
  }

  // Medication Info Methods
  async createMedicationInfo(
    residentId: number,
    data: MedicationInfoFormData
  ): Promise<MedicationInfo> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.1) {
      throw new Error('ネットワークエラーが発生しました。');
    }

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

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

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

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // console.log('Mock deleted medication info:', { residentId, medicationId });
  }
}

export const residentDataService = new ResidentDataService();
