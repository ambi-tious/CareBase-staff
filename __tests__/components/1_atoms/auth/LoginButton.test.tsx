import { LoginButton } from '@/components/1_atoms/auth/LoginButton';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

describe('LoginButton', () => {
  it('renders with default props', () => {
    render(<LoginButton />);

    const button = screen.getByRole('button', { name: 'ログイン' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders with custom children', () => {
    render(<LoginButton>Custom Text</LoginButton>);

    expect(screen.getByRole('button', { name: 'Custom Text' })).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<LoginButton isLoading />);

    const button = screen.getByRole('button', { name: 'ログイン中...' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Check for loading spinner
    const spinner = button.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows custom loading text', () => {
    render(<LoginButton isLoading loadingText="Processing..." />);

    expect(screen.getByRole('button', { name: 'Processing...' })).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<LoginButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-carebase-blue', 'text-white', 'hover:bg-carebase-blue-dark');
  });

  it('applies outline variant styles', () => {
    render(<LoginButton variant="outline" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('border', 'border-carebase-blue', 'text-carebase-blue', 'bg-white');
  });

  it('applies ghost variant styles', () => {
    render(<LoginButton variant="ghost" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-carebase-blue', 'bg-transparent', 'hover:bg-carebase-blue/10');
  });

  it('applies small size styles', () => {
    render(<LoginButton size="sm" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-8', 'px-3', 'text-sm');
  });

  it('applies large size styles', () => {
    render(<LoginButton size="lg" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-12', 'px-6', 'text-lg');
  });

  it('applies medium size styles by default', () => {
    render(<LoginButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10', 'px-4', 'text-base');
  });

  it('applies full width when fullWidth is true', () => {
    render(<LoginButton fullWidth />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('does not apply full width when fullWidth is false', () => {
    render(<LoginButton fullWidth={false} />);

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('w-full');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<LoginButton ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<LoginButton onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<LoginButton disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('is disabled when loading', () => {
    render(<LoginButton isLoading />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('forwards additional props', () => {
    render(
      <LoginButton data-testid="test-button" aria-label="Test button" className="custom-class" />
    );

    const button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('aria-label', 'Test button');
    expect(button).toHaveClass('custom-class');
  });

  it('applies focus styles', () => {
    render(<LoginButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-carebase-blue',
      'focus:ring-offset-2'
    );
  });

  it('applies disabled styles', () => {
    render(<LoginButton disabled />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });
});
