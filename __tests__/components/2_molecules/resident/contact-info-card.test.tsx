import { ContactInfoCard } from '@/components/2_molecules/resident/contact-info-card';
import type { ContactPerson } from '@/mocks/care-board-data';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Mock the modals
jest.mock('@/components/3_organisms/modals/contact-edit-modal', () => ({
  ContactEditModal: ({ isOpen, onClose, onSubmit }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="contact-edit-modal">
        <div>Contact Edit Modal</div>
        <button onClick={() => onClose()}>Close</button>
        <button onClick={() => onSubmit({ name: 'Updated Contact' })}>Submit</button>
      </div>
    );
  },
}));

jest.mock('@/components/3_organisms/modals/contact-delete-modal', () => ({
  ContactDeleteModal: ({ isOpen, onClose, onConfirm, contactName, isDeleting, error }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="contact-delete-modal">
        <div>Contact Delete Modal - {contactName}</div>
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
jest.mock('@/services/contactService', () => ({
  contactService: {
    updateContact: jest.fn(),
    deleteContact: jest.fn(),
  },
}));

describe('ContactInfoCard', () => {
  const mockContact: ContactPerson = {
    id: '1',
    type: '緊急連絡先',
    name: 'テスト連絡先',
    furigana: 'テストレンラクサキ',
    relationship: '長男',
    phone1: '0123-456-789',
    phone2: '0123-456-790',
    email: 'test@example.com',
    address: 'テスト住所',
    notes: 'テスト備考',
  };

  const defaultProps = {
    contact: mockContact,
    residentId: 1,
    residentName: 'テスト利用者',
    onContactUpdate: jest.fn(),
    onContactDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders contact information correctly', () => {
    render(<ContactInfoCard {...defaultProps} />);

    expect(screen.getByText('緊急連絡先')).toBeInTheDocument();
    expect(screen.getByText('テスト連絡先')).toBeInTheDocument();
    expect(screen.getByText('(テストレンラクサキ)')).toBeInTheDocument();
    expect(screen.getByText('長男')).toBeInTheDocument();
    expect(screen.getByText('0123-456-789')).toBeInTheDocument();
    expect(screen.getByText('0123-456-790')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('テスト住所')).toBeInTheDocument();
    expect(screen.getByText('テスト備考')).toBeInTheDocument();
  });

  it('renders edit and delete buttons', () => {
    render(<ContactInfoCard {...defaultProps} />);

    expect(screen.getByText('編集')).toBeInTheDocument();
    expect(screen.getByText('削除')).toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<ContactInfoCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));

    expect(screen.getByTestId('contact-edit-modal')).toBeInTheDocument();
  });

  it('opens delete modal when delete button is clicked', () => {
    render(<ContactInfoCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));

    expect(screen.getByTestId('contact-delete-modal')).toBeInTheDocument();
  });

  it('closes edit modal when close button is clicked', async () => {
    render(<ContactInfoCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));
    expect(screen.getByTestId('contact-edit-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByTestId('contact-edit-modal')).not.toBeInTheDocument();
    });
  });

  it('closes delete modal when cancel button is clicked', async () => {
    render(<ContactInfoCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));
    expect(screen.getByTestId('contact-delete-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByTestId('contact-delete-modal')).not.toBeInTheDocument();
    });
  });

  it('does not render notes section when notes is not provided', () => {
    const contactWithoutNotes = { ...mockContact, notes: undefined };
    render(<ContactInfoCard {...defaultProps} contact={contactWithoutNotes} />);

    expect(screen.queryByText('備考:')).not.toBeInTheDocument();
  });

  it('does not render phone2 when not provided', () => {
    const contactWithoutPhone2 = { ...mockContact, phone2: undefined };
    render(<ContactInfoCard {...defaultProps} contact={contactWithoutPhone2} />);

    expect(screen.queryByText('電話番号2:')).not.toBeInTheDocument();
  });

  it('does not render email when not provided', () => {
    const contactWithoutEmail = { ...mockContact, email: undefined };
    render(<ContactInfoCard {...defaultProps} contact={contactWithoutEmail} />);

    expect(screen.queryByText('メール:')).not.toBeInTheDocument();
  });

  it('does not render furigana when not provided', () => {
    const contactWithoutFurigana = { ...mockContact, furigana: undefined };
    render(<ContactInfoCard {...defaultProps} contact={contactWithoutFurigana} />);

    expect(screen.queryByText('(テストレンラクサキ)')).not.toBeInTheDocument();
  });

  it('renders all required contact fields', () => {
    render(<ContactInfoCard {...defaultProps} />);

    expect(screen.getByText('続柄:')).toBeInTheDocument();
    expect(screen.getByText('電話番号1:')).toBeInTheDocument();
    expect(screen.getByText('住所:')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<ContactInfoCard {...defaultProps} />);

    const card = screen.getByText('テスト連絡先').closest('.mb-4');
    expect(card).toBeInTheDocument();
  });

  it('passes correct props to edit modal', () => {
    render(<ContactInfoCard {...defaultProps} />);

    fireEvent.click(screen.getByText('編集'));

    const modal = screen.getByTestId('contact-edit-modal');
    expect(modal).toBeInTheDocument();
  });

  it('passes correct props to delete modal', () => {
    render(<ContactInfoCard {...defaultProps} />);

    fireEvent.click(screen.getByText('削除'));

    const modal = screen.getByTestId('contact-delete-modal');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText('Contact Delete Modal - テスト連絡先')).toBeInTheDocument();
  });

  it('applies correct badge color for 緊急連絡先', () => {
    render(<ContactInfoCard {...defaultProps} />);

    const badge = screen.getByText('緊急連絡先');
    expect(badge).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('applies correct badge color for 連絡先', () => {
    const regularContact = { ...mockContact, type: '連絡先' as const };
    render(<ContactInfoCard {...defaultProps} contact={regularContact} />);

    const badge = screen.getByText('連絡先');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('applies correct badge color for その他', () => {
    const otherContact = { ...mockContact, type: 'その他' as const };
    render(<ContactInfoCard {...defaultProps} contact={otherContact} />);

    const badge = screen.getByText('その他');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-700');
  });
});
