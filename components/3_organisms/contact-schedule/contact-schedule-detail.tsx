'use client';

import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContactScheduleItem } from '@/types/contact-schedule';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ArrowLeft, Calendar, Clock, Edit3, MessageSquare, Tag, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

interface ContactScheduleDetailProps {
  item: ContactScheduleItem;
  onDelete?: (itemId: string) => Promise<boolean>;
}

export const ContactScheduleDetail: React.FC<ContactScheduleDetailProps> = ({ item, onDelete }) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'schedule':
        return (
          <span className="bg-blue-100 text-blue-700 border-blue-200 px-2 py-1 rounded-full text-xs font-medium border">
            予定
          </span>
        );
      case 'contact':
        return (
          <span className="bg-green-100 text-green-700 border-green-200 px-2 py-1 rounded-full text-xs font-medium border">
            連絡事項
          </span>
        );
      case 'handover':
        return (
          <span className="bg-purple-100 text-purple-700 border-purple-200 px-2 py-1 rounded-full text-xs font-medium border">
            申し送り
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 border-gray-200 px-2 py-1 rounded-full text-xs font-medium border">
            {type}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="bg-red-100 text-red-700 border-red-200 px-2 py-1 rounded-full text-xs font-medium border">
            高
          </span>
        );
      case 'medium':
        return (
          <span className="bg-yellow-100 text-yellow-700 border-yellow-200 px-2 py-1 rounded-full text-xs font-medium border">
            中
          </span>
        );
      case 'low':
        return (
          <span className="bg-blue-100 text-blue-700 border-blue-200 px-2 py-1 rounded-full text-xs font-medium border">
            低
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 border-gray-200 px-2 py-1 rounded-full text-xs font-medium border">
            -
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-red-100 text-red-700 border-red-200 px-2 py-1 rounded-full text-xs font-medium border">
            未対応
          </span>
        );
      case 'confirmed':
        return (
          <span className="bg-yellow-100 text-yellow-700 border-yellow-200 px-2 py-1 rounded-full text-xs font-medium border">
            確認済み
          </span>
        );
      case 'completed':
        return (
          <span className="bg-green-100 text-green-700 border-green-200 px-2 py-1 rounded-full text-xs font-medium border">
            完了
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 border-gray-200 px-2 py-1 rounded-full text-xs font-medium border">
            -
          </span>
        );
    }
  };

  const handleDeleteClick = () => {
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      if (onDelete) {
        const success = await onDelete(item.id);
        if (success) {
          router.push('/contact-schedule');
          return true;
        } else {
          setDeleteError('削除に失敗しました。もう一度お試しください。');
          return false;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push('/contact-schedule');
        return true;
      }
    } catch (error) {
      console.error('Failed to delete contact schedule:', error);
      setDeleteError('削除中にエラーが発生しました。もう一度お試しください。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" asChild>
            <Link href="/contact-schedule">
              <ArrowLeft className="h-4 w-4 mr-2" />
              一覧に戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">連絡・予定詳細</h1>
          </div>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl text-carebase-text-primary">{item.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>ID: {item.id}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(item.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                asChild
                className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
              >
                <Link href={`/contact-schedule/${item.id}/edit`}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  編集
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteClick}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                削除
              </Button>
              {getTypeBadge(item.type)}
              {getPriorityBadge(item.priority)}
              {getStatusBadge(item.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <span className="text-sm font-medium">対象者: </span>
                  <span className="text-sm">{item.assignedTo}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-blue-800">実施日時: </span>
                  <span className="text-sm text-blue-700">
                    {format(new Date(item.dueDate), 'yyyy年MM月dd日', { locale: ja })}
                    {item.startTime && ` ${item.startTime}`}
                    {item.endTime && ` - ${item.endTime}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {item.relatedResidentName && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm font-medium text-green-800">関連利用者: </span>
                  <Link
                    href={`/residents/${item.relatedResidentId}`}
                    className="text-sm text-carebase-blue hover:underline"
                  >
                    {item.relatedResidentName}
                  </Link>
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">タグ:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-carebase-text-primary">内容</h3>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{item.content}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-sm">
              <span className="font-medium text-gray-500">作成日時:</span>
              <div className="mt-1">{formatDateTime(item.createdAt)}</div>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-500">更新日時:</span>
              <div className="mt-1">{formatDateTime(item.updatedAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={item.title}
        itemType="連絡・予定"
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
};
