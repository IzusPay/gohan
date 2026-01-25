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
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
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

interface UsersTableProps {
  users: User[]
}

export default function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    setLoadingId(userId)

    try {
      const result = await updateUserStatus(userId, newStatus)
      
      if (result.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ))
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
      } else {
        toast.error('Failed to update user status')
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
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'active' ? 'default' : 'destructive'}
                    className="capitalize"
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {user.role !== 'admin' && (
                    <Button
                      variant={user.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      disabled={loadingId === user.id}
                      onClick={() => handleStatusToggle(user.id, user.status)}
                    >
                      {loadingId === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : user.status === 'active' ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
