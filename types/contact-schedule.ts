/**
 * Contact Schedule Types
 *
 * Types for contact schedule functionality
 */

// Contact schedule types
export type ContactScheduleType = 'contact' | 'schedule' | 'handover';
export type ContactSchedulePriority = 'high' | 'medium' | 'low';
export type ContactScheduleStatus = 'pending' | 'confirmed' | 'completed';

// Contact schedule entity type
export interface ContactScheduleItem {
  id: string;
  title: string;
  content: string;
  type: ContactScheduleType;
  priority: ContactSchedulePriority;
  status: ContactScheduleStatus;
  assignedTo: string;
  assignedToId: string;
  dueDate: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags?: string[];
  relatedResidentId?: string;
  relatedResidentName?: string;
  category: string;
}

// Type options
export const typeOptions = [
  {
    value: 'contact',
    label: '連絡事項',
    icon: 'MessageCircle',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  {
    value: 'schedule',
    label: '予定',
    icon: 'Calendar',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    value: 'handover',
    label: '申し送り',
    icon: 'MessageSquare',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
] as const;

export const priorityOptions = [
  { value: 'high', label: '高', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'low', label: '低', color: 'bg-blue-100 text-blue-700 border-blue-200' },
] as const;

export const statusOptions = [
  { value: 'pending', label: '未対応', color: 'bg-red-100 text-red-700 border-red-200' },
  {
    value: 'confirmed',
    label: '確認済み',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  { value: 'completed', label: '完了', color: 'bg-green-100 text-green-700 border-green-200' },
] as const;

// Assignment target options
export const assignmentOptions = [
  { value: 'all-staff', label: '全職員' },
  { value: 'group-1', label: '介護フロア A' },
  { value: 'group-2', label: '介護フロア B' },
  { value: 'group-3', label: '管理部門' },
  { value: 'recreation-team', label: 'レクリエーション担当' },
  { value: 'training-group', label: '研修担当' },
] as const;

// Category options
export const categoryOptions = [
  { value: 'other', label: 'その他' },
  { value: 'office-related', label: '事業所関連' },
  { value: 'company-wide', label: '全社連絡' },
  { value: 'resident-related', label: '利用者関連' },
  { value: 'document-related', label: '書類関連' },
  { value: 'confirmation-request', label: '確認依頼' },
] as const;
