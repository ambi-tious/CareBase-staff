"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface LoginFormProps {
  onLogin: (credentials: { facilityId: string; password: string }) => Promise<boolean>
  isLoading?: boolean
  className?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading = false, className = "" }) => {
  const [facilityId, setFacilityId] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<{
    type: "success" | "error" | null
    text: string
  }>({ type: null, text: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: null, text: "" })

    if (!facilityId.trim() || !password.trim()) {
      setMessage({
        type: "error",
        text: "施設IDとパスワードを入力してください。",
      })
      return
    }

    try {
      const success = await onLogin({ facilityId, password })
      if (success) {
        setMessage({
          type: "success",
          text: "ログインに成功しました。",
        })
      } else {
        setMessage({
          type: "error",
          text: "施設IDまたはパスワードが正しくありません。",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "ログイン中にエラーが発生しました。もう一度お試しください。",
      })
    }
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-carebase-text-primary">ログイン</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="facilityId" className="block text-sm font-medium text-gray-700 mb-1">
              施設ID
            </label>
            <input
              id="facilityId"
              type="text"
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-carebase-blue focus:border-transparent"
              placeholder="施設IDを入力"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-carebase-blue focus:border-transparent"
              placeholder="パスワードを入力"
              disabled={isLoading}
            />
          </div>

          {message.type && (
            <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              {message.type === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertDescription className={message.type === "error" ? "text-red-700" : "text-green-700"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-carebase-blue hover:bg-carebase-blue-dark" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ログイン中...
              </>
            ) : (
              "ログイン"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
