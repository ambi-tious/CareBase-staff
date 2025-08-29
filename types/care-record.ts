/**
 * Care Record Types
 */

export interface CareRecord {
  id: string;
  residentId: string;
  residentName: string;
  category: string;
  title: string;
  content: string;
  recordedAt: string;
  createdAt: string;
  createdBy: string;
  createdByName?: string;
  updatedAt: string;
  tags?: string[];
}
