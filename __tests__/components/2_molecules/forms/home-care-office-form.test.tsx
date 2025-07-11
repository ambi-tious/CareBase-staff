import { HomeCareOfficeForm } from '@/components/2_molecules/forms/home-care-office-form';
import { fireEvent, render, screen } from '@testing-library/react';

describe('HomeCareOfficeForm', () => {
  it('事業所名入力欄が表示される', () => {
    render(<HomeCareOfficeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText('事業所名', { exact: false })).toBeInTheDocument();
  });
  it('onSubmitが呼ばれる', () => {
    const onSubmit = vi.fn(() => Promise.resolve(true));
    render(<HomeCareOfficeForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    // 必須フィールドを入力
    fireEvent.change(screen.getByLabelText('事業所名', { exact: false }), {
      target: { value: 'テスト事業所' },
    });
    fireEvent.change(screen.getByLabelText('ケアマネージャー', { exact: false }), {
      target: { value: 'テストマネージャー' },
    });
    fireEvent.change(screen.getByLabelText('電話番号', { exact: false }), {
      target: { value: '09012345678' },
    });
    fireEvent.change(screen.getByLabelText('住所', { exact: false }), {
      target: { value: 'テスト住所' },
    });

    fireEvent.click(screen.getByRole('button', { name: /登録/ }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
