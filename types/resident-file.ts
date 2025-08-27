/**
 * Resident File Types
 *
 * Types for resident file management system
 */

// File category types
export type ResidentFileCategory = 
  | 'medical_record'
  | 'care_plan'
  | 'assessment'
  | 'photo'
  | 'family_document'
  | 'insurance'
  | 'other';

// File status
export type ResidentFileStatus = 'active' | 'archived';

// File entity type
export interface ResidentFile {
  id: string;
  residentId: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  category: ResidentFileCategory;
  status: ResidentFileStatus;
  description?: string;
  tags?: string[];
  uploadedAt: string;
  uploadedBy: string;
  uploadedByName: string;
  url: string;
  thumbnailUrl?: string;
  isImage: boolean;
  isDocument: boolean;
}

// API response types
export interface ResidentFileListResponse {
  files: ResidentFile[];
  total: number;
  page: number;
  limit: number;
}

export interface ResidentFileCreateResponse {
  success: boolean;
  file?: ResidentFile;
  error?: string;
}

// Search and filter types
export interface ResidentFileSearchParams {
  query?: string;
  category?: ResidentFileCategory;
  status?: ResidentFileStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Category options
export const fileCategoryOptions = [
  {
    value: 'medical_record',
    label: '医療記録',
    icon: 'FileText',
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    value: 'care_plan',
    label: 'ケアプラン',
    icon: 'FileCheck',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    value: 'assessment',
    label: 'アセスメント',
    icon: 'ClipboardList',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  {
    value: 'photo',
    label: '写真',
    icon: 'Camera',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    value: 'family_document',
    label: '家族関連書類',
    icon: 'Users',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  {
    value: 'insurance',
    label: '保険関連',
    icon: 'Shield',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  {
    value: 'other',
    label: 'その他',
    icon: 'File',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
] as const;

// Status options
export const fileStatusOptions = [
  { value: 'active', label: '有効', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'archived', label: 'アーカイブ', color: 'bg-gray-100 text-gray-700 border-gray-200' },
] as const;