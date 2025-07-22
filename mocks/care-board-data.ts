// Re-export from care-categories
export {
    careCategories, careCategoryGroups, getCareCategory,
    getCareGroup,
    getCategoriesByGroup,
    getGroupByCategory,
    type CareCategoryGroupKey,
    type CareCategoryKey
} from './care-categories';

// Re-export from residents-data
export {
    careBoardData,
    getResidentById, type CareEvent, type ContactPerson,
    type HomeCareOffice, type IndividualPoint, type MedicalHistory, type MedicalInstitution, type MedicationInfo, type Resident
} from './residents-data';

