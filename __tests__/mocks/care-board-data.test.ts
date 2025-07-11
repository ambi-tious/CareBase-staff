import { careBoardData, careCategories, getResidentById } from '@/mocks/care-board-data';

describe('ケアボードデータ', () => {
  describe('getResidentById', () => {
    it('IDが存在する場合に入居者を返す', () => {
      const resident = getResidentById(1);

      expect(resident).toBeDefined();
      expect(resident?.id).toBe(1);
      expect(resident?.name).toBe('佐藤清');
    });

    it('IDが存在しない場合はundefinedを返す', () => {
      const resident = getResidentById(999);

      expect(resident).toBeUndefined();
    });

    it('エッジケースを正しく処理する', () => {
      expect(getResidentById(0)).toBeUndefined();
      expect(getResidentById(-1)).toBeUndefined();
    });
  });

  describe('careBoardData', () => {
    it('期待される数の入居者を含む', () => {
      expect(careBoardData).toHaveLength(10);
    });

    it('すべての入居者が必須フィールドを持つ', () => {
      careBoardData.forEach((resident) => {
        expect(resident.id).toBeDefined();
        expect(resident.name).toBeDefined();
        expect(resident.furigana).toBeDefined();
        expect(resident.dob).toBeDefined();
        expect(resident.sex).toBeDefined();
        expect(resident.age).toBeDefined();
        expect(resident.admissionDate).toBeDefined();
        expect(resident.admissionStatus).toBeDefined();
        expect(resident.careLevel).toBeDefined();
        expect(resident.address).toBeDefined();
        expect(resident.avatarUrl).toBeDefined();
        expect(resident.events).toBeDefined();
        expect(Array.isArray(resident.events)).toBe(true);
      });
    });

    it('すべての入居者がユニークなIDを持つ', () => {
      const ids = careBoardData.map((resident) => resident.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(careBoardData.length);
    });
  });

  describe('careCategories', () => {
    it('期待されるケアカテゴリを含む', () => {
      expect(careCategories.length).toBeGreaterThan(0);

      const expectedCategories = ['drinking', 'excretion', 'breakfast', 'lunch', 'medication'];
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
        expect(typeof category.key).toBe('string');
        expect(typeof category.label).toBe('string');
        expect(typeof category.icon).toBe('string');
      });
    });
  });
});
