'use client';

import { GroupSelector } from '@/components/2_molecules/auth/group-selector';
import { TeamSelector } from '@/components/2_molecules/auth/team-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import type { Group, Team } from '@/mocks/staff-data';
import { organizationService } from '@/services/organization-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Users } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Group Team Selection validation schema
const groupTeamSelectionSchema = z.object({
  groupId: z.string().min(1, 'グループを選択してください'),
  teamId: z.string().min(1, 'チームを選択してください'),
});

type GroupTeamSelectionFormData = z.infer<typeof groupTeamSelectionSchema>;

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
  const [groups, setGroups] = useState<Group[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<GroupTeamSelectionFormData>({
    resolver: zodResolver(groupTeamSelectionSchema),
    defaultValues: {
      groupId: '',
      teamId: '',
    },
    mode: 'onChange',
  });

  const { control, handleSubmit, setValue, watch, formState } = form;
  const { isValid, isSubmitting } = formState;
  const watchedGroupId = watch('groupId');
  const watchedTeamId = watch('teamId');

  // Load groups on component mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groupsData = await organizationService.getGroups();
        setGroups(groupsData);
      } catch (error) {
        console.error('Failed to load groups:', error);
        setError('グループデータの読み込みに失敗しました');
      }
    };

    loadGroups();
  }, []);

  // Get current group and team IDs from selected staff data
  const getCurrentGroupTeamIds = useCallback(() => {
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
  }, [selectedStaffData, groups]);

  // Initialize selection with current values when modal opens
  useEffect(() => {
    if (isOpen && selectedStaffData) {
      const { currentGroupId, currentTeamId } = getCurrentGroupTeamIds();
      setValue('groupId', currentGroupId || '');
      setValue('teamId', currentTeamId || '');
      setError('');
    }
  }, [isOpen, selectedStaffData, getCurrentGroupTeamIds, setValue]);

  // Load teams when group is selected
  useEffect(() => {
    if (watchedGroupId) {
      const loadTeams = async () => {
        try {
          const teamsData = await organizationService.getTeamsByGroup(watchedGroupId);
          setTeams(teamsData);

          // Auto-select team if only one exists
          if (teamsData.length === 1) {
            setValue('teamId', teamsData[0].id);
          } else if (watchedTeamId) {
            // Check if currently selected team exists in the new group
            const teamExists = teamsData.some((team) => team.id === watchedTeamId);
            if (!teamExists) {
              setValue('teamId', '');
            }
          }
        } catch (error) {
          console.error('Failed to load teams:', error);
          setError('チームデータの読み込みに失敗しました');
        }
      };

      loadTeams();
    } else {
      setTeams([]);
      setValue('teamId', '');
    }
  }, [watchedGroupId, watchedTeamId, setValue]);

  const handleGroupSelect = (groupId: string) => {
    setValue('groupId', groupId);
    setError('');
  };

  const handleTeamSelect = (teamId: string) => {
    setValue('teamId', teamId);
    setError('');
  };

  const onSubmit = handleSubmit(async (data: GroupTeamSelectionFormData) => {
    if (!selectedStaffData) {
      setError('スタッフ情報が見つかりません。');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create updated staff data
      const selectedGroup = groups.find((g) => g.id === data.groupId);
      const selectedTeam = teams.find((t) => t.id === data.teamId);

      const updatedStaffData = {
        staff: selectedStaffData.staff,
        groupName: selectedGroup?.name || selectedStaffData.groupName,
        teamName: selectedTeam?.name || selectedStaffData.teamName,
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
  });

  const handleCancel = () => {
    onClose();
  };

  const { currentGroupId, currentTeamId } = getCurrentGroupTeamIds();
  const showTeamSelector = teams.length > 0;

  // 現在選択中のグループ・チーム情報を取得
  const currentGroup = groups.find((g) => g.id === currentGroupId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto tablet:max-w-[95vw] tablet:max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            グループ・チーム選択
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 tablet:mt-6">
          {/* 現在選択中のグループ・チーム表示 */}
          {selectedStaffData && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">現在選択中:</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 border-blue-300"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        {selectedStaffData.groupName}
                      </Badge>
                      <span className="text-blue-600">-</span>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 border-blue-300"
                      >
                        {selectedStaffData.teamName}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-blue-600">
                    職員: {selectedStaffData.staff?.name || '不明'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Form {...form}>
            <form onSubmit={onSubmit}>
              {/* Group Selector */}
              <FormField
                control={control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <GroupSelector
                        groups={groups}
                        selectedGroupId={field.value}
                        currentGroupId={currentGroupId || undefined}
                        onGroupSelect={handleGroupSelect}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Team Selector */}
              {showTeamSelector && (
                <FormField
                  control={control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TeamSelector
                          teams={teams}
                          selectedTeamId={field.value}
                          currentTeamId={currentTeamId || undefined}
                          onTeamSelect={handleTeamSelect}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                  type="submit"
                  disabled={isLoading || !isValid}
                  className="min-h-touch-target"
                >
                  {isLoading ? '変更中...' : '変更する'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
