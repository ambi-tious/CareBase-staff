'use client';

import { GroupSelector } from '@/components/2_molecules/auth/group-selector';
import { StaffSelector } from '@/components/2_molecules/auth/staff-selector';
import { TeamSelector } from '@/components/2_molecules/auth/team-selector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import type { Staff } from '@/mocks/staff-data';
import { getGroupById, getStaffById, getTeamById, organizationData } from '@/mocks/staff-data';
import { AlertCircle, LogOut } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

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

export const StaffSelectionScreen: React.FC<StaffSelectionScreenProps> = ({
  onStaffSelected,
  onLogout,
  fromHeader = false,
  fromStaffClick = false,
  autoSelectStaff = true,
  autoSelectTeam = true,
  fromGroupClick = false,
  selectedStaffData,
  className = '',
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [error, setError] = useState<string>('');
  
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
    if (selectedGroupId && selectedTeamId && selectedStaffId) {
      // No longer auto-proceed - user must click the login button
    }
  }, [selectedGroupId, selectedTeamId, selectedStaffId]);

  const selectedGroup = selectedGroupId ? getGroupById(selectedGroupId) : null;
  const selectedTeam =
    selectedGroupId && selectedTeamId ? getTeamById(selectedGroupId, selectedTeamId) : null;

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    setSelectedTeamId('');
    setSelectedStaffId('');
    setError('');
    
    // Scroll to team selector after a short delay
    if (groupId && teamSelectorRef.current) {
      setTimeout(() => {
        teamSelectorRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }, 100);
    }
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedStaffId('');
    setError('');
    
    // Scroll to staff selector after a short delay
    if (teamId && staffSelectorRef.current) {
      setTimeout(() => {
        staffSelectorRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
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

        // If coming from staff click, also select the staff
        if (fromStaffClick && teamId) {
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
        // If coming from group click, just select the group
        else if (fromGroupClick && teamId) {
          if (autoSelectTeam) {
            setSelectedTeamId(teamId);
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

  const isGroupAutoSelected = organizationData.length === 1;
  const isTeamAutoSelected = selectedGroup && selectedGroup.teams.length === 1;
  const showGroupSelector = !isGroupAutoSelected;
  const showTeamSelector = selectedGroupId && !isTeamAutoSelected;
  const showStaffSelector = selectedGroupId && selectedTeamId;

  // Function to handle login button click
  const handleLoginClick = () => {
    if (selectedGroupId && selectedTeamId && selectedStaffId) {
      const selectedStaff = getStaffById(selectedGroupId, selectedTeamId, selectedStaffId);
      if (selectedStaff && selectedStaff.isActive) {
        onStaffSelected(selectedStaff);
      } else {
        setError('有効なスタッフを選択してください');
      }
    } else {
      setError('グループ、チーム、スタッフをすべて選択してください');
    }
  };

  return (
    <div className={`max-w-4xl w-full mx-auto ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-carebase-text-primary">
              スタッフ選択
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
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Auto-selected Group Display */}
          {isGroupAutoSelected && selectedGroup && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">選択されたグループ</h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {React.createElement(getLucideIcon(selectedGroup.icon), {
                    className: 'w-5 h-5 text-blue-600',
                  })}
                </div>
                <div>
                  <p className="font-semibold text-blue-900">{selectedGroup.name}</p>
                  <p className="text-sm text-blue-700">{selectedGroup.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Group Selection */}
          {showGroupSelector && (
            <div>
              <GroupSelector
                groups={organizationData}
                selectedGroupId={selectedGroupId}
                onGroupSelect={handleGroupSelect}
              />
            </div>
          )}

          {/* Auto-selected Team Display */}
          {isTeamAutoSelected && selectedTeam && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-800 mb-2">選択されたチーム</h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  {React.createElement(getLucideIcon(selectedTeam.icon), {
                    className: 'w-5 h-5 text-green-600',
                  })}
                </div>
                <div>
                  <p className="font-semibold text-green-900">{selectedTeam.name}</p>
                  <p className="text-sm text-green-700">{selectedTeam.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Team Selection */}
          {showTeamSelector && (
            <div ref={teamSelectorRef}>
              <TeamSelector
                teams={selectedGroup!.teams}
                selectedTeamId={selectedTeamId}
                onTeamSelect={handleTeamSelect}
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
              />
            </div>
          )}

          {/* Login Button - Only show when staff is selected */}
          {selectedStaffId && (
            <div className="flex justify-center mt-6 border-t pt-4">
              <Button
                onClick={handleLoginClick}
                className="bg-carebase-blue hover:bg-carebase-blue-dark text-white px-8 py-2"
              >
                選択したスタッフでログイン
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
