'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Room, RoomFormData } from '@/types/room';
import {
  getAllGroupOptions,
  getGroupIdByName,
  getTeamIdByName,
  getTeamOptionsByGroup,
} from '@/utils/staff-utils';
import { AlertCircle, Building, Edit3, Home, Plus, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

// Interface for selected staff data from localStorage
interface SelectedStaffData {
  staff: {
    id: string;
    name: string;
    furigana: string;
    role: string;
    employeeId: string;
  };
  groupName: string;
  teamName: string;
}

interface RoomManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onCreateRoom: (data: RoomFormData) => Promise<boolean>;
  onUpdateRoom: (roomId: string, data: RoomFormData) => Promise<boolean>;
  onDeleteRoom: (roomId: string) => Promise<boolean>;
}

export const RoomManagementModal: React.FC<RoomManagementModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onCreateRoom,
  onUpdateRoom,
  onDeleteRoom,
}) => {
  const [activeTab, setActiveTab] = useState('list');
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    capacity: 1,
    groupId: '',
    teamId: '',
  });
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RoomFormData, string>>>({});

  const groupOptions = getAllGroupOptions();
  const teamOptions = getTeamOptionsByGroup(formData.groupId || '');

  // Load current logged-in user's group and team information
  useEffect(() => {
    const loadSelectedStaffData = () => {
      try {
        const staffData = localStorage.getItem('carebase_selected_staff_data');
        if (staffData) {
          const parsedData: SelectedStaffData = JSON.parse(staffData);

          // Convert group and team names to IDs
          const groupId = getGroupIdByName(parsedData.groupName);
          const teamId = groupId ? getTeamIdByName(parsedData.teamName, groupId) : null;

          // Set default values for new room creation
          if (!editingRoom && groupId && teamId) {
            setFormData((prev) => ({
              ...prev,
              groupId,
              teamId,
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load selected staff data:', error);
      }
    };
    if (isOpen) {
      setActiveTab('list');
      resetForm();
      if (!editingRoom) {
        loadSelectedStaffData();
      }
    }
  }, [isOpen, editingRoom]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      capacity: 1,
      groupId: '',
      teamId: '',
    });
    setEditingRoom(null);
    setError(null);
    setFieldErrors({});
  }, []);

  const validateForm = useCallback(() => {
    const newFieldErrors: Partial<Record<keyof RoomFormData, string>> = {};

    if (!formData.name.trim()) {
      newFieldErrors.name = '部屋名は必須です';
    }

    if (formData.capacity < 1 || formData.capacity > 10) {
      newFieldErrors.capacity = '定員は1〜10名で入力してください';
    }

    if (!formData.groupId) {
      newFieldErrors.groupId = 'グループは必須です';
    }

    if (!formData.teamId) {
      newFieldErrors.teamId = 'チームは必須です';
    }

    // 重複チェック
    const existingRoom = rooms.find(
      (room) =>
        room.name === formData.name.trim() &&
        room.groupId === formData.groupId &&
        room.teamId === formData.teamId &&
        room.id !== editingRoom?.id
    );

    if (existingRoom) {
      newFieldErrors.name = '同じグループ・チーム内に同じ名前の部屋が既に存在します';
    }

    setFieldErrors(newFieldErrors);
    setError(Object.keys(newFieldErrors).length > 0 ? '入力内容に不備があります。' : null);
    return Object.keys(newFieldErrors).length === 0;
  }, [formData, rooms, editingRoom]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let success = false;

      if (editingRoom) {
        success = await onUpdateRoom(editingRoom.id, formData);
      } else {
        success = await onCreateRoom(formData);
      }

      if (success) {
        resetForm();
        setActiveTab('list');
      } else {
        setError(editingRoom ? '部屋の更新に失敗しました。' : '部屋の作成に失敗しました。');
      }
    } catch (error) {
      console.error('Room form submission error:', error);
      setError('ネットワークエラーが発生しました。接続を確認してもう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingRoom, validateForm, onCreateRoom, onUpdateRoom, resetForm]);

  const handleEdit = useCallback((room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      capacity: room.capacity,
      groupId: room.groupId,
      teamId: room.teamId,
    });
    setActiveTab('form');
  }, []);

  const handleDelete = useCallback(
    async (room: Room) => {
      if (window.confirm(`「${room.name}」を削除してもよろしいですか？`)) {
        setIsSubmitting(true);
        try {
          const success = await onDeleteRoom(room.id);
          if (!success) {
            setError('部屋の削除に失敗しました。');
          }
        } catch (error) {
          console.error('Room deletion error:', error);
          setError('ネットワークエラーが発生しました。');
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [onDeleteRoom]
  );

  const handleCreateNew = useCallback(() => {
    resetForm();
    setActiveTab('form');
  }, [resetForm]);

  const updateField = useCallback(
    (field: keyof RoomFormData, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear field error when user starts typing
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [fieldErrors]
  );

  // Group rooms by group and team
  const groupedRooms = rooms.reduce(
    (acc, room) => {
      const key = `${room.groupId}-${room.teamId}`;
      if (!acc[key]) {
        acc[key] = {
          groupId: room.groupId,
          teamId: room.teamId,
          rooms: [],
        };
      }
      acc[key].rooms.push(room);
      return acc;
    },
    {} as Record<string, { groupId: string; teamId: string; rooms: Room[] }>
  );

  const getGroupName = (groupId: string) => {
    const groupMapping: Record<string, string> = {
      'group-1': '介護フロア A',
      'group-2': '介護フロア B',
      'group-3': '管理部門',
    };
    return groupMapping[groupId] || groupId;
  };

  const getTeamName = (teamId: string) => {
    const teamMapping: Record<string, string> = {
      'team-a1': '朝番チーム',
      'team-a2': '日勤チーム',
      'team-a3': '夜勤チーム',
      'team-b1': '朝番チーム',
      'team-b2': '日勤チーム',
      'team-m1': '管理チーム',
    };
    return teamMapping[teamId] || teamId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            部屋管理
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            施設の部屋情報を管理します。グループ・チームごとに部屋を登録・編集できます。
          </DialogDescription>
        </DialogHeader>

        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  部屋一覧
                </TabsTrigger>
                <TabsTrigger value="form" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {editingRoom ? '部屋編集' : '部屋作成'}
                </TabsTrigger>
              </TabsList>

              {activeTab === 'list' && (
                <Button
                  onClick={handleCreateNew}
                  className="bg-carebase-blue hover:bg-carebase-blue-dark"
                >
                  <Home className="h-4 w-4 mr-2" />
                  新規部屋作成
                </Button>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="list" className="space-y-6">
              {Object.keys(groupedRooms).length === 0 ? (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="text-center py-12">
                    <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      部屋が登録されていません
                    </h3>
                    <p className="text-gray-500 mb-6">
                      最初の部屋を作成して、利用者の部屋管理を始めましょう。
                    </p>
                    <Button
                      onClick={handleCreateNew}
                      className="bg-carebase-blue hover:bg-carebase-blue-dark"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      最初の部屋を作成
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {Object.values(groupedRooms).map((group) => (
                    <Card key={`${group.groupId}-${group.teamId}`}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building className="h-5 w-5 text-carebase-blue" />
                          {getGroupName(group.groupId)} - {getTeamName(group.teamId)}
                          <div className="flex items-center gap-2 text-sm font-normal text-gray-500">
                            <span>({group.rooms.length}部屋)</span>
                            <span className="text-xs">
                              入居:{' '}
                              {group.rooms.reduce(
                                (sum, room) => sum + (room.currentOccupancy || 0),
                                0
                              )}
                              /{group.rooms.reduce((sum, room) => sum + room.capacity, 0)}名
                            </span>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.rooms.map((room) => (
                            <Card key={room.id} className="border border-gray-200">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-carebase-text-primary">
                                    {room.name}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEdit(room)}
                                      disabled={isSubmitting}
                                    >
                                      <Edit3 className="h-3 w-3 mr-1" />
                                      編集
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDelete(room)}
                                      disabled={isSubmitting}
                                      className="border-red-300 text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      削除
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <div className="flex items-center justify-between">
                                    <span>定員: {room.capacity}名</span>
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        (room.currentOccupancy || 0) >= room.capacity
                                          ? 'bg-red-100 text-red-700'
                                          : (room.currentOccupancy || 0) > 0
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-green-100 text-green-700'
                                      }`}
                                    >
                                      {room.currentOccupancy || 0}/{room.capacity}
                                    </span>
                                  </div>
                                  <div className="mt-1">
                                    <span
                                      className={`text-xs font-medium ${
                                        (room.currentOccupancy || 0) >= room.capacity
                                          ? 'text-red-600'
                                          : 'text-green-600'
                                      }`}
                                    >
                                      {(room.currentOccupancy || 0) >= room.capacity
                                        ? '満室'
                                        : '空きあり'}
                                    </span>
                                  </div>
                                  <p className="text-xs mt-1">
                                    作成日: {new Date(room.createdAt).toLocaleDateString('ja-JP')}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="form" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
                    基本情報
                  </h3>

                  <FormField
                    label="部屋名"
                    id="name"
                    value={formData.name}
                    onChange={(value) => updateField('name', value)}
                    placeholder="101号室"
                    required
                    error={fieldErrors.name}
                    disabled={isSubmitting}
                  />

                  <FormField
                    label="定員"
                    id="capacity"
                    type="number"
                    value={formData.capacity.toString()}
                    onChange={(value) => updateField('capacity', parseInt(value) || 1)}
                    placeholder="1"
                    required
                    error={fieldErrors.capacity}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Right Column - Assignment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
                    所属設定
                  </h3>

                  <FormSelect
                    label="所属グループ"
                    id="groupId"
                    value={formData.groupId}
                    onChange={(value) => {
                      updateField('groupId', value);
                      updateField('teamId', ''); // Reset team when group changes
                    }}
                    options={groupOptions.map((option) => ({
                      value: getGroupIdByName(option.value) || '',
                      label: option.label,
                    }))}
                    required
                    error={fieldErrors.groupId}
                    disabled={isSubmitting}
                  />

                  <FormSelect
                    label="所属チーム"
                    id="teamId"
                    value={formData.teamId}
                    onChange={(value) => updateField('teamId', value)}
                    options={teamOptions.map((option) => ({
                      value: getTeamIdByName(option.value, formData.groupId) || '',
                      label: option.label,
                    }))}
                    required
                    error={fieldErrors.teamId}
                    disabled={isSubmitting || !formData.groupId}
                    placeholder={
                      !formData.groupId
                        ? 'まずグループを選択してください'
                        : 'チームを選択してください'
                    }
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('list')}
                  disabled={isSubmitting}
                >
                  キャンセル
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-carebase-blue hover:bg-carebase-blue-dark"
                >
                  <Home className="h-4 w-4 mr-2" />
                  {isSubmitting ? '保存中...' : editingRoom ? '部屋を更新' : '部屋を作成'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
