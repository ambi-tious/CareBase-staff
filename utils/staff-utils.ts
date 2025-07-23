import type { Staff } from '@/mocks/staff-data';

// Helper functions to get group and team names
export function getGroupNameByStaff(staff: Staff): string {
  // This would normally come from the API or be passed through the selection process
  // For now, we'll use mock data mapping
  const organizationData: Record<string, { groupName: string }> = {
    'staff-001': { groupName: '介護フロア A' },
    'staff-002': { groupName: '介護フロア A' },
    'staff-003': { groupName: '介護フロア A' },
    'staff-004': { groupName: '介護フロア A' },
    'staff-005': { groupName: '介護フロア A' },
    'staff-006': { groupName: '介護フロア A' },
    'staff-007': { groupName: '介護フロア A' },
    'staff-008': { groupName: '介護フロア B' },
    'staff-009': { groupName: '介護フロア B' },
    'staff-010': { groupName: '介護フロア B' },
    'staff-011': { groupName: '管理部門' },
    'staff-012': { groupName: '管理部門' },
  };

  return organizationData[staff.id]?.groupName || '不明なグループ';
}

export function getTeamNameByStaff(staff: Staff): string {
  // This would normally come from the API or be passed through the selection process
  const teamMapping: Record<string, string> = {
    'staff-001': '朝番チーム',
    'staff-002': '朝番チーム',
    'staff-003': '朝番チーム',
    'staff-004': '日勤チーム',
    'staff-005': '日勤チーム',
    'staff-006': '夜勤チーム',
    'staff-007': '夜勤チーム',
    'staff-008': '朝番チーム',
    'staff-009': '朝番チーム',
    'staff-010': '日勤チーム',
    'staff-011': '管理チーム',
    'staff-012': '管理チーム',
  };

  return teamMapping[staff.id] || '不明なチーム';
}

// Get all unique group names for form options
export function getAllGroupOptions() {
  const groupNames = [
    '介護フロア A',
    '介護フロア B', 
    '管理部門'
  ];
  
  return groupNames.map(name => ({ value: name, label: name }));
}

// Get all unique team names for form options
export function getAllTeamOptions() {
  const teamNames = [
    '朝番チーム',
    '日勤チーム',
    '夜勤チーム',
    '管理チーム'
  ];
  
  return teamNames.map(name => ({ value: name, label: name }));
}

// Helper functions for reverse lookup
export function getGroupIdByStaffName(groupName: string): string | null {
  const groupMapping: Record<string, string> = {
    '介護フロア A': 'group-1',
    '介護フロア B': 'group-2',
    管理部門: 'group-3',
  };
  return groupMapping[groupName] || null;
}

export function getTeamIdByStaffAndGroup(staff: Staff, groupId: string | null): string | null {
  if (!groupId) return null;

  const teamMapping: Record<string, Record<string, string>> = {
    'group-1': {
      朝番チーム: 'team-a1',
      日勤チーム: 'team-a2',
      夜勤チーム: 'team-a3',
    },
    'group-2': {
      朝番チーム: 'team-b1',
      日勤チーム: 'team-b2',
    },
    'group-3': {
      管理チーム: 'team-m1',
    },
  };

  const teamName = getTeamNameByStaff(staff);
  return teamMapping[groupId]?.[teamName] || null;
}
