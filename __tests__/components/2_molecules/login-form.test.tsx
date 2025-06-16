import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/2_molecules/auth/login-form';
import { jest } from '@jest/globals';

describe('LoginForm', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  it('renders login form correctly', () => {
    render(<LoginForm onLogin={mockOnLogin} />);

    expect(screen.getByText('ログイン')).toBeInTheDocument();
    expect(screen.getByLabelText('ユーザー名')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument();
  });

  it('shows error when fields are empty', async () => {
    render(<LoginForm onLogin={mockOnLogin} />);

    const submitButton = screen.getByRole('button', { name: /ログイン/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('ユーザー名とパスワードを入力してください。')).toBeInTheDocument();
    });

    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('calls onLogin with correct credentials', async () => {
    mockOnLogin.mockResolvedValue(true);
    render(<LoginForm onLogin={mockOnLogin} />);

    const usernameInput = screen.getByLabelText('ユーザー名');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: /ログイン/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
      });
    });
  });

  it('shows success message on successful login', async () => {
    mockOnLogin.mockResolvedValue(true);
    render(<LoginForm onLogin={mockOnLogin} />);

    const usernameInput = screen.getByLabelText('ユーザー名');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: /ログイン/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('ログインに成功しました。')).toBeInTheDocument();
    });
  });

  it('shows error message on failed login', async () => {
    mockOnLogin.mockResolvedValue(false);
    render(<LoginForm onLogin={mockOnLogin} />);

    const usernameInput = screen.getByLabelText('ユーザー名');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: /ログイン/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('ユーザー名またはパスワードが正しくありません。')
      ).toBeInTheDocument();
    });
  });

  it('shows loading state during login', async () => {
    mockOnLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 100))
    );
    render(<LoginForm onLogin={mockOnLogin} />);

    const usernameInput = screen.getByLabelText('ユーザー名');
    const passwordInput = screen.getByLabelText('パスワード');
    const submitButton = screen.getByRole('button', { name: /ログイン/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('ログイン中...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText('ログイン中...')).not.toBeInTheDocument();
    });
  });
});
