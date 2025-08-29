/**
 * Communication Types
 *
 * Types for communication record management system
 */

// Communication record entity type
export interface CommunicationRecord {
  id: string;
  residentId: string;
  datetime: string;
  staffId: string;
  staffName: string;
  contactPersonId?: string;
  contactPersonName: string;
  contactPersonType: 'family' | 'manual';
  communicationContent: string;
  responseContent: string;
  isImportant: boolean;
  threadId?: string; // スレッド機能用
  parentId?: string; // 返信機能用
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
}

// Communication thread type
export interface CommunicationThread {
  id: string;
  title: string;
  residentId: string;
  records: CommunicationRecord[];
  lastActivity: string;
  isImportant: boolean;
  participantStaff: string[];
  participantContacts: string[];
}

// API response types
export interface CommunicationRecordListResponse {
  records: CommunicationRecord[];
  threads: CommunicationThread[];
  total: number;
  page: number;
  limit: number;
}

export interface CommunicationRecordCreateResponse {
  success: boolean;
  record?: CommunicationRecord;
  error?: string;
}

// Search and filter types
export interface CommunicationSearchParams {
  query?: string;
  staffId?: string;
  contactPersonId?: string;
  isImportant?: boolean;
  dateFrom?: string;
  dateTo?: string;
  threadId?: string;
  page?: number;
  limit?: number;
}

// Form data types
export interface CommunicationFormData {
  datetime: string;
  staffId: string;
  contactPersonId?: string;
  contactPersonName: string;
  contactPersonType: 'family' | 'manual';
  communicationContent: string;
  responseContent: string;
  isImportant: boolean;
  threadId?: string;
  parentId?: string;
}

// Contact person option for form
export interface ContactPersonOption {
  id: string;
  name: string;
  relationship: string;
  type: 'family';
}

// Staff option for form
export interface StaffOption {
  id: string;
  name: string;
  role: string;
}
