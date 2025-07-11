import { renderHook, act } from '@testing-library/react';
import { useMedicationStatusForm } from '@/hooks/useMedicationStatusForm';
import type { MedicationStatusFormData } from '@/types/medication-status';
import { jest } from '@jest/globals';

describe('useMedicationStatusForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('initializes with default form data', () => {
    const { result } = renderHook(() =>
      useMedicationStatusForm({
        onSubmit: mockOnSubmit,
      })
    );

    const today = new Date().toISOString().split('T')[0];
    expect(result.current.formData).toEqual({
      date: today,
      content: '',
      notes: '',
    });
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.fieldErrors).toEqual({});
  });

  it('initializes with provided initial data', () => {
    const initialData: Partial<MedicationStatusFormData> = {
      content: 'Test content',
      notes: 'Test notes',
    };

    const { result } = renderHook(() =>
      useMedicationStatusForm({
        onSubmit: mockOnSubmit,
        initialData,
      })
    );

    expect(result.current.formData.content).toBe('Test content');
    expect(result.current.formData.notes).toBe('Test notes');
  });

  it('updates field values correctly', () => {
    const { result } = renderHook(() =>
      useMedicationStatusForm({
        onSubmit: mockOnSubmit,
      })
    );

    act(() => {
      result.current.updateField('content', 'New content');
    });

    expect(result.current.formData.content).toBe('New content');
  });

  it('validates required fields', async () => {
    const { result } = renderHook(() =>
      useMedicationStatusForm({
        onSubmit: mockOnSubmit,
      })
    );

    // Clear the content field to trigger validation error
    act(() => {
      result.current.updateField('content', '');
    });

    await act(async () => {
      const success = await result.current.handleSubmit();
      expect(success).toBe(false);
    });

    expect(result.current.fieldErrors.content).toBeDefined();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates date is not in the future', async () => {
    const { result } = renderHook(() =>
      useMedicationStatusForm({
        onSubmit: mockOnSubmit,
      })
    );

    // Set a future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    act(() => {
      result.current.updateField('date', futureDateString);
      result.current.updateField('content', 'Test content');
    });

    await act(async () => {
      const success = await result.current.handleSubmit();
      expect(success).toBe(false);
    });

    expect(result.current.fieldErrors.date).toBeDefined();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits successfully with valid data', async () => {
    mockOnSubmit.mockResolvedValue(true);

    const { result } = renderHook(() =>
      useMedicationStatusForm({
        onSubmit: mockOnSubmit,
      })
    );

    // Set valid data
    act(() => {
      result.current.updateField('date', '2025-01-15');
      result.current.updateField('content', 'Test medication status');
      result.current.updateField('notes', 'Test notes');
    });

    await act(async () => {
      const success = await result.current.handleSubmit();
      expect(success).toBe(true);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      date: '2025-01-15',
      content: 'Test medication status',
      notes: 'Test notes',
    });
  });

  it('handles submission errors correctly', async () => {
    mockOnSubmit.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() =>
      useMedicationStatusForm({
        onSubmit: mockOnSubmit,
      })
    );

    // Set valid data
    act(() => {
      result.current.updateField('date', '2025-01-15');
      result.current.updateField('content', 'Test content');
    });

    await act(async () => {
      const success = await result.current.handleSubmit();
      expect(success).toBe(false);
    });

    expect(result.current.error).toContain('ネットワークエラー');
  });

  it('validates content length', async () => {
    const { result } = renderHook(() =>
      useMedicationStatusForm({
        onSubmit: mockOnSubmit,
      })
    );

    // Set content that exceeds maximum length
    const longContent = 'a'.repeat(501);

    act(() => {
      result.current.updateField('content', longContent);
    });

    await act(async () => {
      const success = await result.current.handleSubmit();
      expect(success).toBe(false);
    });

    expect(result.current.fieldErrors.content).toBeDefined();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('clears field errors when updating fields', () => {
    const { result } = renderHook(() =>
      useMedicationStatusForm({
        onSubmit: mockOnSubmit,
      })
    );

    // First, trigger validation to set field errors
    act(() => {
      result.current.updateField('content', '');
      result.current.handleSubmit();
    });

    expect(result.current.fieldErrors.content).toBeDefined();

    // Then update the field
    act(() => {
      result.current.updateField('content', 'New content');
    });

    expect(result.current.fieldErrors.content).toBeUndefined();
  });

  it('resets form correctly', () => {
    const initialData = { content: 'Initial content' };

    const { result } = renderHook(() =>
      useMedicationStatusForm({
        onSubmit: mockOnSubmit,
        initialData,
      })
    );

    // Update some fields
    act(() => {
      result.current.updateField('content', 'Changed content');
      result.current.updateField('notes', 'Changed notes');
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.formData.content).toBe('Initial content');
    expect(result.current.formData.notes).toBe('');
    expect(result.current.error).toBeNull();
    expect(result.current.fieldErrors).toEqual({});
  });
});
