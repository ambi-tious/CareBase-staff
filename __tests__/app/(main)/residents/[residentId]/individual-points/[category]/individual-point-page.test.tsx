import IndividualPointPage from '@/app/(main)/residents/[residentId]/individual-points/[category]/page';
import { getResidentById } from '@/mocks/care-board-data';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import { vi } from 'vitest';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

// Mock the IndividualPointDetailPage component
vi.mock('@/components/3_organisms/resident/individual-point-detail-page', () => ({
  IndividualPointDetailPage: ({ resident, category, individualPoint }: any) => (
    <div data-testid="individual-point-detail-page">
      <div data-testid="resident-name">{resident.name}</div>
      <div data-testid="category">{category}</div>
      <div data-testid="point-id">{individualPoint.id}</div>
    </div>
  ),
}));

// Mock the getResidentById function
vi.mock('@/mocks/care-board-data', () => ({
  getResidentById: vi.fn(),
}));

describe('個別ポイント詳細ページ', () => {
  const mockResident = {
    id: 1,
    name: 'テスト利用者',
    individualPoints: [
      {
        id: 'ip1',
        category: '移乗介助',
        icon: 'Users',
        count: 1,
        isActive: true,
      },
      {
        id: 'ip2',
        category: '食事',
        icon: 'Utensils',
        count: 1,
        isActive: true,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('有効な利用者とカテゴリで詳細ページをレンダリングする', async () => {
    (getResidentById as any).mockReturnValue(mockResident);

    const params = Promise.resolve({
      residentId: '1',
      category: '%E7%A7%BB%E4%B9%97%E4%BB%8B%E5%8A%A9', // URL encoded '移乗介助'
    });

    render(await IndividualPointPage({ params }));

    expect(screen.getByTestId('individual-point-detail-page')).toBeInTheDocument();
    expect(screen.getByTestId('resident-name')).toHaveTextContent('テスト利用者');
    expect(screen.getByTestId('category')).toHaveTextContent('移乗介助');
    expect(screen.getByTestId('point-id')).toHaveTextContent('ip1');
  });

  it('利用者が存在しない場合にnotFoundを呼び出す', async () => {
    (getResidentById as any).mockReturnValue(undefined);

    const params = Promise.resolve({
      residentId: '999',
      category: 'test-category',
    });

    try {
      render(await IndividualPointPage({ params }));
    } catch {
      // Expected to throw due to notFound()
    }

    expect(notFound).toHaveBeenCalled();
  });

  it('個別ポイントが存在しない場合にnotFoundを呼び出す', async () => {
    (getResidentById as any).mockReturnValue(mockResident);

    const params = Promise.resolve({
      residentId: '1',
      category: 'non-existent-category',
    });

    try {
      render(await IndividualPointPage({ params }));
    } catch {
      // Expected to throw due to notFound()
    }

    expect(notFound).toHaveBeenCalled();
  });

  it('URLエンコードされたカテゴリ名を正しくデコードする', async () => {
    (getResidentById as any).mockReturnValue(mockResident);

    const params = Promise.resolve({
      residentId: '1',
      category: '%E9%A3%9F%E4%BA%8B', // URL encoded '食事'
    });

    render(await IndividualPointPage({ params }));

    expect(screen.getByTestId('category')).toHaveTextContent('食事');
    expect(screen.getByTestId('point-id')).toHaveTextContent('ip2');
  });

  it('正しい利用者IDを数値に変換する', async () => {
    const mockGetResidentById = getResidentById as any;
    mockGetResidentById.mockReturnValue(mockResident);

    const params = Promise.resolve({
      residentId: '123',
      category: 'test-category',
    });

    try {
      render(await IndividualPointPage({ params }));
    } catch {
      // May throw due to category not found
    }

    expect(mockGetResidentById).toHaveBeenCalledWith(123);
  });

  it('異なるカテゴリで正しい個別ポイントを見つける', async () => {
    (getResidentById as any).mockReturnValue(mockResident);

    // Test with '食事' category
    const params1 = Promise.resolve({
      residentId: '1',
      category: '食事',
    });

    const { unmount } = render(await IndividualPointPage({ params: params1 }));
    expect(screen.getByTestId('point-id')).toHaveTextContent('ip2');

    unmount();

    // Test with '移乗介助' category
    const params2 = Promise.resolve({
      residentId: '1',
      category: '移乗介助',
    });

    render(await IndividualPointPage({ params: params2 }));
    expect(screen.getByTestId('point-id')).toHaveTextContent('ip1');
  });
});
