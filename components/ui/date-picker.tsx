'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  mode?: 'date' | 'month';
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
  id,
  mode = 'date',
  captionLayout,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });

  // デフォルトのプレースホルダーを設定
  const defaultPlaceholder = mode === 'month' ? '年月を選択してください' : '日付を選択してください';
  const finalPlaceholder = placeholder || defaultPlaceholder;

  // 文字列の日付をDateオブジェクトに変換
  const dateValue = value ? new Date(value) : undefined;

  // カレンダーで日付が選択された時の処理
  const handleDateSelect = (date: Date | undefined) => {
    if (date && onChange) {
      // 日付モードの場合は YYYY-MM-DD 形式で値を返す
      const formattedDate = format(date, 'yyyy-MM-dd');
      onChange(formattedDate);
    }
    setIsOpen(false);
  };

  // 月が変更された時の処理（年月モード用）
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    if (mode === 'month' && onChange) {
      const formattedDate = format(date, 'yyyy-MM');
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  // 表示用の日付フォーマット
  const displayValue = dateValue
    ? mode === 'month'
      ? format(dateValue, 'yyyy年MM月', { locale: ja })
      : format(dateValue, 'yyyy年MM月dd日', { locale: ja })
    : finalPlaceholder;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !dateValue && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {mode === 'month' ? (
          <Calendar
            mode="single"
            month={currentMonth}
            onMonthChange={handleMonthChange}
            captionLayout={captionLayout || 'dropdown'}
            locale={ja}
            className="[&_.rdp-table]:hidden [&_.rdp-nav]:hidden"
          />
        ) : (
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleDateSelect}
            captionLayout={captionLayout || 'dropdown'}
            initialFocus
            locale={ja}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
