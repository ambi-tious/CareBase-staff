import type { ContactScheduleNotification, Notification } from '@/types/notification';
import { contactScheduleData } from './contact-schedule-data';

// Convert contact schedule data to notifications
const contactScheduleNotifications: ContactScheduleNotification[] = contactScheduleData.map(
  (item) => ({
    id: `contact-schedule-${item.id}`,
    type: 'contact_schedule' as const,
    title: item.title,
    content: item.content,
    priority: item.priority,
    status:
      item.status === 'pending' ? 'unread' : item.status === 'confirmed' ? 'read' : 'completed',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    createdBy: item.createdBy || 'system',
    createdByName: '事務 花子', // Default creator name
    relatedResidentId: item.relatedResidentId,
    relatedResidentName: item.relatedResidentName,
    navigationUrl: `/contact-schedule/${item.id}`,
    scheduleType: item.type,
    assignedTo: item.assignedTo,
    dueDate: item.dueDate,
    startTime: item.startTime,
    endTime: item.endTime,
    tags: item.tags,
  })
);

// Combine all notifications
export const notificationData: Notification[] = [...contactScheduleNotifications].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);

// Helper functions
export const getNotificationById = (id: string): Notification | undefined => {
  return notificationData.find((notification) => notification.id === id);
};

export const getNotificationsByType = (type: string): Notification[] => {
  return notificationData.filter((notification) => notification.type === type);
};

export const getNotificationsByStatus = (status: string): Notification[] => {
  return notificationData.filter((notification) => notification.status === status);
};

export const getNotificationsByPriority = (priority: string): Notification[] => {
  return notificationData.filter((notification) => notification.priority === priority);
};

export const getUnreadNotifications = (): Notification[] => {
  return notificationData.filter((notification) => notification.status === 'unread');
};

export const searchNotifications = (query: string): Notification[] => {
  const lowercaseQuery = query.toLowerCase();
  return notificationData.filter(
    (notification) =>
      notification.title.toLowerCase().includes(lowercaseQuery) ||
      notification.content.toLowerCase().includes(lowercaseQuery) ||
      notification.createdByName.toLowerCase().includes(lowercaseQuery) ||
      notification.relatedResidentName?.toLowerCase().includes(lowercaseQuery)
  );
};
