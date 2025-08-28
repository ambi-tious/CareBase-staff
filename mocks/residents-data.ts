import type { IconName } from '@/lib/lucide-icon-registry';
import type { Medication } from '@/types/medication';
import type { CareCategoryKey } from './care-categories';

export interface ContactPerson {
  id: string;
  type: '緊急連絡先' | '連絡先' | 'その他';
  name: string;
  furigana?: string;
  relationship: string;
  phone1: string;
  phone2?: string;
  email?: string;
  address: string;
  notes?: string;
  hasAlert?: boolean; // アラート（対応注意）フラグ
  alertReason?: string; // アラート理由（面会NG、連絡NGなど）
}

export interface HomeCareOffice {
  id: string;
  businessName: string;
  careManager: string;
  phone: string;
  fax: string;
  address: string;
  notes?: string;
}

export interface MedicalInstitution {
  id: string;
  institutionName: string;
  doctorName: string;
  phone: string;
  fax: string;
  address: string;
  notes?: string;
}

export interface MedicalHistory {
  id: string;
  date: string;
  diseaseName: string;
  treatmentStatus: '治療中' | '完治' | '経過観察' | 'その他';
  treatmentInstitution?: string;
  notes?: string;
}

// Update MedicationInfo to use new Medication type
export interface MedicationInfo extends Medication {
  // Keep backward compatibility
  institution?: string;
  prescriptionDate?: string;
  imageUrl?: string;
}

export interface IndividualPoint {
  id: string;
  category: string;
  icon: IconName;
  count: number;
  isActive: boolean;
}

export interface CareEvent {
  scheduledTime: string; // 予定時間
  actualTime?: string; // 実施時間（実施済みの場合のみ）
  icon: IconName;
  label: string;
  categoryKey?: CareCategoryKey;
  details?: string;
  color?: string;
  // 後方互換性のためtimeプロパティも残す
  time: string;
}

export interface Resident {
  id: number;
  name: string;
  furigana: string;
  dob: string;
  sex: '男' | '女' | 'その他';
  age: number;
  floorGroup?: string;
  unitTeam?: string;
  roomInfo?: string;
  registrationDate: string;
  lastUpdateDate: string;
  admissionDate?: string;
  dischargeDate?: string;
  careLevel: string;
  certificationDate: string;
  certValidityStart: string;
  certValidityEnd: string;
  avatarUrl: string;
  notes?: string; // 備考フィールドを追加
  events: CareEvent[];
  contacts?: ContactPerson[];
  homeCareOffices?: HomeCareOffice[]; // 複数登録対応
  medicalInstitutions?: MedicalInstitution[];
  medicalHistory?: MedicalHistory[];
  medicationInfo?: MedicationInfo[];
  medications?: Medication[];

  individualPoints?: IndividualPoint[];
}

