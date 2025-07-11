'use client';

import type React from 'react';
import type { Staff } from '@/mocks/staff-data';
import { StaffCard } from '@/components/1_atoms/staff/staff-card';

interface StaffSelectorProps {
  staff: Staff[];
  selectedStaffId?: string;
  onStaffSelect: (staffId: string) => void;
  className?: string;
}

export const StaffSelector: React.FC<StaffSelectorProps> = ({
  staff,
  selectedStaffId,
  onStaffSelect,
  className = '',
}) => {
  const activeStaff = staff.filter((s) => s.isActive);

  if (activeStaff.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">このチームには現在利用可能なスタッフがいません。</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-carebase-text-primary mb-3">
        スタッフを選択してください
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeStaff.map((staffMember) => (
          <StaffCard
            key={staffMember.id}
            staff={staffMember}
            isSelected={selectedStaffId === staffMember.id}
            onClick={() => onStaffSelect(staffMember.id)}
          />
        ))}
      </div>
    </div>
  );
};
