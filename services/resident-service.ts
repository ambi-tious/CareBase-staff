import { apiClient } from './api-client';
import type { ApiResident } from '@/types/api';
import type { Resident } from '@/mocks/care-board-data';

export class ResidentService {
  async getResidents(): Promise<Resident[]> {
    const response = await apiClient.getClient().get<ApiResident[]>('/api/residents');
    return response.data.map(this.transformApiResidentToFrontend);
  }

  async getResidentById(id: string): Promise<Resident | null> {
    try {
      const response = await apiClient.getClient().get<ApiResident>(`/api/residents/${id}`);
      return this.transformApiResidentToFrontend(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createResident(residentData: Partial<ApiResident>): Promise<Resident> {
    const response = await apiClient.getClient().post<ApiResident>('/api/residents', residentData);
    return this.transformApiResidentToFrontend(response.data);
  }

  async updateResident(id: string, residentData: Partial<ApiResident>): Promise<Resident> {
    const response = await apiClient.getClient().put<ApiResident>(`/api/residents/${id}`, residentData);
    return this.transformApiResidentToFrontend(response.data);
  }

  private transformApiResidentToFrontend(apiResident: ApiResident): Resident {
    const birthDate = new Date(apiResident.birth_date);
    const age = this.calculateAge(birthDate);

    return {
      id: parseInt(apiResident.id),
      name: apiResident.name,
      furigana: '', // Not available from backend, will need to be added later
      dob: apiResident.birth_date,
      sex: '男', // Default, will need to be added to backend
      age,
      admissionDate: apiResident.created_at.split('T')[0],
      registrationDate: apiResident.created_at.split('T')[0],
      lastUpdateDate: apiResident.updated_at.split('T')[0],
      admissionStatus: apiResident.status === 'active' ? '入居中' : '退所済',
      careLevel: '要介護1', // Default, will need to be added to backend
      certificationDate: apiResident.created_at.split('T')[0],
      certValidityStart: apiResident.created_at.split('T')[0],
      certValidityEnd: new Date(new Date(apiResident.created_at).getFullYear() + 1, new Date(apiResident.created_at).getMonth(), new Date(apiResident.created_at).getDate()).toISOString().split('T')[0],
      address: '', // Will need to be added to backend
      avatarUrl: '/elderly-japanese-man.png', // Default avatar
      events: [], // Will need care events API
      contacts: [], // Will need contacts API
      homeCareOffice: undefined, // Will need home care office API
      medicalInstitutions: [], // Will need medical institutions API
      medicalHistory: [], // Will need medical history API
      medicationInfo: [], // Will need medication info API
      medicationStatus: [], // Will need medication status API
      individualPoints: [], // Will need individual points API
    };
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

export const residentService = new ResidentService();
