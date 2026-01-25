'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FileItem } from '@/lib/storage'
import { Save, X, Loader2 } from 'lucide-react'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup' // html
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-json'
import 'prismjs/themes/prism-dark.css' // Import a theme
import { fetchFileContentAction, saveFileContentAction } from '@/app/actions/storage'
import { toast } from 'sonner'

interface CodeEditorProps {
  file: FileItem
  onClose: () => void
  onSave: () => void
}

export default function CodeEditor({ file, onClose, onSave }: CodeEditorProps) {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true)
      try {
        const content = await fetchFileContentAction(file.key)
        setCode(content || '')
      } catch (error) {
        toast.error('Failed to load file content')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    loadContent()
  }, [file.key])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await saveFileContentAction(file.key, code)
      if (result.success) {
        toast.success('File saved successfully')
        onSave()
      } else {
        toast.error(result.error as string)
      }
    } catch (error) {
        toast.error('Failed to save file')
        console.error(error)
    } finally {
        setIsSaving(false)
    }
  }

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
            return languages.javascript
        case 'css':
            return languages.css
        case 'html':
            return languages.markup
        case 'php':
            return languages.php
        case 'json':
            return languages.json
        default:
            return languages.markup
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white rounded-lg overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">{file.name}</span>
            {isSaving && <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>}
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Close
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading || isSaving} className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save
            </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto relative font-mono text-sm">
        {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        ) : (
            <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => highlight(code, getLanguage(file.name), file.name.split('.').pop() || 'txt')}
                padding={20}
                className="font-mono min-h-full"
                style={{
                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                    fontSize: 14,
                    backgroundColor: '#1e1e1e',
                    minHeight: '100%'
                }}
                textareaClassName="focus:outline-none"
            />
        )}
      </div>
    </div>
  )
}
