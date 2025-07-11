import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth-service';
import { act, renderHook, waitFor } from '@testing-library/react';

// Mock the auth service
vi.mock('@/services/auth-service');
const mockAuthService = authService as vi.Mocked<typeof authService>;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('認証フック', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
    localStorageMock.removeItem.mockImplementation(() => {});
  });

  it('デフォルト状態で初期化される', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBe(null);
    expect(result.current.user).toBe(null);
    expect(result.current.selectedStaff).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('マウント時にlocalStorageから認証状態を読み込む', () => {
    const mockToken = 'test-token';
    const mockUser = {
      id: '1',
      facilityId: 'facility-1',
      role: 'staff' as const,
      permissions: ['read'],
    };
    const mockStaff = {
      id: 'staff-1',
      name: 'Staff User',
      furigana: 'スタッフユーザー',
      role: 'staff',
      employeeId: 'emp-1',
      facilityId: 'facility-1',
    };

    localStorageMock.getItem
      .mockReturnValueOnce(mockToken)
      .mockReturnValueOnce(JSON.stringify(mockUser))
      .mockReturnValueOnce(JSON.stringify(mockStaff));

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.selectedStaff).toEqual(mockStaff);
  });

  it('localStorageのパースエラーを処理する', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to load auth state:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('ログインが成功する', async () => {
    const mockCredentials = { facilityId: 'facility-1', password: 'password' };
    const mockResponse = {
      success: true,
      token: 'test-token',
      user: { id: '1', facilityId: 'facility-1', role: 'staff' as const, permissions: ['read'] },
    };

    mockAuthService.login.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth());

    let loginResult = false;
    await act(async () => {
      loginResult = await result.current.login(mockCredentials);
    });

    expect(loginResult).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('test-token');
    expect(result.current.user).toEqual({
      id: '1',
      facilityId: 'facility-1',
      role: 'staff',
      permissions: ['read'],
    });
    expect(result.current.error).toBe(null);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('carebase_token', 'test-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'carebase_user',
      JSON.stringify({ id: '1', facilityId: 'facility-1', role: 'staff', permissions: ['read'] })
    );
  });

  it('ログインのバリデーションエラーを処理する', async () => {
    const invalidCredentials = { facilityId: '', password: '' };

    const { result } = renderHook(() => useAuth());

    let loginResult = false;
    await act(async () => {
      loginResult = await result.current.login(invalidCredentials);
    });

    expect(loginResult).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('ログインのサービスエラーを処理する', async () => {
    const mockCredentials = { facilityId: 'facility-1', password: 'password' };
    const mockResponse = {
      success: false,
      error: 'Invalid credentials',
    };

    mockAuthService.login.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth());

    let loginResult = false;
    await act(async () => {
      loginResult = await result.current.login(mockCredentials);
    });

    expect(loginResult).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
  });

  it('ログインのネットワークエラーを処理する', async () => {
    const mockCredentials = { facilityId: 'facility-1', password: 'password' };

    mockAuthService.login.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAuth());

    let loginResult = false;
    await act(async () => {
      loginResult = await result.current.login(mockCredentials);
    });

    expect(loginResult).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('ログイン中にエラーが発生しました。もう一度お試しください。');
  });

  it('スタッフ選択が成功する', async () => {
    const mockStaff = {
      id: 'staff-1',
      name: 'Staff User',
      furigana: 'スタッフユーザー',
      role: 'staff',
      employeeId: 'emp-1',
      facilityId: 'facility-1',
    };
    const mockResponse = {
      success: true,
      staff: mockStaff,
    };

    mockAuthService.selectStaff.mockResolvedValue(mockResponse);

    // Set up authenticated state
    localStorageMock.getItem
      .mockReturnValueOnce('test-token')
      .mockReturnValueOnce(
        JSON.stringify({ id: '1', facilityId: 'facility-1', role: 'staff', permissions: ['read'] })
      );

    const { result } = renderHook(() => useAuth());

    // Wait for initial state to load
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    let selectResult = false;
    await act(async () => {
      selectResult = await result.current.selectStaff('staff-1');
    });

    expect(selectResult).toBe(true);
    expect(result.current.selectedStaff).toEqual(mockStaff);
    expect(result.current.error).toBe(null);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'carebase_selected_staff',
      JSON.stringify(mockStaff)
    );
  });

  it('トークンなしでスタッフ選択を処理する', async () => {
    const { result } = renderHook(() => useAuth());

    let selectResult = false;
    await act(async () => {
      selectResult = await result.current.selectStaff('staff-1');
    });

    expect(selectResult).toBe(false);
    expect(result.current.error).toBe('ログイン情報が見つかりません');
  });

  it('スタッフ選択のサービスエラーを処理する', async () => {
    const mockResponse = {
      success: false,
      error: 'Staff not found',
    };

    mockAuthService.selectStaff.mockResolvedValue(mockResponse);

    // Set up authenticated state
    localStorageMock.getItem
      .mockReturnValueOnce('test-token')
      .mockReturnValueOnce(
        JSON.stringify({ id: '1', facilityId: 'facility-1', role: 'staff', permissions: ['read'] })
      );

    const { result } = renderHook(() => useAuth());

    // Wait for initial state to load
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    let selectResult = false;
    await act(async () => {
      selectResult = await result.current.selectStaff('staff-1');
    });

    expect(selectResult).toBe(false);
    expect(result.current.error).toBe('Staff not found');
  });

  it('ログアウトが成功する', async () => {
    // Set up authenticated state
    localStorageMock.getItem
      .mockReturnValueOnce('test-token')
      .mockReturnValueOnce(
        JSON.stringify({ id: '1', facilityId: 'facility-1', role: 'staff', permissions: ['read'] })
      );

    const { result } = renderHook(() => useAuth());

    // Wait for initial state to load
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBe(null);
    expect(result.current.user).toBe(null);
    expect(result.current.selectedStaff).toBe(null);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('carebase_token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('carebase_user');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('carebase_selected_staff');
  });

  it('エラーをクリアする', () => {
    const { result } = renderHook(() => useAuth());

    // Set an error first
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });
});
