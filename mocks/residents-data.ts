import type { IconName } from '@/lib/lucide-icon-registry';
import type { Medication } from '@/types/medication';
import type { MedicationStatus } from '@/types/medication-status';
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
  admissionDate: string;
  dischargeDate?: string;
  admissionStatus: '入居中' | '退所済' | '待機中';
  careLevel: string;
  certificationDate: string;
  certValidityStart: string;
  certValidityEnd: string;
  address: string;
  avatarUrl: string;
  events: CareEvent[];
  contacts?: ContactPerson[];
  homeCareOffice?: HomeCareOffice;
  medicalInstitutions?: MedicalInstitution[];
  medicalHistory?: MedicalHistory[];
  medicationInfo?: MedicationInfo[];
  medications?: Medication[];
  medicationStatus?: MedicationStatus[];
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
    floorGroup: 'サンプルグループ101',
    unitTeam: 'テストチーム3',
    roomInfo: 'もみじ404号室',
    registrationDate: '2025/04/15',
    lastUpdateDate: '2025/05/20',
    admissionDate: '2025/04/15',
    admissionStatus: '入居中',
    careLevel: '要介護1',
    certificationDate: '2025/01/11',
    certValidityStart: '2024/12/28',
    certValidityEnd: '2025/12/27',
    address: '兵庫県神戸市西区樫野台3-408-14',
    avatarUrl: '/elderly-japanese-man.png',
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
    floorGroup: 'サンプルグループ102',
    unitTeam: 'テストチーム1',
    roomInfo: 'さくら301号室',
    registrationDate: '2025/03/01',
    lastUpdateDate: '2025/05/15',
    admissionDate: '2025/03/01',
    admissionStatus: '入居中',
    careLevel: '要介護3',
    certificationDate: '2025/02/01',
    certValidityStart: '2025/01/15',
    certValidityEnd: '2026/01/14',
    address: '大阪府大阪市北区梅田1-1-1',
    avatarUrl: '/elderly-japanese-woman.png',
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
    floorGroup: 'サンプルグループ103',
    unitTeam: 'テストチーム2',
    roomInfo: 'つばき205号室',
    registrationDate: '2025/01/20',
    lastUpdateDate: '2025/05/18',
    admissionDate: '2025/01/20',
    admissionStatus: '入居中',
    careLevel: '要介護2',
    certificationDate: '2025/01/01',
    certValidityStart: '2024/12/15',
    certValidityEnd: '2025/12/14',
    address: '京都府京都市中京区烏丸通2-3-4',
    avatarUrl: '/elderly-japanese-man-2.png',
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
    floorGroup: 'サンプルグループ104',
    unitTeam: 'テストチーム1',
    roomInfo: 'あじさい108号室',
    registrationDate: '2025/02/10',
    lastUpdateDate: '2025/05/12',
    admissionDate: '2025/02/10',
    admissionStatus: '入居中',
    careLevel: '要支援2',
    certificationDate: '2025/01/20',
    certValidityStart: '2025/01/01',
    certValidityEnd: '2026/01/01',
    address: '神奈川県横浜市港北区新横浜5-6-7',
    avatarUrl: '/elderly-japanese-woman-2.png',
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
    id: 2,
    name: '鈴木幸子',
    furigana: 'スズキサチコ',
    dob: '1942/01/15',
    sex: '女',
    age: 83,
    admissionDate: '2024/11/10',
    registrationDate: '2024/11/01',
    lastUpdateDate: '2025/05/15',
    admissionStatus: '入居中',
    careLevel: '要介護2',
    certificationDate: '2024/10/20',
    certValidityStart: '2024/10/20',
    certValidityEnd: '2025/10/19',
    address: '東京都世田谷区経堂1-2-3',
    avatarUrl: '/elderly-japanese-woman.png',
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
    contacts: [],
  },
  {
    id: 3,
    name: '高橋茂',
    furigana: 'タカハシシゲル',
    dob: '1938/05/30',
    sex: '男',
    age: 87,
    admissionDate: '2025/01/01',
    registrationDate: '2025/01/01',
    lastUpdateDate: '2025/03/01',
    admissionStatus: '入居中',
    careLevel: '要支援1',
    certificationDate: '2024/12/15',
    certValidityStart: '2024/12/15',
    certValidityEnd: '2025/12/14',
    address: '神奈川県横浜市中区山下町1',
    avatarUrl: '/senior-japanese-man.png',
    events: [],
    contacts: [],
  },
  {
    id: 4,
    name: '田中三郎',
    furigana: 'タナカサブロウ',
    dob: '1950/11/02',
    sex: '男',
    age: 74,
    admissionDate: '2025/02/10',
    registrationDate: '2025/02/01',
    lastUpdateDate: '2025/04/01',
    admissionStatus: '入居中',
    careLevel: '自立',
    certificationDate: '2025/01/20',
    certValidityStart: '2025/01/20',
    certValidityEnd: '2026/01/19',
    address: '大阪府大阪市北区梅田2',
    avatarUrl: '/old-japanese-man.png',
    events: [],
    contacts: [],
  },
];

// Helper to find a resident by ID
export const getResidentById = (id: number): Resident | undefined => {
  return careBoardData.find((resident) => resident.id === id);
}; 
