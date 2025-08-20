/**
 * Organization Service
 *
 * Service layer for organization-related API calls
 * Handles groups, teams, and staff data
 */

import { apiClient } from '@/lib/axios';
import type { Group, Staff, Team } from '@/mocks/staff-data';

class OrganizationService {
  /**
   * Get all organization groups
   */
  async getGroups(): Promise<Group[]> {
    try {
      const response = await apiClient.get('/v1/groups');

      if (response.status !== 200) {
        throw new Error(response.data.message || 'グループデータの取得に失敗しました');
      }

      return response.data.groups;
    } catch (error) {
      console.error('Get groups error:', error);
      throw new Error('グループデータの取得に失敗しました');
    }
  }

  /**
   * Get teams by group ID
   */
  async getTeamsByGroup(groupId: string): Promise<Team[]> {
    try {
      const response = await apiClient.get(`/v1/teams?groupId=${groupId}`);

      if (response.status !== 200) {
        throw new Error(response.data.message || 'チームデータの取得に失敗しました');
      }

      return response.data.teams;
    } catch (error) {
      console.error('Get teams by group error:', error);
      throw new Error('チームデータの取得に失敗しました');
    }
  }

  /**
   * Get staff by group and team
   */
  async getStaffByTeam(teamId: string): Promise<Staff[]> {
    try {
      const response = await apiClient.get(`/v1/staff?teamId=${teamId}`);

      if (response.status !== 200) {
        throw new Error(response.data.message || 'スタッフデータの取得に失敗しました');
      }

      return response.data.staff;
    } catch (error) {
      console.error('Get staff by group and team error:', error);
      throw new Error('スタッフデータの取得に失敗しました');
    }
  }

  /**
   * Get staff by ID
   */
  async getStaffById(staffId: string): Promise<Staff | null> {
    try {
      const response = await apiClient.get(`/v1/staff/${staffId}`);

      if (response.status !== 200) {
        throw new Error(response.data.message || 'スタッフデータの取得に失敗しました');
      }

      return response.data.staff;
    } catch (error) {
      console.error('Get staff by ID error:', error);
      throw new Error('スタッフデータの取得に失敗しました');
    }
  }
}

// Export singleton instance
export const organizationService = new OrganizationService();
