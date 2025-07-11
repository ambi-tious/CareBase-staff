import type { ResidentBasicInfo } from '@/components/2_molecules/forms/resident-basic-info-form';
import type { Resident } from '@/mocks/care-board-data';

// Helper function to calculate certification validity end date
const calculateCertValidityEnd = (admissionDate: string): string => {
  const admission = new Date(admissionDate);
  const validityEnd = new Date(admission);
  validityEnd.setFullYear(validityEnd.getFullYear() + 1);
  validityEnd.setDate(validityEnd.getDate() - 1); // One day before the anniversary
  return validityEnd.toISOString().split('T')[0].replace(/-/g, '/');
};

// Mock service for resident operations
export const residentService = {
  async createResident(data: ResidentBasicInfo): Promise<Resident> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Calculate age from date of birth
    const calculateAge = (dob: string): number => {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    };

    // Generate new resident ID (in production, this would be handled by the backend)
    const newId =
      Math.max(...(await import('@/mocks/care-board-data')).careBoardData.map((r) => r.id)) + 1;

    // Create new resident object
    const newResident: Resident = {
      id: newId,
      name: data.name,
      furigana: data.furigana,
      dob: data.dob.replace(/-/g, '/'), // Convert YYYY-MM-DD to YYYY/MM/DD
      sex: data.sex as '男' | '女' | 'その他',
      age: calculateAge(data.dob),
      floorGroup: data.floorGroup || undefined,
      unitTeam: data.unitTeam || undefined,
      roomInfo: data.roomInfo || undefined,
      registrationDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      lastUpdateDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
      admissionDate: data.admissionDate.replace(/-/g, '/'),
      admissionStatus: '入居中',
      careLevel: data.careLevel,
      certificationDate: data.admissionDate.replace(/-/g, '/'), // Default to admission date
      certValidityStart: data.admissionDate.replace(/-/g, '/'),
      certValidityEnd: calculateCertValidityEnd(data.admissionDate),
      address: data.address,
      avatarUrl: '/placeholder.svg', // Default avatar
      events: [],
      contacts: [],
    };

    // In production, this would make an API call to create the resident
    console.log('Creating resident:', newResident);

    const { careBoardData } = await import('@/mocks/care-board-data');
    careBoardData.push(newResident);
    return newResident;
  },

  async updateResident(id: number, data: Partial<ResidentBasicInfo>): Promise<Resident> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, this would make an API call to update the resident
    console.log('Updating resident:', id, data);

    // For now, return a mock updated resident
    const { careBoardData } = await import('@/mocks/care-board-data');
    const existingResident = careBoardData.find((r) => r.id === id);

    if (!existingResident) {
      throw new Error('Resident not found');
    }

    const updatedResident = {
      ...existingResident,
      ...data,
      sex:
        data.sex === '男' || data.sex === '女' || data.sex === 'その他'
          ? data.sex
          : existingResident.sex,
      lastUpdateDate: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
    };

    // Update the resident in the careBoardData array
    const residentIndex = careBoardData.findIndex((r) => r.id === id);
    if (residentIndex !== -1) {
      careBoardData[residentIndex] = updatedResident;
    }

    return updatedResident;
  },
};
