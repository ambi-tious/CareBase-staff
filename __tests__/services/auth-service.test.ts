import { authService } from '@/services/auth-service';

// Mock fetch
global.fetch = jest.fn();

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    process.env.NEXT_PUBLIC_API_URL = '';
  });

  describe('login', () => {
    it('APIログインが成功する', async () => {
      const mockResponse = {
        success: true,
        token: 'api-jwt-token',
        user: {
          id: 'user-1',
          facilityId: 'facility-1',
          role: 'staff',
          permissions: ['read'],
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const credentials = { facilityId: 'facility-1', password: 'password' };
      const result = await authService.login(credentials);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/v1/auth/staff/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
    });

    it('APIエラーを処理する', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const credentials = { facilityId: 'facility-1', password: 'password' };
      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'ネットワークエラーが発生しました。しばらく時間をおいてからお試しください'
      );
    });

    it('HTTPエラーレスポンスを処理する', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const credentials = { facilityId: 'facility-1', password: 'password' };
      const result = await authService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'ネットワークエラーが発生しました。しばらく時間をおいてからお試しください'
      );
    });
  });

  describe('selectStaff', () => {
    it('APIスタッフ選択が成功する', async () => {
      const mockResponse = {
        success: true,
        staff: {
          id: 'staff-001',
          name: '田中 花子',
          furigana: 'タナカ ハナコ',
          role: '介護職員',
          employeeId: 'EMP001',
          facilityId: 'facility-1',
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authService.selectStaff('mock-token', 'staff-001');

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/v1/auth/staff/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
        body: JSON.stringify({ staffId: 'staff-001' }),
      });
    });

    it('スタッフ選択でAPIエラーを処理する', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await authService.selectStaff('mock-token', 'staff-001');

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'ネットワークエラーが発生しました。しばらく時間をおいてからお試しください'
      );
    });
  });

  describe('logout', () => {
    it('APIログアウトが成功する', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await authService.logout('mock-token');

      expect(fetch).toHaveBeenCalledWith('/api/v1/auth/staff/logout', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer mock-token',
        },
      });
    });

    it('ログアウトでAPIエラーを処理する', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await authService.logout('mock-token');

      expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('requestPasswordReset', () => {
    it('パスワードリセット要求が成功する', async () => {
      const mockResponse = { success: true };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authService.requestPasswordReset('facility-1', 'test@example.com');

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/v1/auth/staff/password-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          facilityId: 'facility-1',
          email: 'test@example.com',
        }),
      });
    });

    it('パスワードリセット要求でAPIエラーを処理する', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await authService.requestPasswordReset('facility-1', 'test@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'ネットワークエラーが発生しました。しばらく時間をおいてからお試しください'
      );
    });
  });

  describe('resetPassword', () => {
    it('パスワードリセットが成功する', async () => {
      const mockResponse = { success: true };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authService.resetPassword('reset-token', 'new-password');

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/v1/auth/staff/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: 'reset-token',
          newPassword: 'new-password',
        }),
      });
    });

    it('パスワードリセットでAPIエラーを処理する', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await authService.resetPassword('reset-token', 'new-password');

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'ネットワークエラーが発生しました。しばらく時間をおいてからお試しください'
      );
    });
  });
});
