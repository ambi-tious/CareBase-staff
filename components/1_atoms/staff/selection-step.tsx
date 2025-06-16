import type React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface SelectionStepProps {
  stepNumber: number;
  title: string;
  description?: string;
  isActive: boolean;
  isCompleted: boolean;
  className?: string;
}

export const SelectionStep: React.FC<SelectionStepProps> = ({
  stepNumber,
  title,
  description,
  isActive,
  isCompleted,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
          isCompleted
            ? 'bg-green-500 text-white'
            : isActive
              ? 'bg-carebase-blue text-white'
              : 'bg-gray-200 text-gray-500'
        }`}
      >
        {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
      </div>
      <div className="flex-1">
        <h3 className={`font-medium ${isActive ? 'text-carebase-text-primary' : 'text-gray-500'}`}>
          {title}
        </h3>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
      {!isCompleted && (
        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-carebase-blue' : 'text-gray-300'}`} />
      )}
    </div>
  );
};
