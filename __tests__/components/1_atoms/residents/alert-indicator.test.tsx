import { AlertIndicator } from '@/components/1_atoms/residents/alert-indicator';
import { render, screen } from '@testing-library/react';

describe('AlertIndicator', () => {
  it('renders high level alert correctly', () => {
    render(<AlertIndicator level="high" count={3} />);

    expect(screen.getByText('緊急')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    const badge = screen.getByText('緊急').closest('[class*="bg-red-100"]');
    expect(badge).toHaveClass('bg-red-100', 'text-red-700', 'border-red-200');
  });

  it('renders medium level alert correctly', () => {
    render(<AlertIndicator level="medium" count={5} />);

    expect(screen.getByText('注意')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    const badge = screen.getByText('注意').closest('[class*="bg-orange-100"]');
    expect(badge).toHaveClass('bg-orange-100', 'text-orange-700', 'border-orange-200');
  });

  it('renders low level alert correctly', () => {
    render(<AlertIndicator level="low" count={1} />);

    expect(screen.getByText('情報')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    const badge = screen.getByText('情報').closest('[class*="bg-blue-100"]');
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-700', 'border-blue-200');
  });

  it('does not render when count is 0', () => {
    const { container } = render(<AlertIndicator level="high" count={0} />);

    expect(container.firstChild).toBeNull();
  });

  it('applies custom className', () => {
    render(<AlertIndicator level="high" count={2} className="custom-class" />);

    const badge = screen.getByText('緊急').closest('[class*="custom-class"]');
    expect(badge).toHaveClass('custom-class');
  });

  it('renders with large count', () => {
    render(<AlertIndicator level="medium" count={99} />);

    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('renders with single digit count', () => {
    render(<AlertIndicator level="low" count={1} />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('includes icon for each alert level', () => {
    const { container: highContainer } = render(<AlertIndicator level="high" count={1} />);
    expect(highContainer.querySelector('svg')).toBeInTheDocument();

    const { container: mediumContainer } = render(<AlertIndicator level="medium" count={1} />);
    expect(mediumContainer.querySelector('svg')).toBeInTheDocument();

    const { container: lowContainer } = render(<AlertIndicator level="low" count={1} />);
    expect(lowContainer.querySelector('svg')).toBeInTheDocument();
  });

  it('applies correct badge variant', () => {
    render(<AlertIndicator level="high" count={1} />);

    const badge = screen.getByText('緊急').closest('[class*="border"]');
    expect(badge).toHaveClass('border-red-200');
  });

  it('renders with flex layout classes', () => {
    render(<AlertIndicator level="high" count={1} />);

    const badge = screen.getByText('緊急').closest('[class*="flex"]');
    expect(badge).toHaveClass('flex', 'items-center', 'gap-1');
  });

  it('applies correct text sizes', () => {
    render(<AlertIndicator level="high" count={1} />);

    const label = screen.getByText('緊急');
    const count = screen.getByText('1');

    expect(label).toHaveClass('text-xs', 'font-medium');
    expect(count).toHaveClass('text-xs', 'font-bold');
  });
});
