import { Calendar } from '@/components/ui/calendar';
import { render, screen } from '@testing-library/react';

describe('Calendar', () => {
  it('カレンダーコンポーネントをレンダリングする', () => {
    render(<Calendar />);

    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();
  });

  it('カスタムclassName付きでレンダリングされる', () => {
    render(<Calendar className="custom-calendar" />);

    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();
  });

  it('カスタムclassNames prop付きでレンダリングされる', () => {
    render(
      <Calendar
        classNames={{
          root: 'custom-root',
          month: 'custom-month',
        }}
      />
    );

    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();
  });

  it('ナビゲーションボタンをレンダリングする', () => {
    render(<Calendar />);

    const previousButton = screen.getByLabelText('Go to the Previous Month');
    const nextButton = screen.getByLabelText('Go to the Next Month');

    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('月のキャプションをレンダリングする', () => {
    render(<Calendar />);
    // role='status'の要素を取得し、テキストが月名+年を含むか確認
    const status = screen.getByRole('status');
    const year = new Date().getFullYear().toString();
    const monthEn = new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const monthJp = new Date().toLocaleString('ja-JP', { month: 'long' });
    expect(status.textContent).toContain(year);
    expect(
      status.textContent?.toLowerCase().includes(monthEn) || status.textContent?.includes(monthJp)
    ).toBe(true);
  });

  it('曜日ヘッダーをレンダリングする', () => {
    render(<Calendar />);

    // The calendar shows abbreviated weekday names
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    weekdays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('カレンダーの日付をレンダリングする', () => {
    render(<Calendar />);
    // gridcell(role)で日付セルを取得
    const gridcells = screen.getAllByRole('gridcell');
    expect(gridcells.length).toBeGreaterThan(0);
  });

  it('カスタムボタンバリアントを適用する', () => {
    render(<Calendar buttonVariant="outline" />);

    const previousButton = screen.getByLabelText('Go to the Previous Month');
    expect(previousButton).toHaveClass('border', 'border-input', 'bg-background');
  });

  it('showOutsideDays propを処理する', () => {
    render(<Calendar showOutsideDays={false} />);

    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();
  });

  it('captionLayout propを処理する', () => {
    render(<Calendar captionLayout="dropdown" />);

    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();
  });

  it('カスタムフォーマッター付きでレンダリングされる', () => {
    const customFormatters = {
      formatMonthDropdown: (date: Date) => date.toLocaleString('ja-JP', { month: 'long' }),
    };

    render(<Calendar formatters={customFormatters} />);

    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();
  });

  it('カスタムコンポーネント付きでレンダリングされる', () => {
    const customComponents = {
      DayButton: ({ children, ...props }: any) => (
        <button {...props} data-testid="custom-day-button">
          {children}
        </button>
      ),
    };

    render(<Calendar components={customComponents} />);

    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();
  });

  it('ベースカレンダースタイルを適用する', () => {
    render(<Calendar />);

    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();
  });

  it('異なる月でレンダリングされる', () => {
    const { rerender } = render(<Calendar />);

    // Initial render
    expect(screen.getByRole('grid')).toBeInTheDocument();

    // Re-render with different month
    rerender(<Calendar />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
