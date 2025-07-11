import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

describe('Popover', () => {
  it('ポップオーバートリガーをレンダリングする', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
      </Popover>
    );

    expect(screen.getByText('Open Popover')).toBeInTheDocument();
  });

  it('トリガーがクリックされたときにポップオーバーが開く', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    );

    const trigger = screen.getByText('Open Popover');
    fireEvent.click(trigger);

    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it.skip('外側をクリックしたときにポップオーバーが閉じる', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    );

    const trigger = screen.getByText('Open Popover');
    fireEvent.click(trigger);

    expect(screen.getByText('Popover content')).toBeInTheDocument();

    // Click outside
    fireEvent.click(document.body);

    expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
  });

  it('コンテンツにカスタムclassNameを適用する', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent className="custom-class">Popover content</PopoverContent>
      </Popover>
    );

    const trigger = screen.getByText('Open Popover');
    fireEvent.click(trigger);

    const content = screen.getByText('Popover content');
    expect(content).toHaveClass('custom-class');
  });

  it('コンテンツにデフォルトスタイルを適用する', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    );

    const trigger = screen.getByText('Open Popover');
    fireEvent.click(trigger);

    const content = screen.getByText('Popover content');
    expect(content).toHaveClass(
      'z-50',
      'w-72',
      'rounded-md',
      'border',
      'bg-popover',
      'p-4',
      'text-popover-foreground',
      'shadow-md'
    );
  });

  it('コンテンツにrefを転送する', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent ref={ref}>Popover content</PopoverContent>
      </Popover>
    );

    const trigger = screen.getByText('Open Popover');
    fireEvent.click(trigger);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('カスタムalign propを処理する', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent align="start">Popover content</PopoverContent>
      </Popover>
    );

    const trigger = screen.getByText('Open Popover');
    fireEvent.click(trigger);

    const content = screen.getByText('Popover content');
    expect(content).toBeInTheDocument();
  });

  it('カスタムsideOffset propを処理する', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent sideOffset={8}>Popover content</PopoverContent>
      </Popover>
    );

    const trigger = screen.getByText('Open Popover');
    fireEvent.click(trigger);

    const content = screen.getByText('Popover content');
    expect(content).toBeInTheDocument();
  });

  it('コンテンツに追加のpropsを転送する', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent data-testid="popover-content" aria-label="Test popover">
          Popover content
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByText('Open Popover');
    fireEvent.click(trigger);

    const content = screen.getByTestId('popover-content');
    expect(content).toHaveAttribute('aria-label', 'Test popover');
  });

  it('異なるコンテンツでレンダリングされる', () => {
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <div>Complex content</div>
          <button>Action button</button>
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByText('Open Popover');
    fireEvent.click(trigger);

    expect(screen.getByText('Complex content')).toBeInTheDocument();
    expect(screen.getByText('Action button')).toBeInTheDocument();
  });

  it('複数のポップオーバーを処理する', () => {
    render(
      <div>
        <Popover>
          <PopoverTrigger>First Popover</PopoverTrigger>
          <PopoverContent>First content</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>Second Popover</PopoverTrigger>
          <PopoverContent>Second content</PopoverContent>
        </Popover>
      </div>
    );

    const firstTrigger = screen.getByText('First Popover');
    const secondTrigger = screen.getByText('Second Popover');

    fireEvent.click(firstTrigger);
    expect(screen.getByText('First content')).toBeInTheDocument();

    fireEvent.click(secondTrigger);
    expect(screen.getByText('Second content')).toBeInTheDocument();
  });
});
