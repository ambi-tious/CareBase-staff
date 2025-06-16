import type React from "react"
import type { IndividualPoint } from "@/mocks/care-board-data"
import { Badge } from "@/components/ui/badge"

interface IndividualPointCardProps {
  point: IndividualPoint
}

export const IndividualPointCard: React.FC<IndividualPointCardProps> = ({ point }) => (
  <div
    className={`relative p-4 rounded-lg text-center ${
      point.isActive ? "bg-carebase-blue text-white" : "bg-gray-200 text-gray-500"
    }`}
  >
    {point.count > 0 && (
      <Badge
        variant="destructive"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
      >
        {point.count}
      </Badge>
    )}
    <point.icon className="h-8 w-8 mx-auto mb-2" />
    <p className="text-sm font-medium">{point.category}</p>
  </div>
)
