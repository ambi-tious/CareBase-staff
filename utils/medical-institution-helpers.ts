import type { UnifiedMedicalInstitution } from '@/components/2_molecules/medical/selected-medical-institution-info';
import type { MedicalInstitution } from '@/mocks/residents-data';
import type { MedicalInstitutionMaster } from '@/types/medical-master';

/**
 * 医療機関情報を統一型に変換するヘルパー関数
 */
export const convertToUnifiedMedicalInstitution = (
  institution: MedicalInstitution | MedicalInstitutionMaster
): UnifiedMedicalInstitution => {
  // MedicalInstitution（住民データ）の場合
  if ('doctorName' in institution && typeof institution.doctorName === 'string') {
    return {
      id: institution.id,
      institutionName: institution.institutionName,
      doctorName: institution.doctorName,
      phone: institution.phone,
      fax: institution.fax,
      address: institution.address,
      notes: institution.notes,
    };
  }

  // MedicalInstitutionMaster（マスタデータ）の場合
  return {
    id: institution.id,
    institutionName: institution.institutionName,
    doctorName: undefined, // マスタデータには医師名は含まれない
    phone: institution.phone,
    fax: institution.fax,
    address: institution.address,
    notes: institution.notes,
  };
};

/**
 * MedicalInstitutionMasterからMedicalInstitutionを作成するヘルパー関数
 * 住民に紐付ける際に使用
 */
export const createMedicalInstitutionFromMaster = (
  master: MedicalInstitutionMaster,
  doctorName: string = ''
): MedicalInstitution => {
  return {
    id: master.id,
    institutionName: master.institutionName,
    doctorName,
    phone: master.phone || '',
    fax: master.fax || '',
    address: master.address || '',
    notes: master.notes,
  };
};

/**
 * 医療機関情報が同じかどうかを比較するヘルパー関数
 */
export const isSameMedicalInstitution = (
  a: MedicalInstitution | MedicalInstitutionMaster,
  b: MedicalInstitution | MedicalInstitutionMaster
): boolean => {
  return (
    a.id === b.id &&
    a.institutionName === b.institutionName &&
    a.phone === b.phone &&
    a.fax === b.fax &&
    a.address === b.address &&
    a.notes === b.notes
  );
};

/**
 * 医療機関情報の表示用ラベルを生成するヘルパー関数
 */
export const getMedicalInstitutionDisplayLabel = (
  institution: MedicalInstitution | MedicalInstitutionMaster
): string => {
  const unified = convertToUnifiedMedicalInstitution(institution);
  if (unified.doctorName) {
    return `${unified.institutionName} (${unified.doctorName})`;
  }
  return unified.institutionName;
};

/**
 * 医療機関の連絡先情報を取得するヘルパー関数
 */
export const getMedicalInstitutionContactInfo = (
  institution: MedicalInstitution | MedicalInstitutionMaster
) => {
  const unified = convertToUnifiedMedicalInstitution(institution);
  return {
    phone: unified.phone || '未設定',
    fax: unified.fax || '未設定',
    address: unified.address || '未設定',
    hasContactInfo: Boolean(unified.phone || unified.fax || unified.address),
  };
};
