/**
 * Medication Service
 *
 * API service for medication data operations
 */

import type { Medication } from '@/types/medication';
import type { MedicationFormData } from '@/validations/medication-validation';

class MedicationService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Create new medication for a resident
   */
  async createMedication(
    residentId: number,
    medicationData: MedicationFormData
  ): Promise<Medication> {
    try {
      // For development, use mock creation
      if (process.env.NODE_ENV) {
        return this.mockCreateMedication(residentId, medicationData);
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/medications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicationData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create medication error:', error);
      throw new Error('お薬情報の登録に失敗しました。');
    }
  }

  /**
   * Update existing medication
   */
  async updateMedication(
    residentId: number,
    medicationId: string,
    medicationData: MedicationFormData
  ): Promise<Medication> {
    try {
      // For development, use mock update
      if (process.env.NODE_ENV) {
        return this.mockUpdateMedication(residentId, medicationId, medicationData);
      }

      const response = await fetch(
        `${this.baseUrl}/residents/${residentId}/medications/${medicationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(medicationData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update medication error:', error);
      throw new Error('お薬情報の更新に失敗しました。');
    }
  }

  /**
   * Delete medication
   */
  async deleteMedication(residentId: number, medicationId: string): Promise<void> {
    try {
      // For development, use mock deletion
      if (process.env.NODE_ENV) {
        return this.mockDeleteMedication(residentId, medicationId);
      }

      const response = await fetch(
        `${this.baseUrl}/residents/${residentId}/medications/${medicationId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete medication error:', error);
      throw new Error('お薬情報の削除に失敗しました。');
    }
  }

  /**
   * Mock medication creation for development
   */
  private async mockCreateMedication(
    residentId: number,
    medicationData: MedicationFormData
  ): Promise<Medication> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.1) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // Generate new medication
    const newMedication: Medication = {
      id: `medication-${Date.now()}`,
      medicationName: medicationData.medicationName,
      dosageInstructions: medicationData.dosageInstructions,
      startDate: medicationData.startDate,
      endDate: medicationData.endDate || undefined,
      prescribingInstitution: medicationData.prescribingInstitution,
      notes: medicationData.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // console.log('Mock created medication:', newMedication);
    return newMedication;
  }

  /**
   * Mock medication update for development
   */
  private async mockUpdateMedication(
    residentId: number,
    medicationId: string,
    medicationData: MedicationFormData
  ): Promise<Medication> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // Update medication
    const updatedMedication: Medication = {
      id: medicationId,
      medicationName: medicationData.medicationName,
      dosageInstructions: medicationData.dosageInstructions,
      startDate: medicationData.startDate,
      endDate: medicationData.endDate || undefined,
      prescribingInstitution: medicationData.prescribingInstitution,
      notes: medicationData.notes || undefined,
      createdAt: '2025-01-01T00:00:00.000Z', // Mock creation date
      updatedAt: new Date().toISOString(),
    };

    // console.log('Mock updated medication:', updatedMedication);
    return updatedMedication;
  }

  /**
   * Mock medication deletion for development
   */
  private async mockDeleteMedication(residentId: number, medicationId: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // console.log('Mock deleted medication:', { residentId, medicationId });
  }
}

export const medicationService = new MedicationService();
