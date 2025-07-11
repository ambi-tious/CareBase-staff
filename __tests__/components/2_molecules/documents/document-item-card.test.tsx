import { DocumentItemCard } from '@/components/2_molecules/documents/document-item-card';
import { fireEvent, render, screen } from '@testing-library/react';

const mockItemFile = {
  id: 'file-1',
  type: 'file' as const,
  name: 'テストファイル.pdf',
  fileType: 'pdf' as const,
  size: '1MB',
  createdBy: 'テスト作成者',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
const mockItemFolder = {
  id: 'folder-1',
  type: 'folder' as const,
  name: 'テストフォルダ',
  itemCount: 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('DocumentItemCard', () => {
  it('ファイル情報が表示される', () => {
    render(<DocumentItemCard item={mockItemFile} />);
    expect(screen.getByText('テストファイル.pdf')).toBeInTheDocument();
    expect(screen.getByText('1MB')).toBeInTheDocument();
    expect(screen.getByText('テスト作成者', { exact: false })).toBeInTheDocument();
  });
  it('フォルダ情報が表示される', () => {
    render(<DocumentItemCard item={mockItemFolder} />);
    expect(screen.getByText('テストフォルダ')).toBeInTheDocument();
    expect(screen.getByText('3 個のアイテム')).toBeInTheDocument();
  });
  it('クリックイベントが発火する', () => {
    const onItemClick = vi.fn();
    render(<DocumentItemCard item={mockItemFile} onItemClick={onItemClick} />);
    fireEvent.click(screen.getByText('テストファイル.pdf'));
    expect(onItemClick).toHaveBeenCalledWith(mockItemFile);
  });
});
