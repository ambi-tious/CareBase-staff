import type { IconName } from '@/lib/lucide-icon-registry';

export interface Staff {
  id: string;
  name: string;
  furigana: string;
  role: string;
  employeeId: string;
  avatar?: string;
  isActive: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  staff: Staff[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  teams: Team[];
}

export const organizationData: Group[] = [
  {
    id: 'group-1',
    name: '介護フロア A',
    description: '1階 介護フロア',
    icon: 'Heart',
    teams: [
      {
        id: 'team-a1',
        name: '朝番チーム',
        description: '早朝・午前担当',
        icon: 'UserCheck',
        staff: [
          {
            id: 'staff-001',
            name: '田中 花子',
            furigana: 'タナカ ハナコ',
            role: '介護職員',
            employeeId: 'EMP001',
            isActive: true,
          },
          {
            id: 'staff-002',
            name: '佐藤 太郎',
            furigana: 'サトウ タロウ',
            role: '看護師',
            employeeId: 'EMP002',
            isActive: true,
          },
          {
            id: 'staff-003',
            name: '山田 美咲',
            furigana: 'ヤマダ ミサキ',
            role: '介護職員',
            employeeId: 'EMP003',
            isActive: true,
          },
        ],
      },
      {
        id: 'team-a2',
        name: '日勤チーム',
        description: '日中担当',
        icon: 'Users',
        staff: [
          {
            id: 'staff-004',
            name: '鈴木 一郎',
            furigana: 'スズキ イチロウ',
            role: '主任介護職員',
            employeeId: 'EMP004',
            isActive: true,
          },
          {
            id: 'staff-005',
            name: '高橋 恵子',
            furigana: 'タカハシ ケイコ',
            role: '看護師',
            employeeId: 'EMP005',
            isActive: true,
          },
        ],
      },
      {
        id: 'team-a3',
        name: '夜勤チーム',
        description: '夜間担当',
        icon: 'Shield',
        staff: [
          {
            id: 'staff-006',
            name: '伊藤 健太',
            furigana: 'イトウ ケンタ',
            role: '介護職員',
            employeeId: 'EMP006',
            isActive: true,
          },
          {
            id: 'staff-007',
            name: '渡辺 由美',
            furigana: 'ワタナベ ユミ',
            role: '看護師',
            employeeId: 'EMP007',
            isActive: true,
          },
        ],
      },
    ],
  },
  {
    id: 'group-2',
    name: '介護フロア B',
    description: '2階 介護フロア',
    icon: 'Stethoscope',
    teams: [
      {
        id: 'team-b1',
        name: '朝番チーム',
        description: '早朝・午前担当',
        icon: 'UserCheck',
        staff: [
          {
            id: 'staff-008',
            name: '中村 真一',
            furigana: 'ナカムラ シンイチ',
            role: '介護職員',
            employeeId: 'EMP008',
            isActive: true,
          },
          {
            id: 'staff-009',
            name: '小林 さくら',
            furigana: 'コバヤシ サクラ',
            role: '看護師',
            employeeId: 'EMP009',
            isActive: true,
          },
        ],
      },
      {
        id: 'team-b2',
        name: '日勤チーム',
        description: '日中担当',
        icon: 'Users',
        staff: [
          {
            id: 'staff-010',
            name: '加藤 雄二',
            furigana: 'カトウ ユウジ',
            role: '主任介護職員',
            employeeId: 'EMP010',
            isActive: true,
          },
        ],
      },
    ],
  },
  {
    id: 'group-3',
    name: '管理部門',
    description: '施設管理・事務',
    icon: 'Clipboard',
    teams: [
      {
        id: 'team-m1',
        name: '管理チーム',
        description: '施設長・事務',
        icon: 'Shield',
        staff: [
          {
            id: 'staff-011',
            name: '管理者 太郎',
            furigana: 'カンリシャ タロウ',
            role: '施設長',
            employeeId: 'ADM001',
            isActive: true,
          },
          {
            id: 'staff-012',
            name: '事務 花子',
            furigana: 'ジム ハナコ',
            role: '事務職員',
            employeeId: 'ADM002',
            isActive: true,
          },
        ],
      },
    ],
  },
];

// Helper functions
export const getGroupById = (groupId: string): Group | undefined => {
  return organizationData.find((group) => group.id === groupId);
};

export const getTeamById = (groupId: string, teamId: string): Team | undefined => {
  const group = getGroupById(groupId);
  return group?.teams.find((team) => team.id === teamId);
};

export const getStaffById = (
  groupId: string,
  teamId: string,
  staffId: string
): Staff | undefined => {
  const team = getTeamById(groupId, teamId);
  return team?.staff.find((staff) => staff.id === staffId);
};

export const getAllStaff = (): Staff[] => {
  return organizationData.flatMap((group) => group.teams.flatMap((team) => team.staff));
};
