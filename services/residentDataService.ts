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
import type { MedicationStatus } from '@/types/medication-status';
import type {
  HomeCareOfficeFormData,
  MedicalHistoryFormData as MedicalHistoryFormDataType,
  MedicalInstitutionFormData,
  MedicationInfoFormData,
  MedicationStatusFormData,
} from '@/validations/resident-data-validation';

class ResidentDataService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  // Home Care Office Methods
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
      businessName: data.businessName,
      careManager: data.careManager,
      phone: data.phone,
      fax: data.fax || '',
      address: data.address,
      notes: data.notes,
    };

    console.log('Mock created home care office:', newOffice);
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
      businessName: data.businessName,
      careManager: data.careManager,
      phone: data.phone,
      fax: data.fax || '',
      address: data.address,
      notes: data.notes,
    };

    console.log('Mock updated home care office:', updatedOffice);
    return updatedOffice;
  }

  async deleteHomeCareOffice(residentId: number, officeId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    console.log('Mock deleted home care office:', { residentId, officeId });
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

    console.log('Mock created medical institution:', newInstitution);
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

    console.log('Mock updated medical institution:', updatedInstitution);
    return updatedInstitution;
  }

  async deleteMedicalInstitution(residentId: number, institutionId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    console.log('Mock deleted medical institution:', { residentId, institutionId });
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

    console.log('Mock created medical history:', newHistory);
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

    console.log('Mock updated medical history:', updatedHistory);
    return updatedHistory;
  }

  async deleteMedicalHistory(residentId: number, historyId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    console.log('Mock deleted medical history:', { residentId, historyId });
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

    console.log('Mock created medication info:', newMedication);
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

    console.log('Mock updated medication info:', updatedMedication);
    return updatedMedication;
  }

  async deleteMedicationInfo(residentId: number, medicationId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    console.log('Mock deleted medication info:', { residentId, medicationId });
  }

  // Medication Status Methods
  async createMedicationStatus(
    residentId: number,
    data: MedicationStatusFormData
  ): Promise<MedicationStatus> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.1) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    const newStatus: MedicationStatus = {
      id: `ms-${Date.now()}`,
      date: data.date,
      content: data.content,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Mock created medication status:', newStatus);
    return newStatus;
  }

  async updateMedicationStatus(
    residentId: number,
    statusId: string,
    data: MedicationStatusFormData
  ): Promise<MedicationStatus> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    const updatedStatus: MedicationStatus = {
      id: statusId,
      date: data.date,
      content: data.content,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Mock updated medication status:', updatedStatus);
    return updatedStatus;
  }

  async deleteMedicationStatus(residentId: number, statusId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    console.log('Mock deleted medication status:', { residentId, statusId });
  }
}

export const residentDataService = new ResidentDataService();
