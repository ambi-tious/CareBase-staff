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
import type { MedicalInstitutionMaster } from '@/types/medical-master';
import { Check, ChevronDown, Plus } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface MedicalInstitutionComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  onInstitutionSelect?: (institution: MedicalInstitutionMaster) => void;
  onCreateNew?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MedicalInstitutionCombobox: React.FC<MedicalInstitutionComboboxProps> = ({
  value,
  onValueChange,
  onInstitutionSelect,
  onCreateNew,
  placeholder = '医療機関を選択してください',
  disabled = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [institutions, setInstitutions] = useState<MedicalInstitutionMaster[]>([]);
  const [loading, setLoading] = useState(false);

  const loadInstitutions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await medicalMasterService.getMedicalInstitutions();
      setInstitutions(data);
    } catch (error) {
      console.error('Failed to load medical institutions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInstitutions();
  }, [loadInstitutions]);

  const selectedInstitution = institutions.find(
    (institution) => institution.institutionName === value
  );

  const handleSelect = (currentValue: string) => {
    const institution = institutions.find((inst) => inst.institutionName === currentValue);

    if (institution) {
      onValueChange(currentValue);
      onInstitutionSelect?.(institution);
    }
    setOpen(false);
  };

  const handleCreateNew = () => {
    // setOpen(false);
    onCreateNew?.();
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
            <span className="truncate">
              {selectedInstitution ? selectedInstitution.institutionName : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="医療機関を検索..." disabled={loading} />
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center text-sm">
                  <p className="mb-2">該当する医療機関が見つかりません</p>
                  {onCreateNew && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCreateNew}
                      className="text-carebase-blue border-carebase-blue hover:bg-carebase-blue-light"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      新しい医療機関を登録
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {institutions.map((institution) => (
                  <CommandItem
                    key={institution.id}
                    value={institution.institutionName}
                    onSelect={handleSelect}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === institution.institutionName ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span className="font-medium truncate">{institution.institutionName}</span>
                      </div>
                      {institution.address && (
                        <span className="text-xs text-muted-foreground ml-6 truncate">
                          {institution.address}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              {onCreateNew && institutions.length > 0 && (
                <CommandGroup>
                  <CommandItem onSelect={handleCreateNew} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4 text-carebase-blue" />
                    <span className="text-carebase-blue">新しい医療機関を登録</span>
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
