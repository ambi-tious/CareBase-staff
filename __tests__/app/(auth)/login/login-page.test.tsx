import LoginPage from '@/app/(auth)/login/page';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the LoginForm component
jest.mock('@/components/2_molecules/auth/login-form', () => ({
  LoginForm: ({ onLogin }: { onLogin: (credentials: any) => Promise<boolean> }) => (
    <div data-testid="login-form">
      <button
        onClick={async () => {
          const result = await onLogin({ facilityId: 'admin', password: 'password' });
          return result;
        }}
        data-testid="login-button"
      >
        Login
      </button>
      <button
        onClick={async () => {
          const result = await onLogin({ facilityId: 'wrong', password: 'wrong' });
          return result;
        }}
        data-testid="login-fail-button"
      >
        Login Fail
      </button>
    </div>
  ),
}));

// Mock the Logo component
jest.mock('@/components/1_atoms/common/logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('全てのコンポーネントでログインページをレンダリングする', () => {
    render(<LoginPage />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByText('© 2025 CareBase. All rights reserved.')).toBeInTheDocument();
  });

  it('正しいレイアウトクラスを持つ', () => {
    render(<LoginPage />);

    const container = screen.getByTestId('logo').closest('.min-h-screen');
    expect(container).toHaveClass(
      'min-h-screen',
      'bg-carebase-bg',
      'flex',
      'items-center',
      'justify-center',
      'p-4'
    );
  });

  it('正しいフォームコンテナクラスを持つ', () => {
    render(<LoginPage />);

    const formContainer = screen.getByTestId('login-form').closest('.w-full');
    expect(formContainer).toHaveClass('w-full', 'max-w-md', 'space-y-6');
  });

  it('ログインが成功し、スタッフ選択ページにナビゲートする', async () => {
    render(<LoginPage />);

    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith('/staff-selection');
      },
      { timeout: 2000 }
    );
  });

  it('ログインが失敗し、ナビゲートしない', async () => {
    render(<LoginPage />);

    const loginFailButton = screen.getByTestId('login-fail-button');
    fireEvent.click(loginFailButton);

    await waitFor(
      () => {
        expect(mockPush).not.toHaveBeenCalled();
      },
      { timeout: 2000 }
    );
  });

  it('正しいフッターテキストを持つ', () => {
    render(<LoginPage />);

    const footer = screen
      .getByText('© 2025 CareBase. All rights reserved.')
      .closest('.text-center');
    expect(footer).toHaveClass('text-center', 'text-xs', 'text-gray-500');
  });
});
