import { render, screen } from '@testing-library/react';
import { ContactInfoCard } from '@/components/2_molecules/contact-info-card';
import type { ContactPerson } from '@/mocks/care-board-data';

const mockContact: ContactPerson = {
  id: 'test-1',
  type: '緊急連絡先',
  name: '佐藤誠',
  furigana: 'サトウマコト',
  relationship: '長男',
  phone1: '078-000-0000',
  phone2: '080-0000-0000',
  email: 'test@example.com',
  address: '兵庫県神戸市西区樫野台3-408-14',
  notes: 'テスト備考',
};

describe('ContactInfoCard', () => {
  it('renders contact information correctly', () => {
    render(<ContactInfoCard contact={mockContact} />);

    expect(screen.getByText('緊急連絡先')).toBeInTheDocument();
    expect(screen.getByText('佐藤誠')).toBeInTheDocument();
    expect(screen.getByText('(サトウマコト)')).toBeInTheDocument();
    expect(screen.getByText('長男')).toBeInTheDocument();
    expect(screen.getByText('078-000-0000')).toBeInTheDocument();
    expect(screen.getByText('080-0000-0000')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('兵庫県神戸市西区樫野台3-408-14')).toBeInTheDocument();
    expect(screen.getByText('テスト備考')).toBeInTheDocument();
  });

  it('applies correct styling for emergency contact', () => {
    render(<ContactInfoCard contact={mockContact} />);

    const typeSpan = screen.getByText('緊急連絡先');
    expect(typeSpan).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('applies correct styling for regular contact', () => {
    const regularContact = { ...mockContact, type: '連絡先' as const };
    render(<ContactInfoCard contact={regularContact} />);

    const typeSpan = screen.getByText('連絡先');
    expect(typeSpan).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('renders edit button', () => {
    render(<ContactInfoCard contact={mockContact} />);

    expect(screen.getByRole('button', { name: /編集する/i })).toBeInTheDocument();
  });

  it('handles optional fields correctly', () => {
    const minimalContact: ContactPerson = {
      id: 'test-2',
      type: '連絡先',
      name: '田中花子',
      relationship: '次女',
      phone1: '090-0000-0000',
      address: '東京都渋谷区',
    };

    render(<ContactInfoCard contact={minimalContact} />);

    expect(screen.getByText('田中花子')).toBeInTheDocument();
    expect(screen.getByText('090-0000-0000')).toBeInTheDocument();
    expect(screen.queryByText('電話番号2:')).not.toBeInTheDocument();
    expect(screen.queryByText('メール:')).not.toBeInTheDocument();
    expect(screen.queryByText('備考:')).not.toBeInTheDocument();
  });
});
