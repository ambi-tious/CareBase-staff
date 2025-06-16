"use client"

import type React from "react"
import { useState } from "react"
import { LoginForm } from "@/components/2_molecules/auth/login-form"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/1_atoms/common/logo"
import { Users } from "lucide-react"

interface LoginScreenProps {
  onLogin: (credentials: { facilityId: string; password: string }) => Promise<boolean>
  onStaffSelection?: () => void
  className?: string
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onStaffSelection, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (formCredentials: { facilityId: string; password: string }) => {
    setIsLoading(true)
    try {
      const result = await onLogin({ facilityId: formCredentials.facilityId, password: formCredentials.password })
      return result
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-carebase-bg flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Logo />
        </div>

        {/* Login Form */}
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 CareBase. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
