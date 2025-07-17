import {
  careBoardData,
  careCategories,
  careCategoryGroups,
  getCareCategory,
  getCareGroup,
  getCategoriesByGroup,
  getGroupByCategory,
  getResidentById,
} from '@/mocks/care-board-data';

describe('ケアボードデータ', () => {
  describe('基本データ検証', () => {
    it('利用者データが存在する', () => {
      expect(careBoardData).toBeDefined();
      expect(careBoardData.length).toBeGreaterThan(0);
    });

    it('各利用者が必要なプロパティを持つ', () => {
      careBoardData.forEach((resident) => {
        expect(resident.id).toBeDefined();
        expect(resident.name).toBeDefined();
        expect(resident.furigana).toBeDefined();
        expect(resident.dob).toBeDefined();
        expect(resident.sex).toBeDefined();
        expect(resident.age).toBeDefined();
        expect(resident.admissionStatus).toBeDefined();
        expect(resident.careLevel).toBeDefined();
        expect(resident.avatarUrl).toBeDefined();
        expect(resident.events).toBeDefined();
        expect(Array.isArray(resident.events)).toBe(true);
      });
    });

    it('イベントが適切な構造を持つ', () => {
      careBoardData.forEach((resident) => {
        resident.events.forEach((event) => {
          expect(event.scheduledTime).toBeDefined();
          expect(event.time).toBeDefined();
          expect(event.icon).toBeDefined();
          expect(event.label).toBeDefined();
          expect(typeof event.scheduledTime).toBe('string');
          expect(typeof event.time).toBe('string');
          expect(typeof event.icon).toBe('string');
          expect(typeof event.label).toBe('string');
        });
      });
    });

    it('getResidentById関数が正しく動作する', () => {
      const resident = getResidentById(1);
      expect(resident).toBeDefined();
      expect(resident?.id).toBe(1);

      const nonExistentResident = getResidentById(999);
      expect(nonExistentResident).toBeUndefined();
    });
  });

  describe('careCategoryGroups', () => {
    it('期待されるケアカテゴリグループを含む', () => {
      expect(careCategoryGroups.length).toBe(8);

      const expectedGroups = [
        'meal',
        'vital',
        'drinking',
        'excretion',
        'bathing',
        'medication',
        'eyeDrops',
        'oralCare',
      ];
      expectedGroups.forEach((groupKey) => {
        const group = careCategoryGroups.find((g) => g.key === groupKey);
        expect(group).toBeDefined();
      });
    });

    it('すべてのグループが必須フィールドを持つ', () => {
      careCategoryGroups.forEach((group) => {
        expect(group.key).toBeDefined();
        expect(group.label).toBeDefined();
        expect(group.icon).toBeDefined();
        expect(group.color).toBeDefined();
        expect(typeof group.key).toBe('string');
        expect(typeof group.label).toBe('string');
        expect(typeof group.icon).toBe('string');
        expect(Array.isArray(group.color)).toBe(true);
        expect(group.color.length).toBe(3);
      });
    });

    it('グループごとに適切な数のカテゴリが存在する', () => {
      const mealCategories = getCategoriesByGroup('meal');
      expect(mealCategories.length).toBe(5);

      const vitalCategories = getCategoriesByGroup('vital');
      expect(vitalCategories.length).toBe(5);

      const drinkingCategories = getCategoriesByGroup('drinking');
      expect(drinkingCategories.length).toBe(4);

      const excretionCategories = getCategoriesByGroup('excretion');
      expect(excretionCategories.length).toBe(5);

      const bathingCategories = getCategoriesByGroup('bathing');
      expect(bathingCategories.length).toBe(5);

      const medicationCategories = getCategoriesByGroup('medication');
      expect(medicationCategories.length).toBe(6);

      const eyeDropsCategories = getCategoriesByGroup('eyeDrops');
      expect(eyeDropsCategories.length).toBe(5);

      const oralCareCategories = getCategoriesByGroup('oralCare');
      expect(oralCareCategories.length).toBe(6);
    });
  });

  describe('careCategories', () => {
    it('期待されるケアカテゴリを含む', () => {
      expect(careCategories.length).toBeGreaterThan(0);

      const expectedCategories = ['waterIntake', 'urination', 'breakfast', 'lunch', 'morningMed'];
      expectedCategories.forEach((categoryKey) => {
        const category = careCategories.find((cat) => cat.key === categoryKey);
        expect(category).toBeDefined();
      });
    });

    it('すべてのカテゴリが必須フィールドを持つ', () => {
      careCategories.forEach((category) => {
        expect(category.key).toBeDefined();
        expect(category.label).toBeDefined();
        expect(category.icon).toBeDefined();
        expect(category.groupKey).toBeDefined();
        expect(typeof category.key).toBe('string');
        expect(typeof category.label).toBe('string');
        expect(typeof category.icon).toBe('string');
        expect(typeof category.groupKey).toBe('string');
      });
    });

    it('すべてのカテゴリが有効なグループに属する', () => {
      careCategories.forEach((category) => {
        const group = careCategoryGroups.find((g) => g.key === category.groupKey);
        expect(group).toBeDefined();
      });
    });

    it('カテゴリ合計数が期待される数と一致する', () => {
      // 5 + 5 + 4 + 5 + 5 + 6 + 5 + 6 = 41
      expect(careCategories.length).toBe(41);
    });
  });

  describe('Helper Functions', () => {
    it('getCareCategory関数が正しく動作する', () => {
      const category = getCareCategory('breakfast');
      expect(category).toBeDefined();
      expect(category?.key).toBe('breakfast');
      expect(category?.label).toBe('朝食');

      const nonExistentCategory = getCareCategory('nonexistent' as any);
      expect(nonExistentCategory).toBeUndefined();
    });

    it('getCareGroup関数が正しく動作する', () => {
      const group = getCareGroup('meal');
      expect(group).toBeDefined();
      expect(group?.key).toBe('meal');
      expect(group?.label).toBe('食事');

      const nonExistentGroup = getCareGroup('nonexistent' as any);
      expect(nonExistentGroup).toBeUndefined();
    });

    it('getCategoriesByGroup関数が正しく動作する', () => {
      const mealCategories = getCategoriesByGroup('meal');
      expect(mealCategories.length).toBeGreaterThan(0);
      mealCategories.forEach((category) => {
        expect(category.groupKey).toBe('meal');
      });

      const vitalCategories = getCategoriesByGroup('vital');
      expect(vitalCategories.length).toBeGreaterThan(0);
      vitalCategories.forEach((category) => {
        expect(category.groupKey).toBe('vital');
      });
    });

    it('getGroupByCategory関数が正しく動作する', () => {
      const group = getGroupByCategory('breakfast');
      expect(group).toBeDefined();
      expect(group?.key).toBe('meal');

      const vitalGroup = getGroupByCategory('temperature');
      expect(vitalGroup).toBeDefined();
      expect(vitalGroup?.key).toBe('vital');

      const nonExistentGroup = getGroupByCategory('nonexistent' as any);
      expect(nonExistentGroup).toBeNull();
    });
  });
});
