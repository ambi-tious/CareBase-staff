import { MedicationForm } from '@/components/2_molecules/forms/medication-form';
import { fireEvent, render, screen } from '@testing-library/react';

describe('MedicationForm', () => {
  it('薬剤名入力欄が表示される', () => {
    render(<MedicationForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByLabelText('薬剤名', { exact: false })).toBeInTheDocument();
  });
  it('onSubmitが呼ばれる', () => {
    const onSubmit = jest.fn(() => Promise.resolve(true));
    render(<MedicationForm onSubmit={onSubmit} onCancel={jest.fn()} />);

    // 必須フィールドを入力
    fireEvent.change(screen.getByLabelText('薬剤名', { exact: false }), {
      target: { value: 'テスト薬' },
    });
    fireEvent.change(screen.getByLabelText('用法・用量', { exact: false }), {
      target: { value: '1日1回' },
    });
    fireEvent.change(screen.getByLabelText('処方医療機関', { exact: false }), {
      target: { value: 'テスト病院' },
    });
    fireEvent.change(screen.getByLabelText('服用開始日', { exact: false }), {
      target: { value: '2025-01-01' },
    });

    fireEvent.click(screen.getByRole('button', { name: /登録/ }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
