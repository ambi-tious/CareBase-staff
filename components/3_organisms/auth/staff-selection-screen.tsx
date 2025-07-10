'use client';

import type React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SelectionStep } from '@/components/1_atoms/staff/selection-step';
import { GroupSelector } from '@/components/2_molecules/auth/group-selector';
import { TeamSelector } from '@/components/2_molecules/auth/team-selector';
import { StaffSelector } from '@/components/2_molecules/auth/staff-selector';
import { organizationData, getGroupById, getTeamById, getStaffById } from '@/mocks/staff-data';
import type { Staff } from '@/mocks/staff-data';
import { ArrowLeft, AlertCircle } from 'lucide-react';

interface StaffSelectionScreenProps {
  onStaffSelected: (staff: Staff) => void;
  onBack?: () => void;
  className?: string;
  initialStep?: 'group' | 'team' | 'staff';
}

export const StaffSelectionScreen: React.FC<StaffSelectionScreenProps> = ({
  onStaffSelected,
  onBack,
  className = '',
  initialStep = 'group',
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Load previous selection from localStorage if returning from header click
  useEffect(() => {
    try {
      const data = localStorage.getItem('carebase_selected_staff_data');
      if (data && initialStep !== 'group') {
        const selectedData = JSON.parse(data);
        // Find the group and team IDs based on the selected staff
        for (const group of organizationData) {
          for (const team of group.teams) {
            const staff = team.staff.find(s => s.id === selectedData.staff.id);
            if (staff) {
              setSelectedGroupId(group.id);
              setSelectedTeamId(team.id);
              if (initialStep === 'staff') {
                setSelectedStaffId(staff.id);
              }
              return;
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load previous selection:', error);
    }
  }, [initialStep]);

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

  const handleConfirm = () => {
    if (!selectedStaff) {
      setError('スタッフが選択されていません。');
      return;
    }

    if (!selectedStaff.isActive) {
      setError('選択されたスタッフは現在利用できません。');
      return;
    }

    onStaffSelected(selectedStaff);
  };

  const handleReset = () => {
    setSelectedGroupId('');
    setSelectedTeamId('');
    setSelectedStaffId('');
    setError('');
  };

  const getCurrentStep = () => {
    if (!selectedGroupId) return 1;
    if (!selectedTeamId) return 2;
    if (!selectedStaffId) return 3;
    return 4;
  };

  const currentStep = getCurrentStep();

  return (
    <div className={`max-w-2xl w-full mx-auto ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-carebase-text-primary">
              スタッフ選択
            </CardTitle>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="space-y-3">
            <SelectionStep
              stepNumber={1}
              title="グループ選択"
              description={selectedGroup?.name}
              isActive={currentStep === 1}
              isCompleted={currentStep > 1}
            />
            <SelectionStep
              stepNumber={2}
              title="チーム選択"
              description={selectedTeam?.name}
              isActive={currentStep === 2}
              isCompleted={currentStep > 2}
            />
            <SelectionStep
              stepNumber={3}
              title="スタッフ選択"
              description={selectedStaff?.name}
              isActive={currentStep === 3}
              isCompleted={currentStep > 3}
            />
          </div>

          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Selection Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <GroupSelector
                groups={organizationData}
                selectedGroupId={selectedGroupId}
                onGroupSelect={handleGroupSelect}
              />
            )}

            {currentStep === 2 && selectedGroup && (
              <TeamSelector
                teams={selectedGroup.teams}
                selectedTeamId={selectedTeamId}
                onTeamSelect={handleTeamSelect}
              />
            )}

            {currentStep === 3 && selectedTeam && (
              <StaffSelector
                staff={selectedTeam.staff}
                selectedStaffId={selectedStaffId}
                onStaffSelect={handleStaffSelect}
              />
            )}

            {currentStep === 4 && selectedStaff && (
              <div className="text-center py-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-carebase-text-primary mb-2">
                    選択完了
                  </h3>
                  <p className="text-gray-600">以下のスタッフでログインします：</p>
                </div>
                <div className="max-w-md mx-auto">
                  <Card className="border-2 border-carebase-blue bg-carebase-blue-light">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-carebase-text-primary">
                          {selectedStaff.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{selectedStaff.furigana}</p>
                        <p className="text-sm font-medium text-carebase-blue">
                          {selectedStaff.role}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {selectedGroup?.name} - {selectedTeam?.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleReset} disabled={currentStep === 1}>
              リセット
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={currentStep !== 4}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              この スタッフでログイン
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
