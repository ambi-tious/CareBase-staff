/**
 * Individual Point Types
 *
 * Types for individual point management system
 */

import { z } from 'zod';

// Individual point priority levels
export type IndividualPointPriority = 'high' | 'medium' | 'low';

// Individual point status
export type IndividualPointStatus = 'active' | 'inactive' | 'archived';

// Individual point categories (linked to care record categories)
export type IndividualPointCategory =
  | 'meal'
  | 'bathing'
  | 'medication'
  | 'excretion'
  | 'vital'
  | 'exercise'
  | 'communication'
  | 'other';

// Media file types
export type MediaFileType = 'image' | 'video' | 'document';

// Media attachment interface
export interface MediaAttachment {
  id: string;
  fileName: string;
  fileType: MediaFileType;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Individual point form data schema
export const individualPointFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  content: z.string().min(1, '内容は必須です').max(1000, '内容は1000文字以内で入力してください'),
  category: z.enum(
    ['meal', 'bathing', 'medication', 'excretion', 'vital', 'exercise', 'communication', 'other'],
    {
      required_error: 'カテゴリは必須です',
    }
  ),
  priority: z.enum(['high', 'medium', 'low'], {
    required_error: '優先度は必須です',
  }),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type IndividualPointFormData = z.infer<typeof individualPointFormSchema>;

// Individual point entity type
export interface IndividualPoint {
  id: string;
  residentId: string;
  title: string;
  content: string;
  category: IndividualPointCategory;
  priority: IndividualPointPriority;
  status: IndividualPointStatus;
  tags: string[];
  notes?: string;
  mediaAttachments: MediaAttachment[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  isSystemDefault: boolean; // システム標準かどうか
}

// Category management types
export interface PointCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isSystemDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリ名は必須です')
    .max(50, 'カテゴリ名は50文字以内で入力してください'),
  description: z.string().max(200, '説明は200文字以内で入力してください').optional(),
  icon: z.string().min(1, 'アイコンは必須です'),
  color: z.string().min(1, '色は必須です'),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

// API response types
export interface IndividualPointListResponse {
  points: IndividualPoint[];
  total: number;
  page: number;
  limit: number;
}

export interface IndividualPointCreateResponse {
  success: boolean;
  point?: IndividualPoint;
  error?: string;
}

// Search and filter types
export interface IndividualPointSearchParams {
  query?: string;
  category?: IndividualPointCategory;
  priority?: IndividualPointPriority;
  status?: IndividualPointStatus;
  tags?: string[];
  page?: number;
  limit?: number;
}

// Category options
export const categoryOptions = [
  {
    value: 'meal',
    label: '食事',
    icon: 'Utensils',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  {
    value: 'bathing',
    label: '入浴',
    icon: 'Bath',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    value: 'medication',
    label: '服薬',
    icon: 'Pill',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    value: 'excretion',
    label: '排泄',
    icon: 'ExcretionIcon',
    color: 'bg-brown-100 text-brown-700 border-brown-200',
  },
  {
    value: 'vital',
    label: 'バイタル',
    icon: 'Activity',
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    value: 'exercise',
    label: '運動',
    icon: 'Dumbbell',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  {
    value: 'communication',
    label: 'コミュニケーション',
    icon: 'MessageCircle',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  {
    value: 'other',
    label: 'その他',
    icon: 'FileText',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
] as const;

// Priority options
export const priorityOptions = [
  { value: 'high', label: '高', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'low', label: '低', color: 'bg-blue-100 text-blue-700 border-blue-200' },
] as const;

// Status options
export const statusOptions = [
  { value: 'active', label: '有効', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'inactive', label: '無効', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  {
    value: 'archived',
    label: 'アーカイブ',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
] as const;
