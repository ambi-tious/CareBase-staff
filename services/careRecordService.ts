/**
 * Care Record Service
 *
 * API service for care record operations
 */

import type { CareRecord } from '@/types/care-record';
import type { CareRecordFormData } from '@/validations/care-record-validation';

class CareRecordService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  /**
   * Create new care record
   */
  async createCareRecord(data: CareRecordFormData): Promise<CareRecord> {
    try {
      // For development, use mock creation
      if (process.env.NODE_ENV) {
        return this.mockCreateCareRecord(data);
      }

      const response = await fetch(`${this.baseUrl}/api/v1/care-records`, {
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
      return result;
    } catch (error) {
      console.error('Create care record error:', error);
      throw new Error('介護記録の作成に失敗しました。');
    }
  }

  /**
   * Update existing care record
   */
  async updateCareRecord(recordId: string, data: CareRecordFormData): Promise<CareRecord> {
    try {
      // For development, use mock update
      if (process.env.NODE_ENV) {
        return this.mockUpdateCareRecord(recordId, data);
      }

      const response = await fetch(`${this.baseUrl}/api/v1/care-records/${recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Update care record error:', error);
      throw new Error('介護記録の更新に失敗しました。');
    }
  }

  /**
   * Delete care record
   */
  async deleteCareRecord(recordId: string): Promise<void> {
    try {
      // For development, use mock deletion
      if (process.env.NODE_ENV) {
        return this.mockDeleteCareRecord(recordId);
      }

      const response = await fetch(`${this.baseUrl}/api/v1/care-records/${recordId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete care record error:', error);
      throw new Error('介護記録の削除に失敗しました。');
    }
  }

  /**
   * Get care record by ID
   */
  async getCareRecord(recordId: string): Promise<CareRecord> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV) {
        return this.mockGetCareRecord(recordId);
      }

      const response = await fetch(`${this.baseUrl}/api/v1/care-records/${recordId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get care record error:', error);
      throw new Error('介護記録の取得に失敗しました。');
    }
  }

  /**
   * Mock care record creation for development
   */
  private async mockCreateCareRecord(data: CareRecordFormData): Promise<CareRecord> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.1) {
      throw new Error('ネットワークエラーが発生しました。');
    }

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

    // Generate summary from content
    const summary = data.content.length > 50 ? data.content.substring(0, 47) + '...' : data.content;

    // Generate new care record
    const newRecord: CareRecord = {
      id: `record-${Date.now()}`,
      residentId: data.residentId,
      residentName: this.getResidentNameById(data.residentId),
      category: data.category,
      title: data.title,
      content: data.content,
      summary,
      recordedAt: data.recordedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: staffId,
      createdByName: staffName,
      priority: data.priority,
      status: data.status,
    };

    // console.log('Mock created care record:', newRecord);
    return newRecord;
  }

  /**
   * Mock care record update for development
   */
  private async mockUpdateCareRecord(
    recordId: string,
    data: CareRecordFormData
  ): Promise<CareRecord> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

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

    // Generate summary from content
    const summary = data.content.length > 50 ? data.content.substring(0, 47) + '...' : data.content;

    // Update care record
    const updatedRecord: CareRecord = {
      id: recordId,
      residentId: data.residentId,
      residentName: this.getResidentNameById(data.residentId),
      category: data.category,
      title: data.title,
      content: data.content,
      summary,
      recordedAt: data.recordedAt,
      createdAt: '2025-01-01T00:00:00.000Z', // Mock creation date
      updatedAt: new Date().toISOString(),
      createdBy: staffId,
      createdByName: staffName,
      priority: data.priority,
      status: data.status,
    };

    // console.log('Mock updated care record:', updatedRecord);
    return updatedRecord;
  }

  /**
   * Mock care record deletion for development
   */
  private async mockDeleteCareRecord(recordId: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // console.log('Mock deleted care record:', recordId);
  }

  /**
   * Mock get care record for development
   */
  private async mockGetCareRecord(recordId: string): Promise<CareRecord> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Import care record data
    const { getCareRecordById } = await import('@/mocks/care-record-data');
    const record = getCareRecordById(recordId);

    if (!record) {
      throw new Error('介護記録が見つかりません。');
    }

    return record;
  }

  /**
   * Helper to get resident name by ID
   */
  private getResidentNameById(residentId: string): string {
    // Mock resident mapping
    const residentMap: Record<string, string> = {
      '1': '佐藤清',
      '2': '田中花子',
      '3': '鈴木太郎',
      '4': '山田みどり',
      '5': '鈴木幸子',
      '6': '高橋茂',
      '7': '田中三郎',
    };

    return residentMap[residentId] || '不明な利用者';
  }
}

export const careRecordService = new CareRecordService();
