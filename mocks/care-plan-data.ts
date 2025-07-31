import type { CarePlan } from '@/types/care-plan';

export const carePlanData: CarePlan[] = [
  {
    id: 'plan-001',
    residentId: '1',
    residentName: '佐藤清',
    planTitle: '2025年度 第1期ケアプラン',
    planType: 'continuation',
    careLevel: '要介護1',
    certificationDate: '2025-01-11',
    certValidityStart: '2024-12-28',
    certValidityEnd: '2025-12-27',
    certificationStatus: 'certified',
    careManager: '山田太郎',
    careManagerOffice: 'こうべケアプランセンター',
    status: 'active',
    referralInfo: '前回プランからの継続。血圧管理に注意が必要な状況は変わらず。',
    residentIntention: '自宅での生活を継続したい。できるだけ自立した生活を送りたい。',
    familyIntention: '本人の意向を尊重し、安全に自宅で過ごせるよう支援したい。',
    assessmentCommitteeOpinion: '要介護1の認定は適切。訪問介護とデイサービスの組み合わせが効果的。',
    comprehensiveGuidance:
      '血圧管理を中心とした健康維持と、転倒予防に重点を置いたケアを実施。社会参加の機会も確保する。',
    consentObtained: true,
    goals: ['自立した日常生活の維持', '転倒リスクの軽減', '社会参加の促進'],
    services: [
      {
        id: 'service-001',
        serviceName: '訪問介護',
        serviceType: 'home_care',
        frequency: '週3回',
        duration: '1時間/回',
        provider: 'ハートケアサービス',
        startDate: '2025-01-01',
        notes: '身体介護中心',
      },
      {
        id: 'service-002',
        serviceName: 'デイサービス',
        serviceType: 'day_service',
        frequency: '週2回',
        duration: '6時間/回',
        provider: 'みどりデイサービスセンター',
        startDate: '2025-01-01',
        notes: '機能訓練・入浴サービス',
      },
    ],
    notes: '血圧管理に注意が必要。定期的なバイタルチェックを実施。',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    createdBy: 'cm-001',
    createdByName: '山田太郎',
    nextReviewDate: '2025-04-01',
  },
  {
    id: 'plan-002',
    residentId: '1',
    residentName: '佐藤清',
    planTitle: '2024年度 第4期ケアプラン',
    planType: 'continuation',
    careLevel: '要介護1',
    certificationDate: '2024-01-15',
    certValidityStart: '2024-01-01',
    certValidityEnd: '2024-12-31',
    certificationStatus: 'certified',
    careManager: '山田太郎',
    careManagerOffice: 'こうべケアプランセンター',
    status: 'expired',
    referralInfo: '前期からの継続プラン。',
    residentIntention: '自宅での生活を継続したい。',
    familyIntention: '本人の意向を尊重したい。',
    assessmentCommitteeOpinion: '要介護1の認定継続が適切。',
    comprehensiveGuidance: '自立支援を中心としたケアプラン。',
    consentObtained: true,
    goals: ['自立した日常生活の維持', '健康状態の安定'],
    services: [
      {
        id: 'service-003',
        serviceName: '訪問介護',
        serviceType: 'home_care',
        frequency: '週2回',
        duration: '1時間/回',
        provider: 'ハートケアサービス',
        startDate: '2024-10-01',
        endDate: '2024-12-31',
        notes: '生活援助中心',
      },
    ],
    notes: '前期より介護度が軽減。自立度向上が見られる。',
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-12-15T14:20:00Z',
    createdBy: 'cm-001',
    createdByName: '山田太郎',
    nextReviewDate: '2025-01-01',
  },
  {
    id: 'plan-003',
    residentId: '2',
    residentName: '田中花子',
    planTitle: '2025年度 第1期ケアプラン',
    planType: 'initial',
    careLevel: '要介護3',
    certificationDate: '2025-02-01',
    certValidityStart: '2025-01-15',
    certValidityEnd: '2026-01-14',
    certificationStatus: 'certified',
    careManager: '松本花',
    careManagerOffice: '大阪中央居宅介護支援センター',
    status: 'active',
    referralInfo: '病院からの退院に伴う初回プラン作成。アルツハイマー型認知症の診断あり。',
    residentIntention: '家族と一緒に過ごしたい。できることは自分でやりたい。',
    familyIntention:
      '本人の尊厳を保ちながら、安全に過ごせる環境を整えたい。家族の負担も軽減したい。',
    assessmentCommitteeOpinion: '要介護3の認定が適切。認知症対応型サービスの利用が必要。',
    comprehensiveGuidance:
      '認知症の進行予防と家族支援を中心としたケアプラン。安全確保と社会参加のバランスを重視。',
    consentObtained: true,
    goals: ['認知機能の維持', '安全な生活環境の確保', '家族負担の軽減'],
    services: [
      {
        id: 'service-004',
        serviceName: 'デイサービス',
        serviceType: 'day_service',
        frequency: '週3回',
        duration: '7時間/回',
        provider: '大阪中央デイサービス',
        startDate: '2025-02-01',
        notes: '認知症対応型デイサービス',
      },
      {
        id: 'service-005',
        serviceName: 'ショートステイ',
        serviceType: 'short_stay',
        frequency: '月1回',
        duration: '2泊3日',
        provider: 'やすらぎの里',
        startDate: '2025-02-01',
        notes: '家族のレスパイトケア',
      },
    ],
    notes: 'アルツハイマー型認知症。BPSD症状に注意が必要。',
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-02-01T00:00:00Z',
    createdBy: 'cm-002',
    createdByName: '松本花',
    nextReviewDate: '2025-05-01',
  },
  {
    id: 'plan-004',
    residentId: '3',
    residentName: '鈴木太郎',
    planTitle: '2025年度 第1期ケアプラン',
    planType: 'continuation',
    careLevel: '要介護2',
    certificationDate: '2025-01-01',
    certValidityStart: '2024-12-15',
    certValidityEnd: '2025-12-14',
    certificationStatus: 'certified',
    careManager: '木村和子',
    careManagerOffice: '京都在宅支援センター',
    status: 'active',
    referralInfo: '前回プランからの継続。心房細動の管理が主要課題。',
    residentIntention: '妻と一緒に自宅で過ごしたい。病気の管理をしっかりしたい。',
    familyIntention: '本人の体調管理を最優先に、安心して生活できる環境を整えたい。',
    assessmentCommitteeOpinion: '要介護2の認定継続。医療的ケアの必要性が高い。',
    comprehensiveGuidance:
      '心房細動の管理を中心とした医療的ケアと、ADL維持のためのリハビリテーションを組み合わせたケア。',
    consentObtained: true,
    goals: ['心房細動の管理', 'ADLの維持・向上', '服薬管理の徹底'],
    services: [
      {
        id: 'service-006',
        serviceName: '訪問看護',
        serviceType: 'home_care',
        frequency: '週1回',
        duration: '30分/回',
        provider: '京都訪問看護ステーション',
        startDate: '2025-01-01',
        notes: 'バイタルチェック・服薬指導',
      },
      {
        id: 'service-007',
        serviceName: 'デイサービス',
        serviceType: 'day_service',
        frequency: '週2回',
        duration: '6時間/回',
        provider: '京都リハビリデイ',
        startDate: '2025-01-01',
        notes: '機能訓練・入浴サービス',
      },
    ],
    notes: '心房細動による抗凝固薬服用中。出血リスクに注意。',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-10T16:45:00Z',
    createdBy: 'cm-003',
    createdByName: '木村和子',
    nextReviewDate: '2025-04-01',
  },
];

// Helper functions
export const getCarePlanById = (id: string): CarePlan | undefined => {
  return carePlanData.find((plan) => plan.id === id);
};

export const getCarePlansByResident = (residentId: string): CarePlan[] => {
  return carePlanData
    .filter((plan) => plan.residentId === residentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getCarePlansByStatus = (status: string): CarePlan[] => {
  return carePlanData.filter((plan) => plan.status === status);
};

export const searchCarePlans = (query: string): CarePlan[] => {
  const lowercaseQuery = query.toLowerCase();
  return carePlanData.filter(
    (plan) =>
      plan.planTitle.toLowerCase().includes(lowercaseQuery) ||
      plan.residentName.toLowerCase().includes(lowercaseQuery) ||
      plan.careManager.toLowerCase().includes(lowercaseQuery) ||
      plan.careManagerOffice.toLowerCase().includes(lowercaseQuery)
  );
};
