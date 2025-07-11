import { MedicationCard } from '@/components/2_molecules/medication/medication-card';
import type { Medication } from '@/types/medication';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Mock the medication service
jest.mock('@/services/medicationService', () => ({
  medicationService: {
    updateMedication: jest.fn(),
    deleteMedication: jest.fn(),
  },
}));

const mockMedication: Medication = {
  id: 'med-1',
  medicationName: 'アムロジピン錠5mg',
  dosageInstructions: '1日1回 朝食後 1錠',
  startDate: '2025-01-15',
  endDate: '',
  prescribingInstitution: '松本内科クリニック',
  notes: '血圧管理のため継続服用中',
  createdAt: '2025-01-15T00:00:00.000Z',
  updatedAt: '2025-01-15T00:00:00.000Z',
};

describe('薬剤カード', () => {
  const mockProps = {
    medication: mockMedication,
    residentId: 1,
    residentName: '佐藤清',
    onMedicationUpdate: jest.fn(),
    onMedicationDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('薬剤情報を正しくレンダリングする', () => {
    render(<MedicationCard {...mockProps} />);

    expect(screen.getByText('アムロジピン錠5mg')).toBeInTheDocument();
    expect(screen.getByText('1日1回 朝食後 1錠')).toBeInTheDocument();
    expect(screen.getByText('松本内科クリニック')).toBeInTheDocument();
    expect(screen.getByText('血圧管理のため継続服用中')).toBeInTheDocument();
    expect(screen.getByText('服用中')).toBeInTheDocument();
  });

  it('継続中の薬剤に対して正しいステータスを表示する', () => {
    render(<MedicationCard {...mockProps} />);

    const statusBadge = screen.getByText('服用中');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('終了した薬剤に対して正しいステータスを表示する', () => {
    const endedMedication = {
      ...mockMedication,
      endDate: '2024-12-31',
    };

    render(<MedicationCard {...mockProps} medication={endedMedication} />);

    const statusBadge = screen.getByText('服用終了');
    expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-700');
  });

  it('フォーマットされた日付を正しく表示する', () => {
    render(<MedicationCard {...mockProps} />);

    expect(screen.getByText('2025/1/15')).toBeInTheDocument();
  });

  it('編集ボタンがクリックされたときに編集モーダルを開く', async () => {
    render(<MedicationCard {...mockProps} />);

    const editButton = screen.getByRole('button', { name: /編集/i });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByTestId('medication-modal')).toBeInTheDocument();
    });
  });

  it('削除ボタンがクリックされたときに削除モーダルを開く', async () => {
    render(<MedicationCard {...mockProps} />);

    const deleteButton = screen.getByRole('button', { name: /削除/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    });
  });

  it('終了日がない薬剤を処理する', () => {
    render(<MedicationCard {...mockProps} />);

    expect(screen.queryByText('服用終了日:')).not.toBeInTheDocument();
  });

  it('メモがない薬剤を処理する', () => {
    const medicationWithoutNotes = {
      ...mockMedication,
      notes: undefined,
    };

    render(<MedicationCard {...mockProps} medication={medicationWithoutNotes} />);

    expect(screen.queryByText('メモ:')).not.toBeInTheDocument();
  });

  it('終了日が提供された場合に終了日を表示する', () => {
    const medicationWithEndDate = {
      ...mockMedication,
      endDate: '2025-12-31',
    };

    render(<MedicationCard {...mockProps} medication={medicationWithEndDate} />);

    expect(screen.getByText('服用終了日:')).toBeInTheDocument();
    expect(screen.getByText('2025/12/31')).toBeInTheDocument();
  });
});
