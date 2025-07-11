import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { IconName } from '@/lib/lucide-icon-registry';
import { getLucideIcon } from '@/lib/lucide-icon-registry';

interface NavigationLinkProps {
  label: string;
  href: string;
  icon: IconName;
  setIsMenuOpen: (open: boolean) => void;
}

export function NavigationLink({ label, href, icon, setIsMenuOpen }: NavigationLinkProps) {
  const Icon = getLucideIcon(icon);

  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl bg-carebase-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
      onClick={() => setIsMenuOpen(false)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-carebase-blue-light">
          <Icon className="h-6 w-6 text-carebase-blue" />
        </div>
        <span className="font-semibold text-carebase-text-primary text-base">{label}</span>
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-carebase-blue">
        <ChevronRight className="h-5 w-5 text-carebase-white" />
      </div>
    </Link>
  );
}
