import { ResidentsToolbar } from '@/components/2_molecules/residents/residents-toolbar';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock the ResidentSearchBar component
jest.mock('@/components/2_molecules/residents/resident-search-bar', () => ({
  ResidentSearchBar: ({ onSearch, className }: any) => (
    <div data-testid="resident-search-bar" className={className}>
      <input
        type="text"
        placeholder="利用者を検索"
        onChange={(e) => onSearch(e.target.value)}
        data-testid="search-input"
      />
    </div>
  ),
}));

describe('ResidentsToolbar', () => {
  const defaultProps = {
    onSearch: jest.fn(),
    showDischargedResidents: false,
    onToggleDischargedResidents: jest.fn(),
    onCreateResident: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all toolbar elements correctly', () => {
    render(<ResidentsToolbar {...defaultProps} />);

    expect(screen.getByTestId('resident-search-bar')).toBeInTheDocument();
    expect(screen.getByText('新規利用者登録')).toBeInTheDocument();
    expect(screen.getByText('退所済み利用者も表示')).toBeInTheDocument();
    expect(screen.getByText('フィルター')).toBeInTheDocument();
    expect(screen.getByText('エクスポート')).toBeInTheDocument();
  });

  it('calls onCreateResident when create button is clicked', () => {
    render(<ResidentsToolbar {...defaultProps} />);

    fireEvent.click(screen.getByText('新規利用者登録'));

    expect(defaultProps.onCreateResident).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleDischargedResidents when switch is toggled', () => {
    render(<ResidentsToolbar {...defaultProps} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(defaultProps.onToggleDischargedResidents).toHaveBeenCalledWith(true);
  });

  it('displays switch as checked when showDischargedResidents is true', () => {
    render(<ResidentsToolbar {...defaultProps} showDischargedResidents={true} />);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  it('displays switch as unchecked when showDischargedResidents is false', () => {
    render(<ResidentsToolbar {...defaultProps} showDischargedResidents={false} />);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onSearch when search input changes', () => {
    render(<ResidentsToolbar {...defaultProps} />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'テスト検索' } });

    expect(defaultProps.onSearch).toHaveBeenCalledWith('テスト検索');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-toolbar-class';
    render(<ResidentsToolbar {...defaultProps} className={customClass} />);

    const toolbar = screen.getByTestId('resident-search-bar').closest('.space-y-4');
    expect(toolbar).toHaveClass(customClass);
  });

  it('renders filter button', () => {
    render(<ResidentsToolbar {...defaultProps} />);

    const filterButton = screen.getByText('フィルター');
    expect(filterButton).toBeInTheDocument();
    expect(filterButton).toHaveClass('border-input', 'bg-background');
  });

  it('renders export button', () => {
    render(<ResidentsToolbar {...defaultProps} />);

    const exportButton = screen.getByText('エクスポート');
    expect(exportButton).toBeInTheDocument();
    expect(exportButton).toHaveClass('border-input', 'bg-background');
  });

  it('renders create button with correct styling', () => {
    render(<ResidentsToolbar {...defaultProps} />);

    const createButton = screen.getByText('新規利用者登録');
    expect(createButton).toHaveClass('bg-carebase-blue', 'hover:bg-carebase-blue-dark');
  });

  it('renders switch with correct label', () => {
    render(<ResidentsToolbar {...defaultProps} />);

    const switchElement = screen.getByRole('switch');
    const label = screen.getByText('退所済み利用者も表示');

    expect(switchElement).toHaveAttribute('id', 'show-discharged');
    expect(label).toHaveAttribute('for', 'show-discharged');
  });
});
