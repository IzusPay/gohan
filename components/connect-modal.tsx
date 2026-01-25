'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Terminal, X } from 'lucide-react'

interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
  instanceId: string
  ip: string
}

export default function ConnectModal({ isOpen, onClose, instanceId, ip }: ConnectModalProps) {
  const [step, setStep] = useState<'connecting' | 'password' | 'error'>('connecting')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setStep('connecting')
      setHistory([])
      setInput('')
      
      // Simulate connection delay
      const timer = setTimeout(() => {
        setHistory(prev => [...prev, `OpenSSH 8.9p1 Ubuntu-3ubuntu0.10, OpenSSL 3.0.2 15 Mar 2022`])
        const timer2 = setTimeout(() => {
           setStep('password')
        }, 800)
        return () => clearTimeout(timer2)
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (step === 'password' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [step, history])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'password' || step === 'error') {
        // Simulate password check failure
        setHistory(prev => [...prev, `root@${ip}'s password: `, 'Access denied'])
        setInput('')
        setStep('error')
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-[#1e1e1e] border-gray-800 p-0 overflow-hidden text-gray-300 font-mono shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-800">
          <div className="flex items-center gap-2 text-sm">
            <Terminal className="h-4 w-4" />
            <span>root@{ip} - ssh</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div 
          className="p-4 h-[400px] overflow-y-auto cursor-text" 
          onClick={() => inputRef.current?.focus()}
        >
          <div className="space-y-1">
            <div className="text-green-500">Connecting to instance {instanceId} ({ip})...</div>
            
            {history.map((line, i) => (
              <div key={i} className={line === 'Access denied' ? 'text-red-500' : ''}>
                {line === `root@${ip}'s password: ` ? '' : line}
              </div>
            ))}

            {(step === 'password' || step === 'error') && (
              <div className="flex items-center">
                <span>root@{ip}'s password:&nbsp;</span>
                <input
                  ref={inputRef}
                  type="password"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none text-transparent w-full caret-gray-300"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
