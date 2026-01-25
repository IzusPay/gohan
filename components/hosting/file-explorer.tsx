import { FileItem } from '@/lib/storage'
import { 
  Folder, 
  FileText, 
  FileCode, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Archive, 
  File
} from 'lucide-react'
import { cn, formatBytes } from '@/lib/utils'

interface FileExplorerProps {
  files: FileItem[]
  isLoading: boolean
  selectedFile: FileItem | null
  onFileClick: (file: FileItem) => void
}

export default function FileExplorer({ files, isLoading, selectedFile, onFileClick }: FileExplorerProps) {
  
  const getIcon = (file: FileItem) => {
    if (file.isDirectory) return <Folder className="h-10 w-10 text-blue-500 fill-blue-500/20" />
    
    const ext = file.name.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
        return <ImageIcon className="h-10 w-10 text-purple-500" />
    }
    if (['mp4', 'webm', 'mov'].includes(ext || '')) {
        return <Video className="h-10 w-10 text-red-500" />
    }
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) {
        return <Music className="h-10 w-10 text-pink-500" />
    }
    if (['zip', 'tar', 'gz', 'rar'].includes(ext || '')) {
        return <Archive className="h-10 w-10 text-orange-500" />
    }
    if (['js', 'ts', 'tsx', 'jsx', 'html', 'css', 'json', 'php', 'py'].includes(ext || '')) {
        return <FileCode className="h-10 w-10 text-green-500" />
    }
    
    return <FileText className="h-10 w-10 text-gray-500" />
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )
  }

  if (files.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Folder className="h-16 w-16 mb-4 opacity-20" />
            <p>This folder is empty</p>
        </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {files.map((file) => (
                <div 
                    key={file.key}
                    className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-colors border border-transparent hover:bg-muted/50",
                        selectedFile?.key === file.key && "bg-blue-50 border-blue-200 ring-1 ring-blue-300 dark:bg-blue-900/20 dark:border-blue-800"
                    )}
                    onClick={() => onFileClick(file)}
                >
                    <div className="mb-3 transition-transform hover:scale-110 duration-200">
                        {getIcon(file)}
                    </div>
                    <span className="text-sm text-center truncate w-full font-medium" title={file.name}>
                        {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                        {file.isDirectory ? 'Folder' : formatBytes(file.size || 0)}
                    </span>
                </div>
            ))}
        </div>
    </div>
  )
}
