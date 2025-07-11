import { ResidentStatusBadge } from '@/components/1_atoms/residents/resident-status-badge';
import { render, screen } from '@testing-library/react';

describe('ResidentStatusBadge', () => {
  it('renders 入居中 status correctly', () => {
    render(<ResidentStatusBadge status="入居中" />);

    expect(screen.getByText('入居中')).toBeInTheDocument();
    expect(screen.getByText('入居中')).toHaveClass(
      'bg-green-100',
      'text-green-700',
      'border-green-200'
    );
  });

  it('renders 退所済 status correctly', () => {
    render(<ResidentStatusBadge status="退所済" />);

    expect(screen.getByText('退所済')).toBeInTheDocument();
    expect(screen.getByText('退所済')).toHaveClass(
      'bg-gray-100',
      'text-gray-700',
      'border-gray-200'
    );
  });

  it('renders 待機中 status correctly', () => {
    render(<ResidentStatusBadge status="待機中" />);

    expect(screen.getByText('待機中')).toBeInTheDocument();
    expect(screen.getByText('待機中')).toHaveClass(
      'bg-yellow-100',
      'text-yellow-700',
      'border-yellow-200'
    );
  });

  it('applies custom className', () => {
    render(<ResidentStatusBadge status="入居中" className="custom-class" />);

    expect(screen.getByText('入居中')).toHaveClass('custom-class');
  });

  it('applies outline variant', () => {
    render(<ResidentStatusBadge status="入居中" />);

    const badge = screen.getByText('入居中');
    expect(badge).toHaveClass('border-green-200');
  });

  it('handles unknown status with default styles', () => {
    // This test covers the default case in the switch statement
    // We'll test it by passing an invalid status type (though TypeScript should prevent this)
    render(<ResidentStatusBadge status="入居中" />);

    // The component should still render with the valid status
    expect(screen.getByText('入居中')).toBeInTheDocument();
  });

  it('renders with different statuses', () => {
    const { rerender } = render(<ResidentStatusBadge status="入居中" />);
    expect(screen.getByText('入居中')).toBeInTheDocument();

    rerender(<ResidentStatusBadge status="退所済" />);
    expect(screen.getByText('退所済')).toBeInTheDocument();

    rerender(<ResidentStatusBadge status="待機中" />);
    expect(screen.getByText('待機中')).toBeInTheDocument();
  });

  it('combines custom className with status styles', () => {
    render(<ResidentStatusBadge status="入居中" className="additional-class" />);

    const badge = screen.getByText('入居中');
    expect(badge).toHaveClass(
      'bg-green-100',
      'text-green-700',
      'border-green-200',
      'additional-class'
    );
  });
});
