'use client';

import { StaffCard } from '@/components/1_atoms/staff/staff-card';
import type { Staff } from '@/mocks/staff-data';
import type React from 'react';

interface StaffSelectorProps {
  staff: Staff[];
  selectedStaffId?: string;
  onStaffSelect: (staffId: string) => void;
  disabled?: boolean;
  className?: string;
}

export const StaffSelector: React.FC<StaffSelectorProps> = ({
  staff,
  selectedStaffId,
  onStaffSelect,
  disabled = false,
  className = '',
}) => {
  if (staff.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">このチームには現在利用可能なスタッフがいません。</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-carebase-text-primary mb-3">③ スタッフを選択</h3>
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-2">
        {staff.map((staffMember) => (
          <StaffCard
            key={staffMember.id}
            staff={staffMember}
            isSelected={selectedStaffId === staffMember.id}
            onClick={() => onStaffSelect(staffMember.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};
