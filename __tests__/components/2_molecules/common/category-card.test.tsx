import { CategoryCard } from '@/components/2_molecules/common/category-card';
import { render, screen } from '@testing-library/react';

// lucide-icon-registryのモック
vi.mock('@/lib/lucide-icon-registry', () => ({
  getLucideIcon: () => (props: any) => <svg data-testid="icon" {...props} />,
}));

describe('CategoryCard', () => {
  it('タイトルとアイコン、子要素が表示される', () => {
    render(
      <CategoryCard title="テストタイトル" icon="test-icon">
        <div>子要素</div>
      </CategoryCard>
    );
    expect(screen.getByText('テストタイトル')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('子要素')).toBeInTheDocument();
  });
});
