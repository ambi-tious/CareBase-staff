'use client';

import { GroupSelector } from '@/components/2_molecules/auth/group-selector';
import { StaffSelector } from '@/components/2_molecules/auth/staff-selector';
import { TeamSelector } from '@/components/2_molecules/auth/team-selector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Staff } from '@/mocks/staff-data';
import { getGroupById, getStaffById, getTeamById, organizationData } from '@/mocks/staff-data';
import { AlertCircle, LogOut, User } from 'lucide-react';
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
  fromGroupClick?: boolean;
  autoSelectStaff?: boolean;
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
      autoSelectStaff = true,
      autoSelectTeam = true,
      fromGroupClick = false,
      selectedStaffData,
      className = '',
    },
    ref
  ) => {
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [selectedStaffId, setSelectedStaffId] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGroupTeamChangeMode, setIsGroupTeamChangeMode] = useState<boolean>(false);

    // Refs for scrolling
    const teamSelectorRef = useRef<HTMLDivElement>(null);
    const staffSelectorRef = useRef<HTMLDivElement>(null);

    // Auto-selection logic
    useEffect(() => {
      // Auto-select group if only one exists
      if (organizationData.length === 1 && !selectedGroupId) {
        setSelectedGroupId(organizationData[0].id);
      }
    }, [selectedGroupId]);

    useEffect(() => {
      // Auto-select team if only one exists in selected group
      if (selectedGroupId) {
        const selectedGroup = getGroupById(selectedGroupId);
        if (selectedGroup && selectedGroup.teams.length === 1 && !selectedTeamId) {
          setSelectedTeamId(selectedGroup.teams[0].id);
        }
      }
    }, [selectedGroupId, selectedTeamId]);

    // Auto-proceed when staff is selected
    useEffect(() => {
      if (selectedGroupId && selectedTeamId && selectedStaffId && !isLoading) {
        setIsLoading(true);
        setError('');

        // Small delay to show loading state
        setTimeout(() => {
          const selectedStaff = getStaffById(selectedGroupId, selectedTeamId, selectedStaffId);
          if (selectedStaff && selectedStaff.isActive) {
            onStaffSelected(selectedStaff);
          } else {
            setError('有効なスタッフを選択してください');
            setIsLoading(false);
          }
        }, 500);
      }
    }, [selectedGroupId, selectedTeamId, selectedStaffId, isLoading, onStaffSelected]);

    const selectedGroup = selectedGroupId ? getGroupById(selectedGroupId) : null;
    const selectedTeam =
      selectedGroupId && selectedTeamId ? getTeamById(selectedGroupId, selectedTeamId) : null;

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

      // In group/team change mode, complete the process when team is selected
      if (isGroupTeamChangeMode) {
        setTimeout(() => {
          handleGroupTeamChangeComplete();
        }, 500);
      } else {
        setTimeout(() => {
          staffSelectorRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
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

    // Handle selection from header navigation
    useEffect(() => {
      if (fromHeader && selectedStaffData) {
        const currentStaff = selectedStaffData.staff;

        // Find the group ID from the group name
        const groupId = organizationData.find(
          (group) => group.name === selectedStaffData.groupName
        )?.id;

        // Find the team ID from the team name within the group
        let teamId: string | undefined;
        if (groupId) {
          const group = getGroupById(groupId);
          teamId = group?.teams.find((team) => team.name === selectedStaffData.teamName)?.id;
        }

        if (groupId) {
          setSelectedGroupId(groupId);

          // If coming from group click, enable group/team change mode
          if (fromGroupClick) {
            setIsGroupTeamChangeMode(true);
            // Don't auto-select team, let user choose
            setSelectedTeamId('');
            setSelectedStaffId('');
          }
          // If coming from staff click, also select the staff
          else if (fromStaffClick && teamId) {
            if (autoSelectTeam) {
              setSelectedTeamId(teamId);
            }

            // Find and select the staff
            const team = getTeamById(groupId, teamId);
            const staffMember = team?.staff.find((s) => s.id === currentStaff.id);
            if (staffMember && autoSelectStaff) {
              setSelectedStaffId(staffMember.id);
            }
          }
        }
      }
    }, [
      fromHeader,
      fromStaffClick,
      fromGroupClick,
      selectedStaffData,
      autoSelectStaff,
      autoSelectTeam,
    ]);

    // Handle group/team change mode completion
    const handleGroupTeamChangeComplete = () => {
      if (isGroupTeamChangeMode && selectedGroupId && selectedTeamId && selectedStaffData) {
        // Update localStorage with new group/team but keep the same staff
        const updatedStaffData = {
          staff: selectedStaffData.staff,
          groupName: getGroupById(selectedGroupId)?.name || selectedStaffData.groupName,
          teamName: getTeamById(selectedGroupId, selectedTeamId)?.name || selectedStaffData.teamName,
        };

        try {
          localStorage.setItem('carebase_selected_staff_data', JSON.stringify(updatedStaffData));
          // Navigate back to main page
          window.location.href = '/';
        } catch (error) {
          console.error('Error updating localStorage:', error);
          setError('グループ・チーム情報の更新に失敗しました。');
        }
      }
    };

    const showTeamSelector = selectedGroupId;
    const showStaffSelector = selectedGroupId && selectedTeamId && !isGroupTeamChangeMode;

    return (
      <div ref={ref} className={`max-w-4xl w-full mx-auto ${className}`}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-carebase-text-primary">
                {isGroupTeamChangeMode ? 'グループ・チーム変更' : 'スタッフ選択'}
              </CardTitle>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </Button>
            </div>
            {isGroupTeamChangeMode && selectedStaffData && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    現在のスタッフ: {selectedStaffData.staff.name}
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  スタッフはそのままで、所属するグループ・チームのみ変更します
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {/* Group/Team Change Mode Instructions */}
            {isGroupTeamChangeMode && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  新しいグループとチームを選択してください。選択完了後、自動的にメイン画面に戻ります。
                </AlertDescription>
              </Alert>
            )}

            <div>
              <GroupSelector
                groups={organizationData}
                selectedGroupId={selectedGroupId}
                onGroupSelect={handleGroupSelect}
                disabled={isLoading}
              />
            </div>

            {/* Team Selection */}
            {showTeamSelector && (
              <div ref={teamSelectorRef}>
                <TeamSelector
                  teams={selectedGroup!.teams}
                  selectedTeamId={selectedTeamId}
                  onTeamSelect={handleTeamSelect}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Staff Selection */}
            {showStaffSelector && (
              <div ref={staffSelectorRef}>
                <StaffSelector
                  staff={selectedTeam!.staff}
                  selectedStaffId={selectedStaffId}
                  onStaffSelect={handleStaffSelect}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Group/Team Change Mode Loading */}
            {isGroupTeamChangeMode && selectedGroupId && selectedTeamId && (
              <div className="flex flex-col items-center justify-center py-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  <p className="text-green-800 font-semibold">グループ・チーム情報を更新中...</p>
                </div>
                <p className="text-green-600 text-sm">少々お待ちください</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && !isGroupTeamChangeMode && (
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