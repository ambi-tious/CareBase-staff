import { renderHook, act } from '@testing-library/react';
import { useMedicationForm } from '@/hooks/useMedicationForm';
import type { MedicationFormData } from '@/types/medication';
import { jest } from '@jest/globals';

describe('useMedicationForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('initializes with default form data', () => {
    const { result } = renderHook(() =>
      useMedicationForm({
        onSubmit: mockOnSubmit,
      })
    );

    expect(result.current.formData).toEqual({
      medicationName: '',
      dosageInstructions: '',
      startDate: '',
      endDate: '',
      prescribingInstitution: '',
      notes: '',
    });
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.fieldErrors).toEqual({});
  });

  it('initializes with provided initial data', () => {
    const initialData: Partial<MedicationFormData> = {
      medicationName: 'Test Medicine',
      dosageInstructions: '1日1回',
    };

    const { result } = renderHook(() =>
      useMedicationForm({
        onSubmit: mockOnSubmit,
        initialData,
      })
    );

    expect(result.current.formData.medicationName).toBe('Test Medicine');
    expect(result.current.formData.dosageInstructions).toBe('1日1回');
  });

  it('updates field values correctly', () => {
    const { result } = renderHook(() =>
      useMedicationForm({
        onSubmit: mockOnSubmit,
      })
    );

    act(() => {
      result.current.updateField('medicationName', 'New Medicine');
    });

    expect(result.current.formData.medicationName).toBe('New Medicine');
  });

  it('validates required fields', async () => {
    const { result } = renderHook(() =>
      useMedicationForm({
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      const success = await result.current.handleSubmit();
      expect(success).toBe(false);
    });

    expect(result.current.fieldErrors.medicationName).toBeDefined();
    expect(result.current.fieldErrors.dosageInstructions).toBeDefined();
    expect(result.current.fieldErrors.startDate).toBeDefined();
    expect(result.current.fieldErrors.prescribingInstitution).toBeDefined();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates date range correctly', async () => {
    const { result } = renderHook(() =>
      useMedicationForm({
        onSubmit: mockOnSubmit,
      })
    );

    // Set valid required fields
    act(() => {
      result.current.updateField('medicationName', 'Test Medicine');
      result.current.updateField('dosageInstructions', '1日1回');
      result.current.updateField('startDate', '2025-12-31');
      result.current.updateField('endDate', '2025-01-01'); // End date before start date
      result.current.updateField('prescribingInstitution', 'Test Hospital');
    });

    await act(async () => {
      const success = await result.current.handleSubmit();
      expect(success).toBe(false);
    });

    expect(result.current.fieldErrors.endDate).toBeDefined();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits successfully with valid data', async () => {
    mockOnSubmit.mockResolvedValue(true);

    const { result } = renderHook(() =>
      useMedicationForm({
        onSubmit: mockOnSubmit,
      })
    );

    // Set valid data
    act(() => {
      result.current.updateField('medicationName', 'Test Medicine');
      result.current.updateField('dosageInstructions', '1日1回 朝食後');
      result.current.updateField('startDate', '2025-01-01');
      result.current.updateField('endDate', '2025-12-31');
      result.current.updateField('prescribingInstitution', 'Test Hospital');
      result.current.updateField('notes', 'Test notes');
    });

    await act(async () => {
      const success = await result.current.handleSubmit();
      expect(success).toBe(true);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      medicationName: 'Test Medicine',
      dosageInstructions: '1日1回 朝食後',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      prescribingInstitution: 'Test Hospital',
      notes: 'Test notes',
    });
  });

  it('handles submission errors correctly', async () => {
    mockOnSubmit.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() =>
      useMedicationForm({
        onSubmit: mockOnSubmit,
      })
    );

    // Set valid data
    act(() => {
      result.current.updateField('medicationName', 'Test Medicine');
      result.current.updateField('dosageInstructions', '1日1回');
      result.current.updateField('startDate', '2025-01-01');
      result.current.updateField('prescribingInstitution', 'Test Hospital');
    });

    await act(async () => {
      const success = await result.current.handleSubmit();
      expect(success).toBe(false);
    });

    expect(result.current.error).toContain('ネットワークエラー');
  });

  it('clears field errors when updating fields', () => {
    const { result } = renderHook(() =>
      useMedicationForm({
        onSubmit: mockOnSubmit,
      })
    );

    // First, trigger validation to set field errors
    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.fieldErrors.medicationName).toBeDefined();

    // Then update the field
    act(() => {
      result.current.updateField('medicationName', 'New Medicine');
    });

    expect(result.current.fieldErrors.medicationName).toBeUndefined();
  });

  it('resets form correctly', () => {
    const initialData = { medicationName: 'Initial Medicine' };

    const { result } = renderHook(() =>
      useMedicationForm({
        onSubmit: mockOnSubmit,
        initialData,
      })
    );

    // Update some fields
    act(() => {
      result.current.updateField('medicationName', 'Changed Medicine');
      result.current.updateField('dosageInstructions', 'Changed dosage');
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.formData.medicationName).toBe('Initial Medicine');
    expect(result.current.formData.dosageInstructions).toBe('');
    expect(result.current.error).toBeNull();
    expect(result.current.fieldErrors).toEqual({});
  });
});
