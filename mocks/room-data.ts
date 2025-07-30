import type { Room } from '@/types/room';

export const roomData: Room[] = [
  // 介護フロア A (group-1)
  {
    id: 'room-001',
    name: '101号室',
    capacity: 1,
    groupId: 'group-1',
    teamId: 'team-a1',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-002',
    name: '102号室',
    capacity: 1,
    groupId: 'group-1',
    teamId: 'team-a1',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-003',
    name: '103号室',
    capacity: 2,
    groupId: 'group-1',
    teamId: 'team-a1',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-004',
    name: '201号室',
    capacity: 1,
    groupId: 'group-1',
    teamId: 'team-a2',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-005',
    name: '202号室',
    capacity: 1,
    groupId: 'group-1',
    teamId: 'team-a2',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-006',
    name: '203号室',
    capacity: 2,
    groupId: 'group-1',
    teamId: 'team-a2',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-007',
    name: '301号室',
    capacity: 1,
    groupId: 'group-1',
    teamId: 'team-a3',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-008',
    name: '302号室',
    capacity: 1,
    groupId: 'group-1',
    teamId: 'team-a3',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },

  // 介護フロア B (group-2)
  {
    id: 'room-009',
    name: '401号室',
    capacity: 1,
    groupId: 'group-2',
    teamId: 'team-b1',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-010',
    name: '402号室',
    capacity: 1,
    groupId: 'group-2',
    teamId: 'team-b1',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-011',
    name: '403号室',
    capacity: 2,
    groupId: 'group-2',
    teamId: 'team-b1',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-012',
    name: '501号室',
    capacity: 1,
    groupId: 'group-2',
    teamId: 'team-b2',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'room-013',
    name: '502号室',
    capacity: 1,
    groupId: 'group-2',
    teamId: 'team-b2',
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// Helper functions
export const getRoomsByGroupAndTeam = (groupId: string, teamId: string): Room[] => {
  return roomData.filter(
    (room) => room.groupId === groupId && room.teamId === teamId && room.isActive
  );
};

export const getRoomById = (roomId: string): Room | undefined => {
  return roomData.find((room) => room.id === roomId);
};

export const getAllActiveRooms = (): Room[] => {
  return roomData.filter((room) => room.isActive);
};

export const getRoomsByGroup = (groupId: string): Room[] => {
  return roomData.filter((room) => room.groupId === groupId && room.isActive);
};
