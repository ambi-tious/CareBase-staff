import { ResidentSearchBar } from '@/components/2_molecules/residents/resident-search-bar';
import { fireEvent, render, screen } from '@testing-library/react';

describe('ResidentSearchBar', () => {
  it('プレースホルダーが表示される', () => {
    render(<ResidentSearchBar onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText('利用者名で検索...')).toBeInTheDocument();
  });

  it('入力でonSearchが呼ばれる', () => {
    const onSearch = vi.fn();
    render(<ResidentSearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('利用者名で検索...');
    fireEvent.change(input, { target: { value: 'テスト' } });
    expect(onSearch).toHaveBeenCalledWith('テスト');
  });

  it('クリアボタンでonSearchが空文字で呼ばれる', () => {
    const onSearch = vi.fn();
    render(<ResidentSearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('利用者名で検索...');
    fireEvent.change(input, { target: { value: 'テスト' } });
    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('classNameが適用される', () => {
    render(<ResidentSearchBar onSearch={vi.fn()} className="custom-class" />);
    const container = screen.getByPlaceholderText('利用者名で検索...').closest('div');
    expect(container?.parentElement).toHaveClass('custom-class');
  });
});
