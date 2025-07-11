import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('Alert', () => {
  it('デフォルトのpropsでレンダリングされる', () => {
    render(<Alert>Alert content</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('bg-background text-foreground');
  });

  it('destructiveバリアントでレンダリングされる', () => {
    render(<Alert variant="destructive">Destructive alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-destructive/50 text-destructive');
  });

  it('カスタムclassNameが適用される', () => {
    render(<Alert className="custom-class">Alert content</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Alert content</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('追加のpropsが転送される', () => {
    render(
      <Alert data-testid="test-alert" aria-label="Test">
        Alert content
      </Alert>
    );
    const alert = screen.getByTestId('test-alert');
    expect(alert).toHaveAttribute('aria-label', 'Test');
  });
});

describe('AlertTitle', () => {
  it('デフォルトのpropsでレンダリングされる', () => {
    render(<AlertTitle>Alert Title</AlertTitle>);
    const title = screen.getByText('Alert Title');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H5');
    expect(title).toHaveClass('mb-1 font-medium leading-none tracking-tight');
  });

  it('カスタムclassNameが適用される', () => {
    render(<AlertTitle className="custom-class">Alert Title</AlertTitle>);
    expect(screen.getByText('Alert Title')).toHaveClass('custom-class');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<AlertTitle ref={ref}>Alert Title</AlertTitle>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it('追加のpropsが転送される', () => {
    render(
      <AlertTitle data-testid="test-title" aria-label="Test">
        Alert Title
      </AlertTitle>
    );
    const title = screen.getByTestId('test-title');
    expect(title).toHaveAttribute('aria-label', 'Test');
  });
});

describe('AlertDescription', () => {
  it('デフォルトのpropsでレンダリングされる', () => {
    render(<AlertDescription>Alert description</AlertDescription>);
    const description = screen.getByText('Alert description');
    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe('DIV');
    expect(description).toHaveClass('text-sm [&_p]:leading-relaxed');
  });

  it('カスタムclassNameが適用される', () => {
    render(<AlertDescription className="custom-class">Alert description</AlertDescription>);
    expect(screen.getByText('Alert description')).toHaveClass('custom-class');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(<AlertDescription ref={ref}>Alert description</AlertDescription>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('追加のpropsが転送される', () => {
    render(
      <AlertDescription data-testid="test-desc" aria-label="Test">
        Alert description
      </AlertDescription>
    );
    const description = screen.getByTestId('test-desc');
    expect(description).toHaveAttribute('aria-label', 'Test');
  });
});

describe('Alert composition', () => {
  it('完全なアラート構造をレンダリングする', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert description')).toBeInTheDocument();
  });

  it('destructiveアラートをタイトルと説明付きでレンダリングする', () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error Title</AlertTitle>
        <AlertDescription>Error description</AlertDescription>
      </Alert>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-destructive/50 text-destructive');
    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error description')).toBeInTheDocument();
  });
});
