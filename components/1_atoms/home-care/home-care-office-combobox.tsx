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
import type { HomeCareOffice } from '@/mocks/care-board-data';
import { residentDataService } from '@/services/residentDataService';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import * as React from 'react';

interface HomeCareOfficeComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onOfficeSelect?: (office: HomeCareOffice) => void;
  onCreateNew?: () => void;
  placeholder?: string;
  disabled?: boolean;
  allowCustomValue?: boolean;
  className?: string;
}

export const HomeCareOfficeCombobox: React.FC<HomeCareOfficeComboboxProps> = ({
  value = '',
  onValueChange,
  onOfficeSelect,
  onCreateNew,
  placeholder = '居宅介護支援事業所を選択してください',
  disabled = false,
  allowCustomValue = true,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [offices, setOffices] = React.useState<HomeCareOffice[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  // 居宅介護支援事業所データを読み込み
  React.useEffect(() => {
    const loadOffices = async () => {
      setIsLoading(true);
      try {
        const homeCareOffices = await residentDataService.getHomeCareOffices();
        setOffices(homeCareOffices);
      } catch (error) {
        console.error('Failed to load home care offices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOffices();
  }, []);

  // valueが変更されたときにinputValueを更新
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // 選択されたオフィスを取得
  const selectedOffice = offices.find((office) => office.businessName === value);

  // 表示用のラベルを生成
  const getDisplayLabel = () => {
    if (selectedOffice) {
      return selectedOffice.businessName;
    }
    if (value && allowCustomValue) {
      return value;
    }
    return placeholder;
  };

  // オプション選択時の処理
  const handleSelect = (selectedOffice: HomeCareOffice) => {
    const selectedValue = selectedOffice.businessName;

    if (selectedValue === value) {
      // 同じ値が選択された場合は閉じるだけ
      setOpen(false);
      return;
    }

    setInputValue(selectedValue);
    onValueChange?.(selectedValue);
    onOfficeSelect?.(selectedOffice);
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

  // 新規作成処理
  const handleCreateNew = () => {
    onCreateNew?.();
    setOpen(false);
  };

  // フィルタリングされたオフィス
  const filteredOffices = offices.filter(
    (office) =>
      office.businessName.toLowerCase().includes(inputValue.toLowerCase()) ||
      office.address.toLowerCase().includes(inputValue.toLowerCase()) ||
      office.careManager.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', !value && 'text-muted-foreground', className)}
          disabled={disabled}
        >
          <span className="truncate">{getDisplayLabel()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="居宅介護支援事業所を検索..."
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
                  <div className="px-6 text-center text-sm">
                    <p className="mb-2">該当する事業所が見つかりません</p>
                    {onCreateNew && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCreateNew}
                        className="text-carebase-blue border-carebase-blue hover:bg-carebase-blue-light"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        新しい事業所を登録
                      </Button>
                    )}
                  </div>
                </CommandEmpty>

                {filteredOffices.length > 0 && (
                  <CommandGroup>
                    {filteredOffices.map((office) => (
                      <CommandItem
                        key={office.id}
                        value={office.businessName}
                        onSelect={() => handleSelect(office)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="font-medium truncate">{office.businessName}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {office.address} | {office.careManager}
                          </span>
                        </div>
                        <Check
                          className={cn(
                            'ml-2 h-4 w-4 shrink-0',
                            value === office.businessName ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* 新規作成オプションを常に表示 */}
                {onCreateNew && filteredOffices.length > 0 && (
                  <CommandGroup>
                    <CommandItem onSelect={handleCreateNew} className="text-carebase-blue">
                      <Plus className="h-4 w-4 mr-2" />
                      新しい事業所を登録
                    </CommandItem>
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
