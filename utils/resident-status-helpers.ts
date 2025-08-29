/**
 * 利用者ステータス関連のヘルパー関数
 */

export type ResidentStatus = '入所前' | '入所中' | '退所' | 'ー' | null;

interface ResidentData {
  admissionDate?: string;
  dischargeDate?: string;
}

/**
 * 利用者のステータスを判定する関数
 * @param resident 利用者データ（入所日・退所日を含む）
 * @returns 利用者のステータス
 */
export const getResidentStatus = (resident: ResidentData): ResidentStatus => {
  // 入所日が登録されていない場合はnull（ステータス表示なし）
  if (!resident.admissionDate) {
    return null;
  }

  const today = new Date();
  const admissionDate = new Date(resident.admissionDate.replace(/\//g, '-'));
  const dischargeDate = resident.dischargeDate
    ? new Date(resident.dischargeDate.replace(/\//g, '-'))
    : null;

  // 退所日が設定されている場合
  if (dischargeDate) {
    if (today >= dischargeDate) {
      return '退所';
    } else if (today >= admissionDate) {
      return '入所中';
    } else {
      return '入所前';
    }
  }

  // 退所日が設定されていない場合
  if (today >= admissionDate) {
    return '入所中';
  } else {
    return '入所前';
  }
};
