/**
 * Resident File Service
 *
 * API service for resident file operations
 */

import type { ResidentFile } from '@/types/resident-file';
import type { ResidentFileFormData } from '@/validations/resident-file-validation';

class ResidentFileService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Get files for a resident
   */
  async getResidentFiles(residentId: string): Promise<ResidentFile[]> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV) {
        return this.mockGetResidentFiles(residentId);
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/files`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.files;
    } catch (error) {
      console.error('Get resident files error:', error);
      throw new Error('ファイル一覧の取得に失敗しました。');
    }
  }

  /**
   * Upload new file for a resident
   */
  async uploadResidentFile(
    residentId: string,
    file: File,
    data: ResidentFileFormData
  ): Promise<ResidentFile> {
    try {
      // For development, use mock upload
      if (process.env.NODE_ENV) {
        return this.mockUploadResidentFile(residentId, file, data);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', data.category);
      if (data.description) formData.append('description', data.description);
      if (data.tags) formData.append('tags', data.tags);

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.file;
    } catch (error) {
      console.error('Upload resident file error:', error);
      throw new Error('ファイルのアップロードに失敗しました。');
    }
  }

  /**
   * Delete resident file
   */
  async deleteResidentFile(residentId: string, fileId: string): Promise<void> {
    try {
      // For development, use mock deletion
      if (process.env.NODE_ENV) {
        return this.mockDeleteResidentFile(residentId, fileId);
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete resident file error:', error);
      throw new Error('ファイルの削除に失敗しました。');
    }
  }

  /**
   * Update resident file metadata
   */
  async updateResidentFile(
    residentId: string,
    fileId: string,
    data: ResidentFileFormData
  ): Promise<ResidentFile> {
    try {
      // For development, use mock update
      if (process.env.NODE_ENV) {
        return this.mockUpdateResidentFile(residentId, fileId, data);
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/files/${fileId}`, {
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
      return result.file;
    } catch (error) {
      console.error('Update resident file error:', error);
      throw new Error('ファイル情報の更新に失敗しました。');
    }
  }

  /**
   * Mock implementations for development
   */
  private async mockGetResidentFiles(residentId: string): Promise<ResidentFile[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { getResidentFilesByResidentId } = await import('@/mocks/resident-file-data');
    return getResidentFilesByResidentId(residentId);
  }

  private async mockUploadResidentFile(
    residentId: string,
    file: File,
    data: ResidentFileFormData
  ): Promise<ResidentFile> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

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

    // Determine file type
    const isImage = file.type.startsWith('image/');
    const isDocument = !isImage;

    // Generate new file
    const newFile: ResidentFile = {
      id: `file-${Date.now()}`,
      residentId,
      fileName: `${Date.now()}_${file.name}`,
      originalFileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      category: data.category,
      status: 'active',
      description: data.description || '',
      tags: data.tags ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
      uploadedAt: new Date().toISOString(),
      uploadedBy: staffId,
      uploadedByName: staffName,
      url: URL.createObjectURL(file),
      thumbnailUrl: isImage ? URL.createObjectURL(file) : undefined,
      isImage,
      isDocument,
    };

    return newFile;
  }

  private async mockUpdateResidentFile(
    residentId: string,
    fileId: string,
    data: ResidentFileFormData
  ): Promise<ResidentFile> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // Get existing file from mock data
    const { getResidentFileById } = await import('@/mocks/resident-file-data');
    const existingFile = getResidentFileById(fileId);

    if (!existingFile) {
      throw new Error('ファイルが見つかりません。');
    }

    // Update file metadata
    const updatedFile: ResidentFile = {
      ...existingFile,
      category: data.category,
      description: data.description || '',
      tags: data.tags ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
    };

    return updatedFile;
  }

  private async mockDeleteResidentFile(residentId: string, fileId: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // In a real implementation, this would delete the file from storage
    // console.log('Mock deleted resident file:', { residentId, fileId });
  }
}

export const residentFileService = new ResidentFileService();