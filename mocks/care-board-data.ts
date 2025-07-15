import type { IconName } from '@/lib/lucide-icon-registry';
import type { Medication } from '@/types/medication';
import type { MedicationStatus } from '@/types/medication-status';

// Define Care Categories for User Base View columns
export const careCategories = [
  { key: 'drinking', label: '飲水', icon: 'GlassWater' },
  { key: 'excretion', label: '排泄', icon: 'ExcretionIcon' },
  { key: 'breakfast', label: '朝食', icon: 'Utensils' },
  { key: 'lunch', label: '昼食', icon: 'Soup' },
  { key: 'snack', label: 'おやつ', icon: 'Cookie' },
  { key: 'dinner', label: '夕食', icon: 'Utensils' },
  { key: 'bedtimeMeal', label: '眠前食', icon: 'Bed' },
  { key: 'medication', label: '服薬', icon: 'Pill' },
  { key: 'oralCare', label: '口腔ケア', icon: 'Tooth' },
  { key: 'eyeDrops', label: '点眼', icon: 'Eye' },
  { key: 'bathing', label: '入浴', icon: 'Bath' },
  { key: 'temperature', label: '体温', icon: 'Thermometer' },
  { key: 'pulse', label: '脈拍', icon: 'HeartPulse' },
  { key: 'bloodPressure', label: '血圧', icon: 'Droplets' },
  { key: 'respiration', label: '呼吸', icon: 'Wind' },
  { key: 'spo2', label: 'SpO2', icon: 'Activity' },
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
  details?: IndividualPointDetail[];
}

