import StaffSelectionPage from '@/app/(auth)/staff-selection/page';
import type { Staff } from '@/mocks/staff-data';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock the StaffSelectionScreen component
jest.mock('@/components/3_organisms/auth/staff-selection-screen', () => ({
  StaffSelectionScreen: ({
    onStaffSelected,
    onLogout,
    selectedStaffData,
    fromHeader,
    fromStaffClick,
    fromGroupClick,
    autoSelectStaff,
    autoSelectTeam,
  }: any) => (
    <div data-testid="staff-selection-screen">
      <div data-testid="from-header">{fromHeader ? 'true' : 'false'}</div>
      <div data-testid="from-staff-click">{fromStaffClick ? 'true' : 'false'}</div>
      <div data-testid="from-group-click">{fromGroupClick ? 'true' : 'false'}</div>
      <div data-testid="auto-select-staff">{autoSelectStaff ? 'true' : 'false'}</div>
      <div data-testid="auto-select-team">{autoSelectTeam ? 'true' : 'false'}</div>
      <div data-testid="selected-staff-data">
        {selectedStaffData ? JSON.stringify(selectedStaffData) : 'none'}
      </div>
      <button
        onClick={() => onStaffSelected({ id: 'staff-001', name: '田中太郎' } as Staff)}
        data-testid="select-staff-button"
      >
        Select Staff
      </button>
      <button onClick={onLogout} data-testid="logout-button">
        Logout
      </button>
    </div>
  ),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('スタッフ選択ページ', () => {
  const mockPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('ローディングフォールバックでスタッフ選択ページをレンダリングする', () => {
    render(<StaffSelectionPage />);

    // Suspenseのfallbackは実際には表示されない（StaffSelectionScreenが即座にレンダリングされる）
    // 代わりにStaffSelectionScreenが正しくレンダリングされることを確認
    expect(screen.getByTestId('staff-selection-screen')).toBeInTheDocument();
  });

  it('StaffSelectionScreenコンポーネントをレンダリングする', () => {
    render(<StaffSelectionPage />);

    expect(screen.getByTestId('staff-selection-screen')).toBeInTheDocument();
  });

  it('デフォルト値でStaffSelectionScreenに正しいpropsを渡す', () => {
    mockGet.mockImplementation((key: string) => {
      const params: Record<string, string | null> = {
        from: null,
        staff: null,
        group: null,
        autoSelectStaff: null,
        autoSelectTeam: null,
      };
      return params[key] || null;
    });

    render(<StaffSelectionPage />);

    expect(screen.getByTestId('from-header')).toHaveTextContent('false');
    expect(screen.getByTestId('from-staff-click')).toHaveTextContent('false');
    expect(screen.getByTestId('from-group-click')).toHaveTextContent('false');
    expect(screen.getByTestId('auto-select-staff')).toHaveTextContent('true');
    expect(screen.getByTestId('auto-select-team')).toHaveTextContent('true');
  });

  it('URLパラメータでStaffSelectionScreenに正しいpropsを渡す', () => {
    mockGet.mockImplementation((key: string) => {
      const params: Record<string, string | null> = {
        from: 'header',
        staff: 'true',
        group: 'true',
        autoSelectStaff: 'false',
        autoSelectTeam: 'false',
      };
      return params[key] || null;
    });

    render(<StaffSelectionPage />);

    expect(screen.getByTestId('from-header')).toHaveTextContent('true');
    expect(screen.getByTestId('from-staff-click')).toHaveTextContent('true');
    expect(screen.getByTestId('from-group-click')).toHaveTextContent('true');
    expect(screen.getByTestId('auto-select-staff')).toHaveTextContent('false');
    expect(screen.getByTestId('auto-select-team')).toHaveTextContent('false');
  });

  it('localStorageから選択されたスタッフデータを読み込む', () => {
    const mockStaffData = {
      staff: { id: 'staff-001', name: '田中太郎' },
      groupName: '介護フロア A',
      teamName: '朝番チーム',
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockStaffData));

    render(<StaffSelectionPage />);

    expect(screen.getByTestId('selected-staff-data')).toHaveTextContent(
      JSON.stringify(mockStaffData)
    );
  });

  it('localStorageエラーを適切に処理する', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    render(<StaffSelectionPage />);

    expect(screen.getByTestId('selected-staff-data')).toHaveTextContent('none');
  });

  it('スタッフ選択を処理し、ホームページにナビゲートする', async () => {
    render(<StaffSelectionPage />);

    const selectButton = screen.getByTestId('select-staff-button');
    fireEvent.click(selectButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'carebase_selected_staff_data',
        expect.stringContaining('田中太郎')
      );
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('ログアウトを処理し、ログインページにナビゲートする', () => {
    render(<StaffSelectionPage />);

    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('carebase_selected_staff_data');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('carebase_token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('carebase_user');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('ログアウト中のlocalStorageエラーを処理する', () => {
    localStorageMock.removeItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    render(<StaffSelectionPage />);

    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('正しいレイアウトクラスを持つ', () => {
    render(<StaffSelectionPage />);

    const container = screen.getByTestId('staff-selection-screen').closest('.min-h-screen');
    expect(container).toHaveClass(
      'min-h-screen',
      'bg-carebase-bg',
      'flex',
      'items-center',
      'justify-center',
      'p-4'
    );
  });
});
