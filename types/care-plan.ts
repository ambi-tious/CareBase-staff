/**
 * Care Plan Types
 *
 * Types for care plan management system
 */

// Care plan status
export type CarePlanStatus = 'active' | 'expired' | 'draft' | 'archived';

// Care plan type
export type CarePlanType = 'initial' | 'continuation';

// Certification status
export type CertificationStatus = 'certified' | 'pending';

// Care plan entity type
export interface CarePlan {
  id: string;
  residentId: string;
  residentName: string;
  planTitle: string;
  planType: CarePlanType;
  careLevel: string;
  certificationDate: string;
  certValidityStart: string;
  certValidityEnd: string;
  certificationStatus: CertificationStatus;
  careManager: string;
  careManagerOffice: string;
  status: CarePlanStatus;
  referralInfo?: string;
  residentIntention: string;
  familyIntention: string;
  assessmentCommitteeOpinion: string;
  comprehensiveGuidance: string;
  consentObtained: boolean;
  goals: string[];
  services: CarePlanService[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  nextReviewDate: string;
}

// Care plan service
export interface CarePlanService {
  id: string;
  serviceName: string;
  serviceType: 'home_care' | 'day_service' | 'short_stay' | 'other';
  frequency: string;
  duration: string;
  provider: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

// API response types
export interface CarePlanListResponse {
  carePlans: CarePlan[];
  total: number;
  page: number;
  limit: number;
}

export interface CarePlanCreateResponse {
  success: boolean;
  carePlan?: CarePlan;
  error?: string;
}

// Search and filter types
export interface CarePlanSearchParams {
  query?: string;
  status?: CarePlanStatus;
  careLevel?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Plan type options
export const planTypeOptions = [
  { value: 'initial', label: '初回' },
  { value: 'continuation', label: '継続' },
] as const;

// Certification status options
export const certificationStatusOptions = [
  { value: 'certified', label: '認定済み' },
  { value: 'pending', label: '申請中' },
] as const;

// Status options
export const statusOptions = [
  { value: 'active', label: '有効', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'expired', label: '期限切れ', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'draft', label: '下書き', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'archived', label: 'アーカイブ', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
] as const;

// Service type options
export const serviceTypeOptions = [
  { value: 'home_care', label: '訪問介護' },
  { value: 'day_service', label: 'デイサービス' },
  { value: 'short_stay', label: 'ショートステイ' },
  { value: 'other', label: 'その他' },
] as const;