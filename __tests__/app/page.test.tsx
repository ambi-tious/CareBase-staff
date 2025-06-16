import { render, screen } from '@testing-library/react';
import HomePage from '@/app/(main)/page';
import jest from 'jest'; // Import jest to fix the undeclared variable error

// Mock the CareBoard component
jest.mock('@/components/3_organisms/care-board', () => ({
  CareBoard: () => <div data-testid="care-board">CareBoard Component</div>,
}));

describe('HomePage', () => {
  it('renders CareBoard component', () => {
    render(<HomePage />);

    expect(screen.getByTestId('care-board')).toBeInTheDocument();
  });
});
