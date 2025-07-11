import { SelectionStep } from '@/components/1_atoms/staff/selection-step';
import { render, screen } from '@testing-library/react';

describe('SelectionStep', () => {
  it('renders step with number when not completed', () => {
    render(
      <SelectionStep
        stepNumber={1}
        title="Step 1"
        description="Step description"
        isActive={false}
        isCompleted={false}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step description')).toBeInTheDocument();
  });

  it('renders check icon when completed', () => {
    render(<SelectionStep stepNumber={1} title="Step 1" isActive={false} isCompleted={true} />);

    const checkIcon = screen.getByTestId('check-icon');
    expect(checkIcon).toBeInTheDocument();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('applies active styles when isActive is true', () => {
    render(<SelectionStep stepNumber={1} title="Step 1" isActive={true} isCompleted={false} />);

    const stepNumber = screen.getByText('1');
    const title = screen.getByText('Step 1');

    expect(stepNumber).toHaveClass('bg-carebase-blue', 'text-white');
    expect(title).toHaveClass('text-carebase-text-primary');
  });

  it('applies completed styles when isCompleted is true', () => {
    render(<SelectionStep stepNumber={1} title="Step 1" isActive={false} isCompleted={true} />);

    const stepContainer = document.querySelector('[class*="bg-green-500"]');
    expect(stepContainer).toHaveClass('bg-green-500', 'text-white');
  });

  it('applies inactive styles when neither active nor completed', () => {
    render(<SelectionStep stepNumber={1} title="Step 1" isActive={false} isCompleted={false} />);

    const stepNumber = screen.getByText('1');
    const title = screen.getByText('Step 1');

    expect(stepNumber).toHaveClass('bg-gray-200', 'text-gray-500');
    expect(title).toHaveClass('text-gray-500');
  });

  it('shows chevron icon when not completed', () => {
    render(<SelectionStep stepNumber={1} title="Step 1" isActive={false} isCompleted={false} />);

    const chevronIcon = screen.getByTestId('chevron-icon');
    expect(chevronIcon).toBeInTheDocument();
  });

  it('hides chevron icon when completed', () => {
    render(<SelectionStep stepNumber={1} title="Step 1" isActive={false} isCompleted={true} />);

    expect(screen.queryByTestId('chevron-icon')).not.toBeInTheDocument();
  });

  it('applies active chevron color when isActive is true', () => {
    render(<SelectionStep stepNumber={1} title="Step 1" isActive={true} isCompleted={false} />);

    const chevronIcon = screen.getByTestId('chevron-icon');
    expect(chevronIcon).toHaveClass('text-carebase-blue');
  });

  it('applies inactive chevron color when isActive is false', () => {
    render(<SelectionStep stepNumber={1} title="Step 1" isActive={false} isCompleted={false} />);

    const chevronIcon = screen.getByTestId('chevron-icon');
    expect(chevronIcon).toHaveClass('text-gray-300');
  });

  it('renders without description when not provided', () => {
    render(<SelectionStep stepNumber={1} title="Step 1" isActive={false} isCompleted={false} />);

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.queryByText('Step description')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <SelectionStep
        stepNumber={1}
        title="Step 1"
        isActive={false}
        isCompleted={false}
        className="custom-class"
      />
    );

    const container = screen.getByText('1').closest('[class*="custom-class"]');
    expect(container).toHaveClass('custom-class');
  });

  it('renders with different step numbers', () => {
    const { rerender } = render(
      <SelectionStep stepNumber={1} title="Step 1" isActive={false} isCompleted={false} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();

    rerender(<SelectionStep stepNumber={2} title="Step 2" isActive={false} isCompleted={false} />);
    expect(screen.getByText('2')).toBeInTheDocument();

    rerender(<SelectionStep stepNumber={3} title="Step 3" isActive={false} isCompleted={false} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('applies correct layout classes', () => {
    render(<SelectionStep stepNumber={1} title="Step 1" isActive={false} isCompleted={false} />);

    // 最上位のdiv要素を取得（stepNumberの親の親）
    const container = screen.getByText('1').closest('.flex.items-center.gap-3');
    expect(container).toHaveClass('flex', 'items-center', 'gap-3');
  });
});
