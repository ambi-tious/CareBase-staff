import type { LucideIcon } from 'lucide-react';
import {
  Thermometer,
  HeartPulse,
  Droplets,
  Utensils,
  Bath,
  Pill,
  SmileIcon as Tooth,
  CheckCircle,
  DeleteIcon as ExcretionIcon,
  Eye,
  GlassWater,
  Soup,
  Cookie,
  Bed,
  Wind,
  Activity,
  FileText,
  Users,
} from 'lucide-react';

// Define Care Categories for User Base View columns
export const careCategories = [
  { key: 'drinking', label: '飲水', icon: GlassWater },
  { key: 'excretion', label: '排泄', icon: ExcretionIcon },
  { key: 'breakfast', label: '朝食', icon: Utensils },
  { key: 'lunch', label: '昼食', icon: Soup },
  { key: 'snack', label: 'お��つ', icon: Cookie },
  { key: 'dinner', label: '夕食', icon: Utensils },
  { key: 'bedtimeMeal', label: '眠前食', icon: Bed },
  { key: 'medication', label: '服薬', icon: Pill },
  { key: 'oralCare', label: '口腔ケア', icon: Tooth },
  { key: 'eyeDrops', label: '点眼', icon: Eye },
  { key: 'bathing', label: '入浴', icon: Bath },
  { key: 'temperature', label: '体温', icon: Thermometer },
  { key: 'pulse', label: '脈拍', icon: HeartPulse },
  { key: 'bloodPressure', label: '血圧', icon: Droplets },
  { key: 'respiration', label: '呼吸', icon: Wind },
  { key: 'spo2', label: 'SpO2', icon: Activity },
] as const;

export type CareCategoryKey = (typeof careCategories)[number]['key'];

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
  condition: string;
  notes?: string;
}

export interface MedicationInfo {
  id: string;
  medicationName: string;
  institution: string;
  prescriptionDate: string;
  notes?: string;
  imageUrl?: string;
}

export interface MedicationStatus {
  id: string;
  date: string;
  content: string;
  notes?: string;
}

export interface IndividualPoint {
  id: string;
  category: string;
  icon: LucideIcon;
  count: number;
  isActive: boolean;
}

