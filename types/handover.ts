/**
 * Handover Types
 */

export interface Handover {
  id: string;
  residentId: string;
  residentName: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'confirmed' | 'completed';
  title: string;
  content: string;
  recordedAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  createdBy: string;
  createdByName?: string;
  updatedAt: string;
  tags?: string[];
}
