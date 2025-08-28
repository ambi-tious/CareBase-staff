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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { careManagerService } from '@/services/careManagerService';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

export interface CareManagerOption {
  value: string;
  label: string;
  officeName: string;
}

interface CareManagerComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowCustomValue?: boolean;
  className?: string;
}

export const CareManagerCombobox: React.FC<CareManagerComboboxProps> = ({
  value = '',
  onValueChange,
  placeholder = 'ケアマネージャーを選択してください',
  disabled = false,
  allowCustomValue = true,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<CareManagerOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  // ケアマネージャーオプションを読み込み
  React.useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true);
      try {
        const careManagerOptions = await careManagerService.getCareManagerOptions();
        setOptions(careManagerOptions);
      } catch (error) {
        console.error('Failed to load care manager options:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, []);

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
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">{getDisplayLabel()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="ケアマネージャーを検索..."
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
                  {allowCustomValue && inputValue ? (
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
                    '該当するケアマネージャーが見つかりません'
                  )}
                </CommandEmpty>
                
                {options.length > 0 && (
                  <CommandGroup>
                    {options
                      .filter((option) =>
                        option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
                        option.value.toLowerCase().includes(inputValue.toLowerCase())
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
                            <span className="text-xs text-muted-foreground truncate">
                              {option.officeName}
                            </span>
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
