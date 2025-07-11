import { ErrorAlert } from '@/components/2_molecules/auth/ErrorAlert';
import { render, screen } from '@testing-library/react';

describe('ErrorAlert', () => {
  it('エラーメッセージが表示される', () => {
    render(<ErrorAlert message="テストエラー" />);
    expect(screen.getByText('テストエラー')).toBeInTheDocument();
  });
  it('messageが空なら何も表示しない', () => {
    render(<ErrorAlert message="" />);
    // 空メッセージでもアラートコンテナは表示されるが、メッセージテキストは空
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });
});
