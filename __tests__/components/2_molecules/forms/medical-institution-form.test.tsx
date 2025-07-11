import { MedicalInstitutionForm } from '@/components/2_molecules/forms/medical-institution-form';
import { fireEvent, render, screen } from '@testing-library/react';

describe('MedicalInstitutionForm', () => {
  it('医療機関名入力欄が表示される', () => {
    render(<MedicalInstitutionForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText('医療機関名', { exact: false })).toBeInTheDocument();
  });
  it('onSubmitが呼ばれる', () => {
    const onSubmit = vi.fn(() => Promise.resolve(true));
    render(<MedicalInstitutionForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    // 必須フィールドを入力
    fireEvent.change(screen.getByLabelText('医療機関名', { exact: false }), {
      target: { value: 'テスト病院' },
    });
    fireEvent.change(screen.getByLabelText('医師名', { exact: false }), {
      target: { value: 'テスト医師' },
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
