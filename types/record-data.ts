/**
 * Record Data Types
 *
 * Types for resident record data display functionality
 */

import { z } from 'zod';

// Record types that can be displayed
export type RecordType = 'care' | 'nursing' | 'handover';

// View mode for the record data display
export type ViewMode = 'daily' | 'monthly';

// Record data for daily view
export interface RecordDataItem {
  id: string;
  type: RecordType;
  time: string; // HH:MM format
  title: string;
  content: string;
  staffName: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
  attachments?: string[];
  status?: 'completed' | 'in-progress' | 'pending';
}

// Monthly statistics data
export interface MonthlyStats {
  date: string; // YYYY-MM-DD format
  careRecordCount: number;
  nursingRecordCount: number;
  handoverCount: number;
  totalRecords: number;
  averageTime?: number; // in minutes
  completionRate?: number; // percentage
}

// Filter options for record data
export interface RecordDataFilters {
  date: Date;
  recordTypes: RecordType[];
  searchQuery: string;
}

// Monthly view data structure
export interface MonthlyData {
  month: string; // YYYY-MM format
  stats: MonthlyStats[];
  summary: {
    totalRecords: number;
    averageDaily: number;
    topCategory: string;
    completionRate: number;
    trends: {
      care: number[];
      nursing: number[];
      handover: number[];
    };
  };
}

// Search and filter schema
export const recordDataFiltersSchema = z.object({
  date: z.date(),
  recordTypes: z.array(z.enum(['care', 'nursing', 'handover'])),
  searchQuery: z.string().optional(),
});

export type RecordDataFiltersFormData = z.infer<typeof recordDataFiltersSchema>;

// API response types
export interface RecordDataResponse {
  date: string;
  records: RecordDataItem[];
  total: number;
}

export interface MonthlyDataResponse {
  month: string;
  data: MonthlyData;
}

// Record type options for filtering
export const recordTypeOptions = [
  {
    value: 'care' as const,
    label: 'ケア記録',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: 'Heart',
  },
  {
    value: 'nursing' as const,
    label: '介護記録',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: 'Stethoscope',
  },
  {
    value: 'handover' as const,
    label: '申し送り',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: 'MessageSquare',
  },
] as const;

// Priority options
export const priorityOptions = [
  { value: 'high', label: '高', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'low', label: '低', color: 'bg-blue-100 text-blue-700 border-blue-200' },
] as const;