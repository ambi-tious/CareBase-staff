import { MedicationStatusCard } from '@/components/2_molecules/medication/medication-status-card';
import type { MedicationStatus } from '@/types/medication-status';
import { jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock the medication status service
jest.mock('@/services/medicationStatusService', () => ({
  medicationStatusService: {
    updateMedicationStatus: jest.fn(),
    deleteMedicationStatus: jest.fn(),
  },
}));

// Mock the modals
jest.mock('@/components/3_organisms/modals/medication-status-modal', () => ({
  MedicationStatusModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="medication-status-modal">
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

const mockMedicationStatus: MedicationStatus = {
  id: 'status-1',
  date: '2025-01-15',
  content: '朝食後の薬を服用済み、副作用なし',
  notes: '血圧測定も実施済み',
  createdAt: '2025-01-15T00:00:00.000Z',
  updatedAt: '2025-01-15T00:00:00.000Z',
};

describe('MedicationStatusCard', () => {
  const mockProps = {
    medicationStatus: mockMedicationStatus,
    residentId: 1,
    residentName: '佐藤清',
    onStatusUpdate: jest.fn(),
    onStatusDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders medication status information correctly', () => {
    render(<MedicationStatusCard {...mockProps} />);

    expect(screen.getByText('服薬状況記録')).toBeInTheDocument();
    expect(screen.getByText('2025/1/15')).toBeInTheDocument();
    expect(screen.getByText('朝食後の薬を服用済み、副作用なし')).toBeInTheDocument();
    expect(screen.getByText('血圧測定も実施済み')).toBeInTheDocument();
  });

  it('displays formatted date correctly', () => {
    render(<MedicationStatusCard {...mockProps} />);

    expect(screen.getByText('2025/1/15')).toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<MedicationStatusCard {...mockProps} />);

    const editButton = screen.getByRole('button', { name: /編集/i });
    fireEvent.click(editButton);

    expect(screen.getByTestId('medication-status-modal')).toBeInTheDocument();
  });

  it('opens delete modal when delete button is clicked', () => {
    render(<MedicationStatusCard {...mockProps} />);

    const deleteButton = screen.getByRole('button', { name: /削除/i });
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('handles medication status without notes', () => {
    const statusWithoutNotes = {
      ...mockMedicationStatus,
      notes: undefined,
    };

    render(<MedicationStatusCard {...mockProps} medicationStatus={statusWithoutNotes} />);

    expect(screen.queryByText('メモ:')).not.toBeInTheDocument();
  });

  it('displays notes when provided', () => {
    render(<MedicationStatusCard {...mockProps} />);

    expect(screen.getByText('メモ:')).toBeInTheDocument();
    expect(screen.getByText('血圧測定も実施済み')).toBeInTheDocument();
  });

  it('renders content with proper formatting', () => {
    const statusWithMultilineContent = {
      ...mockMedicationStatus,
      content: '朝食後の薬を服用済み\n副作用なし\n血圧正常',
    };

    render(<MedicationStatusCard {...mockProps} medicationStatus={statusWithMultilineContent} />);

    // Check that the content is rendered with proper formatting using a more specific approach
    const contentElement = screen.getByText('内容:').closest('div')?.querySelector('p');
    expect(contentElement).toHaveTextContent('朝食後の薬を服用済み');
    expect(contentElement).toHaveTextContent('副作用なし');
    expect(contentElement).toHaveTextContent('血圧正常');
  });
});
