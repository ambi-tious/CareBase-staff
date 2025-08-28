'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { medicalMasterService } from '@/services/medicalMasterService';
import type { DoctorOption } from '@/types/medical-master';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

interface DoctorComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  medicalInstitutionName?: string; // 医療機関名での絞り込み
  placeholder?: string;
  disabled?: boolean;
  allowCustomValue?: boolean;
  className?: string;
}

export const DoctorCombobox: React.FC<DoctorComboboxProps> = ({
  value = '',
  onValueChange,
  medicalInstitutionName,
  placeholder = '医師を選択してください',
  disabled = false,
  allowCustomValue = true,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<DoctorOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  // 医師オプションを読み込み
  React.useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true);
      try {
        // 医療機関名が指定されていない場合は、空の配列を設定
        if (!medicalInstitutionName || medicalInstitutionName.trim() === '') {
          setOptions([]);
          setIsLoading(false);
          return;
        }

        // 医療機関名から医療機関IDを取得
        const institutions = await medicalMasterService.getMedicalInstitutions();
        const targetInstitution = institutions.find(
          (inst) => inst.institutionName === medicalInstitutionName
        );

        if (!targetInstitution) {
          // 医療機関が見つからない場合（手入力の場合など）は空の配列を設定
          setOptions([]);
          setIsLoading(false);
          return;
        }

        // 指定された医療機関に紐づく医師のみを取得
        const doctors = await medicalMasterService.getDoctors(targetInstitution.id);

        const doctorOptions: DoctorOption[] = doctors.map((doctor) => ({
          value: doctor.doctorName,
          label: doctor.doctorName,
          medicalInstitutionId: doctor.medicalInstitutionId,
          specialization: doctor.specialization,
        }));

        setOptions(doctorOptions);
      } catch (error) {
        console.error('Failed to load doctor options:', error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, [medicalInstitutionName]);

  // valueが変更されたときにinputValueを更新
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 選択されたオプションを取得
  const selectedOption = options.find((option) => option.value === value);

  // 表示用のラベルを生成
  const getDisplayLabel = () => {
    if (selectedOption) {
      return selectedOption.label;
    }
    if (value && allowCustomValue) {
      return value;
    }
    if (!medicalInstitutionName || medicalInstitutionName.trim() === '') {
      return '先に医療機関を選択してください';
    }
    return placeholder;
  };

  // オプション選択時の処理
  const handleSelect = (selectedValue: string) => {
    if (selectedValue === value) {
      // 同じ値が選択された場合は閉じるだけ
      setOpen(false);
      return;
    }

    setInputValue(selectedValue);
    onValueChange?.(selectedValue);
    setOpen(false);
  };

  // カスタム入力時の処理
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (allowCustomValue) {
      onValueChange?.(newValue);
    }
  };

  // キーダウン処理
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && allowCustomValue && inputValue !== value) {
      event.preventDefault();
      onValueChange?.(inputValue);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            !value && 'text-muted-foreground',
            (!medicalInstitutionName || medicalInstitutionName.trim() === '') &&
              'cursor-not-allowed opacity-50',
            className
          )}
          disabled={disabled || !medicalInstitutionName || medicalInstitutionName.trim() === ''}
        >
          <span className="truncate">{getDisplayLabel()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="医師を検索..."
            value={inputValue}
            onValueChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>読み込み中...</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>
                  {!medicalInstitutionName || medicalInstitutionName.trim() === '' ? (
                    '先に医療機関を選択してください'
                  ) : allowCustomValue && inputValue ? (
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleSelect(inputValue)}
                      >
                        <span className="truncate">「{inputValue}」を入力</span>
                      </Button>
                    </div>
                  ) : (
                    '該当する医師が見つかりません'
                  )}
                </CommandEmpty>

                {options.length > 0 && (
                  <CommandGroup>
                    {options
                      .filter(
                        (option) =>
                          option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
                          option.value.toLowerCase().includes(inputValue.toLowerCase()) ||
                          (option.specialization &&
                            option.specialization.toLowerCase().includes(inputValue.toLowerCase()))
                      )
                      .map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => handleSelect(option.value)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex flex-col items-start flex-1 min-w-0">
                            <span className="font-medium truncate">{option.value}</span>
                            {option.specialization && (
                              <span className="text-xs text-muted-foreground truncate">
                                {option.specialization}
                              </span>
                            )}
                          </div>
                          <Check
                            className={cn(
                              'ml-2 h-4 w-4 shrink-0',
                              value === option.value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
