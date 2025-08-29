'use client';

import { ResidentBasicInfoForm } from '@/components/2_molecules/forms/resident-basic-info-form';
import { RoomManagementModal } from '@/components/3_organisms/modals/room-management-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { residentService } from '@/services/residentService';
import { roomService } from '@/services/roomService';
import type { Room, RoomFormData } from '@/types/room';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function NewResidentPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load rooms on component mount
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const allRooms = await roomService.getAllActiveRooms();
        setRooms(allRooms);
      } catch (error) {
        console.error('Failed to load rooms:', error);
      }
    };

    loadRooms();
  }, []);

  const handleCancel = () => {
    router.push('/residents');
  };

  const handleRoomManagement = () => {
    setIsRoomModalOpen(true);
  };

  const handleCreateRoom = async (data: RoomFormData): Promise<boolean> => {
    try {
      // In production, this would call the API
      // For now, simulate room creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newRoom: Room = {
        id: `room-${Date.now()}`,
        name: data.name,
        capacity: data.capacity,
        groupId: data.groupId,
        teamId: data.teamId,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRooms((prev) => [...prev, newRoom]);

      // Show success toast
      toast.success('部屋の登録が完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to create room:', error);
      return false;
    }
  };

  const handleUpdateRoom = async (roomId: string, data: RoomFormData): Promise<boolean> => {
    try {
      // In production, this would call the API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId
            ? {
                ...room,
                name: data.name,
                capacity: data.capacity,
                groupId: data.groupId,
                teamId: data.teamId,
                updatedAt: new Date().toISOString(),
              }
            : room
        )
      );

      // Show success toast
      toast.success('部屋の更新が完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to update room:', error);
      return false;
    }
  };

  const handleDeleteRoom = async (roomId: string): Promise<boolean> => {
    try {
      // In production, this would call the API
      await new Promise((resolve) => setTimeout(resolve, 800));

      setRooms((prev) => prev.filter((room) => room.id !== roomId));

      // Show success toast
      toast.success('部屋の削除が完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to delete room:', error);
      return false;
    }
  };
  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
          <div className="flex items-center gap-3">
            <UserPlus className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">新規利用者登録</h1>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          新しい利用者の基本情報を入力してください。必須項目（
          <span className="text-red-500">*</span>）は必ず入力してください。
        </p>
      </div>

      {/* Error Alert */}
      {submitError && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            基本情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResidentBasicInfoForm
            onSubmit={async (data) => {
              try {
                setIsSubmitting(true);
                setSubmitError(null);
                const newResident = await residentService.createResident(data);

                // Show success toast
                toast.success('利用者の登録が完了しました。');

                // Navigate to the resident detail page
                router.replace(`/residents/${newResident.id}`);
                return true;
              } catch (error) {
                console.error('Failed to create resident:', error);
                setSubmitError('利用者の登録に失敗しました。もう一度お試しください。');
                return false;
              } finally {
                setIsSubmitting(false);
              }
            }}
            onCancel={handleCancel}
            disabled={isSubmitting}
            handleRoomManagement={handleRoomManagement}
          />
        </CardContent>
      </Card>

      {/* Room Management Modal */}
      <RoomManagementModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        rooms={rooms}
        onCreateRoom={handleCreateRoom}
        onUpdateRoom={handleUpdateRoom}
        onDeleteRoom={handleDeleteRoom}
      />
    </div>
  );
}
