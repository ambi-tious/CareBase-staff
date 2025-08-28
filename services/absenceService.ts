/**
 * Absence Service
 *
 * API service for absence management operations
 */

import type { Absence } from '@/types/absence';
import type { AbsenceFormData } from '@/validations/absence-validation';

class AbsenceService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Get absences for a resident
   */
  async getResidentAbsences(residentId: string): Promise<Absence[]> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV) {
        return this.mockGetResidentAbsences(residentId);
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/absences`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.absences;
    } catch (error) {
      console.error('Get resident absences error:', error);
      throw new Error('不在情報の取得に失敗しました。');
    }
  }

  /**
   * Create new absence record
   */
  async createAbsence(residentId: string, data: AbsenceFormData): Promise<Absence> {
    try {
      // For development, use mock creation
      if (process.env.NODE_ENV) {
        return this.mockCreateAbsence(residentId, data);
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/absences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.absence;
    } catch (error) {
      console.error('Create absence error:', error);
      throw new Error('不在情報の登録に失敗しました。');
    }
  }

  /**
   * Update existing absence record
   */
  async updateAbsence(
    residentId: string,
    absenceId: string,
    data: AbsenceFormData
  ): Promise<Absence> {
    try {
      // For development, use mock update
      if (process.env.NODE_ENV) {
        return this.mockUpdateAbsence(residentId, absenceId, data);
      }

      const response = await fetch(
        `${this.baseUrl}/residents/${residentId}/absences/${absenceId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.absence;
    } catch (error) {
      console.error('Update absence error:', error);
      throw new Error('不在情報の更新に失敗しました。');
    }
  }

  /**
   * Delete absence record
   */
  async deleteAbsence(residentId: string, absenceId: string): Promise<void> {
    try {
      // For development, use mock deletion
      if (process.env.NODE_ENV) {
        return this.mockDeleteAbsence(residentId, absenceId);
      }

      const response = await fetch(
        `${this.baseUrl}/residents/${residentId}/absences/${absenceId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete absence error:', error);
      throw new Error('不在情報の削除に失敗しました。');
    }
  }

  /**
   * Update absence status
   */
  async updateAbsenceStatus(
    residentId: string,
    absenceId: string,
    status: string
  ): Promise<Absence> {
    try {
      // For development, use mock status update
      if (process.env.NODE_ENV) {
        return this.mockUpdateAbsenceStatus(residentId, absenceId, status);
      }

      const response = await fetch(
        `${this.baseUrl}/residents/${residentId}/absences/${absenceId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.absence;
    } catch (error) {
      console.error('Update absence status error:', error);
      throw new Error('不在ステータスの更新に失敗しました。');
    }
  }

  /**
   * Mock implementations for development
   */
  private async mockGetResidentAbsences(residentId: string): Promise<Absence[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { getAbsencesByResident } = await import('@/mocks/absence-data');
    return getAbsencesByResident(residentId);
  }

  private async mockCreateAbsence(residentId: string, data: AbsenceFormData): Promise<Absence> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get current staff info
    let staffName = '田中 花子';
    let staffId = 'staff-001';
    try {
      const staffDataStr = localStorage.getItem('carebase_selected_staff_data');
      if (staffDataStr) {
        const staffData = JSON.parse(staffDataStr);
        staffName = staffData.staff.name;
        staffId = staffData.staff.id;
      }
    } catch (error) {
      console.error('Failed to load staff data:', error);
    }

    // Determine status based on dates
    const now = new Date();
    const startDate = new Date(data.startDateTime);
    const endDate = new Date(data.endDateTime);

    let status: 'scheduled' | 'ongoing' | 'completed';
    if (now < startDate) {
      status = 'scheduled';
    } else if (now >= startDate && now <= endDate) {
      status = 'ongoing';
    } else {
      status = 'completed';
    }

    // Generate new absence
    const newAbsence: Absence = {
      id: `absence-${Date.now()}`,
      residentId,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      reason: data.reason,
      customReason: data.customReason || undefined,
      notes: data.notes || undefined,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: staffId,
      createdByName: staffName,
    };

    return newAbsence;
  }

  private async mockUpdateAbsence(
    residentId: string,
    absenceId: string,
    data: AbsenceFormData
  ): Promise<Absence> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get current staff info
    let staffName = '田中 花子';
    let staffId = 'staff-001';
    try {
      const staffDataStr = localStorage.getItem('carebase_selected_staff_data');
      if (staffDataStr) {
        const staffData = JSON.parse(staffDataStr);
        staffName = staffData.staff.name;
        staffId = staffData.staff.id;
      }
    } catch (error) {
      console.error('Failed to load staff data:', error);
    }

    // Update absence
    const updatedAbsence: Absence = {
      id: absenceId,
      residentId,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      reason: data.reason,
      customReason: data.customReason || undefined,
      notes: data.notes || undefined,
      status: 'scheduled', // Default status for updates
      createdAt: '2025-01-01T00:00:00.000Z', // Mock creation date
      updatedAt: new Date().toISOString(),
      createdBy: staffId,
      createdByName: staffName,
    };

    return updatedAbsence;
  }

  private async mockDeleteAbsence(residentId: string, absenceId: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // console.log('Mock deleted absence:', { residentId, absenceId });
  }

  private async mockUpdateAbsenceStatus(
    residentId: string,
    absenceId: string,
    status: string
  ): Promise<Absence> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { getAbsenceById } = await import('@/mocks/absence-data');
    const absence = getAbsenceById(absenceId);

    if (!absence) {
      throw new Error('不在情報が見つかりません。');
    }

    // Update status
    const updatedAbsence: Absence = {
      ...absence,
      status: status as any,
      updatedAt: new Date().toISOString(),
    };

    return updatedAbsence;
  }
}

export const absenceService = new AbsenceService();