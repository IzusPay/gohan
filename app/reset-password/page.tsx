
"use client"

import React, { useState, useTransition, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Server, AlertCircle, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import { resetPassword } from "@/app/actions"

type ResetState = {
  success?: boolean
  error?: string
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [state, setState] = useState<ResetState | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!token) {
        setState({ error: 'Missing or invalid token. Please request a new password reset link.' })
    }
  }, [token])

  function handleSubmit(formData: FormData) {
    if (!token) return

    formData.append('token', token)
    
    startTransition(async () => {
      const result = await resetPassword(formData)
      setState(result)
      
      if (result.success) {
        setTimeout(() => {
            router.push('/login')
        }, 3000)
      }
    })
  }

  if (state?.success) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-green-100 text-green-600 rounded-full p-3 w-fit mb-4">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <CardTitle>Password Reset Successfully</CardTitle>
                    <CardDescription>
                        Your password has been updated. You will be redirected to the login page shortly.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center">
                    <Button asChild>
                        <Link href="/login">Go to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Server className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                HostPrime
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Reset Form */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Reset Password
            </CardTitle>
            <CardDescription>
              Enter your new password below.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!token ? (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{state?.error || 'Invalid Token'}</AlertDescription>
                 </Alert>
            ) : (
                <form action={handleSubmit} className="space-y-4">
                {state?.error && (
                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        required
                        className="pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        required
                        className="pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                    </>
                    ) : (
                    "Reset Password"
                    )}
                </Button>
                </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <Link href="/login" className="text-sm text-primary hover:underline font-medium">
                Back to Login
            </Link>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 HostPrime. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
