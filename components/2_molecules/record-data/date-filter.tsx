'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateFilterProps {
  date: Date;
  onDateChange: (date: Date) => void;
  viewMode: 'daily' | 'monthly';
}

export const DateFilter: React.FC<DateFilterProps> = ({ date, onDateChange, viewMode }) => {
  const handlePrevious = () => {
    const newDate = new Date(date);
    if (viewMode === 'daily') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (viewMode === 'daily') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const formatDisplayDate = (date: Date) => {
    if (viewMode === 'daily') {
      return format(date, 'yyyy年M月d日(E)', { locale: ja });
    } else {
      return format(date, 'yyyy年M月', { locale: ja });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handlePrevious} className="h-8 w-8 p-0">
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">前の{viewMode === 'daily' ? '日' : '月'}</span>
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'min-w-[200px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? formatDisplayDate(date) : <span>日付を選択</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => selectedDate && onDateChange(selectedDate)}
            initialFocus
            locale={ja}
          />
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" onClick={handleNext} className="h-8 w-8 p-0">
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">次の{viewMode === 'daily' ? '日' : '月'}</span>
      </Button>

      <Button variant="outline" size="sm" onClick={handleToday} className="ml-2">
        今{viewMode === 'daily' ? '日' : '月'}
      </Button>
    </div>
  );
};
