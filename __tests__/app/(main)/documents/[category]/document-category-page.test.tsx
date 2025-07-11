import DocumentCategoryPage from '@/app/(main)/documents/[category]/page';
import { getCategoryByKey, getDocumentsByCategory } from '@/mocks/documents-data';
import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import { vi } from 'vitest';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

// Mock the DocumentList component
vi.mock('@/components/3_organisms/documents/document-list', () => ({
  DocumentList: ({ items }: { items: any[] }) => (
    <div data-testid="document-list">
      <div data-testid="document-count">{items.length}</div>
      {items.map((item, index) => (
        <div key={index} data-testid={`document-${index}`}>
          {item.title}
        </div>
      ))}
    </div>
  ),
}));

// Mock the documents data functions
vi.mock('@/mocks/documents-data', () => ({
  getDocumentsByCategory: vi.fn(),
  getCategoryByKey: vi.fn(),
}));

describe('文書カテゴリページ', () => {
  const mockGetDocumentsByCategory = vi.fn();
  const mockGetCategoryByKey = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (getDocumentsByCategory as any).mockImplementation(mockGetDocumentsByCategory);
    (getCategoryByKey as any).mockImplementation(mockGetCategoryByKey);
  });

  it('有効なカテゴリで文書リストをレンダリングする', async () => {
    const mockCategory = { key: 'care-plans', name: 'ケアプラン' };
    const mockDocuments = [
      { id: '1', title: 'ケアプラン1', category: 'care-plans' },
      { id: '2', title: 'ケアプラン2', category: 'care-plans' },
    ];

    mockGetCategoryByKey.mockReturnValue(mockCategory);
    mockGetDocumentsByCategory.mockReturnValue(mockDocuments);

    const params = Promise.resolve({ category: 'care-plans' });
    render(await DocumentCategoryPage({ params }));

    expect(screen.getByTestId('document-list')).toBeInTheDocument();
    expect(screen.getByTestId('document-count')).toHaveTextContent('2');
    expect(screen.getByTestId('document-0')).toHaveTextContent('ケアプラン1');
    expect(screen.getByTestId('document-1')).toHaveTextContent('ケアプラン2');
  });

  it('カテゴリが存在しない場合にnotFoundを呼び出す', async () => {
    mockGetCategoryByKey.mockReturnValue(null);

    const params = Promise.resolve({ category: 'invalid-category' });

    try {
      render(await DocumentCategoryPage({ params }));
    } catch {
      // Expected to throw due to notFound()
    }

    expect(notFound).toHaveBeenCalled();
  });

  it('データ関数に正しいカテゴリキーを渡す', async () => {
    const mockCategory = { key: 'assessments', name: 'アセスメント' };
    const mockDocuments = [{ id: '1', title: 'アセスメント1', category: 'assessments' }];

    mockGetCategoryByKey.mockReturnValue(mockCategory);
    mockGetDocumentsByCategory.mockReturnValue(mockDocuments);

    const params = Promise.resolve({ category: 'assessments' });
    render(await DocumentCategoryPage({ params }));

    expect(mockGetCategoryByKey).toHaveBeenCalledWith('assessments');
    expect(mockGetDocumentsByCategory).toHaveBeenCalledWith('assessments');
  });

  it('文書が存在しない場合に空の文書リストをレンダリングする', async () => {
    const mockCategory = { key: 'reports', name: '報告書' };
    const mockDocuments: any[] = [];

    mockGetCategoryByKey.mockReturnValue(mockCategory);
    mockGetDocumentsByCategory.mockReturnValue(mockDocuments);

    const params = Promise.resolve({ category: 'reports' });
    render(await DocumentCategoryPage({ params }));

    expect(screen.getByTestId('document-list')).toBeInTheDocument();
    expect(screen.getByTestId('document-count')).toHaveTextContent('0');
  });

  it('正しいレイアウトクラスを持つ', async () => {
    const mockCategory = { key: 'care-plans', name: 'ケアプラン' };
    const mockDocuments = [{ id: '1', title: 'ケアプラン1', category: 'care-plans' }];

    mockGetCategoryByKey.mockReturnValue(mockCategory);
    mockGetDocumentsByCategory.mockReturnValue(mockDocuments);

    const params = Promise.resolve({ category: 'care-plans' });
    render(await DocumentCategoryPage({ params }));

    const container = screen.getByTestId('document-list').closest('.p-4');
    expect(container).toHaveClass('p-4', 'md:p-6', 'bg-carebase-bg', 'min-h-screen');
  });

  it('異なるカテゴリタイプを処理する', async () => {
    const categories = [
      { key: 'care-plans', name: 'ケアプラン' },
      { key: 'assessments', name: 'アセスメント' },
      { key: 'reports', name: '報告書' },
    ];

    for (const category of categories) {
      mockGetCategoryByKey.mockReturnValue(category);
      mockGetDocumentsByCategory.mockReturnValue([
        { id: '1', title: 'Test', category: category.key },
      ]);

      const params = Promise.resolve({ category: category.key });
      const { unmount } = render(await DocumentCategoryPage({ params }));

      expect(screen.getByTestId('document-list')).toBeInTheDocument();
      expect(mockGetCategoryByKey).toHaveBeenCalledWith(category.key);
      expect(mockGetDocumentsByCategory).toHaveBeenCalledWith(category.key);

      unmount();
    }
  });
});
