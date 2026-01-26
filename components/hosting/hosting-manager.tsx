'use client'

import { useState, useEffect, useCallback } from 'react'
import { getFiles, createFolder, removeFile, uploadFile, renameFileAction, moveFileAction, fetchFileContentAction, fetchFileContentBase64Action, getUploadUrlAction, getFileUrl } from '@/app/actions/storage'
import { FileItem } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb'
import { 
  Upload, 
  ArrowLeft,
  RefreshCw,
  FolderPlus,
  ClipboardPaste,
  Edit,
  FileText,
  Scissors,
  FileArchive,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import FileExplorer from '@/components/hosting/file-explorer'
import CodeEditor from '@/components/hosting/code-editor'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import JSZip from 'jszip'

interface HostingManagerProps {
  order: any
}

export default function HostingManager({ order }: HostingManagerProps) {
  const [currentPath, setCurrentPath] = useState('')
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingFile, setEditingFile] = useState<FileItem | null>(null)
  const [clipboard, setClipboard] = useState<{ file: FileItem, action: 'cut' } | null>(null)
  
  // Dialog states
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [renameValue, setRenameValue] = useState('')
  // Track which file is being renamed if triggered from context menu
  const [fileToRename, setFileToRename] = useState<FileItem | null>(null)

  const loadFiles = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getFiles(order.id, currentPath)
      setFiles(data)
    } catch (error) {
      toast.error('Failed to load files')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [order.id, currentPath])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  const handleNavigate = (path: string) => {
    setCurrentPath(path)
    setSelectedFile(null)
  }

  const handleNavigateUp = () => {
    if (currentPath === '') return
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    const newPath = parts.length > 0 ? parts.join('/') + '/' : ''
    setCurrentPath(newPath)
  }

  const handleFileClick = (file: FileItem) => {
    if (file.isDirectory) {
      handleNavigate(currentPath + file.name + '/')
    } else {
      setSelectedFile(file)
    }
  }

  const handleEditFile = (file: FileItem) => {
    // Only allow editing text-based files for now
    const isEditable = /\.(txt|html|css|js|json|php|md|xml|yml|yaml|env|config)$/i.test(file.name)
    if (isEditable) {
        setEditingFile(file)
        setIsEditorOpen(true)
    } else {
        toast.error('This file type cannot be edited')
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName) return
    
    const result = await createFolder(order.id, currentPath, newFolderName)
    if (result.success) {
      toast.success('Folder created')
      setIsNewFolderOpen(false)
      setNewFolderName('')
      loadFiles()
    } else {
      toast.error(result.error as string)
    }
  }

  const openRenameDialog = (file: FileItem) => {
      setFileToRename(file)
      setRenameValue(file.name)
      setIsRenameOpen(true)
  }

  const handleRename = async () => {
    const targetFile = fileToRename || selectedFile
    if (!targetFile || !renameValue) return
    
    // Check if name actually changed
    if (targetFile.name === renameValue) {
        setIsRenameOpen(false)
        return
    }

    const oldKey = targetFile.key
    const result = await renameFileAction(oldKey, renameValue)
    if (result.success) {
        toast.success('Renamed successfully')
        setIsRenameOpen(false)
        setRenameValue('')
        setSelectedFile(null)
        setFileToRename(null)
        loadFiles()
    } else {
        toast.error(result.error as string)
    }
  }

  const handleDelete = async (file?: FileItem) => {
    const targetFile = file || selectedFile
    if (!targetFile) return
    
    if (confirm(`Are you sure you want to delete ${targetFile.name}?`)) {
        const result = await removeFile(targetFile.key, `/dashboard/hosting/${order.id}`)
        if (result) {
            toast.success('File deleted')
            setSelectedFile(null)
            loadFiles()
        } else {
            toast.error('Failed to delete file')
        }
    }
  }

  const handleCut = (file?: FileItem) => {
    const targetFile = file || selectedFile
    if (targetFile) {
        setClipboard({ file: targetFile, action: 'cut' })
        toast.success(`Cut ${targetFile.name}`)
    }
  }

  const handlePaste = async () => {
    if (!clipboard) return
    toast.error("Paste functionality requires server update. Implementing soon.")
  }

  const handleDownload = async (file: FileItem) => {
      const url = await getFileUrl(file.key)
      if (url) {
          window.open(url, '_blank')
      } else {
          toast.error('Failed to get download URL')
      }
  }

  const handleZip = async (file?: FileItem) => {
      const targetFile = file || selectedFile
      if (!targetFile) return
      
      const zip = new JSZip()
      const toastId = toast.loading('Zipping...')
      
      try {
          // Download file content
          const content = await fetchFileContentAction(targetFile.key)
          if (content === null) throw new Error('Failed to download file')
          
          zip.file(targetFile.name, content)
          const blob = await zip.generateAsync({ type: 'blob' })
          const zipFile = new File([blob], `${targetFile.name}.zip`, { type: 'application/zip' })
          
          // Upload using presigned URL for consistency
          const { success, url, error } = await getUploadUrlAction(order.id, currentPath, zipFile.name, zipFile.type)
          
          if (!success || !url) {
              throw new Error(error || 'Failed to get upload URL')
          }
          
          await fetch(url, {
              method: 'PUT',
              body: zipFile
          })
          
          toast.success('Zipped successfully', { id: toastId })
          loadFiles()
      } catch (error) {
          console.error(error)
          toast.error('Failed to zip file', { id: toastId })
      }
  }

  const handleUnzip = async (file?: FileItem) => {
    const targetFile = file || selectedFile
    if (!targetFile || !targetFile.name.endsWith('.zip')) {
        toast.error('Please select a .zip file')
        return
    }
    
    const toastId = toast.loading('Unzipping...')
    
    try {
        const base64Content = await fetchFileContentBase64Action(targetFile.key)
        if (!base64Content) throw new Error('Failed to download file')
        
        const zip = new JSZip()
        const unzipped = await zip.loadAsync(base64Content, { base64: true })
        
        // Upload each file
        const promises: Promise<any>[] = []
        
        unzipped.forEach((relativePath, zipEntry) => {
            if (zipEntry.dir) return
            
            const promise = zipEntry.async('blob').then(async (blob) => {
                const file = new File([blob], zipEntry.name)
                
                // Get Presigned URL
                const { success, url } = await getUploadUrlAction(order.id, currentPath, file.name, file.type || 'application/octet-stream')
                if (!success || !url) return // Skip failed uploads?
                
                return fetch(url, {
                    method: 'PUT',
                    body: file
                })
            })
            promises.push(promise)
        })
        
        await Promise.all(promises)
        toast.success('Unzipped successfully', { id: toastId })
        loadFiles()
    } catch (error) {
        console.error(error)
        toast.error('Failed to unzip', { id: toastId })
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    const file = fileList[0]
    const toastId = toast.loading(`Uploading ${file.name}...`)
    
    try {
        const contentType = file.type || 'application/octet-stream'
        // 1. Get Presigned URL
        const { success, url, error } = await getUploadUrlAction(order.id, currentPath, file.name, contentType)
        
        if (!success || !url) {
            throw new Error(error || 'Failed to get upload URL')
        }
        
        // 2. Upload directly to R2
        const uploadResponse = await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': contentType
            }
        })
        
        if (!uploadResponse.ok) {
            throw new Error('Upload failed')
        }
        
        toast.success('File uploaded successfully', { id: toastId })
        loadFiles()
    } catch (error) {
        console.error(error)
        toast.error('Failed to upload file', { id: toastId })
    }
    
    // Reset input
    e.target.value = ''
  }

  if (isEditorOpen && editingFile) {
    return (
        <CodeEditor 
            file={editingFile} 
            onClose={() => {
                setIsEditorOpen(false)
                setEditingFile(null)
            }}
            onSave={() => {
                loadFiles()
            }}
        />
    )
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-card border rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleNavigateUp} disabled={!currentPath}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center px-2 bg-muted/50 rounded-md h-9">
                <span className="text-sm font-medium text-muted-foreground mr-2">/public_html/</span>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => handleNavigate('')} className="cursor-pointer">root</BreadcrumbLink>
                        </BreadcrumbItem>
                        {currentPath.split('/').filter(Boolean).map((part, index, arr) => {
                             const path = arr.slice(0, index + 1).join('/') + '/'
                             return (
                                <div key={path} className="flex items-center">
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink onClick={() => handleNavigate(path)} className="cursor-pointer">
                                            {part}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </div>
                             )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => loadFiles()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsNewFolderOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePaste()} disabled={!clipboard}>
                <ClipboardPaste className="h-4 w-4 mr-2" />
                Paste
            </Button>
            <div className="relative">
                <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={handleUpload}
                />
                <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                </Button>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 border rounded-lg bg-card overflow-hidden flex flex-col">
         {selectedFile && (
             <div className="flex items-center gap-2 p-2 border-b bg-muted/20">
                 <span className="text-sm font-medium mr-2">{selectedFile.name}</span>
                 {!selectedFile.isDirectory && (
                     <Button variant="ghost" size="sm" onClick={() => handleEditFile(selectedFile)}>
                         <Edit className="h-4 w-4 mr-2" />
                         Edit
                     </Button>
                 )}
                 <Button variant="ghost" size="sm" onClick={() => openRenameDialog(selectedFile)}>
                     <FileText className="h-4 w-4 mr-2" />
                     Rename
                 </Button>
                 <Button variant="ghost" size="sm" onClick={() => handleCut(selectedFile)}>
                     <Scissors className="h-4 w-4 mr-2" />
                     Cut
                 </Button>
                 <Button variant="ghost" size="sm" onClick={() => handleZip(selectedFile)}>
                     <FileArchive className="h-4 w-4 mr-2" />
                     Zip
                 </Button>
                 {selectedFile.name.endsWith('.zip') && (
                    <Button variant="ghost" size="sm" onClick={() => handleUnzip(selectedFile)}>
                        <FileArchive className="h-4 w-4 mr-2" />
                        Unzip
                    </Button>
                 )}
                 <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(selectedFile)}>
                     <Trash2 className="h-4 w-4 mr-2" />
                     Delete
                 </Button>
             </div>
         )}

         <FileExplorer 
            files={files} 
            isLoading={isLoading} 
            selectedFile={selectedFile}
            onFileClick={handleFileClick}
            onRename={openRenameDialog}
            onDelete={handleDelete}
            onZip={handleZip}
            onUnzip={handleUnzip}
            onCut={handleCut}
            onDownload={handleDownload}
            onEdit={handleEditFile}
         />
      </div>

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input 
                        id="name" 
                        value={newFolderName} 
                        onChange={(e) => setNewFolderName(e.target.value)} 
                        className="col-span-3" 
                        placeholder="my-folder"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleCreateFolder}>Create</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Rename Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rename" className="text-right">
                        New Name
                    </Label>
                    <Input 
                        id="rename" 
                        value={renameValue} 
                        onChange={(e) => setRenameValue(e.target.value)} 
                        className="col-span-3" 
                    />
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleRename}>Save</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
