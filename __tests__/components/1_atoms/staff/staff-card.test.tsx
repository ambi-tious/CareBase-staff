import { StaffCard } from '@/components/1_atoms/staff/staff-card';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

describe('StaffCard', () => {
  const mockStaff = {
    id: 'staff-001',
    name: '田中 花子',
    furigana: 'タナカ ハナコ',
    role: '介護職員',
    employeeId: 'EMP001',
    avatar: undefined,
    isActive: true,
  };

  it('renders staff information correctly', () => {
    render(<StaffCard staff={mockStaff} />);

    expect(screen.getByText('田中 花子')).toBeInTheDocument();
    expect(screen.getByText('タナカ ハナコ')).toBeInTheDocument();
    expect(screen.getByText('介護職員')).toBeInTheDocument();
    expect(screen.getByText('ID: EMP001')).toBeInTheDocument();
  });

  it('shows default user icon when no avatar is provided', () => {
    render(<StaffCard staff={mockStaff} />);

    const userIcon = document.querySelector('svg');
    expect(userIcon).toBeInTheDocument();
    expect(userIcon).toHaveClass('w-6', 'h-6', 'text-gray-500');
  });

  it('shows avatar image when provided', () => {
    const staffWithAvatar = { ...mockStaff, avatar: '/test-avatar.jpg' };
    render(<StaffCard staff={staffWithAvatar} />);

    const avatar = screen.getByAltText('田中 花子');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/test-avatar.jpg');
  });

  it('applies selected styles when isSelected is true', () => {
    render(<StaffCard staff={mockStaff} isSelected />);

    const card = screen.getByText('田中 花子').closest('[class*="ring-2"]');
    expect(card).toHaveClass('ring-2', 'ring-carebase-blue', 'bg-carebase-blue', 'text-white');
  });

  it('applies hover styles when not selected', () => {
    render(<StaffCard staff={mockStaff} />);

    const card = screen.getByText('田中 花子').closest('[class*="hover:shadow-md"]');
    expect(card).toHaveClass('hover:shadow-md', 'hover:ring-1', 'hover:ring-carebase-blue-light');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<StaffCard staff={mockStaff} onClick={handleClick} />);

    const card = screen.getByText('田中 花子').closest('[class*="cursor-pointer"]');
    fireEvent.click(card!);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when not provided', () => {
    render(<StaffCard staff={mockStaff} />);

    const card = screen.getByText('田中 花子').closest('[class*="cursor-pointer"]');
    fireEvent.click(card!);

    // Should not throw an error
    expect(card).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<StaffCard staff={mockStaff} className="custom-class" />);

    const card = screen.getByText('田中 花子').closest('[class*="custom-class"]');
    expect(card).toHaveClass('custom-class');
  });

  it('applies correct role badge colors for different roles', () => {
    const roles = [
      { role: '施設長', expectedClass: 'bg-purple-100' },
      { role: '主任介護職員', expectedClass: 'bg-blue-100' },
      { role: '看護師', expectedClass: 'bg-green-100' },
      { role: '介護職員', expectedClass: 'bg-orange-100' },
      { role: '事務職員', expectedClass: 'bg-gray-100' },
    ];

    roles.forEach(({ role, expectedClass }) => {
      const { container } = render(<StaffCard staff={{ ...mockStaff, role }} />);
      const badge = container.querySelector(`[class*="${expectedClass}"]`);
      expect(badge).toBeInTheDocument();
    });
  });

  it('applies selected role badge colors when isSelected is true', () => {
    const { container } = render(<StaffCard staff={mockStaff} isSelected />);
    const badge = container.querySelector('[class*="bg-orange-200"]');
    expect(badge).toBeInTheDocument();
  });

  it('applies default role badge color for unknown role', () => {
    const { container } = render(<StaffCard staff={{ ...mockStaff, role: 'Unknown Role' }} />);
    const badge = container.querySelector('[class*="bg-gray-100"]');
    expect(badge).toBeInTheDocument();
  });

  it('applies correct text colors when selected', () => {
    render(<StaffCard staff={mockStaff} isSelected />);

    const name = screen.getByText('田中 花子');
    const furigana = screen.getByText('タナカ ハナコ');
    const employeeId = screen.getByText('ID: EMP001');

    expect(name).toHaveClass('text-white');
    expect(furigana).toHaveClass('text-blue-100');
    expect(employeeId).toHaveClass('text-blue-200');
  });

  it('applies correct text colors when not selected', () => {
    render(<StaffCard staff={mockStaff} />);

    const name = screen.getByText('田中 花子');
    const furigana = screen.getByText('タナカ ハナコ');
    const employeeId = screen.getByText('ID: EMP001');

    expect(name).toHaveClass('text-carebase-text-primary');
    expect(furigana).toHaveClass('text-gray-500');
    expect(employeeId).toHaveClass('text-gray-400');
  });
});
