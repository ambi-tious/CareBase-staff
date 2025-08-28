import type { ResidentFile } from '@/types/resident-file';

export const residentFileData: ResidentFile[] = [
  {
    id: 'file-001',
    residentId: '1',
    fileName: 'individual_function_training_plan_20190701.pdf',
    originalFileName: '個別機能訓練計画書_20190701.pdf',
    fileType: 'application/pdf',
    fileSize: 2048000,
    category: 'care_plan',
    status: 'active',
    description: '個別機能訓練計画書（2019年7月作成）',
    uploadedAt: '2019-07-01T10:00:00.000Z',
    uploadedBy: 'staff-001',
    uploadedByName: '田中 花子',
    url: '/placeholder.svg?height=400&width=300&query=document',
    thumbnailUrl: '/placeholder.svg?height=200&width=150&query=document',
    isImage: false,
    isDocument: true,
  },
  {
    id: 'file-002',
    residentId: '1',
    fileName: 'home_service_plan_20190710.pdf',
    originalFileName: '居宅サービス計画書(1)_20190710.pdf',
    fileType: 'application/pdf',
    fileSize: 1536000,
    category: 'care_plan',
    status: 'active',
    description: '居宅サービス計画書',
    uploadedAt: '2019-07-10T14:30:00.000Z',
    uploadedBy: 'staff-002',
    uploadedByName: '佐藤 太郎',
    url: '/placeholder.svg?height=400&width=300&query=care-plan',
    thumbnailUrl: '/placeholder.svg?height=200&width=150&query=care-plan',
    isImage: false,
    isDocument: true,
  },
  {
    id: 'file-003',
    residentId: '1',
    fileName: 'respiratory_clinic_report_20190518.pdf',
    originalFileName: '気管支炎_山田クリニック_20190518.pdf',
    fileType: 'application/pdf',
    fileSize: 1024000,
    category: 'medical_record',
    status: 'active',
    description: '気管支炎診療記録（山田クリニック）',
    uploadedAt: '2019-05-18T16:45:00.000Z',
    uploadedBy: 'staff-005',
    uploadedByName: '高橋 恵子',
    url: '/placeholder.svg?height=400&width=300&query=medical',
    thumbnailUrl: '/placeholder.svg?height=200&width=150&query=medical',
    isImage: false,
    isDocument: true,
  },
  {
    id: 'file-004',
    residentId: '1',
    fileName: 'home_visit_checklist_20190701.pdf',
    originalFileName: '居宅訪問チェックシート_20190701.pdf',
    fileType: 'application/pdf',
    fileSize: 512000,
    category: 'assessment',
    status: 'active',
    description: '居宅訪問時のチェックシート',
    uploadedAt: '2019-07-01T09:15:00.000Z',
    uploadedBy: 'staff-003',
    uploadedByName: '山田 美咲',
    url: '/placeholder.svg?height=400&width=300&query=checklist',
    thumbnailUrl: '/placeholder.svg?height=200&width=150&query=checklist',
    isImage: false,
    isDocument: true,
  },
  {
    id: 'file-005',
    residentId: '1',
    fileName: 'home_slope_handrail_photo.jpg',
    originalFileName: '居宅①マンション4階、エレベーター.jpg',
    fileType: 'image/jpeg',
    fileSize: 3072000,
    category: 'photo',
    status: 'active',
    description: '居宅環境写真（マンション4階、エレベーター）',
    uploadedAt: '2019-07-01T11:20:00.000Z',
    uploadedBy: 'staff-003',
    uploadedByName: '山田 美咲',
    url: '/placeholder.svg?height=400&width=600&query=apartment-elevator',
    thumbnailUrl: '/placeholder.svg?height=200&width=300&query=apartment-elevator',
    isImage: true,
    isDocument: false,
  },
  {
    id: 'file-006',
    residentId: '1',
    fileName: 'face_sheet_20190701.pdf',
    originalFileName: 'フェイスシート_20190701.pdf',
    fileType: 'application/pdf',
    fileSize: 768000,
    category: 'assessment',
    status: 'active',
    description: 'フェイスシート（基本情報）',
    uploadedAt: '2019-07-01T08:00:00.000Z',
    uploadedBy: 'staff-001',
    uploadedByName: '田中 花子',
    url: '/placeholder.svg?height=400&width=300&query=face-sheet',
    thumbnailUrl: '/placeholder.svg?height=200&width=150&query=face-sheet',
    isImage: false,
    isDocument: true,
  },
  {
    id: 'file-007',
    residentId: '1',
    fileName: 'home_slope_no_handrail_photo.jpg',
    originalFileName: '居宅②玄関スロープ、手すりなし.jpg',
    fileType: 'image/jpeg',
    fileSize: 2560000,
    category: 'photo',
    status: 'active',
    description: '居宅環境写真（玄関スロープ、手すりなし）',
    uploadedAt: '2019-07-01T11:25:00.000Z',
    uploadedBy: 'staff-003',
    uploadedByName: '山田 美咲',
    url: '/placeholder.svg?height=400&width=600&query=entrance-slope',
    thumbnailUrl: '/placeholder.svg?height=200&width=300&query=entrance-slope',
    isImage: true,
    isDocument: false,
  },
  {
    id: 'file-008',
    residentId: '1',
    fileName: 'service_meeting_report_20190709.pdf',
    originalFileName: 'サービス担当者会議_20190709結論...pdf',
    fileType: 'application/pdf',
    fileSize: 1280000,
    category: 'care_plan',
    status: 'active',
    description: 'サービス担当者会議結論',
    uploadedAt: '2019-07-09T15:30:00.000Z',
    uploadedBy: 'staff-004',
    uploadedByName: '鈴木 一郎',
    url: '/placeholder.svg?height=400&width=300&query=meeting-report',
    thumbnailUrl: '/placeholder.svg?height=200&width=150&query=meeting-report',
    isImage: false,
    isDocument: true,
  },
];

// Helper functions
export const getResidentFilesByResidentId = (residentId: string): ResidentFile[] => {
  return residentFileData.filter((file) => file.residentId === residentId && file.status === 'active');
};

export const getResidentFileById = (fileId: string): ResidentFile | undefined => {
  return residentFileData.find((file) => file.id === fileId);
};

export const getResidentFilesByCategory = (residentId: string, category: string): ResidentFile[] => {
  return residentFileData.filter(
    (file) => file.residentId === residentId && file.category === category && file.status === 'active'
  );
};

export const searchResidentFiles = (residentId: string, query: string): ResidentFile[] => {
  const lowercaseQuery = query.toLowerCase();
  return residentFileData.filter(
    (file) =>
      file.residentId === residentId &&
      file.status === 'active' &&
      (file.originalFileName.toLowerCase().includes(lowercaseQuery) ||
        file.description?.toLowerCase().includes(lowercaseQuery))
  );
};