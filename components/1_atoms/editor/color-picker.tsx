import type React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorOption {
  value: string;
  label: string;
  color: string;
}

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  options: ColorOption[];
  disabled?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  options,
  disabled = false,
}) => {
  const selectedColor = options.find((option) => option.value === value);

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <Button variant="outline" size="sm" className="h-8 border-0 flex items-center gap-1 px-2">
          <div
            className="h-4 w-4 rounded-sm border"
            style={{ backgroundColor: selectedColor?.color || '#000000' }}
          />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1">
        <div className="grid grid-cols-4 gap-1">
          {options.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              className="h-8 w-8 p-0 rounded-md flex items-center justify-center"
              onClick={() => onChange(option.value)}
              title={option.label}
            >
              <div
                className="h-6 w-6 rounded-sm border flex items-center justify-center"
                style={{ backgroundColor: option.color }}
              >
                {value === option.value && <Check className="h-3 w-3 text-white" />}
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};