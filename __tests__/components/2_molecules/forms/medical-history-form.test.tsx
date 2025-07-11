import { MedicalHistoryForm } from '@/components/2_molecules/forms/medical-history-form';
import { fireEvent, render, screen } from '@testing-library/react';

describe('MedicalHistoryForm', () => {
  it('病名入力欄が表示される', () => {
    render(<MedicalHistoryForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText('病名', { exact: false })).toBeInTheDocument();
  });
  it('onSubmitが呼ばれる', () => {
    const onSubmit = vi.fn(() => Promise.resolve(true));
    render(<MedicalHistoryForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    // 必須フィールドを入力
    fireEvent.change(screen.getByLabelText('病名', { exact: false }), {
      target: { value: 'テスト病名' },
    });
    fireEvent.change(screen.getByLabelText('発症年月', { exact: false }), {
      target: { value: '2025-01' },
    });

    fireEvent.click(screen.getByRole('button', { name: /登録/ }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
