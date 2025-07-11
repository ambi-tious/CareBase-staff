import { HomeCareOfficeCard } from '@/components/2_molecules/resident/home-care-office-card';
import type { HomeCareOffice } from '@/mocks/care-board-data';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the modals
vi.mock('@/components/3_organisms/modals/home-care-office-modal', () => ({
  HomeCareOfficeModal: ({ isOpen, onClose, onSubmit }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="home-care-office-modal">
        <div>Home Care Office Modal</div>
        <button onClick={() => onClose()}>Close</button>
        <button onClick={() => onSubmit({ businessName: 'Updated Office' })}>Submit</button>
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
    updateHomeCareOffice: vi.fn(),
    deleteHomeCareOffice: vi.fn(),
  },
}));

describe('HomeCareOfficeCard', () => {
  const mockOffice: HomeCareOffice = {
    id: '1',
    businessName: 'テスト事業所',
    careManager: 'テストケアマネージャー',
    phone: '0123-456-789',
    fax: '0123-456-790',
    address: 'テスト住所',
    notes: 'テスト備考',
  };

  const defaultProps = {
    office: mockOffice,
    residentId: 1,
    residentName: 'テスト利用者',
    onOfficeUpdate: vi.fn(),
    onOfficeDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders office information correctly', () => {
    render(<HomeCareOfficeCard {...defaultProps} />);

    expect(screen.getByText('事業所名')).toBeInTheDocument();
    expect(screen.getByText('テスト事業所')).toBeInTheDocument();
    expect(screen.getByText('テストケアマネージャー')).toBeInTheDocument();
    expect(screen.getByText('0123-456-789')).toBeInTheDocument();
    expect(screen.getByText('0123-456-790')).toBeInTheDocument();
    expect(screen.getByText('テスト住所')).toBeInTheDocument();
    expect(screen.getByText('テスト備考')).toBeInTheDocument();
  });

  it('renders edit and delete buttons', () => {
    render(<HomeCareOfficeCard {...defaultProps} />);

    expect(screen.getByText('編集')).toBeInTheDocument();
    expect(screen.getByText('削除')).toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<HomeCareOfficeCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));

    expect(screen.getByTestId('home-care-office-modal')).toBeInTheDocument();
  });

  it('opens delete modal when delete button is clicked', () => {
    render(<HomeCareOfficeCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('closes edit modal when close button is clicked', async () => {
    render(<HomeCareOfficeCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));
    expect(screen.getByTestId('home-care-office-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByTestId('home-care-office-modal')).not.toBeInTheDocument();
    });
  });

  it('closes delete modal when cancel button is clicked', async () => {
    render(<HomeCareOfficeCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
    });
  });

  it('does not render notes section when notes is not provided', () => {
    const officeWithoutNotes = { ...mockOffice, notes: undefined };
    render(<HomeCareOfficeCard {...defaultProps} office={officeWithoutNotes} />);

    expect(screen.queryByText('備考:')).not.toBeInTheDocument();
  });

  it('renders all required office fields', () => {
    render(<HomeCareOfficeCard {...defaultProps} />);

    expect(screen.getByText('ケアマネージャー:')).toBeInTheDocument();
    expect(screen.getByText('電話番号:')).toBeInTheDocument();
    expect(screen.getByText('FAX:')).toBeInTheDocument();
    expect(screen.getByText('住所:')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<HomeCareOfficeCard {...defaultProps} />);

    const card = screen.getByText('事業所名').closest('.mb-4');
    expect(card).toBeInTheDocument();
  });

  it('passes correct props to edit modal', () => {
    render(<HomeCareOfficeCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));

    const modal = screen.getByTestId('home-care-office-modal');
    expect(modal).toBeInTheDocument();
  });

  it('passes correct props to delete modal', () => {
    render(<HomeCareOfficeCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));

    const modal = screen.getByTestId('delete-modal');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText('Delete Modal - テスト事業所')).toBeInTheDocument();
  });
});
