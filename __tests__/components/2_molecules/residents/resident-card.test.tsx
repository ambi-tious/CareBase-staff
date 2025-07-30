import { ResidentCard } from '@/components/2_molecules/resident/resident-card';
import type { Resident } from '@/mocks/care-board-data';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ src, alt, onError, ...props }: any) {
    return <img src={src} alt={alt} onError={onError} {...props} data-testid="resident-avatar" />;
  },
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  __esModule: true,
  default: function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

// Mock the AlertIndicator component
vi.mock('@/components/1_atoms/residents/alert-indicator', () => ({
  AlertIndicator: ({ level, count }: any) => (
    <div data-testid={`alert-${level}`} data-count={count}>
      {level}: {count}
    </div>
  ),
}));

// Mock the ResidentStatusBadge component
vi.mock('@/components/1_atoms/residents/resident-status-badge', () => ({
  ResidentStatusBadge: ({ status }: any) => (
    <div data-testid="status-badge" data-status={status}>
      {status}
    </div>
  ),
}));

describe('ResidentCard', () => {
  const mockResident: Resident = {
    id: 1,
    name: 'テスト利用者',
    furigana: 'テストリヨウシャ',
    dob: '1940/08/22',
    sex: '男',
    age: 85,
    floorGroup: 'サンプルグループ101',
    unitTeam: 'テストチーム3',
    roomInfo: '404号室',
    registrationDate: '2025/04/15',
    lastUpdateDate: '2025/05/20',
    admissionDate: '2025/04/15',
    admissionStatus: '入居中',
    careLevel: '要介護1',
    certificationDate: '2025/01/11',
    certValidityStart: '2024/12/28',
    certValidityEnd: '2025/12/27',
    address: '兵庫県神戸市西区樫野台3-408-14',
    avatarUrl: '/test-avatar.jpg',
    events: [],
  };

  it('renders resident information correctly', () => {
    render(<ResidentCard resident={mockResident} />);

    expect(screen.getByText('テスト利用者')).toBeInTheDocument();
    expect(screen.getByText('テストリヨウシャ')).toBeInTheDocument();
    expect(screen.getByText('85歳 (男)')).toBeInTheDocument();
    expect(screen.getByText('要介護度: 要介護1')).toBeInTheDocument();
    expect(screen.getByText('404号室')).toBeInTheDocument();
    expect(screen.getByText('チーム: テストチーム3')).toBeInTheDocument();
  });

  it('renders resident avatar with correct props', () => {
    render(<ResidentCard resident={mockResident} />);

    const avatar = screen.getByTestId('resident-avatar');
    expect(avatar).toHaveAttribute('src', '/test-avatar.jpg');
    expect(avatar).toHaveAttribute('alt', 'テスト利用者');
  });

  it('renders placeholder avatar when avatarUrl is empty', () => {
    const residentWithEmptyAvatar = { ...mockResident, avatarUrl: '' };
    render(<ResidentCard resident={residentWithEmptyAvatar} />);

    const avatar = screen.getByTestId('resident-avatar');
    expect(avatar).toHaveAttribute('src', '/placeholder.svg');
  });

  it('renders status badge with correct status', () => {
    render(<ResidentCard resident={mockResident} />);

    const statusBadge = screen.getByTestId('status-badge');
    expect(statusBadge).toHaveAttribute('data-status', '入居中');
    expect(screen.getByText('入居中')).toBeInTheDocument();
  });

  it('renders detail button with correct link', () => {
    render(<ResidentCard resident={mockResident} />);

    const detailButton = screen.getByText('詳細');
    expect(detailButton).toBeInTheDocument();
    expect(detailButton.closest('a')).toHaveAttribute('href', '/residents/1');
  });

  it('renders alert indicators with correct counts', () => {
    render(<ResidentCard resident={mockResident} />);

    const highAlert = screen.getByTestId('alert-high');
    const mediumAlert = screen.getByTestId('alert-medium');
    const lowAlert = screen.getByTestId('alert-low');

    expect(highAlert).toHaveAttribute('data-count', '2');
    expect(mediumAlert).toHaveAttribute('data-count', '1');
    expect(lowAlert).toHaveAttribute('data-count', '0');
  });

  it('shows "なし" when no alerts are present', () => {
    const residentWithNoAlerts = { ...mockResident, id: 4 }; // ID 4 has no alerts
    render(<ResidentCard resident={residentWithNoAlerts} />);

    expect(screen.getByText('なし')).toBeInTheDocument();
  });

  it('does not render room info when not provided', () => {
    const residentWithoutRoom = { ...mockResident, roomInfo: undefined };
    render(<ResidentCard resident={residentWithoutRoom} />);

    expect(screen.queryByText('404号室')).not.toBeInTheDocument();
  });

  it('does not render unit team when not provided', () => {
    const residentWithoutTeam = { ...mockResident, unitTeam: undefined };
    render(<ResidentCard resident={residentWithoutTeam} />);

    expect(screen.queryByText('チーム: テストチーム3')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-resident-card';
    render(<ResidentCard resident={mockResident} className={customClass} />);

    const card = screen.getByText('テスト利用者').closest('.hover\\:shadow-md');
    expect(card).toHaveClass(customClass);
  });

  it('renders all required resident fields', () => {
    render(<ResidentCard resident={mockResident} />);

    expect(screen.getByText('アラート:')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<ResidentCard resident={mockResident} />);

    const card = screen.getByText('テスト利用者').closest('.hover\\:shadow-md');
    expect(card).toHaveClass('transition-shadow');
  });

  it('renders different alert counts for different residents', () => {
    const residentWithHighAlerts = { ...mockResident, id: 5 }; // ID 5 has high alerts
    render(<ResidentCard resident={residentWithHighAlerts} />);

    const highAlert = screen.getByTestId('alert-high');
    expect(highAlert).toHaveAttribute('data-count', '3');
  });
});

describe('ResidentCard 分岐網羅', () => {
  const baseResident: Resident = {
    id: 1,
    name: 'テスト利用者',
    furigana: 'テストリヨウシャ',
    dob: '1940/08/22',
    sex: '男',
    age: 85,
    registrationDate: '2025/04/15',
    lastUpdateDate: '2025/05/20',
    admissionDate: '2025/04/15',
    admissionStatus: '入居中',
    careLevel: '要介護1',
    certificationDate: '2025/01/11',
    certValidityStart: '2024/12/28',
    certValidityEnd: '2025/12/27',
    address: '兵庫県神戸市西区',
    avatarUrl: '/test-avatar.jpg',
    events: [],
  };

  it('roomInfoがない場合は表示されない', () => {
    const resident = { ...baseResident, roomInfo: undefined };
    render(<ResidentCard resident={resident} />);
    expect(screen.queryByText('404号室')).not.toBeInTheDocument();
  });

  it('unitTeamがない場合は表示されない', () => {
    const resident = { ...baseResident, unitTeam: undefined };
    render(<ResidentCard resident={resident} />);
    expect(screen.queryByText(/チーム:/)).not.toBeInTheDocument();
  });

  it('avatarUrlが空文字の場合は空srcで表示', () => {
    const resident = { ...baseResident, avatarUrl: '' };
    render(<ResidentCard resident={resident} />);
    const avatar = screen.getByTestId('resident-avatar');
    expect(avatar).toHaveAttribute('src', '/placeholder.svg');
  });

  it('admissionStatusが退所済の場合', () => {
    const resident = { ...baseResident, admissionStatus: '退所済' as const };
    render(<ResidentCard resident={resident} />);
    expect(screen.getByTestId('status-badge')).toHaveAttribute('data-status', '退所済');
    expect(screen.getByText('退所済')).toBeInTheDocument();
  });

  it('admissionStatusが待機中の場合', () => {
    const resident = { ...baseResident, admissionStatus: '待機中' as const };
    render(<ResidentCard resident={resident} />);
    expect(screen.getByTestId('status-badge')).toHaveAttribute('data-status', '待機中');
    expect(screen.getByText('待機中')).toBeInTheDocument();
  });

  it('admissionStatusが不正値の場合', () => {
    const resident = { ...baseResident, admissionStatus: '不明' } as unknown as Resident;
    render(<ResidentCard resident={resident} />);
    expect(screen.getByTestId('status-badge')).toHaveAttribute('data-status', '不明');
    expect(screen.getByText('不明')).toBeInTheDocument();
  });

  it('propsがnull/undefined/空文字でもクラッシュしない', () => {
    const resident = {
      ...baseResident,
      name: '',
      furigana: '',
      roomInfo: undefined,
      unitTeam: undefined,
      avatarUrl: '',
    };
    render(<ResidentCard resident={resident} />);
    expect(screen.getByTestId('resident-avatar')).toBeInTheDocument();
  });
});
