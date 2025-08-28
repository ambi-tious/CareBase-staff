'use client';

import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Room, RoomFormData } from '@/types/room';
import {
  getAllGroupOptions,
  getGroupIdByName,
  getTeamIdByName,
  getTeamOptionsByGroup,
} from '@/utils/staff-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Building, Edit3, Home, Plus, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Room validation schema
const roomFormSchema = z.object({
  name: z.string().min(1, '部屋名は必須です'),
  capacity: z
    .number()
    .min(1, '定員は1以上で入力してください')
    .max(10, '定員は10以下で入力してください'),
  groupId: z.string().min(1, 'グループは必須です'),
  teamId: z.string().min(1, 'チームは必須です'),
});

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
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserTeamId, setCurrentUserTeamId] = useState<string>('');
  const [deleteConfirmRoom, setDeleteConfirmRoom] = useState<Room | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      name: '',
      capacity: 1,
      groupId: '',
      teamId: '',
    },
    mode: 'onChange',
  });

  const { control, handleSubmit, reset, setValue, watch, formState } = form;
  const { isValid } = formState;
  const watchedGroupId = watch('groupId');

  const resetForm = useCallback(() => {
    reset({
      name: '',
      capacity: 1,
      groupId: '',
      teamId: '',
    });
    setEditingRoom(null);
    setError(null);
  }, [reset]);

  const groupOptions = getAllGroupOptions();
  const teamOptions = getTeamOptionsByGroup(watchedGroupId || '');

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
            setValue('groupId', groupId);
            setValue('teamId', teamId);
          }

          // Set current user's team ID for accordion default state
          if (teamId) {
            setCurrentUserTeamId(teamId);
          }
        }
      } catch (error) {
        console.error('Failed to load selected staff data:', error);
      }
    };
    if (isOpen) {
      // 編集モードでない場合のみリストタブに設定
      if (!editingRoom) {
        setActiveTab('list');
        resetForm();
        loadSelectedStaffData();
      }
    }
  }, [isOpen, editingRoom, resetForm, setValue]);

  const onSubmit = handleSubmit(async (data: RoomFormData) => {
    // 重複チェック
    const existingRoom = rooms.find(
      (room) =>
        room.name === data.name.trim() &&
        room.groupId === data.groupId &&
        room.teamId === data.teamId &&
        room.id !== editingRoom?.id
    );

    if (existingRoom) {
      form.setError('name', { message: '同じグループ・チーム内に同じ名前の部屋が既に存在します' });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let success = false;

      if (editingRoom) {
        success = await onUpdateRoom(editingRoom.id, data);
      } else {
        success = await onCreateRoom(data);
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
  });

  const handleEdit = useCallback(
    (room: Room) => {
      // まず編集対象の部屋を設定
      setEditingRoom(room);
      // フォームデータを設定
      reset({
        name: room.name,
        capacity: room.capacity,
        groupId: room.groupId,
        teamId: room.teamId,
      });
      // エラーをクリア
      setError(null);
      // フォームタブに切り替え
      setActiveTab('form');
    },
    [reset]
  );

  const handleDelete = useCallback((room: Room) => {
    setDeleteConfirmRoom(room);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async (): Promise<boolean> => {
    if (!deleteConfirmRoom) return false;

    try {
      const success = await onDeleteRoom(deleteConfirmRoom.id);
      if (!success) {
        setDeleteError('部屋の削除に失敗しました。');
        return false;
      }
      setDeleteError(null);
      setDeleteConfirmRoom(null);
      return true;
    } catch (error) {
      console.error('Room deletion error:', error);
      setDeleteError('ネットワークエラーが発生しました。');
      return false;
    }
  }, [deleteConfirmRoom, onDeleteRoom]);

  const handleDeleteModalClose = useCallback(() => {
    setDeleteConfirmRoom(null);
    setIsDeleteModalOpen(false);
    setDeleteError(null);
  }, []);

  const handleCreateNew = useCallback(() => {
    resetForm();
    setActiveTab('form');
  }, [resetForm]);

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
                <Accordion
                  type="multiple"
                  defaultValue={
                    currentUserTeamId
                      ? Object.values(groupedRooms)
                          .filter((group) => group.teamId === currentUserTeamId)
                          .map((group) => `${group.groupId}-${group.teamId}`)
                      : []
                  }
                  className="space-y-4"
                >
                  {Object.values(groupedRooms).map((group) => (
                    <AccordionItem
                      key={`${group.groupId}-${group.teamId}`}
                      value={`${group.groupId}-${group.teamId}`}
                      className="border border-gray-200 rounded-lg"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Building className="h-5 w-5 text-carebase-blue" />
                          <span className="text-lg font-semibold text-carebase-text-primary">
                            {getGroupName(group.groupId)} - {getTeamName(group.teamId)}
                          </span>
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
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
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
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEdit(room);
                                      }}
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
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>

            <TabsContent value="form" className="space-y-6">
              <Form {...form}>
                <form onSubmit={onSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
                        基本情報
                      </h3>

                      <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              部屋名 <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="101号室" disabled={isSubmitting} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="capacity"
                        render={({ field: { onChange, value, ...field } }) => (
                          <FormItem>
                            <FormLabel>
                              定員 <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                disabled={isSubmitting}
                                value={value.toString()}
                                onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Right Column - Assignment */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
                        所属設定
                      </h3>

                      <FormField
                        control={control}
                        name="groupId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              所属グループ <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                setValue('teamId', ''); // Reset team when group changes
                              }}
                              disabled={isSubmitting}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="グループを選択" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {groupOptions.map((option) => {
                                  const groupId = getGroupIdByName(option.value) || '';
                                  return (
                                    <SelectItem key={groupId} value={groupId}>
                                      {option.label}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="teamId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              所属チーム <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isSubmitting || !watchedGroupId}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      !watchedGroupId
                                        ? 'まずグループを選択してください'
                                        : 'チームを選択してください'
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {teamOptions.map((option) => {
                                  const teamId =
                                    getTeamIdByName(option.value, watchedGroupId) || '';
                                  return (
                                    <SelectItem key={teamId} value={teamId}>
                                      {option.label}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
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
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="bg-carebase-blue hover:bg-carebase-blue-dark"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      {isSubmitting ? '保存中...' : editingRoom ? '部屋を更新' : '部屋を作成'}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      {/* Delete Confirmation Modal */}
      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        itemName={deleteConfirmRoom?.name || ''}
        itemType="部屋"
        isDeleting={isSubmitting}
        error={deleteError}
        customMessage="部屋に利用者が入居している場合は、先に利用者を他の部屋に移動してください。"
      />
    </Dialog>
  );
};
