'use client'

import { FileItem } from '@/lib/storage'
import { 
  Folder, 
  FileText, 
  FileCode, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Archive, 
  File,
  MoreVertical,
  Pencil,
  Trash2,
  Scissors,
  Download,
  FileArchive,
  Edit
} from 'lucide-react'
import { cn, formatBytes } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { format } from 'date-fns'

interface FileExplorerProps {
  files: FileItem[]
  isLoading: boolean
  selectedFile: FileItem | null
  onFileClick: (file: FileItem) => void
  onRename?: (file: FileItem) => void
  onDelete?: (file: FileItem) => void
  onZip?: (file: FileItem) => void
  onUnzip?: (file: FileItem) => void
  onCut?: (file: FileItem) => void
  onDownload?: (file: FileItem) => void
  onEdit?: (file: FileItem) => void
}

export default function FileExplorer({ 
  files, 
  isLoading, 
  selectedFile, 
  onFileClick,
  onRename,
  onDelete,
  onZip,
  onUnzip,
  onCut,
  onDownload,
  onEdit
}: FileExplorerProps) {
  
  const getIcon = (file: FileItem, className = "h-5 w-5") => {
    if (file.isDirectory) return <Folder className={cn(className, "text-blue-500 fill-blue-500/20")} />
    
    const ext = file.name.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
        return <ImageIcon className={cn(className, "text-purple-500")} />
    }
    if (['mp4', 'webm', 'mov'].includes(ext || '')) {
        return <Video className={cn(className, "text-red-500")} />
    }
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) {
        return <Music className={cn(className, "text-pink-500")} />
    }
    if (['zip', 'tar', 'gz', 'rar'].includes(ext || '')) {
        return <Archive className={cn(className, "text-orange-500")} />
    }
    if (['js', 'ts', 'tsx', 'jsx', 'html', 'css', 'json', 'php', 'py', 'env', 'config'].includes(ext || '')) {
        return <FileCode className={cn(className, "text-green-500")} />
    }
    
    return <FileText className={cn(className, "text-gray-500")} />
  }

  const isEditable = (file: FileItem) => {
    return !file.isDirectory && /\.(txt|html|css|js|json|php|md|xml|yml|yaml|env|config)$/i.test(file.name)
  }

  if (isLoading) {
    return (
        <div className="flex flex-col space-y-3 p-4">
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 h-12 bg-muted/20 animate-pulse rounded-md px-4">
                        <div className="h-6 w-6 rounded-full bg-muted/40"></div>
                        <div className="h-4 w-1/3 bg-muted/40 rounded"></div>
                        <div className="ml-auto h-4 w-20 bg-muted/40 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    )
  }

  if (files.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
            <Folder className="h-16 w-16 mb-4 opacity-20" />
            <p>This folder is empty</p>
        </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px] text-right">Size</TableHead>
            <TableHead className="w-[150px] text-right">Last Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow 
                key={file.key}
                className={cn(
                    "cursor-pointer hover:bg-muted/50 transition-colors group",
                    selectedFile?.key === file.key && "bg-blue-50 dark:bg-blue-900/20"
                )}
                onClick={() => onFileClick(file)}
            >
              <TableCell className="py-2">
                 {getIcon(file)}
              </TableCell>
              <TableCell className="py-2 font-medium">
                <ContextMenu>
                    <ContextMenuTrigger className="flex items-center w-full h-full py-2">
                        {file.name}
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        {!file.isDirectory && isEditable(file) && (
                            <ContextMenuItem onClick={() => onEdit?.(file)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </ContextMenuItem>
                        )}
                        <ContextMenuItem onClick={() => onRename?.(file)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Rename
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => onCut?.(file)}>
                            <Scissors className="mr-2 h-4 w-4" />
                            Cut
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={() => onZip?.(file)}>
                            <Archive className="mr-2 h-4 w-4" />
                            Zip
                        </ContextMenuItem>
                        {file.name.endsWith('.zip') && (
                            <ContextMenuItem onClick={() => onUnzip?.(file)}>
                                <FileArchive className="mr-2 h-4 w-4" />
                                Unzip
                            </ContextMenuItem>
                        )}
                        <ContextMenuSeparator />
                        {!file.isDirectory && (
                             <ContextMenuItem onClick={() => onDownload?.(file)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </ContextMenuItem>
                        )}
                        <ContextMenuItem 
                            onClick={() => onDelete?.(file)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
              </TableCell>
              <TableCell className="text-right py-2 text-muted-foreground text-sm">
                {file.isDirectory ? '-' : formatBytes(file.size || 0)}
              </TableCell>
              <TableCell className="text-right py-2 text-muted-foreground text-sm">
                {file.lastModified ? format(new Date(file.lastModified), 'MMM d, yyyy') : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
