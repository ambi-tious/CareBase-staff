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
import type { MedicalInstitution } from '@/mocks/residents-data';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react';

interface ResidentMedicalInstitutionComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  onInstitutionSelect?: (institution: MedicalInstitution | null) => void;
  medicalInstitutions: MedicalInstitution[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const ResidentMedicalInstitutionCombobox: React.FC<
  ResidentMedicalInstitutionComboboxProps
> = ({
  value,
  onValueChange,
  onInstitutionSelect,
  medicalInstitutions,
  placeholder = '治療機関を選択してください',
  disabled = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  const selectedInstitution = medicalInstitutions.find(
    (institution) => institution.institutionName === value
  );

  const handleSelect = (currentValue: string) => {
    const institution = medicalInstitutions.find((inst) => inst.institutionName === currentValue);

    if (institution) {
      onValueChange(currentValue);
      onInstitutionSelect?.(institution);
    }
    setOpen(false);
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedInstitution?.institutionName || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="医療機関を検索..." />
            <CommandList>
              <CommandEmpty>
                {medicalInstitutions.length === 0
                  ? '登録されている医療機関がありません。'
                  : '該当する医療機関が見つかりません。'}
              </CommandEmpty>
              {medicalInstitutions.length > 0 && (
                <CommandGroup>
                  {medicalInstitutions.map((institution) => (
                    <CommandItem
                      key={institution.id}
                      value={institution.institutionName}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === institution.institutionName ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{institution.institutionName}</span>
                        {institution.doctorName && (
                          <span className="text-sm text-muted-foreground">
                            担当医: {institution.doctorName}
                          </span>
                        )}
                        {institution.phone && (
                          <span className="text-xs text-muted-foreground">
                            TEL: {institution.phone}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
