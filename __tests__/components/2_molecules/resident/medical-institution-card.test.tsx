import { MedicalInstitutionCard } from '@/components/2_molecules/resident/medical-institution-card';
import type { MedicalInstitution } from '@/mocks/care-board-data';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Mock the modals
vi.mock('@/components/3_organisms/modals/medical-institution-modal', () => ({
  MedicalInstitutionModal: ({ isOpen, onClose, onSubmit }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="medical-institution-modal">
        <div>Medical Institution Modal</div>
        <button onClick={() => onClose()}>Close</button>
        <button onClick={() => onSubmit({ institutionName: 'Updated Hospital' })}>Submit</button>
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
    updateMedicalInstitution: vi.fn(),
    deleteMedicalInstitution: vi.fn(),
  },
}));

describe('MedicalInstitutionCard', () => {
  const mockInstitution: MedicalInstitution = {
    id: '1',
    institutionName: 'テスト病院',
    doctorName: 'テスト医師',
    phone: '0123-456-789',
    fax: '0123-456-790',
    address: 'テスト住所',
    notes: 'テスト備考',
  };

  const defaultProps = {
    institution: mockInstitution,
    residentId: 1,
    residentName: 'テスト利用者',
    onInstitutionUpdate: vi.fn(),
    onInstitutionDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders institution information correctly', () => {
    render(<MedicalInstitutionCard {...defaultProps} />);

    expect(screen.getByText('病院名')).toBeInTheDocument();
    expect(screen.getByText('テスト病院')).toBeInTheDocument();
    expect(screen.getByText('テスト医師')).toBeInTheDocument();
    expect(screen.getByText('0123-456-789')).toBeInTheDocument();
    expect(screen.getByText('0123-456-790')).toBeInTheDocument();
    expect(screen.getByText('テスト住所')).toBeInTheDocument();
    expect(screen.getByText('テスト備考')).toBeInTheDocument();
  });

  it('renders edit and delete buttons', () => {
    render(<MedicalInstitutionCard {...defaultProps} />);

    expect(screen.getByText('編集')).toBeInTheDocument();
    expect(screen.getByText('削除')).toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<MedicalInstitutionCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));

    expect(screen.getByTestId('medical-institution-modal')).toBeInTheDocument();
  });

  it('opens delete modal when delete button is clicked', () => {
    render(<MedicalInstitutionCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('closes edit modal when close button is clicked', async () => {
    render(<MedicalInstitutionCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));
    expect(screen.getByTestId('medical-institution-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByTestId('medical-institution-modal')).not.toBeInTheDocument();
    });
  });

  it('closes delete modal when cancel button is clicked', async () => {
    render(<MedicalInstitutionCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
    });
  });

  it('does not render notes section when notes is not provided', () => {
    const institutionWithoutNotes = { ...mockInstitution, notes: undefined };
    render(<MedicalInstitutionCard {...defaultProps} institution={institutionWithoutNotes} />);

    expect(screen.queryByText('備考:')).not.toBeInTheDocument();
  });

  it('renders all required institution fields', () => {
    render(<MedicalInstitutionCard {...defaultProps} />);

    expect(screen.getByText('医師名:')).toBeInTheDocument();
    expect(screen.getByText('電話番号:')).toBeInTheDocument();
    expect(screen.getByText('FAX:')).toBeInTheDocument();
    expect(screen.getByText('住所:')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<MedicalInstitutionCard {...defaultProps} />);

    const card = screen.getByText('病院名').closest('.mb-4');
    expect(card).toBeInTheDocument();
  });

  it('passes correct props to edit modal', () => {
    render(<MedicalInstitutionCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));

    const modal = screen.getByTestId('medical-institution-modal');
    expect(modal).toBeInTheDocument();
  });

  it('passes correct props to delete modal', () => {
    render(<MedicalInstitutionCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));

    const modal = screen.getByTestId('delete-modal');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText('Delete Modal - テスト病院')).toBeInTheDocument();
  });
});
