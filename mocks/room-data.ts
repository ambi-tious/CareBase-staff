import type { Room } from '@/types/room';
import { careBoardData } from './residents-data';

export const roomData: Room[] = [
  // 介護フロア A (group-1)
  {
    id: 'room-001',
    name: '101号室',
    capacity: 1,
    currentOccupancy: 0,
    groupId: 'group-1',
    teamId: 'team-a1',
    isActive: true,
    sortOrder: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-002',
    name: '102号室',
    capacity: 1,
    currentOccupancy: 0,
    groupId: 'group-1',
    teamId: 'team-a1',
    isActive: true,
    sortOrder: 2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-003',
    name: '103号室',
    capacity: 2,
    currentOccupancy: 2,
    groupId: 'group-1',
    teamId: 'team-a1',
    isActive: true,
    sortOrder: 3,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-004',
    name: '201号室',
    capacity: 1,
    currentOccupancy: 1,
    groupId: 'group-1',
    teamId: 'team-a2',
    isActive: true,
    sortOrder: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-005',
    name: '202号室',
    capacity: 1,
    currentOccupancy: 0,
    groupId: 'group-1',
    teamId: 'team-a2',
    isActive: true,
    sortOrder: 2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-006',
    name: '203号室',
    capacity: 2,
    currentOccupancy: 2,
    groupId: 'group-1',
    teamId: 'team-a2',
    isActive: true,
    sortOrder: 3,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-007',
    name: '301号室',
    capacity: 1,
    currentOccupancy: 1,
    groupId: 'group-1',
    teamId: 'team-a3',
    isActive: true,
    sortOrder: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-008',
    name: '302号室',
    capacity: 1,
    currentOccupancy: 0,
    groupId: 'group-1',
    teamId: 'team-a3',
    isActive: true,
    sortOrder: 2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },

  // 介護フロア B (group-2)
  {
    id: 'room-009',
    name: '401号室',
    capacity: 1,
    currentOccupancy: 0,
    groupId: 'group-2',
    teamId: 'team-b1',
    isActive: true,
    sortOrder: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-010',
    name: '402号室',
    capacity: 1,
    currentOccupancy: 1,
    groupId: 'group-2',
    teamId: 'team-b1',
    isActive: true,
    sortOrder: 2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-011',
    name: '403号室',
    capacity: 2,
    currentOccupancy: 0,
    groupId: 'group-2',
    teamId: 'team-b1',
    isActive: true,
    sortOrder: 3,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-012',
    name: '501号室',
    capacity: 1,
    currentOccupancy: 1,
    groupId: 'group-2',
    teamId: 'team-b2',
    isActive: true,
    sortOrder: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-013',
    name: '502号室',
    capacity: 1,
    currentOccupancy: 0,
    groupId: 'group-2',
    teamId: 'team-b2',
    isActive: true,
    sortOrder: 2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  // 満室の部屋を追加
  {
    id: 'room-014',
    name: '101号室B',
    capacity: 1,
    currentOccupancy: 1,
    groupId: 'group-1',
    teamId: 'team-a1',
    isActive: true,
    sortOrder: 4,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-015',
    name: '104号室',
    capacity: 4,
    currentOccupancy: 4,
    groupId: 'group-1',
    teamId: 'team-a1',
    isActive: true,
    sortOrder: 5,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// 入居者データから部屋の入居状況を計算する関数
export const calculateRoomOccupancy = (roomName: string): number => {
  return careBoardData.filter(
    (resident) => resident.roomInfo === roomName && resident.dischargeDate === undefined
  ).length;
};

// 部屋データに入居状況を追加して返す関数
export const getRoomsWithOccupancy = (rooms: Room[]): Room[] => {
  return rooms.map((room) => ({
    ...room,
    currentOccupancy: calculateRoomOccupancy(room.name),
  }));
};

// Helper functions
export const getRoomsByGroupAndTeam = (groupId: string, teamId: string): Room[] => {
  const filteredRooms = roomData.filter(
    (room) => room.groupId === groupId && room.teamId === teamId && room.isActive
  );
  const sortedRooms = filteredRooms.sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
  return getRoomsWithOccupancy(sortedRooms);
};

export const getRoomById = (roomId: string): Room | undefined => {
  const room = roomData.find((room) => room.id === roomId);
  if (room) {
    return {
      ...room,
      currentOccupancy: calculateRoomOccupancy(room.name),
    };
  }
  return undefined;
};

export const getAllActiveRooms = (): Room[] => {
  const activeRooms = roomData.filter((room) => room.isActive);
  const sortedRooms = activeRooms.sort((a, b) => {
    if (a.groupId !== b.groupId) return a.groupId.localeCompare(b.groupId);
    if (a.teamId !== b.teamId) return a.teamId.localeCompare(b.teamId);
    return (a.sortOrder || 999) - (b.sortOrder || 999);
  });
  return getRoomsWithOccupancy(sortedRooms);
};

export const getRoomsByGroup = (groupId: string): Room[] => {
  const filteredRooms = roomData.filter((room) => room.groupId === groupId && room.isActive);
  const sortedRooms = filteredRooms.sort((a, b) => {
    if (a.teamId !== b.teamId) return a.teamId.localeCompare(b.teamId);
    return (a.sortOrder || 999) - (b.sortOrder || 999);
  });
  return getRoomsWithOccupancy(sortedRooms);
};

// Update room sort orders for a specific group and team
export const updateRoomSortOrders = (
  groupId: string,
  teamId: string,
  roomIds: string[]
): boolean => {
  try {
    roomIds.forEach((roomId, index) => {
      const roomIndex = roomData.findIndex(
        (room) => room.id === roomId && room.groupId === groupId && room.teamId === teamId
      );
      if (roomIndex !== -1) {
        roomData[roomIndex].sortOrder = index + 1;
        roomData[roomIndex].updatedAt = new Date().toISOString();
      }
    });
    return true;
  } catch (error) {
    console.error('Failed to update room sort orders:', error);
    return false;
  }
};
