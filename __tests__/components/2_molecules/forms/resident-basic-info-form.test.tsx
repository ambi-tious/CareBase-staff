import { ResidentBasicInfoForm } from '@/components/2_molecules/forms/resident-basic-info-form';
import { fireEvent, render, screen } from '@testing-library/react';

describe('ResidentBasicInfoForm', () => {
  const mockData = {
    name: '',
    furigana: '',
    dob: '',
    sex: '' as const,
    careLevel: '',
    floorGroup: '',
    unitTeam: '',
    roomInfo: '',
    address: '',
    admissionDate: '',
  };

  it('氏名入力欄が表示される', () => {
    render(<ResidentBasicInfoForm data={mockData} onChange={jest.fn()} errors={{}} />);
    expect(screen.getByLabelText('氏名', { exact: false })).toBeInTheDocument();
  });
  it('onChangeが呼ばれる', () => {
    const onChange = jest.fn();
    render(<ResidentBasicInfoForm data={mockData} onChange={onChange} errors={{}} />);
    fireEvent.change(screen.getByLabelText('氏名', { exact: false }), {
      target: { value: 'テスト太郎' },
    });
    expect(onChange).toHaveBeenCalledWith({ ...mockData, name: 'テスト太郎' });
  });
});
