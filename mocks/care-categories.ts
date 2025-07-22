// Define Care Category Groups
export const careCategoryGroups = [
  {
    key: 'meal',
    label: '食事',
    icon: 'Utensils',
    color: [243, 156, 18], // オレンジ系
  },
  {
    key: 'vital',
    label: 'バイタル',
    icon: 'Activity',
    color: [231, 76, 60], // 赤系
  },
  {
    key: 'drinking',
    label: '飲水',
    icon: 'GlassWater',
    color: [52, 152, 219], // 青系
  },
  {
    key: 'excretion',
    label: '排泄',
    icon: 'ExcretionIcon',
    color: [121, 85, 72], // 茶系
  },
  {
    key: 'bathing',
    label: '入浴',
    icon: 'Bath',
    color: [74, 144, 226], // 水色系
  },
  {
    key: 'medication',
    label: '服薬',
    icon: 'Pill',
    color: [155, 89, 182], // 紫系
  },
  {
    key: 'eyeDrops',
    label: '点眼',
    icon: 'Eye',
    color: [46, 204, 113], // 緑系
  },
  {
    key: 'oralCare',
    label: '口腔ケア',
    icon: 'Tooth',
    color: [241, 196, 15], // 黄系
  },
] as const;

export type CareCategoryGroupKey = (typeof careCategoryGroups)[number]['key'];

// Define Care Categories with parent groups
export const careCategories = [
  // 食事カテゴリ
  { key: 'breakfast', label: '朝食', icon: 'Utensils', groupKey: 'meal' },
  { key: 'lunch', label: '昼食', icon: 'Utensils', groupKey: 'meal' },
  { key: 'snack', label: 'おやつ', icon: 'Cookie', groupKey: 'meal' },
  { key: 'dinner', label: '夕食', icon: 'Utensils', groupKey: 'meal' },
  { key: 'bedtimeMeal', label: '眠前食', icon: 'Bed', groupKey: 'meal' },

  // バイタルカテゴリ
  { key: 'temperature', label: '体温', icon: 'Thermometer', groupKey: 'vital' },
  { key: 'pulse', label: '脈拍', icon: 'HeartPulse', groupKey: 'vital' },
  { key: 'bloodPressure', label: '血圧', icon: 'Droplets', groupKey: 'vital' },
  { key: 'respiration', label: '呼吸', icon: 'Wind', groupKey: 'vital' },
  { key: 'spo2', label: 'SpO2', icon: 'Activity', groupKey: 'vital' },

  // 飲水カテゴリ
  { key: 'waterIntake', label: '水分摂取', icon: 'GlassWater', groupKey: 'drinking' },
  { key: 'teaTime', label: 'お茶タイム', icon: 'Coffee', groupKey: 'drinking' },
  { key: 'hydrationCheck', label: '水分量確認', icon: 'CheckCircle', groupKey: 'drinking' },
  { key: 'drinkingAssistance', label: '飲水介助', icon: 'Users', groupKey: 'drinking' },

  // 排泄カテゴリ
  { key: 'urination', label: '排尿', icon: 'ExcretionIcon', groupKey: 'excretion' },
  { key: 'defecation', label: '排便', icon: 'ExcretionIcon', groupKey: 'excretion' },
  { key: 'diaperChange', label: 'おむつ交換', icon: 'Baby', groupKey: 'excretion' },
  { key: 'toiletAssistance', label: 'トイレ介助', icon: 'Users', groupKey: 'excretion' },
  { key: 'portableToilet', label: 'ポータブルトイレ', icon: 'Home', groupKey: 'excretion' },

  // 入浴カテゴリ
  { key: 'fullBath', label: '一般浴', icon: 'Bath', groupKey: 'bathing' },
  { key: 'mechanicalBath', label: '機械浴', icon: 'Settings', groupKey: 'bathing' },
  { key: 'showerBath', label: 'シャワー浴', icon: 'ShowerHead', groupKey: 'bathing' },
  { key: 'partialBath', label: '部分浴', icon: 'Droplets', groupKey: 'bathing' },
  { key: 'footBath', label: '足浴', icon: 'Footprints', groupKey: 'bathing' },

  // 服薬カテゴリ
  { key: 'morningMed', label: '朝薬', icon: 'Pill', groupKey: 'medication' },
  { key: 'noonMed', label: '昼薬', icon: 'Pill', groupKey: 'medication' },
  { key: 'eveningMed', label: '夕薬', icon: 'Pill', groupKey: 'medication' },
  { key: 'bedtimeMed', label: '就寝前薬', icon: 'Bed', groupKey: 'medication' },
  { key: 'emergencyMed', label: '頓服薬', icon: 'AlertTriangle', groupKey: 'medication' },
  { key: 'medCheck', label: '服薬確認', icon: 'CheckCircle', groupKey: 'medication' },

  // 点眼カテゴリ
  { key: 'morningEyeDrops', label: '朝点眼', icon: 'Eye', groupKey: 'eyeDrops' },
  { key: 'noonEyeDrops', label: '昼点眼', icon: 'Eye', groupKey: 'eyeDrops' },
  { key: 'eveningEyeDrops', label: '夕点眼', icon: 'Eye', groupKey: 'eyeDrops' },
  { key: 'bedtimeEyeDrops', label: '就寝前点眼', icon: 'Moon', groupKey: 'eyeDrops' },
  { key: 'specialEyeDrops', label: '特別点眼', icon: 'Star', groupKey: 'eyeDrops' },

  // 口腔ケアカテゴリ
  { key: 'toothBrushing', label: '歯磨き', icon: 'Tooth', groupKey: 'oralCare' },
  { key: 'mouthwash', label: 'うがい', icon: 'Droplets', groupKey: 'oralCare' },
  { key: 'tongueClean', label: '舌清拭', icon: 'FileText', groupKey: 'oralCare' },
  { key: 'gumMassage', label: '歯茎マッサージ', icon: 'Heart', groupKey: 'oralCare' },
  { key: 'dentureClean', label: '義歯清拭', icon: 'Smile', groupKey: 'oralCare' },
  { key: 'oralMoisture', label: '口腔保湿', icon: 'Droplets', groupKey: 'oralCare' },
] as const;

export type CareCategoryKey = (typeof careCategories)[number]['key'];

// Helper functions
export const getCareCategory = (key: CareCategoryKey) => {
  return careCategories.find((category) => category.key === key);
};

export const getCareGroup = (groupKey: CareCategoryGroupKey) => {
  return careCategoryGroups.find((group) => group.key === groupKey);
};

export const getCategoriesByGroup = (groupKey: CareCategoryGroupKey) => {
  return careCategories.filter((category) => category.groupKey === groupKey);
};

export const getGroupByCategory = (categoryKey: CareCategoryKey) => {
  const category = getCareCategory(categoryKey);
  if (!category) return null;
  return getCareGroup(category.groupKey);
};
