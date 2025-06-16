"use client"

import type React from "react"
import type { Staff } from "@/mocks/staff-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

interface StaffCardProps {
  staff: Staff
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export const StaffCard: React.FC<StaffCardProps> = ({ staff, isSelected = false, onClick, className = "" }) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "施設長":
        return "bg-purple-100 text-purple-700"
      case "主任介護職員":
        return "bg-blue-100 text-blue-700"
      case "看護師":
        return "bg-green-100 text-green-700"
      case "介護職員":
        return "bg-orange-100 text-orange-700"
      case "事務職員":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-carebase-blue bg-carebase-blue-light" : ""
      } ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              {staff.avatar ? (
                <img
                  src={staff.avatar || "/placeholder.svg"}
                  alt={staff.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-500" />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-carebase-text-primary truncate">{staff.name}</h3>
              <Badge className={`text-xs ${getRoleBadgeColor(staff.role)}`}>{staff.role}</Badge>
            </div>
            <p className="text-sm text-gray-500 mb-1">{staff.furigana}</p>
            <p className="text-xs text-gray-400">ID: {staff.employeeId}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
