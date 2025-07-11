import { NavigationLink } from '@/components/2_molecules/common/navigation-link';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));
vi.mock('@/lib/lucide-icon-registry', () => ({
  getLucideIcon: () => (props: any) => <svg data-testid="icon" {...props} />,
}));

describe('NavigationLink', () => {
  it('ラベルとアイコンが表示される', () => {
    render(
      <NavigationLink label="テストラベル" href="/test" icon="test-icon" setIsMenuOpen={vi.fn()} />
    );
    expect(screen.getByText('テストラベル')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('クリック時にsetIsMenuOpenが呼ばれる', () => {
    const setIsMenuOpen = vi.fn();
    render(
      <NavigationLink
        label="テストラベル"
        href="/test"
        icon="test-icon"
        setIsMenuOpen={setIsMenuOpen}
      />
    );
    fireEvent.click(screen.getByText('テストラベル'));
    expect(setIsMenuOpen).toHaveBeenCalledWith(false);
  });
});
