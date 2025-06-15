import type React from "react"
import { AppHeader } from "@/components/3_organisms/app-header"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-carebase-bg">
      <AppHeader />
      <main>{children}</main>
    </div>
  )
}
