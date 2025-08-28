// ケアマネージャー関連の型定義

/**
 * ケアマネージャーマスタデータ
 */
export interface CareManager {
  /** ID */
  id: string;
  /** ケアマネージャー名 */
  name: string;
  /** 所属事業所名 */
  officeName: string;
  /** 電話番号 */
  phone?: string;
  /** FAX番号 */
  fax?: string;
  /** メールアドレス */
  email?: string;
  /** 住所 */
  address?: string;
  /** 備考 */
  notes?: string;
  /** アクティブフラグ */
  isActive: boolean;
  /** 作成日 */
  createdAt: string;
  /** 更新日 */
  updatedAt: string;
}

/**
 * ケアマネージャーフォームデータ
 */
export interface CareManagerFormData {
  /** ケアマネージャー名 */
  name: string;
  /** 所属事業所名 */
  officeName: string;
  /** 電話番号 */
  phone?: string;
  /** FAX番号 */
  fax?: string;
  /** メールアドレス */
  email?: string;
  /** 住所 */
  address?: string;
  /** 備考 */
  notes?: string;
}

/**
 * ケアマネージャー検索オプション
 */
export interface CareManagerSearchOptions {
  /** 検索キーワード */
  keyword?: string;
  /** アクティブフラグ */
  isActive?: boolean;
  /** 事業所名フィルタ */
  officeName?: string;
}

/**
 * ケアマネージャー選択用のオプション
 */
export interface CareManagerOption {
  /** 値 */
  value: string;
  /** ラベル */
  label: string;
  /** 事業所名 */
  officeName?: string;
  /** 無効フラグ */
  disabled?: boolean;
}
