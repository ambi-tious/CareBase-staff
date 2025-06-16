import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

export function CategoryCard({ title, icon: Icon, children }: CategoryCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-carebase-blue-light p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-carebase-white shadow-sm">
          <Icon className="h-7 w-7 text-carebase-blue" />
        </div>
        <h2 className="text-lg font-bold text-carebase-text-primary">{title}</h2>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
