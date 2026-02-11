"use client"

import React from "react"
import Link from "next/link"
import { useTransition, useState } from "react"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Server, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { login, recoverPassword } from "@/app/actions"

type LoginState = {
  error?: string
}

type RecoveryState = {
  success?: boolean
  message?: string
  error?: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, setState] = useState<LoginState | null>(null)
  const [isPending, startTransition] = useTransition()
  
  const [isRecoveryPending, startRecoveryTransition] = useTransition()
  const [recoveryState, setRecoveryState] = useState<RecoveryState | null>(null)
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false)

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await login(formData)
      setState(result)
    })
  }

  function handleRecovery(formData: FormData) {
    startRecoveryTransition(async () => {
      const result = await recoverPassword(formData)
      setRecoveryState(result)
    })
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

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your Hetnez account to manage your servers
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              {state?.error && (
                <Alert
                  variant="destructive"
                  className="bg-destructive/10 border-destructive/30"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {state.error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Dialog open={isRecoveryOpen} onOpenChange={setIsRecoveryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" size="sm" className="px-0 font-normal h-auto text-muted-foreground hover:text-primary">
                      Forgot password?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset Password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form action={handleRecovery} className="space-y-4 py-4">
                       {recoveryState?.error && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{recoveryState.error}</AlertDescription>
                          </Alert>
                       )}
                       {recoveryState?.success && (
                          <Alert className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900">
                            <AlertDescription>{recoveryState.message}</AlertDescription>
                          </Alert>
                       )}
                      <div className="space-y-2">
                        <Label htmlFor="recovery-email">Email Address</Label>
                        <Input id="recovery-email" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isRecoveryPending}>
                          {isRecoveryPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : "Send Reset Link"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="#"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
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