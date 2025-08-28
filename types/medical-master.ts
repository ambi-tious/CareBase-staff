/**
 * 医療機関マスタの型定義
 */
export interface MedicalInstitutionMaster {
  id: string;
  institutionName: string;
  address?: string;
  phone?: string;
  fax?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 医師マスタの型定義
 */
export interface DoctorMaster {
  id: string;
  doctorName: string;
  medicalInstitutionId: string; // 医療機関IDとの紐付け
  specialization?: string; // 専門科目
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 医療機関マスタフォームデータ
 */
export interface MedicalInstitutionMasterFormData {
  institutionName: string;
  address?: string;
  phone?: string;
  fax?: string;
  notes?: string;
}

/**
 * 医師マスタフォームデータ
 */
export interface DoctorMasterFormData {
  doctorName: string;
  medicalInstitutionId: string;
  specialization?: string;
  notes?: string;
}

/**
 * 医療機関選択用のオプション
 */
export interface MedicalInstitutionOption {
  value: string;
  label: string;
  address?: string;
  phone?: string;
}

/**
 * 医師選択用のオプション
 */
export interface DoctorOption {
  value: string;
  label: string;
  medicalInstitutionId: string;
  specialization?: string;
}
