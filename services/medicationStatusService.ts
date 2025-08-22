/**
 * Medication Status Service
 *
 * API service for medication status operations
 */

import type { MedicationStatus } from '@/types/medication-status';
import type { MedicationStatusFormData } from '@/validations/medication-status-validation';

class MedicationStatusService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Create new medication status for a resident
   */
  async createMedicationStatus(
    residentId: number,
    statusData: MedicationStatusFormData
  ): Promise<MedicationStatus> {
    try {
      // For development, use mock creation
      if (!!process.env.NODE_ENV) {
        return this.mockCreateMedicationStatus(residentId, statusData);
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/medication-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create medication status error:', error);
      throw new Error('服薬状況の登録に失敗しました。');
    }
  }

  /**
   * Update existing medication status
   */
  async updateMedicationStatus(
    residentId: number,
    statusId: string,
    statusData: MedicationStatusFormData
  ): Promise<MedicationStatus> {
    try {
      // For development, use mock update
      if (!!process.env.NODE_ENV) {
        return this.mockUpdateMedicationStatus(residentId, statusId, statusData);
      }

      const response = await fetch(
        `${this.baseUrl}/residents/${residentId}/medication-status/${statusId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(statusData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update medication status error:', error);
      throw new Error('服薬状況の更新に失敗しました。');
    }
  }

  /**
   * Delete medication status
   */
  async deleteMedicationStatus(residentId: number, statusId: string): Promise<void> {
    try {
      // For development, use mock deletion
      if (!!process.env.NODE_ENV) {
        return this.mockDeleteMedicationStatus(residentId, statusId);
      }

      const response = await fetch(
        `${this.baseUrl}/residents/${residentId}/medication-status/${statusId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete medication status error:', error);
      throw new Error('服薬状況の削除に失敗しました。');
    }
  }

  /**
   * Mock medication status creation for development
   */
  private async mockCreateMedicationStatus(
    residentId: number,
    statusData: MedicationStatusFormData
  ): Promise<MedicationStatus> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.1) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // Generate new medication status
    const newStatus: MedicationStatus = {
      id: `status-${Date.now()}`,
      date: statusData.date,
      content: statusData.content,
      notes: statusData.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // console.log('Mock created medication status:', newStatus);
    return newStatus;
  }

  /**
   * Mock medication status update for development
   */
  private async mockUpdateMedicationStatus(
    residentId: number,
    statusId: string,
    statusData: MedicationStatusFormData
  ): Promise<MedicationStatus> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // Update medication status
    const updatedStatus: MedicationStatus = {
      id: statusId,
      date: statusData.date,
      content: statusData.content,
      notes: statusData.notes || undefined,
      createdAt: '2025-01-01T00:00:00.000Z', // Mock creation date
      updatedAt: new Date().toISOString(),
    };

    // console.log('Mock updated medication status:', updatedStatus);
    return updatedStatus;
  }

  /**
   * Mock medication status deletion for development
   */
  private async mockDeleteMedicationStatus(residentId: number, statusId: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // console.log('Mock deleted medication status:', { residentId, statusId });
  }
}

export const medicationStatusService = new MedicationStatusService();
