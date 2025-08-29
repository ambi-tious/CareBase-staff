'use client';

import { ResidentBasicInfoForm } from '@/components/2_molecules/forms/resident-basic-info-form';
import { RoomManagementModal } from '@/components/3_organisms/modals/room-management-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getResidentById } from '@/mocks/care-board-data';
import { residentService } from '@/services/residentService';
import { roomService } from '@/services/roomService';
import type { Room, RoomFormData } from '@/types/room';
import { ArrowLeft, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface EditResidentPageProps {
  params: Promise<{ residentId: string }>; // Next.js 15: params は非同期解決
}

// ユーティリティ: YYYY/MM/DD → YYYY-MM-DD
const toHyphenDate = (dateStr?: string) => (dateStr ? dateStr.replaceAll('/', '-') : '');

export default function EditResidentPage({ params }: EditResidentPageProps) {
  const router = useRouter();
  const [resolvedResidentId, setResolvedResidentId] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const resident = useMemo(() => {
    if (!resolvedResidentId) return null;
    const idNum = Number.parseInt(resolvedResidentId, 10);
    return getResidentById(idNum) || null;
  }, [resolvedResidentId]);

  // params 解決 & 初期データロード
  useEffect(() => {
    const load = async () => {
      const p = await params;
      setResolvedResidentId(p.residentId);
      setIsLoading(false);
    };
    load();
  }, [params]);

  // 部屋一覧ロード（モーダル用）
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

  // 基本的な状態管理のみ（フォーム状態はResidentBasicInfoFormで管理）
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    if (resident) {
      router.push(`/residents/${resident.id}`);
    } else {
      router.push('/residents');
    }
  };

  const handleRoomManagement = () => {
    setIsRoomModalOpen(true);
  };

  const handleCreateRoom = async (data: RoomFormData): Promise<boolean> => {
    try {
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
      return true;
    } catch (error) {
      console.error('Failed to create room:', error);
      return false;
    }
  };

  const handleUpdateRoom = async (roomId: string, data: RoomFormData): Promise<boolean> => {
    try {
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
      return true;
    } catch (error) {
      console.error('Failed to update room:', error);
      return false;
    }
  };

  const handleDeleteRoom = async (roomId: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
      return true;
    } catch (error) {
      console.error('Failed to delete room:', error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="outline" asChild>
            <Link href="/residents">
              <ArrowLeft className="h-4 w-4" /> 戻る
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-carebase-text-primary">利用者が見つかりません</h1>
        </div>
        <p className="text-gray-600">URL をご確認のうえ、一覧から再度お選びください。</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="outline" asChild>
            <Link href={`/residents/${resident.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" /> 戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">利用者情報の編集</h1>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          {resident.name}様の基本情報を編集してください。必須項目（
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
            <Edit3 className="h-5 w-5" /> 基本情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResidentBasicInfoForm
            onSubmit={async (data) => {
              try {
                setIsSubmitting(true);
                setSubmitError(null);

                // 更新用に一部フォーマット変換（内部データはスラッシュ区切りが既定）
                const payload: Record<string, unknown> = {
                  ...data,
                  dob: data.dob ? data.dob.replaceAll('-', '/') : '',
                  admissionDate: data.admissionDate ? data.admissionDate.replaceAll('-', '/') : '',
                  dischargeDate: data.dischargeDate
                    ? data.dischargeDate.replaceAll('-', '/')
                    : undefined,
                };

                // 画像は Resident の avatarUrl にマップする
                if (data.profileImage) {
                  payload.avatarUrl = data.profileImage;
                  delete payload.profileImage;
                }

                const updatePayload = payload as Parameters<
                  typeof residentService.updateResident
                >[1];
                await residentService.updateResident(resident!.id, updatePayload);

                // 編集後は詳細へ戻る
                router.push(`/residents/${resident!.id}`);
                return true;
              } catch (error) {
                console.error('Failed to update resident:', error);
                setSubmitError('利用者情報の更新に失敗しました。もう一度お試しください。');
                return false;
              } finally {
                setIsSubmitting(false);
              }
            }}
            onCancel={handleCancel}
            initialData={{
              name: resident.name || '',
              furigana: resident.furigana || '',
              dob: toHyphenDate(resident.dob),
              sex: resident.sex || '男',
              floorGroup: resident.floorGroup || '',
              unitTeam: resident.unitTeam || '',
              roomInfo: resident.roomInfo || '',
              admissionDate: toHyphenDate(resident.admissionDate),
              dischargeDate: toHyphenDate(resident.dischargeDate),
              status: (resident.status as '入所前' | '入所中' | '退所' | 'ー') || 'ー',
              profileImage: resident.avatarUrl || '',
              notes: resident.notes || '',
            }}
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
        onReorderRooms={async (groupId, teamId, roomIds) => {
          try {
            const success = await roomService.updateRoomSortOrders(groupId, teamId, roomIds);
            if (success) {
              // Refresh rooms data
              const updatedRooms = await roomService.getAllActiveRooms();
              setRooms(updatedRooms);
            }
            return success;
          } catch (error) {
            console.error('Failed to reorder rooms:', error);
            return false;
          }
        }}
      />
    </div>
  );
}
