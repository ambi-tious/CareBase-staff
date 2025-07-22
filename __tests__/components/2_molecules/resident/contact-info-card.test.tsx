import { ContactCard } from '@/components/2_molecules/resident/contact-info-card';
import type { ContactPerson } from '@/mocks/care-board-data';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the modals
vi.mock('@/components/3_organisms/modals/contact-edit-modal', () => ({
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

vi.mock('@/components/3_organisms/modals/generic-delete-modal', () => ({
  GenericDeleteModal: ({ isOpen, onClose, onConfirm, itemName, isDeleting, error }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="generic-delete-modal">
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
vi.mock('@/services/contactService', () => ({
  contactService: {
    updateContact: vi.fn(),
    deleteContact: vi.fn(),
  },
}));

describe('ContactCard', () => {
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
    onUpdate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders contact information correctly', () => {
    render(<ContactCard {...defaultProps} />);

    expect(screen.getByText('緊急連絡先')).toBeInTheDocument();
    expect(screen.getByText('テスト連絡先')).toBeInTheDocument();
    expect(screen.getByText('テストレンラクサキ')).toBeInTheDocument();
    expect(screen.getByText('長男')).toBeInTheDocument();
    expect(screen.getByText('0123-456-789')).toBeInTheDocument();
    expect(screen.getByText('0123-456-790')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('テスト住所')).toBeInTheDocument();
    expect(screen.getByText('テスト備考')).toBeInTheDocument();
  });

  it('renders edit and delete buttons', () => {
    render(<ContactCard {...defaultProps} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    const deleteButton = screen.getByRole('button', { name: /trash/i });
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<ContactCard {...defaultProps} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(screen.getByTestId('contact-edit-modal')).toBeInTheDocument();
  });

  it('opens delete modal when delete button is clicked', () => {
    render(<ContactCard {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /trash/i });
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('generic-delete-modal')).toBeInTheDocument();
  });

  it('closes edit modal when close button is clicked', async () => {
    render(<ContactCard {...defaultProps} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    expect(screen.getByTestId('contact-edit-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByTestId('contact-edit-modal')).not.toBeInTheDocument();
    });
  });

  it('closes delete modal when cancel button is clicked', async () => {
    render(<ContactCard {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /trash/i });
    fireEvent.click(deleteButton);
    expect(screen.getByTestId('generic-delete-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByTestId('generic-delete-modal')).not.toBeInTheDocument();
    });
  });

  it('does not render notes section when notes is not provided', () => {
    const contactWithoutNotes = { ...mockContact, notes: undefined };
    render(<ContactCard {...defaultProps} contact={contactWithoutNotes} />);

    expect(screen.queryByText('備考:')).not.toBeInTheDocument();
  });

  it('does not render phone2 when not provided', () => {
    const contactWithoutPhone2 = { ...mockContact, phone2: undefined };
    render(<ContactCard {...defaultProps} contact={contactWithoutPhone2} />);

    expect(screen.queryByText('電話2:')).not.toBeInTheDocument();
  });

  it('does not render email when not provided', () => {
    const contactWithoutEmail = { ...mockContact, email: undefined };
    render(<ContactCard {...defaultProps} contact={contactWithoutEmail} />);

    expect(screen.queryByText('メール:')).not.toBeInTheDocument();
  });

  it('does not render furigana when not provided', () => {
    const contactWithoutFurigana = { ...mockContact, furigana: undefined };
    render(<ContactCard {...defaultProps} contact={contactWithoutFurigana} />);

    expect(screen.queryByText('テストレンラクサキ')).not.toBeInTheDocument();
  });

  it('renders all required contact fields', () => {
    render(<ContactCard {...defaultProps} />);

    expect(screen.getByText('続柄:')).toBeInTheDocument();
    expect(screen.getByText('電話:')).toBeInTheDocument();
    expect(screen.getByText('住所:')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<ContactCard {...defaultProps} />);

    const card = screen.getByText('テスト連絡先').closest('[class*="shadow"]');
    expect(card).toBeInTheDocument();
  });

  it('passes correct props to edit modal', () => {
    render(<ContactCard {...defaultProps} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    const modal = screen.getByTestId('contact-edit-modal');
    expect(modal).toBeInTheDocument();
  });

  it('passes correct props to delete modal', () => {
    render(<ContactCard {...defaultProps} />);

    const deleteButton = screen.getByRole('button', { name: /trash/i });
    fireEvent.click(deleteButton);

    const modal = screen.getByTestId('generic-delete-modal');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText('Delete Modal - テスト連絡先')).toBeInTheDocument();
  });

  it('applies correct badge color for 緊急連絡先', () => {
    render(<ContactCard {...defaultProps} />);

    const badge = screen.getByText('緊急連絡先');
    expect(badge).toHaveClass('text-red-800');
  });

  it('applies correct badge color for 連絡先', () => {
    const regularContact = { ...mockContact, type: '連絡先' as const };
    render(<ContactCard {...defaultProps} contact={regularContact} />);

    const badge = screen.getByText('連絡先');
    expect(badge).toHaveClass('text-blue-800');
  });

  it('applies correct badge color for その他', () => {
    const otherContact = { ...mockContact, type: 'その他' as const };
    render(<ContactCard {...defaultProps} contact={otherContact} />);

    const badge = screen.getByText('その他');
    expect(badge).toHaveClass('text-gray-800');
  });
});
