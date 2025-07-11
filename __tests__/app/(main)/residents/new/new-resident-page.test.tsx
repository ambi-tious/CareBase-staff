import NewResidentPage from '@/app/(main)/residents/new/page';
import { useResidentForm } from '@/hooks/useResidentForm';
import { residentService } from '@/services/residentService';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock the ResidentBasicInfoForm component
vi.mock('@/components/2_molecules/forms/resident-basic-info-form', () => ({
  ResidentBasicInfoForm: ({ data, onChange, errors, disabled }: any) => (
    <div data-testid="resident-basic-info-form">
      <div data-testid="form-data">{JSON.stringify(data)}</div>
      <div data-testid="form-errors">{JSON.stringify(errors)}</div>
      <div data-testid="form-disabled">{disabled ? 'true' : 'false'}</div>
      <button onClick={() => onChange({ name: '田中太郎' })} data-testid="change-form">
        Change Form
      </button>
    </div>
  ),
}));

// Mock the useResidentForm hook
vi.mock('@/hooks/useResidentForm', () => ({
  useResidentForm: vi.fn(),
}));

// Mock the residentService
vi.mock('@/services/residentService', () => ({
  residentService: {
    createResident: vi.fn(),
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
  Save: () => <div data-testid="save-icon">Save</div>,
  UserPlus: () => <div data-testid="user-plus-icon">UserPlus</div>,
}));

describe('NewResidentPage', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });

    // Mock useResidentForm hook
    (useResidentForm as any).mockReturnValue({
      formData: { name: '', email: '' },
      setFormData: vi.fn(),
      errors: {},
      isSubmitting: false,
      handleSubmit: vi.fn().mockResolvedValue(true),
    });

    // Mock residentService
    (residentService.createResident as any).mockResolvedValue({
      id: 'resident-001',
      name: '田中太郎',
    });
  });

  it('renders new resident page with all components', () => {
    render(<NewResidentPage />);

    expect(screen.getByText('新規利用者登録')).toBeInTheDocument();
    expect(screen.getAllByTestId('user-plus-icon')).toHaveLength(2); // 2つのアイコンが存在することを確認
    expect(screen.getByTestId('resident-basic-info-form')).toBeInTheDocument();
    expect(screen.getByText('戻る')).toBeInTheDocument();
    expect(screen.getByText('登録')).toBeInTheDocument();
  });

  it('has correct header structure', () => {
    render(<NewResidentPage />);

    const header = screen.getByText('新規利用者登録').closest('.mb-6');
    expect(header).toBeInTheDocument();
    expect(screen.getByText(/新しい利用者の基本情報を入力してください/)).toBeInTheDocument();
  });

  it('has correct layout classes', () => {
    render(<NewResidentPage />);

    const container = screen.getByText('新規利用者登録').closest('.p-4');
    expect(container).toHaveClass('p-4', 'md:p-6', 'bg-carebase-bg', 'min-h-screen');
  });

  it('handles cancel button click', () => {
    render(<NewResidentPage />);

    const cancelButton = screen.getByText('戻る');
    fireEvent.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith('/residents');
  });

  it('handles save button click successfully', async () => {
    const mockHandleSubmit = vi.fn().mockResolvedValue(true);
    (useResidentForm as any).mockReturnValue({
      formData: { name: '田中太郎', email: 'tanaka@example.com' },
      setFormData: vi.fn(),
      errors: {},
      isSubmitting: false,
      handleSubmit: mockHandleSubmit,
    });

    render(<NewResidentPage />);

    const saveButton = screen.getByText('登録');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  it('shows error alert when submit fails', async () => {
    (useResidentForm as any).mockReturnValue({
      formData: { name: '田中太郎', email: 'tanaka@example.com' },
      setFormData: vi.fn(),
      errors: {},
      isSubmitting: false,
      handleSubmit: vi.fn().mockResolvedValue(false),
    });

    render(<NewResidentPage />);
    const saveButton = screen.getByText('登録');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText('入力内容に不備があります。必須項目を確認してください。')
      ).toBeInTheDocument();
    });
  });

  it('disables buttons when submitting', () => {
    (useResidentForm as any).mockReturnValue({
      formData: { name: '', email: '' },
      setFormData: vi.fn(),
      errors: {},
      isSubmitting: true,
      handleSubmit: vi.fn(),
    });

    render(<NewResidentPage />);

    expect(screen.getByText('登録中...')).toBeInTheDocument();
    expect(screen.getByTestId('form-disabled')).toHaveTextContent('true');
  });

  it('has correct card structure', () => {
    render(<NewResidentPage />);

    const card = screen.getByText('基本情報').closest('.max-w-6xl');
    expect(card).toBeInTheDocument();
    expect(screen.getByText('基本情報')).toBeInTheDocument();
  });

  it('has correct action buttons layout', () => {
    render(<NewResidentPage />);

    const actionButtons = screen.getByText('キャンセル').closest('.flex');
    expect(actionButtons).toHaveClass(
      'flex',
      'items-center',
      'justify-end',
      'gap-4',
      'mt-8',
      'pt-6',
      'border-t'
    );
  });
});
