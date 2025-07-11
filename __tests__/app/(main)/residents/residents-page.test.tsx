import ResidentsPage from '@/app/(main)/residents/page';
import { render, screen } from '@testing-library/react';

// Mock the ResidentsList component
vi.mock('@/components/3_organisms/residents/residents-list', () => ({
  ResidentsList: () => <div data-testid="residents-list">Residents List Component</div>,
}));

describe('入居者ページ', () => {
  it('ResidentsListコンポーネントで入居者ページをレンダリングする', () => {
    render(<ResidentsPage />);

    expect(screen.getByTestId('residents-list')).toBeInTheDocument();
    expect(screen.getByText('Residents List Component')).toBeInTheDocument();
  });

  it('ResidentsListコンポーネントを正しくレンダリングする', () => {
    render(<ResidentsPage />);

    const residentsList = screen.getByTestId('residents-list');
    expect(residentsList).toBeInTheDocument();
  });
});
