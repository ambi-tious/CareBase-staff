import { ContactForm } from '@/components/2_molecules/forms/contact-form';
import { render, screen } from '@testing-library/react';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('ContactForm', () => {
  it('フォームの各入力欄が表示される', () => {
    render(<ContactForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByLabelText('氏名', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('電話番号1', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('備考', { exact: false })).toBeInTheDocument();
  });
});
