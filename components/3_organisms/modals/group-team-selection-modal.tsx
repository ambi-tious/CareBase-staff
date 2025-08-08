'use client';

import { GroupSelector } from '@/components/2_molecules/auth/group-selector';
import { TeamSelector } from '@/components/2_molecules/auth/team-selector';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getGroupById, getTeamById, organizationData } from '@/mocks/staff-data';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

interface SelectedStaffData {
  staff: any;
  groupName: string;
  teamName: string;
}

interface GroupTeamSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStaffData: SelectedStaffData | null;
  onGroupTeamChange?: (updatedData: SelectedStaffData) => void;
}

export const GroupTeamSelectionModal: React.FC<GroupTeamSelectionModalProps> = ({
  isOpen,
  onClose,
  selectedStaffData,
  onGroupTeamChange,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Get current group and team IDs from selected staff data
  const getCurrentGroupTeamIds = useCallback(() => {
    if (!selectedStaffData) return { currentGroupId: null, currentTeamId: null };

    // Find current group ID by name
    const currentGroupId =
      organizationData.find((group) => group.name === selectedStaffData.groupName)?.id || null;

    // Find current team ID by name within the group
    let currentTeamId: string | null = null;
    if (currentGroupId) {
      const group = getGroupById(currentGroupId);
      currentTeamId =
        group?.teams.find((team) => team.name === selectedStaffData.teamName)?.id || null;
    }

    return { currentGroupId, currentTeamId };
  }, [selectedStaffData]);

  // Initialize selection with current values when modal opens
  useEffect(() => {
    if (isOpen && selectedStaffData) {
      const { currentGroupId, currentTeamId } = getCurrentGroupTeamIds();
      setSelectedGroupId(currentGroupId || '');
      setSelectedTeamId(currentTeamId || '');
      setError('');
    }
  }, [isOpen, selectedStaffData, getCurrentGroupTeamIds]);

  // Auto-select team if only one exists in selected group
  useEffect(() => {
    if (selectedGroupId) {
      const selectedGroup = getGroupById(selectedGroupId);
      if (selectedGroup && selectedGroup.teams.length === 1) {
        setSelectedTeamId(selectedGroup.teams[0].id);
      } else if (selectedTeamId) {
        // Check if currently selected team exists in the new group
        const teamExists = selectedGroup?.teams.some((team) => team.id === selectedTeamId);
        if (!teamExists) {
          setSelectedTeamId('');
        }
      }
    } else {
      setSelectedTeamId('');
    }
  }, [selectedGroupId, selectedTeamId]);

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    setError('');
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedGroupId || !selectedTeamId) {
      setError('グループとチームの両方を選択してください。');
      return;
    }

    if (!selectedStaffData) {
      setError('スタッフ情報が見つかりません。');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create updated staff data
      const updatedStaffData = {
        staff: selectedStaffData.staff,
        groupName: getGroupById(selectedGroupId)?.name || selectedStaffData.groupName,
        teamName: getTeamById(selectedGroupId, selectedTeamId)?.name || selectedStaffData.teamName,
      };

      // Update localStorage
      localStorage.setItem('carebase_selected_staff_data', JSON.stringify(updatedStaffData));

      // Trigger storage event for other components
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'carebase_selected_staff_data',
          newValue: JSON.stringify(updatedStaffData),
          oldValue: JSON.stringify(selectedStaffData),
        })
      );

      // Call callback if provided
      if (onGroupTeamChange) {
        onGroupTeamChange(updatedStaffData);
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error updating group/team selection:', error);
      setError('グループ・チーム情報の更新に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const { currentGroupId, currentTeamId } = getCurrentGroupTeamIds();
  const selectedGroup = selectedGroupId ? getGroupById(selectedGroupId) : null;
  const showTeamSelector = selectedGroup && selectedGroup.teams.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto tablet:max-w-[95vw] tablet:max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            グループ・チーム選択
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 tablet:mt-6">
          {/* Group Selector */}
          <GroupSelector
            groups={organizationData}
            selectedGroupId={selectedGroupId}
            currentGroupId={currentGroupId || undefined}
            onGroupSelect={handleGroupSelect}
          />

          {/* Team Selector */}
          {showTeamSelector && (
            <TeamSelector
              teams={selectedGroup.teams}
              selectedTeamId={selectedTeamId}
              currentTeamId={currentTeamId || undefined}
              onTeamSelect={handleTeamSelect}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="min-h-touch-target"
            >
              キャンセル
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !selectedGroupId || !selectedTeamId}
              className="min-h-touch-target"
            >
              {isLoading ? '変更中...' : '変更する'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