export const careBoardData: Resident[] = [
  {
    id: 1,
    name: '佐藤清',
    furigana: 'サトウキヨシ',
    dob: '1940/08/22',
    sex: '男',
    age: 85,
    floorGroup: '介護フロア A',
    unitTeam: '朝番チーム',
    roomInfo: '101号室',
    registrationDate: '2025/04/15',
    lastUpdateDate: '2025/05/20',
    admissionDate: '2025/04/15',
    careLevel: '要介護1',
    certificationDate: '2025/01/11',
    certValidityStart: '2024/12/28',
    certValidityEnd: '2025/12/27',
    avatarUrl: '/elderly-japanese-man.png',
    notes:
      '食事の際は必ず介助が必要です。アレルギーはありませんが、食事のペースが遅いため、ゆっくりと見守りながら介助してください。',
    contacts: [
      {
        id: 'contact-1-1',
        type: '緊急連絡先',
        name: '佐藤健太',
        furigana: 'サトウケンタ',
        relationship: '長男',
        phone1: '090-1234-5678',
        phone2: '078-234-5678',
        email: 'k.sato@example.com',
        address: '兵庫県神戸市中央区三宮町1-1-1',
        notes: '平日19時以降連絡可能',
        hasAlert: true,
        alertReason: '面会NG、連絡は夜間のみ',
      },
      {
        id: 'contact-1-2',
        type: '連絡先',
        name: '佐藤美香',
        furigana: 'サトウミカ',
        relationship: '長男の妻',
        phone1: '080-8765-4321',
        email: 'm.sato@example.com',
        address: '兵庫県神戸市中央区三宮町1-1-1',
        notes: '日中連絡可能',
      },
    ],
    homeCareOffices: [
      {
        id: '1',
        businessName: '渋谷ケアプランセンター',
        address: '東京都渋谷区渋谷1-1-1',
        phone: '03-1234-5678',
        fax: '03-1234-5679',
        careManager: '田中太郎',
        notes: '渋谷エリア専門のケアプランセンター',
      },
    ],
    medicalInstitutions: [
      {
        id: 'medical-1-1',
        institutionName: '神戸総合病院',
        doctorName: '田中内科 田中先生',
        phone: '078-555-6666',
        fax: '078-555-6667',
        address: '兵庫県神戸市中央区港島中町4-6',
        notes: '月1回通院、内科・循環器科',
      },
      {
        id: 'medical-1-2',
        institutionName: 'みどりクリニック',
        doctorName: '緑川医師',
        phone: '078-777-8888',
        fax: '078-777-8889',
        address: '兵庫県神戸市西区伊川谷町有瀬1234',
        notes: '眼科定期受診',
      },
    ],
    medicalHistory: [
      {
        id: 'history-1-1',
        date: '2020-03-15',
        diseaseName: '高血圧症',
        treatmentStatus: '治療中',
        treatmentInstitution: '神戸総合病院',
        notes: 'ACE阻害薬で良好にコントロール中',
      },
      {
        id: 'history-1-2',
        date: '2018-07-20',
        diseaseName: '糖尿病',
        treatmentStatus: '治療中',
        treatmentInstitution: '神戸総合病院',
        notes: 'HbA1c 6.8%で安定',
      },
      {
        id: 'history-1-3',
        date: '2019-11-10',
        diseaseName: '白内障',
        treatmentStatus: '完治',
        treatmentInstitution: 'みどりクリニック',
        notes: '両眼手術済み、経過良好',
      },
    ],
    medications: [
      {
        id: 'med-1-1',
        medicationName: 'アムロジピン錠 5mg',
        dosageInstructions: '1日1回朝食後',
        startDate: '2020-03-15',
        prescribingInstitution: '神戸総合病院',
        notes: '血圧管理のため',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'med-1-2',
        medicationName: 'メトホルミン錠 250mg',
        dosageInstructions: '1日2回朝夕食後',
        startDate: '2018-07-20',
        prescribingInstitution: '神戸総合病院',
        notes: '糖尿病治療',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    ],

    events: [
      {
        scheduledTime: '07:00',
        time: '07:00',
        icon: 'Thermometer',
        label: '36.5',
        categoryKey: 'temperature',
      },
      {
        scheduledTime: '07:00',
        actualTime: '07:05',
        time: '07:05',
        icon: 'HeartPulse',
        label: '77',
        categoryKey: 'pulse',
      },
      {
        scheduledTime: '07:00',
        actualTime: '07:10',
        time: '07:10',
        icon: 'Droplets',
        label: '120/80',
        categoryKey: 'bloodPressure',
      },
      {
        scheduledTime: '08:00',
        time: '08:00',
        icon: 'Utensils',
        label: '朝食',
        categoryKey: 'breakfast',
      },
      {
        scheduledTime: '09:00',
        actualTime: '09:15',
        time: '09:15',
        icon: 'Pill',
        label: '朝薬',
        categoryKey: 'morningMed',
      },
      {
        scheduledTime: '10:00',
        time: '10:00',
        icon: 'GlassWater',
        label: '200ml',
        categoryKey: 'waterIntake',
      },
      {
        scheduledTime: '12:00',
        time: '12:00',
        icon: 'Utensils',
        label: '昼食',
        categoryKey: 'lunch',
      },
      {
        scheduledTime: '14:00',
        actualTime: '14:30',
        time: '14:30',
        icon: 'ExcretionIcon',
        label: '排尿',
        categoryKey: 'urination',
      },
      {
        scheduledTime: '15:00',
        time: '15:00',
        icon: 'Cookie',
        label: 'おやつ',
        categoryKey: 'snack',
      },
      {
        scheduledTime: '16:00',
        time: '16:00',
        icon: 'Bath',
        label: '一般浴',
        categoryKey: 'fullBath',
      },
      {
        scheduledTime: '18:00',
        time: '18:00',
        icon: 'Utensils',
        label: '夕食',
        categoryKey: 'dinner',
      },
      {
        scheduledTime: '19:00',
        time: '19:00',
        icon: 'Pill',
        label: '夕薬',
        categoryKey: 'eveningMed',
      },
      {
        scheduledTime: '20:00',
        time: '20:00',
        icon: 'Tooth',
        label: '歯磨き',
        categoryKey: 'toothBrushing',
      },
      {
        scheduledTime: '21:00',
        time: '21:00',
        icon: 'Bed',
        label: '就寝前薬',
        categoryKey: 'bedtimeMed',
      },
    ],
  },
  {
    id: 2,
    name: '田中花子',
    furigana: 'タナカハナコ',
    dob: '1935/03/15',
    sex: '女',
    age: 90,
    floorGroup: '介護フロア A',
    unitTeam: '朝番チーム',
    roomInfo: '102号室',
    registrationDate: '2025/03/01',
    lastUpdateDate: '2025/05/15',
    admissionDate: '2025/12/01',
    careLevel: '要介護3',
    certificationDate: '2025/02/01',
    certValidityStart: '2025/01/15',
    certValidityEnd: '2026/01/14',
    avatarUrl: '/elderly-japanese-woman.png',
    notes:
      '認知症のため、見守りが必要です。徘徊の可能性があるため、常に声かけを行い、安全確認を徹底してください。歩行器を使用して移動します。',
    contacts: [
      {
        id: 'contact-2-1',
        type: '緊急連絡先',
        name: '田中佐助',
        furigana: 'タナカサスケ',
        relationship: '次男',
        phone1: '06-1111-2222',
        phone2: '090-3333-4444',
        email: 's.tanaka@example.com',
        address: '大阪府大阪市中央区難波1-2-3',
        notes: '仕事の都合で平日は夕方以降連絡可能',
      },
      {
        id: 'contact-2-2',
        type: '連絡先',
        name: '田中良子',
        furigana: 'タナカヨシコ',
        relationship: '長女',
        phone1: '075-5555-6666',
        email: 'y.tanaka@example.com',
        address: '京都府京都市下京区烏丸通五条下る',
        notes: '月2回面会、京都在住',
      },
    ],
    homeCareOffices: [
      {
        id: '2',
        businessName: '新宿ライフケアサポート',
        address: '東京都新宿区新宿2-2-2',
        phone: '03-2345-6789',
        fax: '03-2345-6790',
        careManager: '佐藤花子',
        notes: '新宿区在宅介護支援事業所',
      },
    ],
    medicalInstitutions: [
      {
        id: 'medical-2-1',
        institutionName: '大阪市立総合医療センター',
        doctorName: '内科 佐々木医師',
        phone: '06-9999-0000',
        fax: '06-9999-0001',
        address: '大阪府大阪市都島区都島本通2-13-22',
        notes: '認知症専門外来、月1回受診',
      },
      {
        id: 'medical-2-2',
        institutionName: '梅田整形外科',
        doctorName: '整形外科 梅田医師',
        phone: '06-1234-5678',
        fax: '06-1234-5679',
        address: '大阪府大阪市北区梅田1-5-6',
        notes: '膝関節症フォロー',
      },
    ],
    medicalHistory: [
      {
        id: 'history-2-1',
        date: '2022-01-10',
        diseaseName: 'アルツハイマー型認知症',
        treatmentStatus: '治療中',
        treatmentInstitution: '大阪市立総合医療センター',
        notes: 'MMSE 18点、中等度認知症',
      },
      {
        id: 'history-2-2',
        date: '2020-05-15',
        diseaseName: '変形性膝関節症',
        treatmentStatus: '治療中',
        treatmentInstitution: '梅田整形外科',
        notes: '両膝に痛み、歩行器使用',
      },
      {
        id: 'history-2-3',
        date: '2019-12-01',
        diseaseName: '不眠症',
        treatmentStatus: '治療中',
        treatmentInstitution: '大阪市立総合医療センター',
        notes: '睡眠薬調整中',
      },
    ],
    medications: [
      {
        id: 'med-2-1',
        medicationName: 'ドネペジル塩酸塩錠 5mg',
        dosageInstructions: '1日1回朝食後',
        startDate: '2022-01-10',
        prescribingInstitution: '大阪市立総合医療センター',
        notes: '認知症治療薬',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'med-2-2',
        medicationName: 'ゾルピデム酒石酸塩錠 5mg',
        dosageInstructions: '1日1回就寝前',
        startDate: '2019-12-01',
        prescribingInstitution: '大阪市立総合医療センター',
        notes: '不眠症治療',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'med-2-3',
        medicationName: 'ロキソプロフェンナトリウム錠 60mg',
        dosageInstructions: '疼痛時 1日2回まで',
        startDate: '2020-05-15',
        prescribingInstitution: '梅田整形外科',
        notes: '膝痛時頓服',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    ],

    events: [
      {
        scheduledTime: '07:15',
        actualTime: '07:20',
        time: '07:20',
        icon: 'Thermometer',
        label: '36.2',
        categoryKey: 'temperature',
      },
      {
        scheduledTime: '07:15',
        time: '07:15',
        icon: 'HeartPulse',
        label: '82',
        categoryKey: 'pulse',
      },
      {
        scheduledTime: '08:30',
        time: '08:30',
        icon: 'Utensils',
        label: '朝食',
        categoryKey: 'breakfast',
      },
      {
        scheduledTime: '09:30',
        time: '09:30',
        icon: 'Pill',
        label: '朝薬',
        categoryKey: 'morningMed',
      },
      {
        scheduledTime: '10:30',
        actualTime: '10:45',
        time: '10:45',
        icon: 'ExcretionIcon',
        label: 'おむつ交換',
        categoryKey: 'diaperChange',
      },
      {
        scheduledTime: '12:30',
        time: '12:30',
        icon: 'Utensils',
        label: '昼食',
        categoryKey: 'lunch',
      },
      {
        scheduledTime: '13:30',
        time: '13:30',
        icon: 'Pill',
        label: '昼薬',
        categoryKey: 'noonMed',
      },
      {
        scheduledTime: '15:30',
        time: '15:30',
        icon: 'Cookie',
        label: 'おやつ',
        categoryKey: 'snack',
      },
      {
        scheduledTime: '16:30',
        time: '16:30',
        icon: 'ExcretionIcon',
        label: 'おむつ交換',
        categoryKey: 'diaperChange',
      },
      {
        scheduledTime: '18:30',
        time: '18:30',
        icon: 'Utensils',
        label: '夕食',
        categoryKey: 'dinner',
      },
      {
        scheduledTime: '19:30',
        time: '19:30',
        icon: 'Pill',
        label: '夕薬',
        categoryKey: 'eveningMed',
      },
      {
        scheduledTime: '20:30',
        actualTime: '20:45',
        time: '20:45',
        icon: 'Droplets',
        label: 'うがい',
        categoryKey: 'mouthwash',
      },
    ],
  },
  {
    id: 3,
    name: '鈴木太郎',
    furigana: 'スズキタロウ',
    dob: '1945/12/08',
    sex: '男',
    age: 79,
    floorGroup: '介護フロア A',
    unitTeam: '朝番チーム',
    roomInfo: '103号室',
    registrationDate: '2025/01/20',
    lastUpdateDate: '2025/05/18',
    admissionDate: '2020/01/20',
    dischargeDate: '2025/01/20',
    careLevel: '要介護2',
    certificationDate: '2025/01/01',
    certValidityStart: '2024/12/15',
    certValidityEnd: '2025/12/14',
    avatarUrl: '/elderly-man-avatar.png',
    notes:
      '心房細動のため、血圧と脈拍の定期的なチェックが必要です。視力が低下しているため、文字の読み上げや説明を丁寧に行ってください。',
    contacts: [
      {
        id: 'contact-3-1',
        type: '緊急連絡先',
        name: '鈴木美代子',
        furigana: 'スズキミヨコ',
        relationship: '妻',
        phone1: '075-2222-3333',
        phone2: '080-4444-5555',
        email: 'm.suzuki@example.com',
        address: '京都府京都市中京区烏丸通2-3-4',
        notes: '同居中、日中在宅',
      },
      {
        id: 'contact-3-2',
        type: '連絡先',
        name: '鈴木一郎',
        furigana: 'スズキイチロウ',
        relationship: '長男',
        phone1: '06-6666-7777',
        email: 'i.suzuki@example.com',
        address: '大阪府大阪市西区新町1-2-3',
        notes: '大阪在住、週末面会可能',
      },
    ],
    homeCareOffices: [
      {
        id: '3',
        businessName: '港区ホームケアサービス',
        address: '東京都港区港3-3-3',
        phone: '03-3456-7890',
        fax: '03-3456-7891',
        careManager: '鈴木一郎',
        notes: '港区地域密着型ケアサービス',
      },
    ],
    medicalInstitutions: [
      {
        id: 'medical-3-1',
        institutionName: '京都第一赤十字病院',
        doctorName: '循環器内科 京都医師',
        phone: '075-5555-6666',
        fax: '075-5555-6667',
        address: '京都府京都市東山区本町15-749',
        notes: '心房細動治療、月1回受診',
      },
      {
        id: 'medical-3-2',
        institutionName: '烏丸眼科',
        doctorName: '眼科 烏丸医師',
        phone: '075-3333-4444',
        fax: '075-3333-4445',
        address: '京都府京都市中京区烏丸通三条上る',
        notes: '緑内障定期チェック',
      },
    ],
    medicalHistory: [
      {
        id: 'history-3-1',
        date: '2021-03-20',
        diseaseName: '心房細動',
        treatmentStatus: '治療中',
        treatmentInstitution: '京都第一赤十字病院',
        notes: '抗凝固薬服用中、定期心電図モニタリング',
      },
      {
        id: 'history-3-2',
        date: '2020-09-10',
        diseaseName: '緑内障',
        treatmentStatus: '治療中',
        treatmentInstitution: '烏丸眼科',
        notes: '点眼薬で眼圧コントロール中',
      },
      {
        id: 'history-3-3',
        date: '2019-06-15',
        diseaseName: '前立腺肥大症',
        treatmentStatus: '治療中',
        treatmentInstitution: '京都第一赤十字病院',
        notes: 'α1ブロッカーで症状改善',
      },
    ],
    medications: [
      {
        id: 'med-3-1',
        medicationName: 'ワルファリンカリウム錠 1mg',
        dosageInstructions: '1日1回夕食後',
        startDate: '2021-03-20',
        prescribingInstitution: '京都第一赤十字病院',
        notes: '心房細動に対する抗凝固療法',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'med-3-2',
        medicationName: 'ラタノプロスト点眼液 0.005%',
        dosageInstructions: '1日1回就寝前両眼',
        startDate: '2020-09-10',
        prescribingInstitution: '烏丸眼科',
        notes: '緑内障治療',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'med-3-3',
        medicationName: 'タムスロシン塩酸塩カプセル 0.2mg',
        dosageInstructions: '1日1回夕食後',
        startDate: '2019-06-15',
        prescribingInstitution: '京都第一赤十字病院',
        notes: '前立腺肥大症治療',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    ],

    events: [
      {
        scheduledTime: '06:45',
        time: '06:45',
        icon: 'Thermometer',
        label: '36.8',
        categoryKey: 'temperature',
      },
      {
        scheduledTime: '06:45',
        actualTime: '06:50',
        time: '06:50',
        icon: 'HeartPulse',
        label: '75',
        categoryKey: 'pulse',
      },
      {
        scheduledTime: '07:45',
        time: '07:45',
        icon: 'Utensils',
        label: '朝食',
        categoryKey: 'breakfast',
      },
      {
        scheduledTime: '08:45',
        time: '08:45',
        icon: 'Pill',
        label: '朝薬',
        categoryKey: 'morningMed',
      },
      {
        scheduledTime: '09:45',
        actualTime: '10:00',
        time: '10:00',
        icon: 'Users',
        label: 'トイレ介助',
        categoryKey: 'toiletAssistance',
      },
      {
        scheduledTime: '11:45',
        time: '11:45',
        icon: 'GlassWater',
        label: '150ml',
        categoryKey: 'waterIntake',
      },
      {
        scheduledTime: '12:45',
        time: '12:45',
        icon: 'Utensils',
        label: '昼食',
        categoryKey: 'lunch',
      },
      {
        scheduledTime: '14:45',
        time: '14:45',
        icon: 'Settings',
        label: '機械浴',
        categoryKey: 'mechanicalBath',
      },
      {
        scheduledTime: '15:45',
        time: '15:45',
        icon: 'Cookie',
        label: 'おやつ',
        categoryKey: 'snack',
      },
      {
        scheduledTime: '17:45',
        time: '17:45',
        icon: 'Eye',
        label: '夕点眼',
        categoryKey: 'eveningEyeDrops',
      },
      {
        scheduledTime: '18:45',
        time: '18:45',
        icon: 'Utensils',
        label: '夕食',
        categoryKey: 'dinner',
      },
      {
        scheduledTime: '19:45',
        actualTime: '20:00',
        time: '20:00',
        icon: 'Pill',
        label: '夕薬',
        categoryKey: 'eveningMed',
      },
    ],
  },
  {
    id: 4,
    name: '山田みどり',
    furigana: 'ヤマダミドリ',
    dob: '1950/07/22',
    sex: '女',
    age: 74,
    floorGroup: '介護フロア A',
    unitTeam: '朝番チーム',
    roomInfo: '103号室',
    registrationDate: '2025/02/10',
    lastUpdateDate: '2025/05/12',
    admissionDate: '2025/02/10',
    careLevel: '要支援2',
    certificationDate: '2025/01/20',
    certValidityStart: '2025/01/01',
    certValidityEnd: '2026/01/01',
    avatarUrl: '/senior-japanese-woman.png',
    contacts: [
      {
        id: 'contact-4-1',
        type: '緊急連絡先',
        name: '山田雄介',
        furigana: 'ヤマダユウスケ',
        relationship: '息子',
        phone1: '045-1111-2222',
        phone2: '090-7777-8888',
        email: 'y.yamada@example.com',
        address: '神奈川県横浜市港北区新横浜3-4-5',
        notes: '近所在住、緊急時即対応可能',
      },
      {
        id: 'contact-4-2',
        type: '連絡先',
        name: '山田恵子',
        furigana: 'ヤマダケイコ',
        relationship: '息子の妻',
        phone1: '045-3333-4444',
        email: 'k.yamada@example.com',
        address: '神奈川県横浜市港北区新横浜3-4-5',
        notes: '買い物等のサポート担当',
      },
    ],
    homeCareOffices: [
      {
        id: '4',
        businessName: '品川ケアライフサポート',
        address: '東京都品川区品川4-4-4',
        phone: '03-4567-8901',
        fax: '03-4567-8902',
        careManager: '高橋美咲',
        notes: '品川区在宅介護支援センター',
      },
    ],
    medicalInstitutions: [
      {
        id: 'medical-4-1',
        institutionName: '横浜労災病院',
        doctorName: '整形外科 横浜医師',
        phone: '045-4748-4748',
        fax: '045-4748-4749',
        address: '神奈川県横浜市港北区小机町3211',
        notes: '腰椎圧迫骨折フォロー',
      },
      {
        id: 'medical-4-2',
        institutionName: '新横浜内科クリニック',
        doctorName: '内科 新横浜医師',
        phone: '045-6666-7777',
        fax: '045-6666-7778',
        address: '神奈川県横浜市港北区新横浜1-1-1',
        notes: '骨粗鬆症治療',
      },
    ],
    medicalHistory: [
      {
        id: 'history-4-1',
        date: '2023-08-15',
        diseaseName: '腰椎圧迫骨折',
        treatmentStatus: '経過観察',
        treatmentInstitution: '横浜労災病院',
        notes: 'L2圧迫骨折、保存療法で経過良好',
      },
      {
        id: 'history-4-2',
        date: '2022-04-10',
        diseaseName: '骨粗鬆症',
        treatmentStatus: '治療中',
        treatmentInstitution: '新横浜内科クリニック',
        notes: '骨密度改善傾向',
      },
      {
        id: 'history-4-3',
        date: '2021-11-05',
        diseaseName: '高脂血症',
        treatmentStatus: '治療中',
        treatmentInstitution: '新横浜内科クリニック',
        notes: 'LDL-C 120mg/dlで目標達成',
      },
    ],
    medications: [
      {
        id: 'med-4-1',
        medicationName: 'アレンドロン酸ナトリウム錠 35mg',
        dosageInstructions: '週1回朝食前',
        startDate: '2022-04-10',
        prescribingInstitution: '新横浜内科クリニック',
        notes: '骨粗鬆症治療、起床時服用',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'med-4-2',
        medicationName: 'ロスバスタチンカルシウム錠 2.5mg',
        dosageInstructions: '1日1回夕食後',
        startDate: '2021-11-05',
        prescribingInstitution: '新横浜内科クリニック',
        notes: '高脂血症治療',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'med-4-3',
        medicationName: 'カルシウム・ビタミンD3錠',
        dosageInstructions: '1日2回朝夕食後',
        startDate: '2022-04-10',
        prescribingInstitution: '新横浜内科クリニック',
        notes: '骨粗鬆症予防',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    ],

    events: [
      {
        scheduledTime: '07:30',
        actualTime: '07:35',
        time: '07:35',
        icon: 'Thermometer',
        label: '36.3',
        categoryKey: 'temperature',
      },
      {
        scheduledTime: '08:00',
        time: '08:00',
        icon: 'Utensils',
        label: '朝食',
        categoryKey: 'breakfast',
      },
      {
        scheduledTime: '09:00',
        time: '09:00',
        icon: 'Pill',
        label: '朝薬',
        categoryKey: 'morningMed',
      },
      {
        scheduledTime: '10:00',
        time: '10:00',
        icon: 'Tooth',
        label: '歯磨き',
        categoryKey: 'toothBrushing',
      },
      {
        scheduledTime: '11:00',
        actualTime: '11:15',
        time: '11:15',
        icon: 'GlassWater',
        label: '200ml',
        categoryKey: 'waterIntake',
      },
      {
        scheduledTime: '12:00',
        time: '12:00',
        icon: 'Utensils',
        label: '昼食',
        categoryKey: 'lunch',
      },
      {
        scheduledTime: '14:00',
        time: '14:00',
        icon: 'ExcretionIcon',
        label: '排尿',
        categoryKey: 'urination',
      },
      {
        scheduledTime: '15:00',
        time: '15:00',
        icon: 'Cookie',
        label: 'おやつ',
        categoryKey: 'snack',
      },
      {
        scheduledTime: '16:00',
        time: '16:00',
        icon: 'Droplets',
        label: '部分浴',
        categoryKey: 'partialBath',
      },
      {
        scheduledTime: '18:00',
        time: '18:00',
        icon: 'Utensils',
        label: '夕食',
        categoryKey: 'dinner',
      },
      {
        scheduledTime: '19:00',
        actualTime: '19:10',
        time: '19:10',
        icon: 'Pill',
        label: '夕薬',
        categoryKey: 'eveningMed',
      },
      {
        scheduledTime: '20:00',
        time: '20:00',
        icon: 'Heart',
        label: '歯茎マッサージ',
        categoryKey: 'gumMassage',
      },
    ],
  },
  {
    id: 5,
    name: '鈴木幸子',
    furigana: 'スズキサチコ',
    dob: '1942/01/15',
    sex: '女',
    age: 83,
    floorGroup: '介護フロア A',
    unitTeam: '日勤チーム',
    roomInfo: '201号室',
    admissionDate: '2024/11/10',
    registrationDate: '2024/11/01',
    lastUpdateDate: '2025/05/15',
    careLevel: '要介護2',
    certificationDate: '2024/10/20',
    certValidityStart: '2024/10/20',
    certValidityEnd: '2025/10/19',
    avatarUrl: '/elderly-japanese-woman.png',
    contacts: [
      {
        id: 'contact-5-1',
        type: '緊急連絡先',
        name: '鈴木達也',
        furigana: 'スズキタツヤ',
        relationship: '甥',
        phone1: '03-1111-2222',
        phone2: '090-9999-0000',
        email: 't.suzuki@example.com',
        address: '東京都世田谷区豪徳寺1-1-1',
        notes: '最寄りの親族、平日連絡可能',
      },
    ],
    homeCareOffices: [
      {
        id: '5',
        businessName: '目黒サポートケアセンター',
        address: '東京都目黒区目黒5-5-5',
        phone: '03-5678-9012',
        fax: '03-5678-9013',
        careManager: '渡辺健太',
        notes: '目黒区専門のケアプランセンター',
      },
    ],
    medicalInstitutions: [
      {
        id: 'medical-5-1',
        institutionName: '関東中央病院',
        doctorName: '内科 関東医師',
        phone: '03-3429-1171',
        fax: '03-3429-1172',
        address: '東京都世田谷区上用賀6-25-1',
        notes: '慢性腎不全フォロー',
      },
    ],
    medicalHistory: [
      {
        id: 'history-5-1',
        date: '2023-02-01',
        diseaseName: '慢性腎不全',
        treatmentStatus: '治療中',
        treatmentInstitution: '関東中央病院',
        notes: 'CKD stage 3、食事療法中',
      },
      {
        id: 'history-5-2',
        date: '2022-08-20',
        diseaseName: '貧血',
        treatmentStatus: '治療中',
        treatmentInstitution: '関東中央病院',
        notes: '腎性貧血、EPO製剤使用',
      },
    ],
    medications: [
      {
        id: 'med-5-1',
        medicationName: 'エポエチン アルファ注射液 6000単位',
        dosageInstructions: '週1回皮下注射',
        startDate: '2022-08-20',
        prescribingInstitution: '関東中央病院',
        notes: '腎性貧血治療',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    ],

    events: [
      {
        scheduledTime: '10:00',
        actualTime: '10:15',
        time: '10:15',
        icon: 'GlassWater',
        label: '200ml',
        details: '10:00\n合計2',
        categoryKey: 'waterIntake',
      },
      {
        scheduledTime: '09:00',
        actualTime: '09:05',
        time: '09:05',
        icon: 'ExcretionIcon',
        label: '排尿',
        categoryKey: 'urination',
      },
    ],
  },
  {
    id: 6,
    name: '高橋茂',
    furigana: 'タカハシシゲル',
    dob: '1938/05/30',
    sex: '男',
    age: 87,
    floorGroup: '介護フロア A',
    unitTeam: '日勤チーム',
    roomInfo: '203号室',
    admissionDate: '2025/01/01',
    registrationDate: '2025/01/01',
    lastUpdateDate: '2025/03/01',
    careLevel: '要介護2',
    certificationDate: '2024/12/15',
    certValidityStart: '2024/12/15',
    certValidityEnd: '2025/12/14',
    avatarUrl: '/senior-japanese-man.png',
    contacts: [
      {
        id: 'contact-6-1',
        type: '緊急連絡先',
        name: '高橋直子',
        furigana: 'タカハシナオコ',
        relationship: '長女',
        phone1: '045-2222-3333',
        phone2: '080-4444-5555',
        email: 'n.takahashi@example.com',
        address: '神奈川県横浜市中区元町1-1-1',
        notes: '週2回面会、買い物支援',
      },
      {
        id: 'contact-6-2',
        type: '連絡先',
        name: '高橋正人',
        furigana: 'タカハシマサト',
        relationship: '次男',
        phone1: '03-7777-8888',
        email: 'm.takahashi@example.com',
        address: '東京都港区赤坂1-1-1',
        notes: '月1回面会、東京勤務',
      },
    ],
    homeCareOffices: [
      {
        id: '1',
        businessName: '渋谷ケアプランセンター',
        address: '東京都渋谷区渋谷1-1-1',
        phone: '03-1234-5678',
        fax: '03-1234-5679',
        careManager: '田中太郎',
        notes: '渋谷エリア専門のケアプランセンター',
      },
    ],
    medicalInstitutions: [
      {
        id: 'medical-6-1',
        institutionName: '横浜市立みなと赤十字病院',
        doctorName: '泌尿器科 みなと医師',
        phone: '045-628-6100',
        fax: '045-628-6101',
        address: '神奈川県横浜市中区新山下3-12-1',
        notes: '前立腺癌術後フォロー',
      },
    ],
    medicalHistory: [
      {
        id: 'history-6-1',
        date: '2023-05-10',
        diseaseName: '前立腺癌',
        treatmentStatus: '経過観察',
        treatmentInstitution: '横浜市立みなと赤十字病院',
        notes: '根治手術後、PSA陰性で経過良好',
      },
    ],
    medications: [],

    events: [],
  },
  {
    id: 7,
    name: '田中三郎',
    furigana: 'タナカサブロウ',
    dob: '1950/08/26',
    sex: '男',
    age: 74,
    floorGroup: '介護フロア A',
    unitTeam: '日勤チーム',
    roomInfo: '203号室',
    admissionDate: '2025/02/10',
    registrationDate: '2025/02/01',
    lastUpdateDate: '2025/04/01',
    careLevel: '自立',
    certificationDate: '2025/01/20',
    certValidityStart: '2025/01/20',
    certValidityEnd: '2026/01/19',
    avatarUrl: '/old-japanese-man.png',
    contacts: [
      {
        id: 'contact-7-1',
        type: '緊急連絡先',
        name: '田中麻衣',
        furigana: 'タナカマイ',
        relationship: '娘',
        phone1: '06-3333-4444',
        phone2: '090-5555-6666',
        email: 'm.tanaka@example.com',
        address: '大阪府大阪市北区梅田1-5-6',
        notes: '近距離在住、毎日連絡取り合い',
      },
    ],
    homeCareOffices: [
      {
        id: '2',
        businessName: '新宿ライフケアサポート',
        address: '東京都新宿区新宿2-2-2',
        phone: '03-2345-6789',
        fax: '03-2345-6790',
        careManager: '佐藤花子',
        notes: '新宿区在宅介護支援事業所',
      },
    ],
    medicalInstitutions: [
      {
        id: 'medical-7-1',
        institutionName: '梅田総合病院',
        doctorName: '内科 梅田医師',
        phone: '06-6666-7777',
        fax: '06-6666-7778',
        address: '大阪府大阪市北区梅田2-4-6',
        notes: '健康管理、年1回健診',
      },
    ],
    medicalHistory: [],
    medications: [],

    events: [],
  },
  // 追加の利用者データ（満室状況を作るため）
  {
    id: 8,
    name: '佐々木一郎',
    furigana: 'ササキイチロウ',
    dob: '1943/04/10',
    sex: '男',
    age: 81,
    floorGroup: '介護フロア A',
    unitTeam: '夜勤チーム',
    roomInfo: '301号室',
    registrationDate: '2025/01/15',
    lastUpdateDate: '2025/05/10',
    admissionDate: '2025/01/15',
    careLevel: '要介護1',
    certificationDate: '2025/01/01',
    certValidityStart: '2024/12/20',
    certValidityEnd: '2025/12/19',
    avatarUrl: '/elderly-japanese-man.png',
    contacts: [
      {
        id: 'contact-8-1',
        type: '緊急連絡先',
        name: '佐々木美和',
        furigana: 'ササキミワ',
        relationship: '妻',
        phone1: '078-8888-9999',
        phone2: '090-1111-2222',
        email: 'm.sasaki@example.com',
        address: '兵庫県神戸市東灘区住吉本町1-1-1',
        notes: '同居中、日中在宅',
      },
    ],
    homeCareOffices: [
      {
        id: '3',
        businessName: '港区ホームケアサービス',
        address: '東京都港区港3-3-3',
        phone: '03-3456-7890',
        fax: '03-3456-7891',
        careManager: '鈴木一郎',
        notes: '港区地域密着型ケアサービス',
      },
    ],
    events: [],
  },
  {
    id: 9,
    name: '伊藤和子',
    furigana: 'イトウカズコ',
    dob: '1948/09/25',
    sex: '女',
    age: 76,
    floorGroup: '介護フロア B',
    unitTeam: '朝番チーム',
    roomInfo: '402号室',
    registrationDate: '2025/03/01',
    lastUpdateDate: '2025/05/08',
    admissionDate: '2025/03/01',
    careLevel: '要介護2',
    certificationDate: '2025/02/15',
    certValidityStart: '2025/02/15',
    certValidityEnd: '2026/02/14',
    avatarUrl: '/elderly-japanese-woman.png',
    contacts: [
      {
        id: 'contact-9-1',
        type: '緊急連絡先',
        name: '伊藤健一',
        furigana: 'イトウケンイチ',
        relationship: '長男',
        phone1: '06-7777-8888',
        phone2: '090-3333-4444',
        email: 'k.ito@example.com',
        address: '大阪府大阪市住吉区住吉1-1-1',
        notes: '近所在住、緊急時対応可能',
      },
    ],
    homeCareOffices: [
      {
        id: '4',
        businessName: '品川ケアライフサポート',
        address: '東京都品川区品川4-4-4',
        phone: '03-4567-8901',
        fax: '03-4567-8902',
        careManager: '高橋美咲',
        notes: '品川区在宅介護支援センター',
      },
    ],
    events: [],
  },
  {
    id: 10,
    name: '渡辺正夫',
    furigana: 'ワタナベマサオ',
    dob: '1941/12/03',
    sex: '男',
    age: 83,
    floorGroup: '介護フロア B',
    unitTeam: '日勤チーム',
    roomInfo: '501号室',
    registrationDate: '2025/02/20',
    lastUpdateDate: '2025/05/05',
    admissionDate: '2025/02/20',
    dischargeDate: '2025/05/15',
    careLevel: '要介護3',
    certificationDate: '2025/02/01',
    certValidityStart: '2025/02/01',
    certValidityEnd: '2026/01/31',
    avatarUrl: '/elderly-japanese-man.png',
    contacts: [
      {
        id: 'contact-10-1',
        type: '緊急連絡先',
        name: '渡辺恵美',
        furigana: 'ワタナベエミ',
        relationship: '長女',
        phone1: '075-4444-5555',
        phone2: '080-6666-7777',
        email: 'e.watanabe@example.com',
        address: '京都府京都市右京区嵯峨2-2-2',
        notes: '週2回面会、買い物支援',
      },
    ],
    homeCareOffices: [
      {
        id: '1',
        businessName: '渋谷ケアプランセンター',
        address: '東京都渋谷区渋谷1-1-1',
        phone: '03-1234-5678',
        fax: '03-1234-5679',
        careManager: '田中太郎',
        notes: '渋谷エリア専門のケアプランセンター',
      },
    ],
    events: [],
  },
  {
    id: 11,
    name: '田中花子',
    furigana: 'タナカハナコ',
    dob: '1950/03/15',
    sex: '女',
    age: 74,
    floorGroup: '介護フロア A',
    unitTeam: '夜番チーム',
    roomInfo: '601号室',
    registrationDate: '2025/05/01',
    lastUpdateDate: '2025/05/01',
    // admissionDate: 未設定（入所前の状態）
    careLevel: '要介護1',
    certificationDate: '2025/04/20',
    certValidityStart: '2025/04/20',
    certValidityEnd: '2026/04/19',
    avatarUrl: '/elderly-japanese-woman.png',
    notes: '入所予定の利用者です。入所日は未定です。',
    contacts: [
      {
        id: 'contact-11-1',
        type: '緊急連絡先',
        name: '田中太郎',
        furigana: 'タナカタロウ',
        relationship: '長男',
        phone1: '06-8888-9999',
        phone2: '090-7777-8888',
        email: 't.tanaka@example.com',
        address: '大阪府大阪市北区梅田1-1-1',
        notes: '入所手続き担当',
      },
    ],
    homeCareOffices: [
      {
        id: '2',
        businessName: '新宿ライフケアサポート',
        address: '東京都新宿区新宿2-2-2',
        phone: '03-2345-6789',
        fax: '03-2345-6790',
        careManager: '佐藤花子',
        notes: '新宿区在宅介護支援事業所',
      },
    ],
    events: [],
  },
  {
    id: 12,
    name: '山田次郎',
    furigana: 'ヤマダジロウ',
    dob: '1945/07/10',
    sex: '男',
    age: 79,
    floorGroup: '介護フロア B',
    unitTeam: '日勤チーム',
    roomInfo: '602号室',
    registrationDate: '2025/04/20',
    lastUpdateDate: '2025/04/20',
    admissionDate: '2025/06/01', // 未来の入所日（入所前の状態）
    careLevel: '要介護2',
    certificationDate: '2025/04/15',
    certValidityStart: '2025/04/15',
    certValidityEnd: '2026/04/14',
    avatarUrl: '/elderly-japanese-man.png',
    notes: '6月1日に入所予定です。',
    contacts: [
      {
        id: 'contact-12-1',
        type: '緊急連絡先',
        name: '山田美咲',
        furigana: 'ヤマダミサキ',
        relationship: '長女',
        phone1: '06-9999-0000',
        phone2: '080-8888-9999',
        email: 'm.yamada@example.com',
        address: '大阪府大阪市西区西本町2-2-2',
        notes: '入所手続き担当',
      },
    ],
    homeCareOffices: [
      {
        id: '3',
        businessName: '港区ホームケアサービス',
        address: '東京都港区港3-3-3',
        phone: '03-3456-7890',
        fax: '03-3456-7891',
        careManager: '鈴木一郎',
        notes: '港区地域密着型ケアサービス',
      },
    ],
    events: [],
  },
];

// Helper to find a resident by ID
export const getResidentById = (id: number): Resident | undefined => {
  return careBoardData.find((resident) => resident.id === id);
};
