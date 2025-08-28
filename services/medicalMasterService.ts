import type {
  DoctorMaster,
  DoctorMasterFormData,
  MedicalInstitutionMaster,
  MedicalInstitutionMasterFormData,
} from '@/types/medical-master';

/**
 * 医療機関マスタサービス
 */
class MedicalMasterService {
  private readonly API_BASE = '/api/medical-master';

  /**
   * 医療機関マスタ一覧を取得
   */
  async getMedicalInstitutions(): Promise<MedicalInstitutionMaster[]> {
    try {
      // TODO: APIエンドポイントが実装されるまでモックデータを返す
      return this.getMockMedicalInstitutions();
    } catch (error) {
      console.error('Failed to fetch medical institutions:', error);
      throw new Error('医療機関マスタの取得に失敗しました');
    }
  }

  /**
   * 医療機関マスタを作成
   */
  async createMedicalInstitution(
    data: MedicalInstitutionMasterFormData
  ): Promise<MedicalInstitutionMaster> {
    try {
      // TODO: APIエンドポイントが実装されるまでモックレスポンスを返す
      const newInstitution: MedicalInstitutionMaster = {
        id: `medical_inst_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newInstitution;
    } catch (error) {
      console.error('Failed to create medical institution:', error);
      throw new Error('医療機関マスタの作成に失敗しました');
    }
  }

  /**
   * 医療機関マスタを更新
   */
  async updateMedicalInstitution(
    id: string,
    data: MedicalInstitutionMasterFormData
  ): Promise<MedicalInstitutionMaster> {
    try {
      // TODO: APIエンドポイントが実装されるまでモックレスポンスを返す
      const updatedInstitution: MedicalInstitutionMaster = {
        id,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return updatedInstitution;
    } catch (error) {
      console.error('Failed to update medical institution:', error);
      throw new Error('医療機関マスタの更新に失敗しました');
    }
  }

  /**
   * 医療機関マスタを削除
   */
  async deleteMedicalInstitution(id: string): Promise<void> {
    try {
      // TODO: APIエンドポイントが実装されるまでモック処理
      console.log(`Deleting medical institution: ${id}`);
    } catch (error) {
      console.error('Failed to delete medical institution:', error);
      throw new Error('医療機関マスタの削除に失敗しました');
    }
  }

  /**
   * 医師マスタ一覧を取得（医療機関ID指定可能）
   */
  async getDoctors(medicalInstitutionId?: string): Promise<DoctorMaster[]> {
    try {
      // TODO: APIエンドポイントが実装されるまでモックデータを返す
      const allDoctors = this.getMockDoctors();
      if (medicalInstitutionId) {
        return allDoctors.filter((doctor) => doctor.medicalInstitutionId === medicalInstitutionId);
      }
      return allDoctors;
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      throw new Error('医師マスタの取得に失敗しました');
    }
  }

  /**
   * 医師マスタを作成
   */
  async createDoctor(data: DoctorMasterFormData): Promise<DoctorMaster> {
    try {
      // TODO: APIエンドポイントが実装されるまでモックレスポンスを返す
      const newDoctor: DoctorMaster = {
        id: `doctor_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newDoctor;
    } catch (error) {
      console.error('Failed to create doctor:', error);
      throw new Error('医師マスタの作成に失敗しました');
    }
  }

  /**
   * 医師マスタを更新
   */
  async updateDoctor(id: string, data: DoctorMasterFormData): Promise<DoctorMaster> {
    try {
      // TODO: APIエンドポイントが実装されるまでモックレスポンスを返す
      const updatedDoctor: DoctorMaster = {
        id,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      return updatedDoctor;
    } catch (error) {
      console.error('Failed to update doctor:', error);
      throw new Error('医師マスタの更新に失敗しました');
    }
  }

  /**
   * 医師マスタを削除
   */
  async deleteDoctor(id: string): Promise<void> {
    try {
      // TODO: APIエンドポイントが実装されるまでモック処理
      console.log(`Deleting doctor: ${id}`);
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      throw new Error('医師マスタの削除に失敗しました');
    }
  }

  /**
   * モック医療機関データ
   */
  private getMockMedicalInstitutions(): MedicalInstitutionMaster[] {
    return [
      {
        id: 'med_inst_001',
        institutionName: '神戸中央病院',
        address: '兵庫県神戸市中央区港島中町4-6',
        phone: '078-302-4321',
        fax: '078-302-4322',
        notes: '総合病院',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'med_inst_002',
        institutionName: '松本内科クリニック',
        address: '兵庫県神戸市西区新川1-5-1',
        phone: '078-123-4567',
        fax: '078-123-4568',
        notes: '内科・循環器科',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'med_inst_003',
        institutionName: 'ハートケア整形外科',
        address: '兵庫県神戸市西区糸井2-14-9',
        phone: '078-234-5678',
        fax: '078-234-5679',
        notes: '整形外科・リハビリテーション科',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'med_inst_004',
        institutionName: '神戸西眼科クリニック',
        address: '兵庫県神戸市西区玉津町高津橋174-2',
        phone: '078-927-1234',
        fax: '078-927-1235',
        notes: '眼科専門',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];
  }

  /**
   * モック医師データ
   */
  private getMockDoctors(): DoctorMaster[] {
    return [
      // 神戸中央病院の医師
      {
        id: 'doctor_001',
        doctorName: '田中 太郎',
        medicalInstitutionId: 'med_inst_001',
        specialization: '内科',
        notes: '院長',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'doctor_002',
        doctorName: '佐藤 花子',
        medicalInstitutionId: 'med_inst_001',
        specialization: '循環器科',
        notes: '副院長',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'doctor_006',
        doctorName: '伊藤 健一',
        medicalInstitutionId: 'med_inst_001',
        specialization: '外科',
        notes: '外科部長',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      // 松本内科クリニックの医師
      {
        id: 'doctor_003',
        doctorName: '松本 一郎',
        medicalInstitutionId: 'med_inst_002',
        specialization: '内科',
        notes: '院長',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'doctor_007',
        doctorName: '松本 美子',
        medicalInstitutionId: 'med_inst_002',
        specialization: '内科・循環器科',
        notes: '副院長',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      // ハートケア整形外科の医師
      {
        id: 'doctor_004',
        doctorName: '山田 次郎',
        medicalInstitutionId: 'med_inst_003',
        specialization: '整形外科',
        notes: '院長',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'doctor_008',
        doctorName: '木村 陽子',
        medicalInstitutionId: 'med_inst_003',
        specialization: 'リハビリテーション科',
        notes: '理学療法士',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      // 神戸西眼科クリニックの医師
      {
        id: 'doctor_005',
        doctorName: '高橋 三郎',
        medicalInstitutionId: 'med_inst_004',
        specialization: '眼科',
        notes: '院長・眼科専門医',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];
  }
}

export const medicalMasterService = new MedicalMasterService();
