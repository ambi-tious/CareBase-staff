/**
 * Room Types
 *
 * Types for room management system
 */

export interface Room {
  id: string;
  name: string;
  capacity: number;
  groupId: string;
  teamId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomFormData {
  name: string;
  capacity: number;
  groupId: string;
  teamId: string;
}

// API response types
export interface RoomCreateResponse {
  success: boolean;
  room?: Room;
  error?: string;
}

export interface RoomListResponse {
  rooms: Room[];
  total: number;
}