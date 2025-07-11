import { InputField } from '@/components/1_atoms/auth/InputField';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

describe('InputField', () => {
  it('renders input field with label', () => {
    render(<InputField label="Test Label" />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders input field without label', () => {
    render(<InputField />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows required indicator when isRequired is true', () => {
    render(<InputField label="Test Label" isRequired />);

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-red-500');
  });

  it('shows error message when error prop is provided', () => {
    render(<InputField label="Test Label" error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-red-600');
    expect(screen.getByText('This field is required')).toHaveAttribute('role', 'alert');
  });

  it('applies error variant styles when variant is error', () => {
    render(<InputField label="Test Label" variant="error" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-300', 'focus:ring-red-500', 'focus:border-red-500');
  });

  it('applies success variant styles when variant is success', () => {
    render(<InputField label="Test Label" variant="success" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-green-300', 'focus:ring-green-500', 'focus:border-green-500');
  });

  it('applies default variant styles when variant is default', () => {
    render(<InputField label="Test Label" variant="default" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'border-gray-300',
      'focus:ring-carebase-blue',
      'focus:border-carebase-blue'
    );
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<InputField ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('handles user input', () => {
    render(<InputField label="Test Label" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(input.value).toBe('test value');
  });

  it('forwards additional props', () => {
    render(
      <InputField
        label="Test Label"
        placeholder="Enter text"
        data-testid="test-input"
        aria-label="Test input"
      />
    );

    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('aria-label', 'Test input');
  });

  it('handles disabled state', () => {
    render(<InputField label="Test Label" disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass(
      'disabled:bg-gray-50',
      'disabled:text-gray-500',
      'disabled:cursor-not-allowed'
    );
  });

  it('generates unique id when not provided', () => {
    const { rerender } = render(<InputField label="Test Label 1" />);
    const firstInput = screen.getByLabelText('Test Label 1');
    const firstId = firstInput.id;

    rerender(<InputField label="Test Label 2" />);
    const secondInput = screen.getByLabelText('Test Label 2');
    const secondId = secondInput.id;

    expect(firstId).not.toBe(secondId);
  });

  it('uses provided id when available', () => {
    render(<InputField label="Test Label" id="custom-id" />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('id', 'custom-id');
  });
});
