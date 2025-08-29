/**
 * Room Service
 *
 * API service for room management
 */

import {
  getAllActiveRooms,
  getRoomsByGroup,
  getRoomsByGroupAndTeam,
  updateRoomSortOrders,
} from '@/mocks/room-data';
import type { Room } from '@/types/room';

class RoomService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Get rooms by group and team
   */
  async getRoomsByGroupAndTeam(groupId: string, teamId: string): Promise<Room[]> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV) {
        return this.mockGetRoomsByGroupAndTeam(groupId, teamId);
      }

      const response = await fetch(`${this.baseUrl}/rooms?groupId=${groupId}&teamId=${teamId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.rooms;
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

      const response = await fetch(`${this.baseUrl}/rooms`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.rooms;
    } catch (error) {
      console.error('Get all rooms error:', error);
      throw new Error('部屋情報の取得に失敗しました。');
    }
  }

  /**
   * Update room sort orders
   */
  async updateRoomSortOrders(groupId: string, teamId: string, roomIds: string[]): Promise<boolean> {
    try {
      // For development, use mock data
      if (process.env.NODE_ENV) {
        return this.mockUpdateRoomSortOrders(groupId, teamId, roomIds);
      }

      const response = await fetch(`${this.baseUrl}/rooms/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, teamId, roomIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Update room sort orders error:', error);
      throw new Error('部屋の並び替えに失敗しました。');
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

      const response = await fetch(`${this.baseUrl}/rooms?groupId=${groupId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.rooms;
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

  private async mockUpdateRoomSortOrders(
    groupId: string,
    teamId: string,
    roomIds: string[]
  ): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return updateRoomSortOrders(groupId, teamId, roomIds);
  }
}

export const roomService = new RoomService();
