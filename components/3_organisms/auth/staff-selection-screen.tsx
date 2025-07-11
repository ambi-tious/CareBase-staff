'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GroupSelector } from '@/components/2_molecules/auth/group-selector';
import { TeamSelector } from '@/components/2_molecules/auth/team-selector';
import { StaffSelector } from '@/components/2_molecules/auth/staff-selector';
import { organizationData, getGroupById, getTeamById, getStaffById } from '@/mocks/staff-data';
import type { Staff } from '@/mocks/staff-data';
import { LogOut, AlertCircle } from 'lucide-react';

// Define the type for selected staff data
interface SelectedStaffData {
  staff: Staff;
  groupName: string;
  teamName: string;
}

interface StaffSelectionScreenProps {
  onStaffSelected: (staff: Staff) => void;
  onLogout?: () => void;
  selectedStaffData?: SelectedStaffData;
  className?: string;
}

export const StaffSelectionScreen: React.FC<StaffSelectionScreenProps> = ({
  onStaffSelected,
  onLogout,
  selectedStaffData,
  className = '',
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [error, setError] = useState<string>('');

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
      const selectedStaff = getStaffById(selectedGroupId, selectedTeamId, selectedStaffId);
      if (selectedStaff && selectedStaff.isActive) {
        // Auto-proceed after a short delay for better UX
        const timer = setTimeout(() => {
          onStaffSelected(selectedStaff);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedGroupId, selectedTeamId, selectedStaffId, onStaffSelected]);

  const selectedGroup = selectedGroupId ? getGroupById(selectedGroupId) : null;
  const selectedTeam =
    selectedGroupId && selectedTeamId ? getTeamById(selectedGroupId, selectedTeamId) : null;
  const selectedStaff =
    selectedGroupId && selectedTeamId && selectedStaffId
      ? getStaffById(selectedGroupId, selectedTeamId, selectedStaffId)
      : null;

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    setSelectedTeamId('');
    setSelectedStaffId('');
    setError('');
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedStaffId('');
    setError('');
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

  const handleReset = () => {
    // Only reset non-auto-selected items
    if (organizationData.length > 1) {
      setSelectedGroupId('');
    }
    if (selectedGroup && selectedGroup.teams.length > 1) {
      setSelectedTeamId('');
    }
    setSelectedStaffId('');
    setError('');
  };

  // Handle selection from header navigation
  useEffect(() => {
    // Check if we're coming from header navigation
    const urlParams = new URLSearchParams(window.location.search);
    const fromHeader = urlParams.get('from');
    
    if (fromHeader === 'header' && selectedStaffData) {
      // Pre-select based on current staff data
      const currentStaff = selectedStaffData.staff;
      const groupId = getGroupIdByStaffName(selectedStaffData.groupName);
      const teamId = getTeamIdByStaffAndGroup(currentStaff, groupId);
      
      if (groupId) {
        setSelectedGroupId(groupId);
      }
      if (teamId) {
        setSelectedTeamId(teamId);
      }
    }
  }, [selectedStaffData]);
  const isGroupAutoSelected = organizationData.length === 1;
  const isTeamAutoSelected = selectedGroup && selectedGroup.teams.length === 1;
  const showGroupSelector = !isGroupAutoSelected;
  const showTeamSelector = selectedGroupId && !isTeamAutoSelected;
  const showStaffSelector = selectedGroupId && selectedTeamId;

  return (
    <div className={`max-w-4xl w-full mx-auto ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-carebase-text-primary">
              スタッフ選択
            </CardTitle>
            <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-300 hover:bg-red-50">
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
                  <selectedGroup.icon className="w-5 h-5 text-blue-600" />
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
                  <selectedTeam.icon className="w-5 h-5 text-green-600" />
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
            <div>
              <TeamSelector
                teams={selectedGroup!.teams}
                selectedTeamId={selectedTeamId}
                onTeamSelect={handleTeamSelect}
              />
            </div>
          )}

          {/* Staff Selection */}
          {showStaffSelector && (
            <div>
              <StaffSelector
                staff={selectedTeam!.staff}
                selectedStaffId={selectedStaffId}
                onStaffSelect={handleStaffSelect}
              />
            </div>
          )}

          {/* Loading State */}
          {selectedStaff && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 text-carebase-blue">
                <div className="w-4 h-4 border-2 border-carebase-blue border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">
                  {selectedStaff.name} でログイン中...
                </span>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {(selectedGroupId || selectedTeamId || selectedStaffId) && (
            <div className="flex justify-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!!selectedStaff}
                className="text-gray-600"
              >
                選択をリセット
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};