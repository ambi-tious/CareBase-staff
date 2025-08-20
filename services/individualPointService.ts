/**
 * Individual Point Service
 *
 * Service layer for individual point API calls
 */

import type { IndividualPoint, PointCategory } from '@/types/individual-point';
import type {
  CategoryFormData,
  IndividualPointFormData,
} from '@/validations/individual-point-validation';

class IndividualPointService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Get individual points for a resident
   */
  async getIndividualPoints(residentId: string): Promise<IndividualPoint[]> {
    try {
      if (process.env.NODE_ENV) {
        return this.mockGetIndividualPoints(residentId);
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/individual-points`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get individual points error:', error);
      throw new Error('個別ポイントの取得に失敗しました。');
    }
  }

  /**
   * Create new individual point
   */
  async createIndividualPoint(
    residentId: string,
    data: IndividualPointFormData,
    mediaFiles?: File[]
  ): Promise<IndividualPoint> {
    try {
      if (process.env.NODE_ENV) {
        return this.mockCreateIndividualPoint(residentId, data, mediaFiles);
      }

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));

      if (mediaFiles) {
        mediaFiles.forEach((file, index) => {
          formData.append(`media_${index}`, file);
        });
      }

      const response = await fetch(`${this.baseUrl}/residents/${residentId}/individual-points`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Create individual point error:', error);
      throw new Error('個別ポイントの作成に失敗しました。');
    }
  }

  /**
   * Update existing individual point
   */
  async updateIndividualPoint(
    residentId: string,
    pointId: string,
    data: IndividualPointFormData,
    mediaFiles?: File[]
  ): Promise<IndividualPoint> {
    try {
      if (process.env.NODE_ENV) {
        return this.mockUpdateIndividualPoint(residentId, pointId, data, mediaFiles);
      }

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));

      if (mediaFiles) {
        mediaFiles.forEach((file, index) => {
          formData.append(`media_${index}`, file);
        });
      }

      const response = await fetch(
        `${this.baseUrl}/residents/${residentId}/individual-points/${pointId}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Update individual point error:', error);
      throw new Error('個別ポイントの更新に失敗しました。');
    }
  }

  /**
   * Delete individual point
   */
  async deleteIndividualPoint(residentId: string, pointId: string): Promise<void> {
    try {
      if (process.env.NODE_ENV) {
        return this.mockDeleteIndividualPoint(residentId, pointId);
      }

      const response = await fetch(
        `${this.baseUrl}/residents/${residentId}/individual-points/${pointId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete individual point error:', error);
      throw new Error('個別ポイントの削除に失敗しました。');
    }
  }

  /**
   * Get point categories
   */
  async getPointCategories(): Promise<PointCategory[]> {
    try {
      if (process.env.NODE_ENV) {
        return this.mockGetPointCategories();
      }

      const response = await fetch(`${this.baseUrl}/point-categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get point categories error:', error);
      throw new Error('カテゴリの取得に失敗しました。');
    }
  }

  /**
   * Create new point category
   */
  async createPointCategory(data: CategoryFormData): Promise<PointCategory> {
    try {
      if (process.env.NODE_ENV) {
        return this.mockCreatePointCategory(data);
      }

      const response = await fetch(`${this.baseUrl}/point-categories`, {
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
      console.error('Create point category error:', error);
      throw new Error('カテゴリの作成に失敗しました。');
    }
  }

  /**
   * Mock implementations for development
   */
  private async mockGetIndividualPoints(residentId: string): Promise<IndividualPoint[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { getIndividualPointsByResident } = await import('@/mocks/individual-points-data');
    return getIndividualPointsByResident(residentId);
  }

  private async mockCreateIndividualPoint(
    residentId: string,
    data: IndividualPointFormData,
    mediaFiles?: File[]
  ): Promise<IndividualPoint> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

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

    // Mock media attachments
    const mediaAttachments =
      mediaFiles?.map((file, index) => ({
        id: `media-${Date.now()}-${index}`,
        fileName: file.name,
        fileType: file.type.startsWith('image/')
          ? ('image' as const)
          : file.type.startsWith('video/')
            ? ('video' as const)
            : ('document' as const),
        fileSize: file.size,
        url: URL.createObjectURL(file),
        thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        uploadedAt: new Date().toISOString(),
        uploadedBy: staffId,
      })) || [];

    const newPoint: IndividualPoint = {
      id: `point-${Date.now()}`,
      residentId,
      title: data.title,
      content: data.content,
      category: data.category,
      priority: data.priority,
      status: data.status,
      tags: data.tags,
      notes: data.notes,
      mediaAttachments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: staffId,
      createdByName: staffName,
      isSystemDefault: false,
    };

    // console.log('Mock created individual point:', newPoint);
    return newPoint;
  }

  private async mockUpdateIndividualPoint(
    residentId: string,
    pointId: string,
    data: IndividualPointFormData,
    mediaFiles?: File[]
  ): Promise<IndividualPoint> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

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

    // Mock media attachments for new files
    const newMediaAttachments =
      mediaFiles?.map((file, index) => ({
        id: `media-${Date.now()}-${index}`,
        fileName: file.name,
        fileType: file.type.startsWith('image/')
          ? ('image' as const)
          : file.type.startsWith('video/')
            ? ('video' as const)
            : ('document' as const),
        fileSize: file.size,
        url: URL.createObjectURL(file),
        thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        uploadedAt: new Date().toISOString(),
        uploadedBy: staffId,
      })) || [];

    const updatedPoint: IndividualPoint = {
      id: pointId,
      residentId,
      title: data.title,
      content: data.content,
      category: data.category,
      priority: data.priority,
      status: data.status,
      tags: data.tags,
      notes: data.notes,
      mediaAttachments: newMediaAttachments,
      createdAt: '2025-01-01T00:00:00.000Z', // Mock creation date
      updatedAt: new Date().toISOString(),
      createdBy: staffId,
      createdByName: staffName,
      isSystemDefault: false,
    };

    // console.log('Mock updated individual point:', updatedPoint);
    return updatedPoint;
  }

  private async mockDeleteIndividualPoint(residentId: string, pointId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // console.log('Mock deleted individual point:', { residentId, pointId });
  }

  private async mockGetPointCategories(): Promise<PointCategory[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { pointCategoriesData } = await import('@/mocks/individual-points-data');
    return pointCategoriesData;
  }

  private async mockCreatePointCategory(data: CategoryFormData): Promise<PointCategory> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.1) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    const newCategory: PointCategory = {
      id: `cat-${Date.now()}`,
      name: data.name,
      description: data.description || '',
      icon: data.icon,
      color: data.color,
      isSystemDefault: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // console.log('Mock created point category:', newCategory);
    return newCategory;
  }
}

export const individualPointService = new IndividualPointService();
