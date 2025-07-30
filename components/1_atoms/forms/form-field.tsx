import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
  referenceDate?: string; // 基準日（初期表示月の設定に使用）
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = '',
  disabled = false,
  captionLayout,
  referenceDate,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {type === 'date' ? (
        <DatePicker
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
          )}
          mode="date"
          captionLayout={captionLayout}
          referenceDate={referenceDate}
        />
      ) : type === 'month' ? (
        <DatePicker
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
          )}
          mode="month"
          captionLayout={captionLayout}
          referenceDate={referenceDate}
        />
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500'
          )}
        />
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
