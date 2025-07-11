import HomePage from '@/app/(main)/page';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the CareBoard component
vi.mock('@/components/3_organisms/care-board/care-board', () => ({
  CareBoard: () => <div data-testid="care-board">Care Board Component</div>,
}));

describe('HomePage', () => {
  it('renders home page with CareBoard component', () => {
    render(<HomePage />);

    expect(screen.getByTestId('care-board')).toBeInTheDocument();
    expect(screen.getByText('Care Board Component')).toBeInTheDocument();
  });

  it('renders CareBoard component correctly', () => {
    render(<HomePage />);

    const careBoard = screen.getByTestId('care-board');
    expect(careBoard).toBeInTheDocument();
  });
});