export interface CareEvent {
  time: string;
  icon: LucideIcon;
  label: string;
  categoryKey?: CareCategoryKey;
  details?: string;
  color?: string;
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
      { time: '07:00', icon: Thermometer, label: '36.5', categoryKey: 'temperature' },
      { time: '07:00', icon: HeartPulse, label: '77', categoryKey: 'pulse' },
      { time: '07:00', icon: Droplets, label: '156/110', categoryKey: 'bloodPressure' },
      { time: '08:00', icon: Tooth, label: '粘膜・舌の清掃', categoryKey: 'oralCare' },
      { time: '12:00', icon: Utensils, label: '8:10', categoryKey: 'lunch' },
    ],
    contacts: [
      {
        id: 'c1',
        type: '緊急連絡先',
        name: '佐藤誠',
        furigana: 'サトウマコト',
        relationship: '長男',
        phone1: '078-000-0000',
        phone2: '080-0000-0000',
        email: 'mail@example.com',
        address: '兵庫県神戸市西区樫野台3-408-14',
        notes: 'ここに、テキストが入ります。メモ。ここに、テキストが入ります。',
      },
      {
        id: 'c2',
        type: '連絡先',
        name: '山田智子',
        furigana: 'ヤマダトモコ',
        relationship: '長女',
        phone1: '042-000-0000',
        phone2: '070-0000-0000',
        email: '-',
        address: '東京都あきる野市秋川6518',
        notes:
          'ここに、テキストが入ります。メモ。ここに、テキストが入ります。メモ。ここに、テキストが入ります。メモ。ここに、テキストが入ります。',
      },
      {
        id: 'c3',
        type: 'その他',
        name: '佐藤美咲',
        furigana: 'サトウミサキ',
        relationship: '孫',
        phone1: '080-0000-0000',
        phone2: '-',
        email: 'testmail@example.com',
        address: '兵庫県尼崎市西御園町5-6-4西御園町マンション1401',
        notes: '-',
      },
    ],
    homeCareOffice: {
      id: 'hco1',
      businessName: 'ハートケアプランセンター神戸西',
      careManager: '山口恵子',
      phone: '078-000-0000',
      fax: '078-0000-0000',
      address: '兵庫県神戸市西区糸井2-14-9',
      notes: 'ここに、テキストが入ります。メモ。ここに、テキストが入ります。',
    },
    medicalInstitutions: [
      {
        id: 'mi1',
        institutionName: '松本内科クリニック',
        doctorName: '松本医師',
        phone: '078-000-0000',
        fax: '078-0000-0000',
        address: '兵庫県神戸市西区新川1名ヶ原4-5-1',
        notes: 'ここに、テキストが入ります。メモ。ここに、テキストが入ります。',
      },
      {
        id: 'mi2',
        institutionName: '神戸市中央病院',
        doctorName: '井上医師',
        phone: '078-000-0000',
        fax: '078-0000-0000',
        address: '兵庫県神戸市北区北浜町3-4-4',
        notes:
          'ここに、テキストが入ります。メモ。ここに、テキストが入ります。ここに、テキストが入ります。メモ。ここに、テキストが入ります。ここに、テキストが入ります。メモ。ここに、テキストが入ります。',
      },
    ],
    medicalHistory: [
      {
        id: 'mh1',
        date: '2025/04/15',
        condition: '大腸ポリープ\n高血圧',
        notes: 'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。',
      },
    ],
    medicationInfo: [
      {
        id: 'med1',
        medicationName: '薬の名前が入ります',
        institution: '松本内科クリニック',
        prescriptionDate: '2025/04/28',
        notes:
          'ここに、テキストが入ります。メモ。ここに、テキストが入ります。ここに、テキストが入ります。メモ。ここに、テキストが入ります。',
        imageUrl: '/placeholder.svg?height=120&width=120',
      },
      {
        id: 'med2',
        medicationName: '薬の名前が入ります薬の名前が入ります',
        institution: '○○○○調剤薬局神戸中央病院前',
        prescriptionDate: '2025/04/15',
        notes: '-',
        imageUrl: '/placeholder.svg?height=120&width=120',
      },
    ],
    medicationStatus: [
      {
        id: 'ms1',
        date: '2025/04/15',
        content: '腸閉塞予防　漢方服用',
        notes: '薬アレルギーは出ていない',
      },
    ],
    individualPoints: [
      { id: 'ip1', category: '移乗介助', icon: Users, count: 1, isActive: true },
      { id: 'ip2', category: '食事', icon: Utensils, count: 1, isActive: true },
      { id: 'ip3', category: '飲水', icon: GlassWater, count: 1, isActive: true },
      { id: 'ip4', category: '服薬', icon: Pill, count: 1, isActive: true },
      { id: 'ip5', category: '排泄', icon: ExcretionIcon, count: 0, isActive: false },
      { id: 'ip6', category: '接遇', icon: Users, count: 2, isActive: true },
      { id: 'ip7', category: '点眼', icon: Eye, count: 0, isActive: false },
      { id: 'ip8', category: 'バイタル', icon: Activity, count: 0, isActive: false },
      { id: 'ip9', category: '入浴', icon: Bath, count: 10, isActive: true },
      { id: 'ip10', category: '口腔ケア', icon: Tooth, count: 0, isActive: false },
      { id: 'ip11', category: 'その他', icon: FileText, count: 1, isActive: true },
      { id: 'ip12', category: '薬', icon: Pill, count: 0, isActive: false },
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
        time: 'N/A',
        icon: GlassWater,
        label: '000ml',
        details: '00:00\n合計2',
        categoryKey: 'drinking',
      },
      { time: '00:00', icon: ExcretionIcon, label: '排尿', categoryKey: 'excretion' },
      { time: '10:10', icon: Utensils, label: '完食', categoryKey: 'breakfast' },
      { time: 'N/A', icon: Soup, label: '9:8', categoryKey: 'lunch' },
      { time: 'N/A', icon: Cookie, label: '6', categoryKey: 'snack' },
      { time: 'N/A', icon: Utensils, label: '6:7', categoryKey: 'dinner' },
      { time: 'N/A', icon: Bed, label: '5:9', categoryKey: 'bedtimeMeal' },
      { time: 'N/A', icon: Pill, label: '食後', categoryKey: 'medication' },
      { time: 'N/A', icon: Tooth, label: '歯磨き', categoryKey: 'oralCare' },
      { time: 'N/A', icon: CheckCircle, label: '実施', categoryKey: 'eyeDrops' },
      { time: 'N/A', icon: Bath, label: '入浴', categoryKey: 'bathing' },
      { time: 'N/A', icon: Thermometer, label: '36.5', categoryKey: 'temperature' },
      { time: 'N/A', icon: HeartPulse, label: '77', categoryKey: 'pulse' },
      { time: 'N/A', icon: Droplets, label: '118/72', categoryKey: 'bloodPressure' },
      { time: 'N/A', icon: Wind, label: '16', categoryKey: 'respiration' },
      { time: 'N/A', icon: Activity, label: '98', categoryKey: 'spo2' },
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
  {
    id: 5,
    name: '伊藤文子',
    furigana: 'イトウフミコ',
    dob: '1945/03/25',
    sex: '女',
    age: 80,
    admissionDate: '2023/09/01',
    registrationDate: '2023/08/15',
    lastUpdateDate: '2025/05/01',
    admissionStatus: '入居中',
    careLevel: '要介護3',
    certificationDate: '2023/08/20',
    certValidityStart: '2023/08/20',
    certValidityEnd: '2024/08/19',
    address: '愛知県名古屋市中区栄3',
    avatarUrl: '/senior-japanese-woman.png',
    events: [],
    contacts: [],
  },
  {
    id: 6,
    name: '渡辺千代子',
    furigana: 'ワタナベチヨコ',
    dob: '1935/07/12',
    sex: '女',
    age: 90,
    admissionDate: '2024/06/01',
    registrationDate: '2024/05/15',
    lastUpdateDate: '2025/02/01',
    admissionStatus: '入居中',
    careLevel: '要介護4',
    certificationDate: '2024/05/20',
    certValidityStart: '2024/05/20',
    certValidityEnd: '2025/05/19',
    address: '福岡県福岡市博多区中洲4',
    avatarUrl: '/elderly-woman-avatar.png',
    events: [],
    contacts: [],
  },
  {
    id: 7,
    name: '山本明',
    furigana: 'ヤマモトアキラ',
    dob: '1952/09/08',
    sex: '男',
    age: 72,
    admissionDate: '2025/03/15',
    registrationDate: '2025/03/01',
    lastUpdateDate: '2025/05/10',
    admissionStatus: '入居中',
    careLevel: '要介護1',
    certificationDate: '2025/02/20',
    certValidityStart: '2025/02/20',
    certValidityEnd: '2026/02/19',
    address: '北海道札幌市中央区大通西5',
    avatarUrl: '/elderly-man-avatar.png',
    events: [],
    contacts: [],
  },
  {
    id: 8,
    name: '中村実',
    furigana: 'ナカムラミノル',
    dob: '1960/12/01',
    sex: '男',
    age: 64,
    admissionDate: '2024/08/01',
    registrationDate: '2024/07/15',
    lastUpdateDate: '2025/01/01',
    admissionStatus: '入居中',
    careLevel: '要支援2',
    certificationDate: '2024/07/20',
    certValidityStart: '2024/07/20',
    certValidityEnd: '2025/07/19',
    address: '沖縄県那覇市久茂地6',
    avatarUrl: '/middle-aged-man-avatar.png',
    events: [],
    contacts: [],
  },
];

export const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];

// Helper to find a resident by ID
export const getResidentById = (id: number): Resident | undefined => {
  return careBoardData.find((resident) => resident.id === id);
};
