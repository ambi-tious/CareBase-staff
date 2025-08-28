import { CategoryCard } from '@/components/2_molecules/common/category-card';
import { NavigationLink } from '@/components/2_molecules/common/navigation-link';
import { dashboardMenu } from '@/mocks/dashboard-menu';

export function StaffDashboard({ setIsMenuOpen }: { setIsMenuOpen: (open: boolean) => void }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        {dashboardMenu.map((category) => (
          <CategoryCard key={category.title} title={category.title} icon={category.icon}>
            {category.links.map((link) => (
              <NavigationLink key={link.label} {...link} setIsMenuOpen={setIsMenuOpen} />
            ))}
          </CategoryCard>
        ))}
      </div>
    </div>
  );
}
