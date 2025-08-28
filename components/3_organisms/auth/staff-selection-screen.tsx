'use client';

import { GroupSelector } from '@/components/2_molecules/auth/group-selector';
import { StaffSelector } from '@/components/2_molecules/auth/staff-selector';
import { TeamSelector } from '@/components/2_molecules/auth/team-selector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Group, Staff, Team } from '@/mocks/staff-data';
import { organizationService } from '@/services/organization-service';
import { AlertCircle, ArrowLeft, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { forwardRef, useEffect, useRef, useState } from 'react';

// Define the type for selected staff data
interface SelectedStaffData {
  staff: Staff;
  groupName: string;
  teamName: string;
}

interface StaffSelectionScreenProps {
  onStaffSelected: (staff: Staff) => void;
  onLogout?: () => void;
  fromHeader?: boolean;
  fromStaffClick?: boolean;
  autoSelectTeam?: boolean;
  selectedStaffData?: SelectedStaffData;
  className?: string;
}

const StaffSelectionScreenComponent = forwardRef<HTMLDivElement, StaffSelectionScreenProps>(
  (
    {
      onStaffSelected,
      onLogout,
      fromHeader = false,
      fromStaffClick = false,
      autoSelectTeam = true,
      selectedStaffData,
      className = '',
    },
    ref
  ) => {
    const router = useRouter();
    const [groups, setGroups] = useState<Group[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [selectedStaffId, setSelectedStaffId] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Refs for scrolling
    const teamSelectorRef = useRef<HTMLDivElement>(null);
    const staffSelectorRef = useRef<HTMLDivElement>(null);

    // Load groups on component mount
    useEffect(() => {
      const loadGroups = async () => {
        try {
          const groupsData = await organizationService.getGroups();
          setGroups(groupsData);

          // Auto-select group if only one exists
          if (groupsData.length === 1 && !selectedGroupId) {
            setSelectedGroupId(groupsData[0].id);
          }
        } catch (error) {
          console.error('Failed to load groups:', error);
          setError('グループデータの読み込みに失敗しました');
        }
      };

      loadGroups();
    }, []);

    useEffect(() => {
      // Auto-select team if only one exists in selected group
      if (selectedGroupId) {
        const loadTeamsData = async () => {
          try {
            const teamsData = await organizationService.getTeamsByGroup(selectedGroupId);
            setTeams(teamsData);

            if (teamsData && teamsData.length === 1 && !selectedTeamId) {
              setSelectedTeamId(teamsData[0].id);
            }
          } catch (error) {
            console.error('Failed to load team data:', error);
            setError('チームデータの読み込みに失敗しました');
          }
        };

        loadTeamsData();
      }
    }, [selectedGroupId, selectedTeamId]);

    // Load team data when team is selected
    useEffect(() => {
      if (selectedGroupId && selectedTeamId) {
        const loadStaffData = async () => {
          try {
            const staffData = await organizationService.getStaffByTeam(selectedTeamId);
            setStaff(staffData);
          } catch (error) {
            console.error('Failed to load team data:', error);
            setError('スタッフデータの取得に失敗しました');
          }
        };
        loadStaffData();
      }
    }, [selectedGroupId, selectedTeamId]);

    // Auto-proceed when staff is selected
    useEffect(() => {
      if (selectedGroupId && selectedTeamId && selectedStaffId && !isLoading) {
        setIsLoading(true);
        setError('');

        // Small delay to show loading state
        setTimeout(async () => {
          try {
            const selectedStaff = await organizationService.getStaffById(selectedStaffId);
            if (selectedStaff) {
              onStaffSelected(selectedStaff);
            } else {
              setError('有効なスタッフを選択してください');
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Failed to get staff data:', error);
            setError('スタッフデータの選択に失敗しました');
            setSelectedStaffId('');
            setIsLoading(false);
          }
        }, 500);
      }
    }, [selectedGroupId, selectedTeamId, selectedStaffId, isLoading, onStaffSelected]);

    const handleGroupSelect = (groupId: string) => {
      setSelectedGroupId(groupId);
      setSelectedTeamId('');
      setSelectedStaffId('');
      setError('');

      setTimeout(() => {
        teamSelectorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    };

    const handleTeamSelect = (teamId: string) => {
      setSelectedTeamId(teamId);
      setSelectedStaffId('');
      setError('');

      setTimeout(() => {
        staffSelectorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    };

    const handleStaffSelect = (staffId: string) => {
      setSelectedStaffId(staffId);
      setError('');
    };

    const handleLogout = () => {
      if (onLogout) {
        onLogout();
      }
    };

    const handleBack = () => {
      router.back();
    };

    // Handle selection from header navigation
    useEffect(() => {
      if (fromHeader && selectedStaffData && groups.length > 0) {
        // Find the group ID from the group name
        const groupId = groups.find((group) => group.name === selectedStaffData.groupName)?.id;

        // Find the team ID from the team name within the group
        let teamId: string | undefined;
        if (groupId) {
          const group = groups.find((g) => g.id === groupId);
          teamId = group?.teams.find((team) => team.name === selectedStaffData.teamName)?.id;
        }

        if (groupId) {
          setSelectedGroupId(groupId);

          // If coming from staff click, also select the staff
          if (fromStaffClick && teamId) {
            if (autoSelectTeam) {
              setSelectedTeamId(teamId);
            }
          }
        }
      }
    }, [fromHeader, fromStaffClick, selectedStaffData, autoSelectTeam, groups]);

    // Get current group and team IDs from selected staff data
    const getCurrentGroupTeamIds = () => {
      if (!selectedStaffData || groups.length === 0)
        return { currentGroupId: null, currentTeamId: null };

      // Find current group ID by name
      const currentGroupId =
        groups.find((group) => group.name === selectedStaffData.groupName)?.id || null;

      // Find current team ID by name within the group
      let currentTeamId: string | null = null;
      if (currentGroupId) {
        const group = groups.find((g) => g.id === currentGroupId);
        currentTeamId =
          group?.teams.find((team) => team.name === selectedStaffData.teamName)?.id || null;
      }

      return { currentGroupId, currentTeamId };
    };

    const { currentGroupId, currentTeamId } = getCurrentGroupTeamIds();

    const showTeamSelector = selectedGroupId;
    const showStaffSelector = selectedGroupId && selectedTeamId;

    return (
      <div ref={ref} className={`max-w-4xl w-full mx-auto ${className}`}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {fromHeader && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    戻る
                  </Button>
                )}
                <CardTitle className="text-xl font-bold text-carebase-text-primary">
                  スタッフ選択
                </CardTitle>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <GroupSelector
                groups={groups}
                selectedGroupId={selectedGroupId}
                currentGroupId={currentGroupId || undefined}
                onGroupSelect={handleGroupSelect}
                disabled={isLoading}
              />
            </div>

            {/* Team Selection */}
            {showTeamSelector && teams && (
              <div ref={teamSelectorRef}>
                <TeamSelector
                  teams={teams}
                  selectedTeamId={selectedTeamId}
                  currentTeamId={currentTeamId || undefined}
                  onTeamSelect={handleTeamSelect}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Staff Selection */}
            {showStaffSelector && staff && (
              <div ref={staffSelectorRef}>
                <StaffSelector
                  staff={staff}
                  selectedStaffId={selectedStaffId}
                  onStaffSelect={handleStaffSelect}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-blue-800 font-semibold">ログイン処理中...</p>
                </div>
                <p className="text-blue-600 text-sm">少々お待ちください</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);

StaffSelectionScreenComponent.displayName = 'StaffSelectionScreen';

export const StaffSelectionScreen = StaffSelectionScreenComponent;
