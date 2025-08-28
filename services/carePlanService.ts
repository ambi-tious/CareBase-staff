/**
 * Care Plan Service
 *
 * API service for care plan operations
 */

import type { CarePlan } from '@/types/care-plan';
import type { CarePlanFormData } from '@/validations/care-plan-validation';

class CarePlanService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Create new care plan
   */
  async createCarePlan(residentId: string, data: CarePlanFormData): Promise<CarePlan> {
    try {
      // For development, use mock creation
      if (process.env.NODE_ENV) {
        return this.mockCreateCarePlan(residentId, data);
      }

      const response = await fetch(`${this.baseUrl}/v1/residents/${residentId}/care-plans`, {
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
      console.error('Create care plan error:', error);
      throw new Error('ケアプランの作成に失敗しました。');
    }
  }

  /**
   * Update existing care plan
   */
  async updateCarePlan(
    residentId: string,
    planId: string,
    data: CarePlanFormData
  ): Promise<CarePlan> {
    try {
      // For development, use mock update
      if (process.env.NODE_ENV) {
        return this.mockUpdateCarePlan(residentId, planId, data);
      }

      const response = await fetch(
        `${this.baseUrl}/v1/residents/${residentId}/care-plans/${planId}`,
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
      return result;
    } catch (error) {
      console.error('Update care plan error:', error);
      throw new Error('ケアプランの更新に失敗しました。');
    }
  }

  /**
   * Get care plan by ID
   */
  async getCarePlan(residentId: string, planId: string): Promise<CarePlan> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV) {
        return this.mockGetCarePlan(residentId, planId);
      }

      const response = await fetch(
        `${this.baseUrl}/v1/residents/${residentId}/care-plans/${planId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get care plan error:', error);
      throw new Error('ケアプランの取得に失敗しました。');
    }
  }

  /**
   * Delete care plan
   */
  async deleteCarePlan(residentId: string, planId: string): Promise<void> {
    try {
      // For development, use mock deletion
      if (process.env.NODE_ENV) {
        return this.mockDeleteCarePlan(residentId, planId);
      }

      const response = await fetch(
        `${this.baseUrl}/v1/residents/${residentId}/care-plans/${planId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete care plan error:', error);
      throw new Error('ケアプランの削除に失敗しました。');
    }
  }

  /**
   * Mock care plan creation for development
   */
  private async mockCreateCarePlan(residentId: string, data: CarePlanFormData): Promise<CarePlan> {
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

    // Get resident name
    const residentName = this.getResidentNameById(residentId);

    // Generate new care plan
    const newCarePlan: CarePlan = {
      id: `plan-${Date.now()}`,
      residentId,
      residentName,
      planTitle: data.planTitle,
      planType: data.planType,
      careLevel: data.careLevel,
      certificationDate: data.certificationDate,
      certValidityStart: data.certValidityStart,
      certValidityEnd: data.certValidityEnd,
      certificationStatus: data.certificationStatus,
      careManager: data.careManager,
      careManagerOffice: data.careManagerOffice,
      status: 'active',
      isReferral: data.isReferral,
      residentIntention: data.residentIntention,
      familyIntention: data.familyIntention,
      assessmentCommitteeOpinion: data.assessmentCommitteeOpinion,
      comprehensiveGuidance: data.comprehensiveGuidance,
      consentObtained: data.consentObtained,
      goals: data.goals.filter((goal) => goal.trim() !== ''),
      services: data.services.map((service) => ({
        ...service,
        id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
      notes: data.notes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: staffId,
      createdByName: staffName,
      nextReviewDate: data.nextReviewDate,
    };

    // console.log('Mock created care plan:', newCarePlan);
    return newCarePlan;
  }

  /**
   * Mock care plan update for development
   */
  private async mockUpdateCarePlan(
    residentId: string,
    planId: string,
    data: CarePlanFormData
  ): Promise<CarePlan> {
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

    // Get resident name
    const residentName = this.getResidentNameById(residentId);

    // Update care plan
    const updatedCarePlan: CarePlan = {
      id: planId,
      residentId,
      residentName,
      planTitle: data.planTitle,
      planType: data.planType,
      careLevel: data.careLevel,
      certificationDate: data.certificationDate,
      certValidityStart: data.certValidityStart,
      certValidityEnd: data.certValidityEnd,
      certificationStatus: data.certificationStatus,
      careManager: data.careManager,
      careManagerOffice: data.careManagerOffice,
      status: 'active',
      isReferral: data.isReferral,
      residentIntention: data.residentIntention,
      familyIntention: data.familyIntention,
      assessmentCommitteeOpinion: data.assessmentCommitteeOpinion,
      comprehensiveGuidance: data.comprehensiveGuidance,
      consentObtained: data.consentObtained,
      goals: data.goals.filter((goal) => goal.trim() !== ''),
      services: data.services.map((service) => ({
        ...service,
        id:
          (service as any).id || `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })),
      notes: data.notes || undefined,
      createdAt: '2025-01-01T00:00:00.000Z', // Mock creation date
      updatedAt: new Date().toISOString(),
      createdBy: staffId,
      createdByName: staffName,
      nextReviewDate: data.nextReviewDate,
    };

    // console.log('Mock updated care plan:', updatedCarePlan);
    return updatedCarePlan;
  }

  /**
   * Mock get care plan for development
   */
  private async mockGetCarePlan(residentId: string, planId: string): Promise<CarePlan> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Import care plan data
    const { getCarePlanById } = await import('@/mocks/care-plan-data');
    const plan = getCarePlanById(planId);

    if (!plan) {
      throw new Error('ケアプランが見つかりません。');
    }

    return plan;
  }

  /**
   * Mock care plan deletion for development
   */
  private async mockDeleteCarePlan(residentId: string, planId: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // console.log('Mock deleted care plan:', { residentId, planId });
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

export const carePlanService = new CarePlanService();
