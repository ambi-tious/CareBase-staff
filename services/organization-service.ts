/**
 * Organization Service
 *
 * Service layer for organization-related API calls
 * Handles groups, teams, and staff data
 */

import { apiClient } from '@/lib/axios';
import type { Group, Staff, Team } from '@/mocks/staff-data';
import { getAllStaff, getGroupById, organizationData } from '@/mocks/staff-data';

class OrganizationService {
  /**
   * Get all organization groups
   */
  async getGroups(): Promise<Group[]> {
    // 開発環境の場合はモックデータを使用
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 開発環境: モックグループデータを返却');
      return organizationData;
    }

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
    // 開発環境の場合はモックデータを使用
    if (process.env.NODE_ENV === 'development') {
      const group = getGroupById(groupId);
      if (!group) {
        throw new Error('指定されたグループが見つかりません');
      }
      console.log('🔧 開発環境: モックチームデータを返却', {
        groupId,
        teamCount: group.teams.length,
      });
      return group.teams;
    }

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
    // 開発環境の場合はモックデータを使用
    if (process.env.NODE_ENV === 'development') {
      // 全グループから指定されたチームを検索
      for (const group of organizationData) {
        const team = group.teams.find((t) => t.id === teamId);
        if (team) {
          console.log('🔧 開発環境: モックスタッフデータを返却', {
            teamId,
            groupName: group.name,
            teamName: team.name,
            staffCount: team.staff.length,
          });
          return team.staff;
        }
      }
      throw new Error('指定されたチームが見つかりません');
    }

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
    // 開発環境の場合はモックデータを使用
    if (process.env.NODE_ENV === 'development') {
      const allStaff = getAllStaff();
      const staff = allStaff.find((s) => s.id === staffId);
      if (staff) {
        console.log('🔧 開発環境: モックスタッフデータを返却', {
          staffId,
          staffName: staff.name,
          role: staff.role,
        });
        return staff;
      }
      console.log('🔧 開発環境: 指定されたスタッフが見つかりません', { staffId });
      return null;
    }

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
