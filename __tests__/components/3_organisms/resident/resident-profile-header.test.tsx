import { ResidentProfileHeader } from '@/components/3_organisms/resident/resident-profile-header';
import type { Resident } from '@/mocks/care-board-data';
import { render, screen } from '@testing-library/react';

const mockResident: Resident = {
  id: 1,
  name: '佐藤清',
  furigana: 'サトウキヨシ',
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
  avatarUrl: '/test-avatar.png',
  events: [],
};

describe('ResidentProfileHeader', () => {
  it('renders resident basic information correctly', () => {
    render(<ResidentProfileHeader resident={mockResident} />);

    expect(screen.getByText('佐藤清')).toBeInTheDocument();
    expect(screen.getByText('サトウキヨシ')).toBeInTheDocument();
    expect(screen.getByText('1940/08/22 (85歳)')).toBeInTheDocument();
    expect(screen.getByText('男')).toBeInTheDocument();
  });

  it('renders facility information correctly', () => {
    render(<ResidentProfileHeader resident={mockResident} />);

    expect(screen.getByText('サンプルグループ101')).toBeInTheDocument();
    expect(screen.getByText('テストチーム3')).toBeInTheDocument();
    expect(screen.getByText('404号室')).toBeInTheDocument();
  });

  it('renders care information correctly', () => {
    render(<ResidentProfileHeader resident={mockResident} />);

    expect(screen.getByText('入居中')).toBeInTheDocument();
    expect(screen.getByText('要介護1')).toBeInTheDocument();
    expect(screen.getByText('2025/01/11')).toBeInTheDocument();
    expect(screen.getByText('2024/12/28 ~ 2025/12/27')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<ResidentProfileHeader resident={mockResident} />);

    expect(screen.getByRole('button', { name: /記録データ/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ケアプラン/i })).toBeInTheDocument();
  });

  it('renders avatar with correct alt text', () => {
    render(<ResidentProfileHeader resident={mockResident} />);

    const avatar = screen.getByAltText('佐藤清');
    expect(avatar).toBeInTheDocument();
  });

  it('handles optional fields correctly', () => {
    const minimalResident = {
      ...mockResident,
      floorGroup: undefined,
      unitTeam: undefined,
      roomInfo: undefined,
      dischargeDate: undefined,
    };

    render(<ResidentProfileHeader resident={minimalResident} />);

    // Should render dashes for undefined values
    const dashElements = screen.getAllByText('-');
    expect(dashElements.length).toBeGreaterThan(0);
  });
});
