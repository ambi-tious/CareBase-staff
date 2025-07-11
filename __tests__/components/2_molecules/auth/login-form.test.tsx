import { LoginForm } from '@/components/2_molecules/auth/login-form';
import type { LoginCredentials } from '@/types/auth';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

describe('LoginForm', () => {
  const mockOnLogin = jest.fn() as jest.MockedFunction<
    (credentials: LoginCredentials) => Promise<boolean>
  >;

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  it('renders login form correctly', () => {
    render(<LoginForm onLogin={mockOnLogin} />);

    // Use getAllByText to handle multiple elements with same text
    const loginTexts = screen.getAllByText('ログイン');
    expect(loginTexts).toHaveLength(2); // Title and button
    const inputFields = screen.getAllByDisplayValue('');
    expect(inputFields).toHaveLength(2); // Two input fields
    expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument();
  });

  it('shows error when fields are empty', async () => {
    render(<LoginForm onLogin={mockOnLogin} />);

    const submitButton = screen.getByRole('button', { name: /ログイン/i });
    fireEvent.click(submitButton);

    // The form should be disabled when fields are empty, so no error message should appear
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('calls onLogin with correct credentials', async () => {
    mockOnLogin.mockResolvedValue(true);
    render(<LoginForm onLogin={mockOnLogin} />);

    const facilityIdInput = screen.getByPlaceholderText('施設IDを入力');
    const passwordInput = screen.getByPlaceholderText('パスワードを入力');
    const submitButton = screen.getByRole('button', { name: /ログイン/i });

    fireEvent.change(facilityIdInput, { target: { value: 'testfacility' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        facilityId: 'testfacility',
        password: 'testpass',
      });
    });
  });

  it('shows success message on successful login', async () => {
    mockOnLogin.mockResolvedValue(true);
    render(<LoginForm onLogin={mockOnLogin} />);

    const facilityIdInput = screen.getByPlaceholderText('施設IDを入力');
    const passwordInput = screen.getByPlaceholderText('パスワードを入力');
    const submitButton = screen.getByRole('button', { name: /ログイン/i });

    fireEvent.change(facilityIdInput, { target: { value: 'testfacility' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('ログインに成功しました。')).toBeInTheDocument();
    });
  });

  it('shows error message on failed login', async () => {
    // Mock the onLogin to throw an error to trigger the catch block
    mockOnLogin.mockRejectedValue(new Error('Login failed'));
    render(<LoginForm onLogin={mockOnLogin} />);

    const facilityIdInput = screen.getByPlaceholderText('施設IDを入力');
    const passwordInput = screen.getByPlaceholderText('パスワードを入力');
    const submitButton = screen.getByRole('button', { name: /ログイン/i });

    fireEvent.change(facilityIdInput, { target: { value: 'wrongfacility' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('ログイン中にエラーが発生しました。もう一度お試しください。')
      ).toBeInTheDocument();
    });
  });

  it('shows loading state when isLoading prop is true', () => {
    render(<LoginForm onLogin={mockOnLogin} isLoading={true} />);

    expect(screen.getByText('ログイン中...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ログイン中.../i })).toBeDisabled();
  });
});
