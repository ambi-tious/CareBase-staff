/**
 * Communication Service
 *
 * API service for communication record operations
 */

import type { CommunicationRecord, CommunicationThread } from '@/types/communication';
import type { CommunicationFormData } from '@/validations/communication-validation';

class CommunicationService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Get communication records for a resident
   */
  async getResidentCommunicationRecords(residentId: string): Promise<CommunicationRecord[]> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV) {
        return this.mockGetResidentCommunicationRecords(residentId);
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/communications`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.records;
    } catch (error) {
      console.error('Get resident communication records error:', error);
      throw new Error('コミュニケーション記録の取得に失敗しました。');
    }
  }

  /**
   * Get communication threads for a resident
   */
  async getResidentCommunicationThreads(residentId: string): Promise<CommunicationThread[]> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV) {
        return this.mockGetResidentCommunicationThreads(residentId);
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/communication-threads`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.threads;
    } catch (error) {
      console.error('Get resident communication threads error:', error);
      throw new Error('コミュニケーションスレッドの取得に失敗しました。');
    }
  }

  /**
   * Create new communication record
   */
  async createCommunicationRecord(residentId: string, data: CommunicationFormData): Promise<CommunicationRecord> {
    try {
      // For development, use mock creation
      if (process.env.NODE_ENV) {
        return this.mockCreateCommunicationRecord(residentId, data);
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/communications`, {
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
      return result.record;
    } catch (error) {
      console.error('Create communication record error:', error);
      throw new Error('コミュニケーション記録の登録に失敗しました。');
    }
  }

  /**
   * Update existing communication record
   */
  async updateCommunicationRecord(
    residentId: string,
    recordId: string,
    data: CommunicationFormData
  ): Promise<CommunicationRecord> {
    try {
      // For development, use mock update
      if (process.env.NODE_ENV) {
        return this.mockUpdateCommunicationRecord(residentId, recordId, data);
      }

      const response = await fetch(
        `${this.baseUrl}/residents/${residentId}/communications/${recordId}`,
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
      return result.record;
    } catch (error) {
      console.error('Update communication record error:', error);
      throw new Error('コミュニケーション記録の更新に失敗しました。');
    }
  }

  /**
   * Delete communication record
   */
  async deleteCommunicationRecord(residentId: string, recordId: string): Promise<void> {
    try {
      // For development, use mock deletion
      if (process.env.NODE_ENV) {
        return this.mockDeleteCommunicationRecord(residentId, recordId);
      }

      const response = await fetch(
        `${this.baseUrl}/residents/${residentId}/communications/${recordId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete communication record error:', error);
      throw new Error('コミュニケーション記録の削除に失敗しました。');
    }
  }

  /**
   * Mock implementations for development
   */
  private async mockGetResidentCommunicationRecords(residentId: string): Promise<CommunicationRecord[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { getCommunicationRecordsByResident } = await import('@/mocks/communication-data');
    return getCommunicationRecordsByResident(residentId);
  }

  private async mockGetResidentCommunicationThreads(residentId: string): Promise<CommunicationThread[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { getCommunicationThreadsByResident } = await import('@/mocks/communication-data');
    return getCommunicationThreadsByResident(residentId);
  }

  private async mockCreateCommunicationRecord(
    residentId: string,
    data: CommunicationFormData
  ): Promise<CommunicationRecord> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get current staff info
    let staffName = '田中 花子';
    let createdByStaffId = 'staff-001';
    try {
      const staffDataStr = localStorage.getItem('carebase_selected_staff_data');
      if (staffDataStr) {
        const staffData = JSON.parse(staffDataStr);
        createdByStaffId = staffData.staff.id;
      }
    } catch (error) {
      console.error('Failed to load staff data:', error);
    }

    // Get staff name from staffId
    const { getAllStaff } = await import('@/mocks/staff-data');
    const allStaff = getAllStaff();
    const selectedStaff = allStaff.find(s => s.id === data.staffId);
    staffName = selectedStaff?.name || '不明な職員';

    // Generate new record
    const newRecord: CommunicationRecord = {
      id: `comm-${Date.now()}`,
      residentId,
      datetime: data.datetime,
      staffId: data.staffId,
      staffName,
      contactPersonId: data.contactPersonId,
      contactPersonName: data.contactPersonName,
      contactPersonType: data.contactPersonType,
      communicationContent: data.communicationContent,
      responseContent: data.responseContent,
      isImportant: data.isImportant,
      threadId: data.threadId,
      parentId: data.parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: createdByStaffId,
      createdByName: selectedStaff?.name || '不明な職員',
    };

    return newRecord;
  }

  private async mockUpdateCommunicationRecord(
    residentId: string,
    recordId: string,
    data: CommunicationFormData
  ): Promise<CommunicationRecord> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get staff name from staffId
    const { getAllStaff } = await import('@/mocks/staff-data');
    const allStaff = getAllStaff();
    const selectedStaff = allStaff.find(s => s.id === data.staffId);

    // Update record
    const updatedRecord: CommunicationRecord = {
      id: recordId,
      residentId,
      datetime: data.datetime,
      staffId: data.staffId,
      staffName: selectedStaff?.name || '不明な職員',
      contactPersonId: data.contactPersonId,
      contactPersonName: data.contactPersonName,
      contactPersonType: data.contactPersonType,
      communicationContent: data.communicationContent,
      responseContent: data.responseContent,
      isImportant: data.isImportant,
      threadId: data.threadId,
      parentId: data.parentId,
      createdAt: '2025-01-01T00:00:00.000Z', // Mock creation date
      updatedAt: new Date().toISOString(),
      createdBy: 'staff-001', // Mock creator
      createdByName: '田中 花子',
    };

    return updatedRecord;
  }

  private async mockDeleteCommunicationRecord(residentId: string, recordId: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // console.log('Mock deleted communication record:', { residentId, recordId });
  }
}

export const communicationService = new CommunicationService();