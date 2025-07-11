import { careBoardData, careCategories, getResidentById } from '@/mocks/care-board-data';

describe('care-board-data', () => {
  describe('getResidentById', () => {
    it('returns resident when ID exists', () => {
      const resident = getResidentById(1);

      expect(resident).toBeDefined();
      expect(resident?.id).toBe(1);
      expect(resident?.name).toBe('佐藤清');
    });

    it('returns undefined when ID does not exist', () => {
      const resident = getResidentById(999);

      expect(resident).toBeUndefined();
    });

    it('handles edge cases correctly', () => {
      expect(getResidentById(0)).toBeUndefined();
      expect(getResidentById(-1)).toBeUndefined();
    });
  });

  describe('careBoardData', () => {
    it('contains expected number of residents', () => {
      expect(careBoardData).toHaveLength(10);
    });

    it('all residents have required fields', () => {
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

    it('has unique IDs for all residents', () => {
      const ids = careBoardData.map((resident) => resident.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(careBoardData.length);
    });
  });

  describe('careCategories', () => {
    it('contains expected care categories', () => {
      expect(careCategories.length).toBeGreaterThan(0);

      const expectedCategories = ['drinking', 'excretion', 'breakfast', 'lunch', 'medication'];
      expectedCategories.forEach((categoryKey) => {
        const category = careCategories.find((cat) => cat.key === categoryKey);
        expect(category).toBeDefined();
      });
    });

    it('all categories have required fields', () => {
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
