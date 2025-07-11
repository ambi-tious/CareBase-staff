import { Badge } from '@/components/ui/badge';
import { render, screen } from '@testing-library/react';

describe('Badge', () => {
  it('デフォルトバリアントでレンダリングされる', () => {
    render(<Badge>Test Badge</Badge>);

    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground');
  });

  it('secondaryバリアントでレンダリングされる', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);

    const badge = screen.getByText('Secondary Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground');
  });

  it('destructiveバリアントでレンダリングされる', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);

    const badge = screen.getByText('Destructive Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      'border-transparent',
      'bg-destructive',
      'text-destructive-foreground'
    );
  });

  it('outlineバリアントでレンダリングされる', () => {
    render(<Badge variant="outline">Outline Badge</Badge>);

    const badge = screen.getByText('Outline Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-foreground');
  });

  it('カスタムclassNameが適用される', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);

    const badge = screen.getByText('Custom Badge');
    expect(badge).toHaveClass('custom-class');
  });

  it('追加のpropsが転送される', () => {
    render(
      <Badge data-testid="test-badge" aria-label="Test badge">
        Test Badge
      </Badge>
    );

    const badge = screen.getByTestId('test-badge');
    expect(badge).toHaveAttribute('aria-label', 'Test badge');
  });

  it('ベースバッジスタイルが適用される', () => {
    render(<Badge>Test Badge</Badge>);

    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-ring',
      'focus:ring-offset-2'
    );
  });

  it('異なるコンテンツでレンダリングされる', () => {
    const { rerender } = render(<Badge>First Badge</Badge>);
    expect(screen.getByText('First Badge')).toBeInTheDocument();

    rerender(<Badge>Second Badge</Badge>);
    expect(screen.getByText('Second Badge')).toBeInTheDocument();
  });

  it('バリアントとカスタムクラスを組み合わせる', () => {
    render(
      <Badge variant="secondary" className="custom-class">
        Combined Badge
      </Badge>
    );

    const badge = screen.getByText('Combined Badge');
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground', 'custom-class');
  });
});
