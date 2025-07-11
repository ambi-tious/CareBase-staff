import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MedicationCard } from '@/components/2_molecules/medication/medication-card';
import type { Medication } from '@/types/medication';
import { jest } from '@jest/globals';

// Mock the medication service
jest.mock('@/services/medicationService', () => ({
  medicationService: {
    updateMedication: jest.fn(),
    deleteMedication: jest.fn(),
  },
}));

// Mock the modals
jest.mock('@/components/3_organisms/modals/medication-modal', () => ({
  MedicationModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="medication-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock('@/components/3_organisms/modals/generic-delete-modal', () => ({
  GenericDeleteModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="delete-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

const mockMedication: Medication = {
  id: 'med-1',
  medicationName: 'アムロジピン錠5mg',
  dosageInstructions: '1日1回 朝食後 1錠',
  startDate: '2025-01-15',
  endDate: '',
  prescribingInstitution: '松本内科クリニック',
  notes: '血圧管理のため継続服用中',
  createdAt: '2025-01-15T00:00:00.000Z',
  updatedAt: '2025-01-15T00:00:00.000Z',
};

describe('MedicationCard', () => {
  const mockProps = {
    medication: mockMedication,
    residentId: 1,
    residentName: '佐藤清',
    onMedicationUpdate: jest.fn(),
    onMedicationDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders medication information correctly', () => {
    render(<MedicationCard {...mockProps} />);

    expect(screen.getByText('アムロジピン錠5mg')).toBeInTheDocument();
    expect(screen.getByText('1日1回 朝食後 1錠')).toBeInTheDocument();
    expect(screen.getByText('松本内科クリニック')).toBeInTheDocument();
    expect(screen.getByText('血圧管理のため継続服用中')).toBeInTheDocument();
    expect(screen.getByText('服用中')).toBeInTheDocument();
  });

  it('shows correct status for ongoing medication', () => {
    render(<MedicationCard {...mockProps} />);

    const statusBadge = screen.getByText('服用中');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('shows correct status for ended medication', () => {
    const endedMedication = {
      ...mockMedication,
      endDate: '2024-12-31',
    };

    render(<MedicationCard {...mockProps} medication={endedMedication} />);

    const statusBadge = screen.getByText('服用終了');
    expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-700');
  });

  it('displays formatted dates correctly', () => {
    render(<MedicationCard {...mockProps} />);

    expect(screen.getByText('2025/1/15')).toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<MedicationCard {...mockProps} />);

    const editButton = screen.getByRole('button', { name: /編集/i });
    fireEvent.click(editButton);

    expect(screen.getByTestId('medication-modal')).toBeInTheDocument();
  });

  it('opens delete modal when delete button is clicked', () => {
    render(<MedicationCard {...mockProps} />);

    const deleteButton = screen.getByRole('button', { name: /削除/i });
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('handles medication without end date', () => {
    render(<MedicationCard {...mockProps} />);

    expect(screen.queryByText('服用終了日:')).not.toBeInTheDocument();
  });

  it('handles medication without notes', () => {
    const medicationWithoutNotes = {
      ...mockMedication,
      notes: undefined,
    };

    render(<MedicationCard {...mockProps} medication={medicationWithoutNotes} />);

    expect(screen.queryByText('メモ:')).not.toBeInTheDocument();
  });

  it('displays end date when provided', () => {
    const medicationWithEndDate = {
      ...mockMedication,
      endDate: '2025-12-31',
    };

    render(<MedicationCard {...mockProps} medication={medicationWithEndDate} />);

    expect(screen.getByText('服用終了日:')).toBeInTheDocument();
    expect(screen.getByText('2025/12/31')).toBeInTheDocument();
  });
});
