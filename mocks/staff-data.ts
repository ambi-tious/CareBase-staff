import type { IconName } from '@/lib/lucide-icon-registry';

export interface Role {
  name: string;
  color: string;
}

export interface Staff {
  id: string;
  name: string;
  furigana: string;
  role: Role;
  employeeId: string;
  avatar?: string;
  isActive: boolean;
  team?: Team;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  staff: Staff[];
  group?: Group;
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
        group: {
          id: 'group-1',
          name: '介護フロア A',
          description: '1階 介護フロア',
          icon: 'Heart',
          teams: [],
        },
        staff: [
          {
            id: 'staff-001',
            name: '田中 花子',
            furigana: 'タナカ ハナコ',
            role: {
              name: '介護職員',
              color: 'green',
            },
            employeeId: 'EMP001',
            isActive: true,
            team: {
              id: 'team-a1',
              name: '朝番チーム',
              description: '早朝・午前担当',
              icon: 'UserCheck',
              group: {
                id: 'group-1',
                name: '介護フロア A',
                description: '1階 介護フロア',
                icon: 'Heart',
                teams: [],
              },
              staff: [],
            },
          },
          {
            id: 'staff-002',
            name: '佐藤 太郎',
            furigana: 'サトウ タロウ',
            role: {
              name: '看護師',
              color: 'blue',
            },
            employeeId: 'EMP002',
            isActive: true,
            team: {
              id: 'team-a1',
              name: '朝番チーム',
              description: '早朝・午前担当',
              icon: 'UserCheck',
              group: {
                id: 'group-1',
                name: '介護フロア A',
                description: '1階 介護フロア',
                icon: 'Heart',
                teams: [],
              },
              staff: [],
            },
          },
          {
            id: 'staff-003',
            name: '山田 美咲',
            furigana: 'ヤマダ ミサキ',
            role: {
              name: '介護職員',
              color: 'green',
            },
            employeeId: 'EMP003',
            isActive: true,
            team: {
              id: 'team-a1',
              name: '朝番チーム',
              description: '早朝・午前担当',
              icon: 'UserCheck',
              group: {
                id: 'group-1',
                name: '介護フロア A',
                description: '1階 介護フロア',
                icon: 'Heart',
                teams: [],
              },
              staff: [],
            },
          },
        ],
      },
      {
        id: 'team-a2',
        name: '日勤チーム',
        description: '日中担当',
        icon: 'Users',
        group: {
          id: 'group-1',
          name: '介護フロア A',
          description: '1階 介護フロア',
          icon: 'Heart',
          teams: [],
        },
        staff: [
          {
            id: 'staff-004',
            name: '鈴木 一郎',
            furigana: 'スズキ イチロウ',
            role: {
              name: '主任介護職員',
              color: 'green',
            },
            employeeId: 'EMP004',
            isActive: true,
            team: {
              id: 'team-a2',
              name: '日勤チーム',
              description: '日中担当',
              icon: 'Users',
              group: {
                id: 'group-1',
                name: '介護フロア A',
                description: '1階 介護フロア',
                icon: 'Heart',
                teams: [],
              },
              staff: [],
            },
          },
          {
            id: 'staff-005',
            name: '高橋 恵子',
            furigana: 'タカハシ ケイコ',
            role: {
              name: '看護師',
              color: 'blue',
            },
            employeeId: 'EMP005',
            isActive: true,
            team: {
              id: 'team-a2',
              name: '日勤チーム',
              description: '日中担当',
              icon: 'Users',
              group: {
                id: 'group-1',
                name: '介護フロア A',
                description: '1階 介護フロア',
                icon: 'Heart',
                teams: [],
              },
              staff: [],
            },
          },
        ],
      },
      {
        id: 'team-a3',
        name: '夜勤チーム',
        description: '夜間担当',
        icon: 'Shield',
        group: {
          id: 'group-1',
          name: '介護フロア A',
          description: '1階 介護フロア',
          icon: 'Heart',
          teams: [],
        },
        staff: [
          {
            id: 'staff-006',
            name: '伊藤 健太',
            furigana: 'イトウ ケンタ',
            role: {
              name: '介護職員',
              color: 'green',
            },
            employeeId: 'EMP006',
            isActive: true,
            team: {
              id: 'team-a3',
              name: '夜勤チーム',
              description: '夜間担当',
              icon: 'Shield',
              group: {
                id: 'group-1',
                name: '介護フロア A',
                description: '1階 介護フロア',
                icon: 'Heart',
                teams: [],
              },
              staff: [],
            },
          },
          {
            id: 'staff-007',
            name: '渡辺 由美',
            furigana: 'ワタナベ ユミ',
            role: {
              name: '看護師',
              color: 'blue',
            },
            employeeId: 'EMP007',
            isActive: true,
            team: {
              id: 'team-a3',
              name: '夜勤チーム',
              description: '夜間担当',
              icon: 'Shield',
              group: {
                id: 'group-1',
                name: '介護フロア A',
                description: '1階 介護フロア',
                icon: 'Heart',
                teams: [],
              },
              staff: [],
            },
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
        group: {
          id: 'group-2',
          name: '介護フロア B',
          description: '2階 介護フロア',
          icon: 'Stethoscope',
          teams: [],
        },
        staff: [
          {
            id: 'staff-008',
            name: '中村 真一',
            furigana: 'ナカムラ シンイチ',
            role: {
              name: '介護職員',
              color: 'green',
            },
            employeeId: 'EMP008',
            isActive: true,
            team: {
              id: 'team-b1',
              name: '朝番チーム',
              description: '早朝・午前担当',
              icon: 'UserCheck',
              group: {
                id: 'group-2',
                name: '介護フロア B',
                description: '2階 介護フロア',
                icon: 'Stethoscope',
                teams: [],
              },
              staff: [],
            },
          },
          {
            id: 'staff-009',
            name: '小林 さくら',
            furigana: 'コバヤシ サクラ',
            role: {
              name: '看護師',
              color: 'blue',
            },
            employeeId: 'EMP009',
            isActive: true,
            team: {
              id: 'team-b1',
              name: '朝番チーム',
              description: '早朝・午前担当',
              icon: 'UserCheck',
              group: {
                id: 'group-2',
                name: '介護フロア B',
                description: '2階 介護フロア',
                icon: 'Stethoscope',
                teams: [],
              },
              staff: [],
            },
          },
        ],
      },
      {
        id: 'team-b2',
        name: '日勤チーム',
        description: '日中担当',
        icon: 'Users',
        group: {
          id: 'group-2',
          name: '介護フロア B',
          description: '2階 介護フロア',
          icon: 'Stethoscope',
          teams: [],
        },
        staff: [
          {
            id: 'staff-010',
            name: '加藤 雄二',
            furigana: 'カトウ ユウジ',
            role: {
              name: '主任介護職員',
              color: 'green',
            },
            employeeId: 'EMP010',
            isActive: true,
            team: {
              id: 'team-b2',
              name: '日勤チーム',
              description: '日中担当',
              icon: 'Users',
              group: {
                id: 'group-2',
                name: '介護フロア B',
                description: '2階 介護フロア',
                icon: 'Stethoscope',
                teams: [],
              },
              staff: [],
            },
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
        group: {
          id: 'group-3',
          name: '管理部門',
          description: '施設管理・事務',
          icon: 'Clipboard',
          teams: [],
        },
        staff: [
          {
            id: 'staff-011',
            name: '管理者 太郎',
            furigana: 'カンリシャ タロウ',
            role: {
              name: '施設長',
              color: 'red',
            },
            employeeId: 'ADM001',
            isActive: true,
            team: {
              id: 'team-m1',
              name: '管理チーム',
              description: '施設長・事務',
              icon: 'Shield',
              group: {
                id: 'group-3',
                name: '管理部門',
                description: '施設管理・事務',
                icon: 'Clipboard',
                teams: [],
              },
              staff: [],
            },
          },
          {
            id: 'staff-012',
            name: '事務 花子',
            furigana: 'ジム ハナコ',
            role: {
              name: '事務職員',
              color: 'gray',
            },
            employeeId: 'ADM002',
            isActive: true,
            team: {
              id: 'team-m1',
              name: '管理チーム',
              description: '施設長・事務',
              icon: 'Shield',
              group: {
                id: 'group-3',
                name: '管理部門',
                description: '施設管理・事務',
                icon: 'Clipboard',
                teams: [],
              },
              staff: [],
            },
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

export const getAllStaff = (): Staff[] => {
  return organizationData.flatMap((group) => group.teams.flatMap((team) => team.staff));
};

// スタッフIDからグループ名とチーム名を取得するヘルパー関数
export const getStaffGroupAndTeam = (
  staffId: string
): { groupName: string; teamName: string } | null => {
  for (const group of organizationData) {
    for (const team of group.teams) {
      const staff = team.staff.find((s) => s.id === staffId);
      if (staff) {
        return {
          groupName: group.name,
          teamName: team.name,
        };
      }
    }
  }
  return null;
};
