/**
 * Notification Types
 *
 * Types for unified notification system including contact schedules and system notifications
 */

// Notification types
export type NotificationType = 'contact_schedule' | 'system';

// Notification priority levels
export type NotificationPriority = 'high' | 'medium' | 'low';

// Notification status
export type NotificationStatus = 'unread' | 'read' | 'completed';

// Base notification interface
export interface BaseNotification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  targetStaffIds?: string[];
  relatedResidentId?: string;
  relatedResidentName?: string;
  readAt?: string;
  completedAt?: string;
  // Navigation URL for when notification is clicked
  navigationUrl: string;
}

// Contact schedule notification (extends base)
export interface ContactScheduleNotification extends BaseNotification {
  type: 'contact_schedule';
  scheduleType: 'contact' | 'schedule' | 'handover';
  assignedTo: string;
  dueDate: string;
  startTime?: string;
  endTime?: string;
  tags?: string[];
}

// System notification (extends base)
export interface SystemNotification extends BaseNotification {
  type: 'system';
  systemType: 'maintenance' | 'update' | 'announcement' | 'alert';
}

// Union type for all notifications
export type Notification = ContactScheduleNotification | SystemNotification;

// Notification search and filter types
export interface NotificationSearchParams {
  query?: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// API response types
export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

// Type options for UI
export const notificationTypeOptions = [
  {
    value: 'contact_schedule',
    label: '連絡・予定',
    icon: 'Calendar',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    value: 'system',
    label: 'システム',
    icon: 'Settings',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
] as const;

export const notificationPriorityOptions = [
  { value: 'high', label: '高', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'low', label: '低', color: 'bg-blue-100 text-blue-700 border-blue-200' },
] as const;

export const notificationStatusOptions = [
  { value: 'unread', label: '未読', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'read', label: '既読', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'completed', label: '対応済み', color: 'bg-blue-100 text-blue-700 border-blue-200' },
] as const;
