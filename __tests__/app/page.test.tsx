import HomePage from '@/app/(main)/page';
import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

// Mock the CareBoard component
jest.mock('@/components/3_organisms/care-board/care-board', () => ({
  CareBoard: () => <div data-testid="care-board">CareBoard Component</div>,
}));

describe('HomePage', () => {
  it('renders CareBoard component', () => {
    render(<HomePage />);

    expect(screen.getByTestId('care-board')).toBeDefined();
  });
});
