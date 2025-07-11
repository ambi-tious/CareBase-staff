import HomePage from '@/app/(main)/page';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the CareBoard component
vi.mock('@/components/3_organisms/care-board/care-board', () => ({
  CareBoard: () => <div data-testid="care-board">CareBoard Component</div>,
}));

describe('ホームページ', () => {
  it('CareBoardコンポーネントをレンダリングする', () => {
    render(<HomePage />);

    expect(screen.getByTestId('care-board')).toBeDefined();
  });
});
