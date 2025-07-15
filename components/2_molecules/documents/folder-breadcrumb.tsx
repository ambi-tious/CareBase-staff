import type React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import type { BreadcrumbItem } from '@/types/document';

interface FolderBreadcrumbProps {
  path: BreadcrumbItem[];
  className?: string;
}

export const FolderBreadcrumb: React.FC<FolderBreadcrumbProps> = ({ path, className = '' }) => {
  return (
    <nav aria-label="フォルダパス" className={`flex items-center flex-wrap ${className}`}>
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        const href = item.id === 'root' ? '/documents' : `/documents/folder/${item.id}`;
        
        return (
          <React.Fragment key={item.id}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400 flex-shrink-0" />
            )}
            
            <div className="flex items-center">
              {index === 0 && <Home className="h-4 w-4 mr-1 text-gray-500" />}
              
              {isLast ? (
                <span className="font-medium text-gray-900">{item.name}</span>
              ) : (
                <Link
                  href={href}
                  className="text-gray-600 hover:text-carebase-blue hover:underline"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
};