import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface CategoryCardProps {
  title: string
  icon: LucideIcon
  children: ReactNode
}

export function CategoryCard({ title, icon: Icon, children }: CategoryCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-carebase-blue-light p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-carebase-white shadow-sm">
          <Icon className="h-7 w-7 text-carebase-blue" />
        </div>
        <h2 className="text-xl font-bold text-carebase-text-primary">{title}</h2>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
