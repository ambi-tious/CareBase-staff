import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('Card', () => {
  it('デフォルトのpropsでレンダリングされる', () => {
    render(<Card>Card content</Card>);
    const card = screen.getByText('Card content');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-lg border bg-card text-card-foreground shadow-sm');
  });

  it('カスタムclassNameが適用される', () => {
    render(<Card className="custom-class">Card content</Card>);
    expect(screen.getByText('Card content')).toHaveClass('custom-class');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Card content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('追加のpropsが転送される', () => {
    render(
      <Card data-testid="test-card" aria-label="Test">
        Card content
      </Card>
    );
    const card = screen.getByTestId('test-card');
    expect(card).toHaveAttribute('aria-label', 'Test');
  });
});

describe('CardHeader', () => {
  it('デフォルトのpropsでレンダリングされる', () => {
    render(<CardHeader>Header content</CardHeader>);
    const header = screen.getByText('Header content');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('flex flex-col space-y-1.5 p-6');
  });

  it('カスタムclassNameが適用される', () => {
    render(<CardHeader className="custom-class">Header content</CardHeader>);
    expect(screen.getByText('Header content')).toHaveClass('custom-class');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>Header content</CardHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardTitle', () => {
  it('デフォルトのpropsでレンダリングされる', () => {
    render(<CardTitle>Title content</CardTitle>);
    const title = screen.getByText('Title content');
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('text-2xl font-semibold leading-none tracking-tight');
  });

  it('カスタムclassNameが適用される', () => {
    render(<CardTitle className="custom-class">Title content</CardTitle>);
    expect(screen.getByText('Title content')).toHaveClass('custom-class');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardTitle ref={ref}>Title content</CardTitle>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardDescription', () => {
  it('デフォルトのpropsでレンダリングされる', () => {
    render(<CardDescription>Description content</CardDescription>);
    const description = screen.getByText('Description content');
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-sm text-muted-foreground');
  });

  it('カスタムclassNameが適用される', () => {
    render(<CardDescription className="custom-class">Description content</CardDescription>);
    expect(screen.getByText('Description content')).toHaveClass('custom-class');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardDescription ref={ref}>Description content</CardDescription>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardContent', () => {
  it('デフォルトのpropsでレンダリングされる', () => {
    render(<CardContent>Content</CardContent>);
    const content = screen.getByText('Content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('p-6 pt-0');
  });

  it('カスタムclassNameが適用される', () => {
    render(<CardContent className="custom-class">Content</CardContent>);
    expect(screen.getByText('Content')).toHaveClass('custom-class');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Content</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardFooter', () => {
  it('デフォルトのpropsでレンダリングされる', () => {
    render(<CardFooter>Footer content</CardFooter>);
    const footer = screen.getByText('Footer content');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('flex items-center p-6 pt-0');
  });

  it('カスタムclassNameが適用される', () => {
    render(<CardFooter className="custom-class">Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toHaveClass('custom-class');
  });

  it('refが正しく転送される', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardFooter ref={ref}>Footer content</CardFooter>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('Card composition', () => {
  it('完全なカード構造をレンダリングする', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });
});
