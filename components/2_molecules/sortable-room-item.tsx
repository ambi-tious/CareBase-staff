'use client';

import { ActionDropdownMenu } from '@/components/1_atoms/buttons/action-dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import type { Room } from '@/types/room';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit3, GripVertical, Trash2 } from 'lucide-react';
import React from 'react';

interface SortableRoomItemProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  isSubmitting?: boolean;
  layout?: 'list' | 'grid';
  index?: number;
}

export const SortableRoomItem: React.FC<SortableRoomItemProps> = ({
  room,
  onEdit,
  onDelete,
  isSubmitting = false,
  layout = 'list',
  index,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: room.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (layout === 'grid') {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={`border border-gray-200 cursor-grab relative ${
          isDragging ? 'shadow-lg opacity-50 cursor-grabbing' : 'hover:shadow-md'
        } transition-shadow`}
        {...attributes}
        {...listeners}
      >
        {typeof index === 'number' && (
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-carebase-blue text-white rounded-full flex items-center justify-center text-xs font-semibold">
            {index + 1}
          </div>
        )}
        <CardContent className="p-4">
          {/* Order Number */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-carebase-blue text-lg">{room.name}</h3>
              <span
                className={`text-xs ${
                  (room.currentOccupancy || 0) >= room.capacity
                    ? 'text-red-700'
                    : (room.currentOccupancy || 0) > 0
                      ? 'text-yellow-700'
                      : 'text-green-700'
                }`}
              >
                {(room.currentOccupancy || 0) >= room.capacity ? (
                  '満室'
                ) : (
                  <>
                    <span>空きあり</span>
                    <span className="ml-1">
                      ( {room.capacity - (room.currentOccupancy || 0)}名 )
                    </span>
                  </>
                )}
              </span>
            </div>
            <ActionDropdownMenu
              actions={[
                {
                  id: 'edit',
                  label: '編集',
                  icon: Edit3,
                  onClick: (e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    onEdit(room);
                  },
                  disabled: isSubmitting,
                },
                {
                  id: 'delete',
                  label: '削除',
                  icon: Trash2,
                  onClick: () => onDelete(room),
                  disabled: isSubmitting,
                  variant: 'destructive',
                },
              ]}
            />
          </div>
          <div className="flex items-center text-gray-600 mt-2 gap-2">
            <p className="text-xs">定員: {room.capacity}名</p>
            <p className="text-xs">
              作成日: {new Date(room.createdAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List layout (original design with grip handle)
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`border border-gray-200 ${
        isDragging ? 'shadow-lg opacity-50' : 'hover:shadow-md'
      } transition-shadow`}
    >
      <CardContent className="p-4 relative">
        {/* Order Number */}
        {typeof index === 'number' && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-carebase-blue text-white rounded-full flex items-center justify-center text-xs font-semibold">
            {index + 1}
          </div>
        )}
        <div className="flex items-center gap-3 mt-2">
          {/* Drag Handle */}
          <div
            className={`flex items-center justify-center w-6 h-6 text-gray-400 cursor-grab hover:text-gray-600 ${
              isDragging ? 'cursor-grabbing' : ''
            } ml-8`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </div>

          {/* Room Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-carebase-text-primary">{room.name}</h4>
              <ActionDropdownMenu
                actions={[
                  {
                    id: 'edit',
                    label: '編集',
                    icon: Edit3,
                    onClick: (e) => {
                      e?.preventDefault();
                      e?.stopPropagation();
                      onEdit(room);
                    },
                    disabled: isSubmitting,
                  },
                  {
                    id: 'delete',
                    label: '削除',
                    icon: Trash2,
                    onClick: () => onDelete(room),
                    disabled: isSubmitting,
                    variant: 'destructive',
                  },
                ]}
              />
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
                  {(room.currentOccupancy || 0) >= room.capacity ? '満室' : '空きあり'}
                </span>
              </div>
              <p className="text-xs mt-1">
                作成日: {new Date(room.createdAt).toLocaleDateString('ja-JP')}
              </p>
              {room.sortOrder && <p className="text-xs text-gray-400">順番: {room.sortOrder}</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
