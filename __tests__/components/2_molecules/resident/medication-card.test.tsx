import { MedicationCard } from '@/components/2_molecules/resident/medication-card';
import type { MedicationInfo } from '@/mocks/care-board-data';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} data-testid="medication-image" />;
  },
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  __esModule: true,
  default: function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

describe('MedicationCard', () => {
  const mockMedication: MedicationInfo = {
    id: '1',
    medicationName: 'テスト薬剤',
    dosageInstructions: '1日1回 朝食後 1錠',
    startDate: '2024-01-15',
    endDate: '',
    prescribingInstitution: 'テスト病院',
    notes: 'テスト備考',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    // Backward compatibility
    institution: 'テスト病院',
    prescriptionDate: '2024/01/15',
    imageUrl: '/test-image.jpg',
  };

  it('renders medication information correctly', () => {
    render(<MedicationCard medication={mockMedication} />);

    expect(screen.getByText('薬情報')).toBeInTheDocument();
    expect(screen.getByText('テスト薬剤')).toBeInTheDocument();
    expect(screen.getByText('テスト病院')).toBeInTheDocument();
    expect(screen.getByText('2024/01/15')).toBeInTheDocument();
    expect(screen.getByText('テスト備考')).toBeInTheDocument();
  });

  it('renders medication image with correct props', () => {
    render(<MedicationCard medication={mockMedication} />);

    const image = screen.getByTestId('medication-image');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'テスト薬剤');
  });

  it('renders placeholder image when imageUrl is not provided', () => {
    const medicationWithoutImage = { ...mockMedication, imageUrl: undefined };
    render(<MedicationCard medication={medicationWithoutImage} />);

    const image = screen.getByTestId('medication-image');
    expect(image).toHaveAttribute('src', '/placeholder.svg?height=96&width=96&query=medication');
  });

  it('renders edit button', () => {
    render(<MedicationCard medication={mockMedication} />);

    expect(screen.getByText('編集する')).toBeInTheDocument();
  });

  it('renders image change link', () => {
    render(<MedicationCard medication={mockMedication} />);

    expect(screen.getByText('画像を変更')).toBeInTheDocument();
  });

  it('does not render notes section when notes is not provided', () => {
    const medicationWithoutNotes = { ...mockMedication, notes: undefined };
    render(<MedicationCard medication={medicationWithoutNotes} />);

    expect(screen.queryByText('備考:')).not.toBeInTheDocument();
  });

  it('renders all required medication fields', () => {
    render(<MedicationCard medication={mockMedication} />);

    expect(screen.getByText('調剤/処方医療機関:')).toBeInTheDocument();
    expect(screen.getByText('調剤年月日:')).toBeInTheDocument();
    expect(screen.getByText('備考:')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<MedicationCard medication={mockMedication} />);

    const card = screen.getByText('薬情報').closest('.mb-4');
    expect(card).toBeInTheDocument();
  });
});
