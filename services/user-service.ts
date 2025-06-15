import { apiClient } from './api-client';
import type { ApiUser } from '@/types/api';

export class UserService {
  async getUsers(): Promise<ApiUser[]> {
    const response = await apiClient.getClient().get<ApiUser[]>('/api/users');
    return response.data;
  }

  async getUserById(id: string): Promise<ApiUser | null> {
    try {
      const response = await apiClient.getClient().get<ApiUser>(`/api/users/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<ApiUser>): Promise<ApiUser> {
    const response = await apiClient.getClient().put<ApiUser>(`/api/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.getClient().delete(`/api/users/${id}`);
  }
}

export const userService = new UserService();
