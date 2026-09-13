'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ShieldCheck } from 'lucide-react'

// Toggle visual de 2FA - apenas estado de exibicao, sem efeito no fluxo de login
export default function TwoFactorCard({ email }: { email: string }) {
  const storageKey = `2fa-enabled:${email}`
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) setEnabled(stored === 'true')
    } catch {}
  }, [storageKey])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    try {
      localStorage.setItem(storageKey, String(next))
    } catch {}
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <ShieldCheck className={`h-5 w-5 ${enabled ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <Label className="font-medium">Google Authenticator</Label>
              <p className="text-sm text-muted-foreground">
                {enabled
                  ? 'Two-factor authentication is enabled'
                  : 'Two-factor authentication is disabled'}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={toggle}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              enabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform ${
                enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
