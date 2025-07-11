import { Logo } from '@/components/1_atoms/common/logo';
import { render, screen } from '@testing-library/react';

describe('Logo', () => {
  it('renders logo with text', () => {
    render(<Logo />);

    expect(screen.getByText('CareBase')).toBeInTheDocument();
  });

  it('renders SVG icon', () => {
    render(<Logo />);

    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-10', 'h-10');
  });

  it('applies correct styling classes', () => {
    render(<Logo />);

    const container = screen.getByText('CareBase').parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'space-x-3', 'justify-center');

    const text = screen.getByText('CareBase');
    expect(text).toHaveClass('text-3xl', 'font-bold', 'logo-font', 'text-gray-800');
  });

  it('renders complete logo structure', () => {
    const { container } = render(<Logo />);

    // Check for SVG paths
    const paths = container.querySelectorAll('path');
    expect(paths).toHaveLength(2);

    // Check for text content
    expect(screen.getByText('CareBase')).toBeInTheDocument();
  });
});
