import { MedicalHistoryCard } from '@/components/2_molecules/resident/medical-history-card';
import type { MedicalHistory } from '@/mocks/care-board-data';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Mock the modals
vi.mock('@/components/3_organisms/modals/medical-history-modal', () => ({
  MedicalHistoryModal: ({ isOpen, onClose, onSubmit }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="medical-history-modal">
        <div>Medical History Modal</div>
        <button onClick={() => onClose()}>Close</button>
        <button onClick={() => onSubmit({ diseaseName: 'Updated Disease' })}>Submit</button>
      </div>
    );
  },
}));

vi.mock('@/components/3_organisms/modals/generic-delete-modal', () => ({
  GenericDeleteModal: ({ isOpen, onClose, onConfirm, itemName, isDeleting, error }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="delete-modal">
        <div>Delete Modal - {itemName}</div>
        <button onClick={() => onClose()}>Cancel</button>
        <button onClick={() => onConfirm()} disabled={isDeleting}>
          Confirm
        </button>
        {error && <div data-testid="delete-error">{error}</div>}
      </div>
    );
  },
}));

// Mock the service
vi.mock('@/services/residentDataService', () => ({
  residentDataService: {
    updateMedicalHistory: vi.fn(),
    deleteMedicalHistory: vi.fn(),
  },
}));

describe('MedicalHistoryCard', () => {
  const mockHistory: MedicalHistory = {
    id: '1',
    date: '2024-01-15',
    diseaseName: 'テスト疾患',
    treatmentStatus: '治療中',
    treatmentInstitution: 'テスト病院',
    notes: 'テスト備考',
  };

  const defaultProps = {
    history: mockHistory,
    residentId: 1,
    residentName: 'テスト利用者',
    onHistoryUpdate: vi.fn(),
    onHistoryDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders history information correctly', () => {
    render(<MedicalHistoryCard {...defaultProps} />);

    expect(screen.getByText('病名')).toBeInTheDocument();
    expect(screen.getByText('テスト疾患')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('テスト病院')).toBeInTheDocument();
    expect(screen.getByText('テスト備考')).toBeInTheDocument();
    expect(screen.getByText('治療中')).toBeInTheDocument();
  });

  it('renders edit and delete buttons', () => {
    render(<MedicalHistoryCard {...defaultProps} />);

    expect(screen.getByText('編集')).toBeInTheDocument();
    expect(screen.getByText('削除')).toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<MedicalHistoryCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));

    expect(screen.getByTestId('medical-history-modal')).toBeInTheDocument();
  });

  it('opens delete modal when delete button is clicked', () => {
    render(<MedicalHistoryCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('closes edit modal when close button is clicked', async () => {
    render(<MedicalHistoryCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));
    expect(screen.getByTestId('medical-history-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByTestId('medical-history-modal')).not.toBeInTheDocument();
    });
  });

  it('closes delete modal when cancel button is clicked', async () => {
    render(<MedicalHistoryCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
    });
  });

  it('does not render notes section when notes is not provided', () => {
    const historyWithoutNotes = { ...mockHistory, notes: undefined };
    render(<MedicalHistoryCard {...defaultProps} history={historyWithoutNotes} />);

    expect(screen.queryByText('備考:')).not.toBeInTheDocument();
  });

  it('does not render treatment institution when not provided', () => {
    const historyWithoutInstitution = { ...mockHistory, treatmentInstitution: undefined };
    render(<MedicalHistoryCard {...defaultProps} history={historyWithoutInstitution} />);

    expect(screen.queryByText('治療機関:')).not.toBeInTheDocument();
  });

  it('renders all required history fields', () => {
    render(<MedicalHistoryCard {...defaultProps} />);

    expect(screen.getByText('発症年月:')).toBeInTheDocument();
    expect(screen.getByText('治療機関:')).toBeInTheDocument();
    expect(screen.getByText('備考:')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<MedicalHistoryCard {...defaultProps} />);

    const card = screen.getByText('病名').closest('.mb-4');
    expect(card).toBeInTheDocument();
  });

  it('passes correct props to edit modal', () => {
    render(<MedicalHistoryCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));

    const modal = screen.getByTestId('medical-history-modal');
    expect(modal).toBeInTheDocument();
  });

  it('passes correct props to delete modal', () => {
    render(<MedicalHistoryCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));

    const modal = screen.getByTestId('delete-modal');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText('Delete Modal - テスト疾患')).toBeInTheDocument();
  });

  it('applies correct status badge color for 治療中', () => {
    render(<MedicalHistoryCard {...defaultProps} />);

    const statusBadge = screen.getByText('治療中');
    expect(statusBadge).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('applies correct status badge color for 完治', () => {
    const curedHistory = { ...mockHistory, treatmentStatus: '完治' as const };
    render(<MedicalHistoryCard {...defaultProps} history={curedHistory} />);

    const statusBadge = screen.getByText('完治');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('applies correct status badge color for 経過観察', () => {
    const observationHistory = { ...mockHistory, treatmentStatus: '経過観察' as const };
    render(<MedicalHistoryCard {...defaultProps} history={observationHistory} />);

    const statusBadge = screen.getByText('経過観察');
    expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-700');
  });

  it('applies default status badge color for unknown status', () => {
    const unknownHistory = { ...mockHistory, treatmentStatus: 'その他' as const };
    render(<MedicalHistoryCard {...defaultProps} history={unknownHistory} />);

    const statusBadge = screen.getByText('その他');
    expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-700');
  });
});
