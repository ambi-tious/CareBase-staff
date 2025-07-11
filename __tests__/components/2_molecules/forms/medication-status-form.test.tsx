import { MedicationStatusForm } from '@/components/2_molecules/forms/medication-status-form';
import { fireEvent, render, screen } from '@testing-library/react';

describe('MedicationStatusForm', () => {
  it('状態入力欄が表示される', () => {
    render(<MedicationStatusForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText('内容', { exact: false })).toBeInTheDocument();
  });
  it('onSubmitが呼ばれる', () => {
    const onSubmit = vi.fn(() => Promise.resolve(true));
    render(<MedicationStatusForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    // 必須フィールドを入力
    fireEvent.change(screen.getByLabelText('内容', { exact: false }), {
      target: { value: 'テスト状態' },
    });

    fireEvent.click(screen.getByRole('button', { name: /登録/ }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
