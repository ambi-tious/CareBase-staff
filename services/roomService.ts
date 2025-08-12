/**
 * Room Service
 *
 * API service for room management
 */

import api from '@/lib/api';
import { getAllActiveRooms, getRoomsByGroup, getRoomsByGroupAndTeam } from '@/mocks/room-data';
import type { Room } from '@/types/room';

class RoomService {
  /**
   * Get rooms by group and team
   */
  async getRoomsByGroupAndTeam(groupId: string, teamId: string): Promise<Room[]> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV) {
        return this.mockGetRoomsByGroupAndTeam(groupId, teamId);
      }

      const response = await api.get(`/api/rooms?groupId=${groupId}&teamId=${teamId}`);
      return response.data.rooms;
    } catch (error) {
      console.error('Get rooms error:', error);
      throw new Error('部屋情報の取得に失敗しました。');
    }
  }

  /**
   * Get all active rooms
   */
  async getAllActiveRooms(): Promise<Room[]> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV) {
        return this.mockGetAllActiveRooms();
      }

      const response = await api.get('/api/rooms');
      return response.data.rooms;
    } catch (error) {
      console.error('Get all rooms error:', error);
      throw new Error('部屋情報の取得に失敗しました。');
    }
  }

  /**
   * Get rooms by group
   */
  async getRoomsByGroup(groupId: string): Promise<Room[]> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV) {
        return this.mockGetRoomsByGroup(groupId);
      }

      const response = await api.get(`/api/rooms?groupId=${groupId}`);
      return response.data.rooms;
    } catch (error) {
      console.error('Get rooms by group error:', error);
      throw new Error('部屋情報の取得に失敗しました。');
    }
  }

  /**
   * Mock implementations for development
   */
  private async mockGetRoomsByGroupAndTeam(groupId: string, teamId: string): Promise<Room[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getRoomsByGroupAndTeam(groupId, teamId);
  }

  private async mockGetAllActiveRooms(): Promise<Room[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getAllActiveRooms();
  }

  private async mockGetRoomsByGroup(groupId: string): Promise<Room[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getRoomsByGroup(groupId);
  }
}

export const roomService = new RoomService();
