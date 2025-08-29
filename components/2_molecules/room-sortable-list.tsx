'use client';

import type { Room } from '@/types/room';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';
import { SortableRoomItem } from './sortable-room-item';

interface RoomSortableListProps {
  rooms: Room[];
  onReorder: (roomIds: string[]) => void;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  isSubmitting?: boolean;
  layout?: 'list' | 'grid';
}

export const RoomSortableList: React.FC<RoomSortableListProps> = ({
  rooms,
  onReorder,
  onEdit,
  onDelete,
  isSubmitting = false,
  layout = 'list',
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = rooms.findIndex((room) => room.id === active.id);
      const newIndex = rooms.findIndex((room) => room.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedRooms = arrayMove(rooms, oldIndex, newIndex);
        const roomIds = reorderedRooms.map((room) => room.id);
        onReorder(roomIds);
      }
    }
  };

  if (rooms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        このグループ・チームには部屋が登録されていません
      </div>
    );
  }

  const sortingStrategy = layout === 'grid' ? rectSortingStrategy : verticalListSortingStrategy;
  const modifiers =
    layout === 'grid' ? [restrictToWindowEdges] : [restrictToVerticalAxis, restrictToWindowEdges];
  const containerClassName =
    layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3';

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      <SortableContext items={rooms.map((room) => room.id)} strategy={sortingStrategy}>
        <div className={containerClassName}>
          {rooms.map((room, index) => (
            <SortableRoomItem
              key={room.id}
              room={room}
              onEdit={onEdit}
              onDelete={onDelete}
              isSubmitting={isSubmitting}
              layout={layout}
              index={index}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
