import { FormField } from '@/components/1_atoms/forms/form-field';
import { fireEvent, render, screen } from '@testing-library/react';

describe('FormField', () => {
  const defaultProps = {
    label: 'Test Label',
    id: 'test-field',
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<FormField {...defaultProps} />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with custom type', () => {
    render(<FormField {...defaultProps} type="email" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('shows required indicator when required is true', () => {
    render(<FormField {...defaultProps} required />);

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-red-500');
  });

  it('shows error message when error prop is provided', () => {
    render(<FormField {...defaultProps} error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-red-600');
    expect(screen.getByText('This field is required')).toHaveAttribute('role', 'alert');
  });

  it('applies error styles to input when error is present', () => {
    render(<FormField {...defaultProps} error="Error message" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-300', 'focus:border-red-500', 'focus:ring-red-500');
  });

  it('handles user input', () => {
    render(<FormField {...defaultProps} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(defaultProps.onChange).toHaveBeenCalledWith('test value');
  });

  it('displays placeholder text', () => {
    render(<FormField {...defaultProps} placeholder="Enter text here" />);

    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<FormField {...defaultProps} disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<FormField {...defaultProps} className="custom-class" />);

    // containerはラベルの親ではなく、最上位div
    const container = screen.getByLabelText('Test Label').closest('.space-y-2');
    expect(container).toHaveClass('custom-class');
  });

  it('displays current value', () => {
    render(<FormField {...defaultProps} value="current value" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('current value');
  });

  it('associates label with input correctly', () => {
    render(<FormField {...defaultProps} />);

    const label = screen.getByText('Test Label');
    const input = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'test-field');
    expect(input).toHaveAttribute('id', 'test-field');
  });

  it('renders with different input types', () => {
    const { rerender } = render(<FormField {...defaultProps} type="password" />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');

    rerender(<FormField {...defaultProps} type="number" />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');

    rerender(<FormField {...defaultProps} type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('calls onChange with correct value on input change', () => {
    render(<FormField {...defaultProps} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(defaultProps.onChange).toHaveBeenCalledWith('new value');
  });
});
