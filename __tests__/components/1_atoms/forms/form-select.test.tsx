import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { fireEvent, render, screen } from '@testing-library/react';

describe('FormSelect', () => {
  const defaultProps = {
    label: 'Test Select',
    id: 'test-select',
    value: '',
    onChange: vi.fn(),
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<FormSelect {...defaultProps} />);

    expect(screen.getByText('Test Select')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows required indicator when required is true', () => {
    render(<FormSelect {...defaultProps} required />);

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-red-500');
  });

  it('shows error message when error prop is provided', () => {
    render(<FormSelect {...defaultProps} error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-red-600');
    expect(screen.getByText('This field is required')).toHaveAttribute('role', 'alert');
  });

  it('applies error styles to select when error is present', () => {
    render(<FormSelect {...defaultProps} error="Error message" />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-300', 'focus:border-red-500', 'focus:ring-red-500');
  });

  it('displays placeholder text', () => {
    render(<FormSelect {...defaultProps} placeholder="Custom placeholder" />);

    expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
  });

  it('displays default placeholder when not provided', () => {
    render(<FormSelect {...defaultProps} />);

    expect(screen.getByText('選択してください')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<FormSelect {...defaultProps} disabled />);

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<FormSelect {...defaultProps} className="custom-class" />);

    const container = screen.getByText('Test Select').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('displays selected value', () => {
    render(<FormSelect {...defaultProps} value="option2" />);

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('associates label with select correctly', () => {
    render(<FormSelect {...defaultProps} />);

    const label = screen.getByText('Test Select');
    expect(label).toHaveAttribute('for', 'test-select');
  });

  it('opens select dropdown when clicked', () => {
    render(<FormSelect {...defaultProps} />);

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    // Check that options are rendered
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls onChange when option is selected', () => {
    render(<FormSelect {...defaultProps} />);

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    const option = screen.getByText('Option 2');
    fireEvent.click(option);

    expect(defaultProps.onChange).toHaveBeenCalledWith('option2');
  });

  it('renders all provided options', () => {
    render(<FormSelect {...defaultProps} />);

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    defaultProps.options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('handles empty options array', () => {
    render(<FormSelect {...defaultProps} options={[]} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    fireEvent.click(select);

    // listboxが表示されるが、optionが存在しないことを確認
    const listbox = screen.queryByRole('listbox');
    if (listbox) {
      expect(listbox.childElementCount).toBeGreaterThanOrEqual(1); // viewport等が含まれる
      // optionが存在しない
      expect(listbox.querySelectorAll('[role="option"]').length).toBe(0);
    }
  });
});
