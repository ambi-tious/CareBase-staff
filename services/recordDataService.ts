import type { RecordDataItem, MonthlyData, RecordDataResponse, MonthlyDataResponse } from '@/types/record-data';
import { getResidentRecordData, getResidentMonthlyData } from '@/mocks/record-data';

class RecordDataService {
  /**
   * Get record data for a specific resident and date
   */
  async getRecordData(residentId: string, date: string): Promise<RecordDataResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const records = getResidentRecordData(residentId, date);
      
      return {
        date,
        records,
        total: records.length,
      };
    } catch (error) {
      console.error('Failed to fetch record data:', error);
      throw new Error('記録データの取得に失敗しました');
    }
  }

  /**
   * Get monthly data for a specific resident and month
   */
  async getMonthlyData(residentId: string, month: string): Promise<MonthlyDataResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const data = getResidentMonthlyData(residentId, month);
      
      return {
        month,
        data,
      };
    } catch (error) {
      console.error('Failed to fetch monthly data:', error);
      throw new Error('月次データの取得に失敗しました');
    }
  }

  /**
   * Search record data
   */
  async searchRecordData(
    residentId: string,
    date: string,
    query: string,
    recordTypes: string[] = []
  ): Promise<RecordDataResponse> {
    try {
      // First get the base data
      const baseResponse = await this.getRecordData(residentId, date);
      
      // Filter records based on search criteria
      const filteredRecords = baseResponse.records.filter(record => {
        const matchesQuery = !query || 
          record.title.toLowerCase().includes(query.toLowerCase()) ||
          record.content.toLowerCase().includes(query.toLowerCase()) ||
          record.staffName.toLowerCase().includes(query.toLowerCase());

        const matchesType = recordTypes.length === 0 || recordTypes.includes(record.type);

        return matchesQuery && matchesType;
      });

      return {
        ...baseResponse,
        records: filteredRecords,
        total: filteredRecords.length,
      };
    } catch (error) {
      console.error('Failed to search record data:', error);
      throw new Error('記録データの検索に失敗しました');
    }
  }

  /**
   * Create new record data
   */
  async createRecordData(residentId: string, recordData: Partial<RecordDataItem>): Promise<RecordDataItem> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const newRecord: RecordDataItem = {
        id: `rd-${Date.now()}`,
        type: recordData.type || 'care',
        time: recordData.time || new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        title: recordData.title || '',
        content: recordData.content || '',
        staffName: recordData.staffName || 'システムユーザー',
        category: recordData.category,
        priority: recordData.priority || 'medium',
        notes: recordData.notes,
        attachments: recordData.attachments,
        status: recordData.status || 'completed',
      };

      // In a real app, this would save to a database
      console.log('Created record:', newRecord);
      
      return newRecord;
    } catch (error) {
      console.error('Failed to create record data:', error);
      throw new Error('記録データの作成に失敗しました');
    }
  }

  /**
   * Update existing record data
   */
  async updateRecordData(recordId: string, recordData: Partial<RecordDataItem>): Promise<RecordDataItem> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // In a real app, this would update the database
      const updatedRecord: RecordDataItem = {
        id: recordId,
        type: recordData.type || 'care',
        time: recordData.time || '',
        title: recordData.title || '',
        content: recordData.content || '',
        staffName: recordData.staffName || '',
        category: recordData.category,
        priority: recordData.priority,
        notes: recordData.notes,
        attachments: recordData.attachments,
        status: recordData.status,
      };

      console.log('Updated record:', updatedRecord);
      
      return updatedRecord;
    } catch (error) {
      console.error('Failed to update record data:', error);
      throw new Error('記録データの更新に失敗しました');
    }
  }

  /**
   * Delete record data
   */
  async deleteRecordData(recordId: string): Promise<boolean> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // In a real app, this would delete from database
      console.log('Deleted record:', recordId);
      
      return true;
    } catch (error) {
      console.error('Failed to delete record data:', error);
      throw new Error('記録データの削除に失敗しました');
    }
  }

  /**
   * Export record data
   */
  async exportRecordData(
    residentId: string,
    dateFrom: string,
    dateTo: string,
    format: 'csv' | 'pdf' = 'csv'
  ): Promise<Blob> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would generate and return the file
      const mockData = `日付,時刻,種別,タイトル,内容,担当者\n2025-01-21,08:30,ケア記録,朝食介助,朝食を8割程度摂取...,田中 花子`;
      
      return new Blob([mockData], { type: 'text/csv;charset=utf-8' });
    } catch (error) {
      console.error('Failed to export record data:', error);
      throw new Error('記録データのエクスポートに失敗しました');
    }
  }
}

export const recordDataService = new RecordDataService();