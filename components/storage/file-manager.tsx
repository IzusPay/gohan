'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { HardDrive, Upload, Trash2, Download, FileIcon, Loader2 } from "lucide-react"
import { uploadFile, removeFile, getFileUrl } from "@/app/actions/storage"
import { toast } from "sonner"

interface FileItem {
  key: string
  size: number
  lastModified: Date
  etag: string
}

interface FileManagerProps {
  files: FileItem[]
  maxStorage?: number // in bytes, default 10GB
}

export function FileManager({ files: initialFiles, maxStorage = 10 * 1024 * 1024 * 1024 }: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingFile, setUploadingFile] = useState<string | null>(null)

  const usedStorage = files.reduce((acc, file) => acc + (file.size || 0), 0)
  const usedPercentage = Math.min((usedStorage / maxStorage) * 100, 100)

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadingFile(file.name)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await uploadFile(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('File uploaded successfully')
        // Optimistic update or wait for server revalidation (handled by page reload usually, but here we might want to refresh)
        // For now, let's just reload the page or rely on router refresh if we had it passed down
        window.location.reload() 
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
      setUploadingFile(null)
    }
  }

  const handleDownload = async (key: string) => {
    const url = await getFileUrl(key)
    if (url) {
      window.open(url, '_blank')
    } else {
      toast.error('Failed to get download URL')
    }
  }

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const success = await removeFile(key)
      if (success) {
        setFiles(files.filter(f => f.key !== key))
        toast.success('File deleted')
      } else {
        toast.error('Failed to delete file')
      }
    } catch (error) {
      toast.error('Error deleting file')
    }
  }

  return (
    <div className="space-y-6">
      {/* Storage Overview Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Storage Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{formatSize(usedStorage)}</span>
            <span className="text-sm text-muted-foreground">of {formatSize(maxStorage)}</span>
          </div>
          <Progress value={usedPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {files.length} files stored
          </p>
        </CardContent>
      </Card>

      {/* File Manager Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Files</CardTitle>
              <CardDescription>Manage your cloud documents and assets.</CardDescription>
            </div>
            <div>
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <Button disabled={isUploading} asChild>
                <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isUploading ? `Uploading ${uploadingFile}...` : 'Upload File'}
                </label>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No files uploaded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  files.map((file) => (
                    <TableRow key={file.key}>
                      <TableCell>
                        <FileIcon className="h-4 w-4 text-blue-500" />
                      </TableCell>
                      <TableCell className="font-medium">{file.key}</TableCell>
                      <TableCell>{formatSize(file.size)}</TableCell>
                      <TableCell>{new Date(file.lastModified).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownload(file.key)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(file.key)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
