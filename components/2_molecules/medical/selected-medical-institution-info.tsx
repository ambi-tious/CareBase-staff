'use client';

import type { MedicalInstitution } from '@/mocks/residents-data';
import type { MedicalInstitutionMaster } from '@/types/medical-master';
import { convertToUnifiedMedicalInstitution } from '@/utils/medical-institution-helpers';
import React from 'react';

/**
 * 医療機関情報の統一型
 * 既存の型を統合して使いやすくする
 */
export interface UnifiedMedicalInstitution {
  id: string;
  institutionName: string;
  doctorName?: string;
  phone?: string;
  fax?: string;
  address?: string;
  notes?: string;
}

interface SelectedMedicalInstitutionInfoProps {
  institution: MedicalInstitution | MedicalInstitutionMaster | UnifiedMedicalInstitution | null;
  showDoctorName?: boolean;
  className?: string;
  title?: string;
}

/**
 * 選択された医療機関の情報を表示する共通コンポーネント
 */
export const SelectedMedicalInstitutionInfo: React.FC<SelectedMedicalInstitutionInfoProps> = ({
  institution,
  showDoctorName = true,
  className = '',
  title = '選択された医療機関の情報',
}) => {
  if (!institution) {
    return null;
  }

  // 型ガードとデータ変換
  const unifiedInstitution = convertToUnifiedMedicalInstitution(institution);

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 医療機関名 */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            医療機関名
          </label>
          <div className="text-sm text-gray-900 mt-1 font-medium">
            {unifiedInstitution.institutionName}
          </div>
        </div>

        {/* 担当医（表示設定に応じて） */}
        {showDoctorName && unifiedInstitution.doctorName && (
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              担当医
            </label>
            <div className="text-sm text-gray-900 mt-1">{unifiedInstitution.doctorName}</div>
          </div>
        )}

        {/* 電話番号 */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            電話番号
          </label>
          <div className="text-sm text-gray-900 mt-1">{unifiedInstitution.phone || '未設定'}</div>
        </div>

        {/* FAX */}
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">FAX</label>
          <div className="text-sm text-gray-900 mt-1">{unifiedInstitution.fax || '未設定'}</div>
        </div>

        {/* 住所 */}
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">住所</label>
          <div className="text-sm text-gray-900 mt-1">{unifiedInstitution.address || '未設定'}</div>
        </div>

        {/* 備考 */}
        {unifiedInstitution.notes && (
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              備考
            </label>
            <div className="text-sm text-gray-900 mt-1">{unifiedInstitution.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};
