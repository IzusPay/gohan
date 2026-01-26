'use client'

import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { updateUserStatus } from '@/app/actions'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: string
  company?: string
}

interface LeadsTableProps {
  leads: User[]
}

export default function LeadsTable({ leads: initialLeads }: LeadsTableProps) {
  const [leads, setLeads] = useState<User[]>(initialLeads)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleActivate = async (userId: string) => {
    setLoadingId(userId)

    try {
      const result = await updateUserStatus(userId, 'active')
      
      if (result.success) {
        // Remove the activated user from the leads list
        setLeads(leads.filter(user => user.id !== userId))
        toast.success('Lead activated successfully')
      } else {
        toast.error('Failed to activate lead')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No leads found (pending activation)
              </TableCell>
            </TableRow>
          ) : (
            leads.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company || '-'}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={loadingId === user.id}
                    onClick={() => handleActivate(user.id)}
                  >
                    {loadingId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
