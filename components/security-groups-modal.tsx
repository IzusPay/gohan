'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Shield, Plus, Trash2, ArrowRightLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SecurityRule {
  id: string
  type: string
  protocol: string
  portRange: string
  source: string
  description?: string
}

interface SecurityGroupsModalProps {
  isOpen: boolean
  onClose: () => void
  instanceId: string
}

export default function SecurityGroupsModal({ isOpen, onClose, instanceId }: SecurityGroupsModalProps) {
  const [inboundRules, setInboundRules] = useState<SecurityRule[]>([
    { id: '1', type: 'SSH', protocol: 'TCP', portRange: '22', source: '0.0.0.0/0', description: 'Allow SSH access' },
    { id: '2', type: 'HTTP', protocol: 'TCP', portRange: '80', source: '0.0.0.0/0', description: 'Allow Web traffic' },
    { id: '3', type: 'HTTPS', protocol: 'TCP', portRange: '443', source: '0.0.0.0/0', description: 'Allow Secure Web traffic' },
  ])

  const [outboundRules, setOutboundRules] = useState<SecurityRule[]>([
    { id: '1', type: 'All traffic', protocol: 'All', portRange: 'All', source: '0.0.0.0/0', description: 'Allow all outbound traffic' },
  ])

  const handleDeleteRule = (id: string, type: 'inbound' | 'outbound') => {
    if (type === 'inbound') {
      setInboundRules(inboundRules.filter(rule => rule.id !== id))
    } else {
      setOutboundRules(outboundRules.filter(rule => rule.id !== id))
    }
  }

  const handleAddRule = (type: 'inbound' | 'outbound') => {
    const newRule: SecurityRule = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'Custom TCP',
      protocol: 'TCP',
      portRange: '8080',
      source: '0.0.0.0/0',
      description: 'New Rule'
    }
    
    if (type === 'inbound') {
      setInboundRules([...inboundRules, newRule])
    } else {
      setOutboundRules([...outboundRules, newRule])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Edit Inbound and Outbound rules
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Instance ID: <span className="font-mono text-foreground">{instanceId}</span>
          </p>

          <Tabs defaultValue="inbound" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inbound">Inbound Rules</TabsTrigger>
              <TabsTrigger value="outbound">Outbound Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="inbound" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Inbound rules control the incoming traffic that's allowed to reach your instance.</h3>
                <Button size="sm" onClick={() => handleAddRule('inbound')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Protocol</TableHead>
                      <TableHead>Port Range</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inboundRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>{rule.type}</TableCell>
                        <TableCell>{rule.protocol}</TableCell>
                        <TableCell>{rule.portRange}</TableCell>
                        <TableCell>{rule.source}</TableCell>
                        <TableCell>{rule.description}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive/90"
                            onClick={() => handleDeleteRule(rule.id, 'inbound')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="outbound" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Outbound rules control the traffic that's allowed to leave your instance.</h3>
                <Button size="sm" onClick={() => handleAddRule('outbound')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Protocol</TableHead>
                      <TableHead>Port Range</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outboundRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>{rule.type}</TableCell>
                        <TableCell>{rule.protocol}</TableCell>
                        <TableCell>{rule.portRange}</TableCell>
                        <TableCell>{rule.source}</TableCell>
                        <TableCell>{rule.description}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive/90"
                            onClick={() => handleDeleteRule(rule.id, 'outbound')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
