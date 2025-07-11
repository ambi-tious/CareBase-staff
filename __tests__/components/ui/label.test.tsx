import { Label } from '@/components/ui/label';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('ラベルコンポーネント', () => {
  it('デフォルトのpropsでレンダリングされる', () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
    );
  });

  it('カスタムclassNameが適用される', () => {
    render(<Label className="custom-class">Test Label</Label>);
    expect(screen.getByText('Test Label')).toHaveClass('custom-class');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Test Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it('追加のpropsが転送される', () => {
    render(
      <Label data-testid="test-label" htmlFor="input-id">
        Test Label
      </Label>
    );
    const label = screen.getByTestId('test-label');
    expect(label).toHaveAttribute('for', 'input-id');
  });

  it('フォームコントロールと関連付けられる', () => {
    render(
      <div>
        <Label htmlFor="test-input">Test Label</Label>
        <input id="test-input" />
      </div>
    );

    const label = screen.getByText('Test Label');
    const input = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toHaveAttribute('id', 'test-input');
  });

  it('無効状態のスタイリングを処理する', () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText('Test Label');

    // Check that the peer-disabled classes are present
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed');
    expect(label).toHaveClass('peer-disabled:opacity-70');
  });
});