export interface IndividualPointDetail {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CareEvent {
  time: string;
  icon: IconName;
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
      { time: '07:00', icon: 'Thermometer', label: '36.5', categoryKey: 'temperature' },
      { time: '07:00', icon: 'HeartPulse', label: '77', categoryKey: 'pulse' },
      { time: '07:00', icon: 'Droplets', label: '156/110', categoryKey: 'bloodPressure' },
      { time: '08:00', icon: 'Tooth', label: '粘膜・舌の清掃', categoryKey: 'oralCare' },
      { time: '12:00', icon: 'Utensils', label: '8:10', categoryKey: 'lunch' },
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
        date: '2025/04',
        diseaseName: '大腸ポリープ',
        treatmentStatus: '完治',
        treatmentInstitution: '神戸市中央病院',
        notes: 'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。',
      },
      {
        id: 'mh2',
        date: '2020/03',
        diseaseName: '高血圧症',
        treatmentStatus: '治療中',
        treatmentInstitution: '松本内科クリニック',
        notes: '定期的な血圧測定と投薬治療を継続中',
      },
    ],
    medicationInfo: [
      {
        id: 'med1',
        medicationName: '薬の名前が入ります',
        dosageInstructions: '1日1回 朝食後 1錠',
        startDate: '2025-04-28',
        endDate: '',
        prescribingInstitution: '松本内科クリニック',
        notes:
          'ここに、テキストが入ります。メモ。ここに、テキストが入ります。ここに、テキストが入ります。メモ。ここに、テキストが入ります。',
        createdAt: '2025-04-28T00:00:00.000Z',
        updatedAt: '2025-04-28T00:00:00.000Z',
        // Backward compatibility
        institution: '松本内科クリニック',
        prescriptionDate: '2025/04/28',
        imageUrl: '/placeholder.svg?height=120&width=120',
      },
      {
        id: 'med2',
        medicationName: '薬の名前が入ります薬の名前が入ります',
        dosageInstructions: '1日2回 朝夕食後 各1錠',
        startDate: '2025-04-15',
        endDate: '2025-07-15',
        prescribingInstitution: '○○○○調剤薬局神戸中央病院前',
        notes: '-',
        createdAt: '2025-04-15T00:00:00.000Z',
        updatedAt: '2025-04-15T00:00:00.000Z',
        // Backward compatibility
        institution: '○○○○調剤薬局神戸中央病院前',
        prescriptionDate: '2025/04/15',
        imageUrl: '/placeholder.svg?height=120&width=120',
      },
    ],
    medications: [
      {
        id: 'medication-1',
        medicationName: 'アムロジピン錠5mg',
        dosageInstructions: '1日1回 朝食後 1錠',
        startDate: '2025-01-15',
        endDate: '',
        prescribingInstitution: '松本内科クリニック',
        notes: '血圧管理のため継続服用中',
        createdAt: '2025-01-15T00:00:00.000Z',
        updatedAt: '2025-01-15T00:00:00.000Z',
      },
      {
        id: 'medication-2',
        medicationName: 'ロキソニン錠60mg',
        dosageInstructions: '痛みがある時のみ 1回1錠 1日3回まで',
        startDate: '2025-03-01',
        endDate: '2025-03-31',
        prescribingInstitution: '神戸市中央病院',
        notes: '胃薬と一緒に服用',
        createdAt: '2025-03-01T00:00:00.000Z',
        updatedAt: '2025-03-01T00:00:00.000Z',
      },
    ],
    medicationStatus: [
      {
        id: 'ms1',
        date: '2025/04/15',
        content: '腸閉塞予防　漢方服用',
        notes: '薬アレルギーは出ていない',
        createdAt: '2025-04-15T00:00:00.000Z',
        updatedAt: '2025-04-15T00:00:00.000Z',
      },
    ],
    individualPoints: [
      { 
        id: 'ip1', 
        category: '移乗介助', 
        icon: 'Users', 
        count: 1, 
        isActive: true,
        details: [
          {
            id: 'ipd1',
            title: '車椅子への移乗時の注意点',
            content: '<p>佐藤様は右膝に痛みがあるため、移乗時には特に注意が必要です。</p><p>以下の手順で行ってください：</p><ol><li>必ず2人介助で行う</li><li>右側からの移乗を避ける</li><li>声掛けを十分に行う</li></ol><p>痛みを訴えた場合はすぐに中止し、看護師に報告してください。</p>',
            createdAt: '2025-01-15T00:00:00.000Z',
            updatedAt: '2025-01-15T00:00:00.000Z',
            createdBy: '田中 花子'
          }
        ]
      },
      { 
        id: 'ip2', 
        category: '食事', 
        icon: 'Utensils', 
        count: 1, 
        isActive: true,
        details: [
          {
            id: 'ipd2',
            title: '食事介助の方法',
            content: '<p>佐藤様は嚥下機能が低下しているため、以下の点に注意してください：</p><ul><li>一口量は小さめにする</li><li>食事の際は必ず30度以上の角度で上体を起こす</li><li>食事の前にはお茶でうがいをしてもらう</li></ul><p>むせ込みが見られた場合は、すぐに中止し、看護師に報告してください。</p>',
            createdAt: '2025-02-10T00:00:00.000Z',
            updatedAt: '2025-02-10T00:00:00.000Z',
            createdBy: '佐藤 太郎'
          }
        ]
      },
      { 
        id: 'ip3', 
        category: '飲水', 
        icon: 'GlassWater', 
        count: 1, 
        isActive: true,
        details: [
          {
            id: 'ipd3',
            title: '水分摂取の注意点',
            content: '<p>佐藤様は脱水症状を起こしやすいため、こまめな水分補給が必要です。</p><p>1日の目標摂取量：<strong>1500ml</strong></p><p>好みの飲み物：</p><ul><li>麦茶（常温）</li><li>りんごジュース（薄めて提供）</li></ul><p>※トロミ剤は使用しない</p>',
            createdAt: '2025-01-20T00:00:00.000Z',
            updatedAt: '2025-01-20T00:00:00.000Z',
            createdBy: '山田 美咲'
          }
        ]
      },
      { 
        id: 'ip4', 
        category: '服薬', 
        icon: 'Pill', 
        count: 1, 
        isActive: true,
        details: [
          {
            id: 'ipd4',
            title: '服薬管理について',
            content: '<p>佐藤様は薬の飲み忘れが多いため、以下の点に注意してください：</p><ul><li>必ず目の前で服用を確認する</li><li>水分と一緒に飲み込むまで見守る</li><li>拒否がある場合は無理強いせず、30分後に再度促す</li></ul><p>服用拒否が続く場合は看護師に報告してください。</p>',
            createdAt: '2025-03-05T00:00:00.000Z',
            updatedAt: '2025-03-05T00:00:00.000Z',
            createdBy: '高橋 恵子'
          }
        ]
      },
      { id: 'ip5', category: '排泄', icon: 'ExcretionIcon', count: 0, isActive: false },
      { 
        id: 'ip6', 
        category: '接遇', 
        icon: 'Users', 
        count: 2, 
        isActive: true,
        details: [
          {
            id: 'ipd5',
            title: 'コミュニケーション方法',
            content: '<p>佐藤様は聴力が低下しているため、以下の点に注意してください：</p><ul><li>正面から、ゆっくり、はっきりと話す</li><li>必要に応じてジェスチャーを交える</li><li>筆談ボードを活用する（居室に設置済み）</li></ul><p>特に朝は聴力が低下しているため、より丁寧なコミュニケーションを心がけてください。</p>',
            createdAt: '2025-01-25T00:00:00.000Z',
            updatedAt: '2025-01-25T00:00:00.000Z',
            createdBy: '鈴木 一郎'
          },
          {
            id: 'ipd6',
            title: '不穏時の対応',
            content: '<p>佐藤様は夕方になると不穏になることがあります（サンダウンシンドローム）。</p><p>不穏時の対応：</p><ol><li>静かな環境に誘導する</li><li>好きな音楽（クラシック）をかける</li><li>家族の写真を見せる</li></ol><p>上記で落ち着かない場合は看護師に報告してください。</p>',
            createdAt: '2025-02-15T00:00:00.000Z',
            updatedAt: '2025-02-15T00:00:00.000Z',
            createdBy: '伊藤 健太'
          }
        ]
      },
      { id: 'ip7', category: '点眼', icon: 'Eye', count: 0, isActive: false },
      { id: 'ip8', category: 'バイタル', icon: 'Activity', count: 0, isActive: false },
      { 
        id: 'ip9', 
        category: '入浴', 
        icon: 'Bath', 
        count: 10, 
        isActive: true,
        details: [
          {
            id: 'ipd7',
            title: '入浴介助の注意点',
            content: '<p>佐藤様は浴槽の出入りに不安があるため、以下の点に注意してください：</p><ul><li>必ず2人介助で行う</li><li>滑り止めマットを使用する</li><li>湯温は40度を超えないようにする（血圧上昇に注意）</li><li>入浴前後の血圧測定を必ず行う</li></ul><p>入浴後は脱水予防のため、必ず水分補給を促してください。</p>',
            createdAt: '2025-01-30T00:00:00.000Z',
            updatedAt: '2025-01-30T00:00:00.000Z',
            createdBy: '渡辺 由美'
          },
          {
            id: 'ipd8',
            title: '皮膚観察について',
            content: '<p>佐藤様は仙骨部に発赤が見られるため、入浴時に以下の観察を行ってください：</p><ul><li>仙骨部の発赤の有無と程度</li><li>かかと、肘などの骨突出部の状態</li><li>全身の乾燥状態</li></ul><p>入浴後は保湿クリームを塗布し、体位変換を2時間ごとに行ってください。</p><p>発赤の悪化が見られた場合は看護師に報告してください。</p>',
            createdAt: '2025-02-05T00:00:00.000Z',
            updatedAt: '2025-02-05T00:00:00.000Z',
            createdBy: '中村 真一'
          }
        ]
      },
      { id: 'ip10', category: '口腔ケア', icon: 'Tooth', count: 0, isActive: false },
      { 
        id: 'ip11', 
        category: 'その他', 
        icon: 'FileText', 
        count: 1, 
        isActive: true,
        details: [
          {
            id: 'ipd9',
            title: '趣味・好みについて',
            content: '<p>佐藤様の趣味・好みについての情報です：</p><ul><li>好きな食べ物：和菓子（特に羊羹）、煮魚</li><li>嫌いな食べ物：パン類、乳製品</li><li>趣味：将棋、歴史番組の視聴</li><li>好きな話題：昔の仕事の話（元教師）</li></ul><p>コミュニケーションの際は、上記の話題を取り入れると会話が弾みます。</p>',
            createdAt: '2025-02-20T00:00:00.000Z',
            updatedAt: '2025-02-20T00:00:00.000Z',
            createdBy: '小林 さくら'
          }
        ]
      },
      { id: 'ip12', category: '薬', icon: 'Pill', count: 0, isActive: false },
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
        icon: 'GlassWater',
        label: '000ml',
        details: '00:00\n合計2',
        categoryKey: 'drinking',
      },
      { time: '00:00', icon: 'ExcretionIcon', label: '排尿', categoryKey: 'excretion' },
      { time: '10:10', icon: 'Utensils', label: '完食', categoryKey: 'breakfast' },
      { time: 'N/A', icon: 'Soup', label: '9:8', categoryKey: 'lunch' },
      { time: 'N/A', icon: 'Cookie', label: '6', categoryKey: 'snack' },
      { time: 'N/A', icon: 'Utensils', label: '6:7', categoryKey: 'dinner' },
      { time: 'N/A', icon: 'Bed', label: '5:9', categoryKey: 'bedtimeMeal' },
      { time: 'N/A', icon: 'Pill', label: '食後', categoryKey: 'medication' },
      { time: 'N/A', icon: 'Tooth', label: '歯磨き', categoryKey: 'oralCare' },
      { time: 'N/A', icon: 'CheckCircle', label: '実施', categoryKey: 'eyeDrops' },
      { time: 'N/A', icon: 'Bath', label: '入浴', categoryKey: 'bathing' },
      { time: 'N/A', icon: 'Thermometer', label: '36.5', categoryKey: 'temperature' },
      { time: 'N/A', icon: 'HeartPulse', label: '77', categoryKey: 'pulse' },
      { time: 'N/A', icon: 'Droplets', label: '118/72', categoryKey: 'bloodPressure' },
      { time: 'N/A', icon: 'Wind', label: '16', categoryKey: 'respiration' },
      { time: 'N/A', icon: 'Activity', label: '98', categoryKey: 'spo2' },
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

