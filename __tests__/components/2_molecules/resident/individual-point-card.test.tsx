import { IndividualPointCard } from '@/components/2_molecules/resident/individual-point-card';
import type { IndividualPoint } from '@/mocks/care-board-data';
import { render, screen } from '@testing-library/react';

// Mock the lucide icon registry
jest.mock('@/lib/lucide-icon-registry', () => ({
  getLucideIcon: jest.fn(() => {
    return function MockIcon({ className }: { className?: string }) {
      return (
        <div data-testid="mock-icon" className={className}>
          Icon
        </div>
      );
    };
  }),
}));

describe('IndividualPointCard', () => {
  const mockPoint: IndividualPoint = {
    id: '1',
    category: 'テストカテゴリ',
    icon: 'Home',
    count: 5,
    isActive: true,
  };

  it('renders correctly with active state', () => {
    render(<IndividualPointCard point={mockPoint} />);

    expect(screen.getByText('テストカテゴリ')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders correctly with inactive state', () => {
    const inactivePoint = { ...mockPoint, isActive: false };
    render(<IndividualPointCard point={inactivePoint} />);

    expect(screen.getByText('テストカテゴリ')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not show badge when count is 0', () => {
    const zeroCountPoint = { ...mockPoint, count: 0 };
    render(<IndividualPointCard point={zeroCountPoint} />);

    expect(screen.getByText('テストカテゴリ')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes for active state', () => {
    render(<IndividualPointCard point={mockPoint} />);

    const card = screen.getByText('テストカテゴリ').closest('div');
    expect(card).toHaveClass('bg-carebase-blue', 'text-white');
  });

  it('applies correct CSS classes for inactive state', () => {
    const inactivePoint = { ...mockPoint, isActive: false };
    render(<IndividualPointCard point={inactivePoint} />);

    const card = screen.getByText('テストカテゴリ').closest('div');
    expect(card).toHaveClass('bg-gray-200', 'text-gray-500');
  });

  it('renders badge with correct styling when count is greater than 0', () => {
    render(<IndividualPointCard point={mockPoint} />);

    const badge = screen.getByText('5');
    expect(badge).toHaveClass('absolute', '-top-2', '-right-2', 'h-6', 'w-6', 'rounded-full');
  });
});
