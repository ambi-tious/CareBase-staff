import { InfoRow } from '@/components/1_atoms/info-row';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('InfoRow', () => {
  it('renders label and value correctly', () => {
    render(<InfoRow label="テストラベル" value="テスト値" />);

    expect(screen.getByText('テストラベル')).toBeInTheDocument();
    expect(screen.getByText('テスト値')).toBeInTheDocument();
  });

  it('renders dash when value is null', () => {
    render(<InfoRow label="テストラベル" value={null} />);

    expect(screen.getByText('テストラベル')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders dash when value is undefined', () => {
    render(<InfoRow label="テストラベル" />);

    expect(screen.getByText('テストラベル')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <InfoRow label="テストラベル" value="テスト値" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders numeric values correctly', () => {
    render(<InfoRow label="年齢" value={85} />);

    expect(screen.getByText('年齢')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });
});