// Add some discharged residents for testing
careBoardData.push(
  {
    id: 9,
    name: '退所太郎',
    furigana: 'タイショタロウ',
    dob: '1945/03/15',
    sex: '男',
    age: 80,
    admissionDate: '2023/01/01',
    dischargeDate: '2024/12/31',
    registrationDate: '2022/12/15',
    lastUpdateDate: '2024/12/31',
    admissionStatus: '退所済',
    careLevel: '要介護2',
    certificationDate: '2023/01/01',
    certValidityStart: '2023/01/01',
    certValidityEnd: '2024/01/01',
    address: '東京都新宿区西新宿1-1-1',
    avatarUrl: '/elderly-man-avatar.png',
    events: [],
    contacts: [],
  },
  {
    id: 10,
    name: '退所花子',
    furigana: 'タイショハナコ',
    dob: '1950/07/20',
    sex: '女',
    age: 75,
    admissionDate: '2023/06/01',
    dischargeDate: '2024/11/30',
    registrationDate: '2023/05/15',
    lastUpdateDate: '2024/11/30',
    admissionStatus: '退所済',
    careLevel: '要支援2',
    certificationDate: '2023/06/01',
    certValidityStart: '2023/06/01',
    certValidityEnd: '2024/06/01',
    address: '神奈川県横浜市港北区新横浜2-2-2',
    avatarUrl: '/elderly-woman-avatar.png',
    events: [],
    contacts: [],
  }
);

export const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00'];

// Helper to find a resident by ID
export const getResidentById = (id: number): Resident | undefined => {
  return careBoardData.find((resident) => resident.id === id);
};
