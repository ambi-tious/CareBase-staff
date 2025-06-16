import { dashboardMenu } from '@/mocks/dashboard-menu';
import { CategoryCard } from '@/components/2_molecules/common/category-card';
import { NavigationLink } from '@/components/2_molecules/common/navigation-link';

export function StaffDashboard() {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2 xl:grid-cols-3">
        {dashboardMenu.map((category) => (
          <CategoryCard key={category.title} title={category.title} icon={category.icon}>
            {category.links.map((link) => (
              <NavigationLink key={link.label} {...link} />
            ))}
          </CategoryCard>
        ))}
      </div>
    </div>
  );
}
