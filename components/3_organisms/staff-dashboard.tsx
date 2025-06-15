import { dashboardMenu } from "@/mocks/dashboard-menu"
import { CategoryCard } from "@/components/2_molecules/category-card"
import { NavigationLink } from "@/components/2_molecules/navigation-link"

export function StaffDashboard() {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 md:p-8">
        {dashboardMenu.map((category) => (
          <CategoryCard key={category.title} title={category.title} icon={category.icon}>
            {category.links.map((link) => (
              <NavigationLink key={link.label} {...link} />
            ))}
          </CategoryCard>
        ))}
      </div>
    </div>
  )
}
