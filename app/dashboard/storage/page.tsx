import { FileManager } from "@/components/storage/file-manager"
import { getFiles } from "@/app/actions/storage"
import DashboardNav from "@/components/dashboard-nav"
import { getUser } from "@/app/actions"
import { redirect } from "next/navigation"

export default async function StoragePage() {
  const { email } = await getUser()
  
  if (!email) {
    redirect('/login')
  }

  const files = await getFiles()
  
  // Serialize dates for client component
  const serializedFiles = files.map(f => ({
    ...f,
    lastModified: f.lastModified || new Date(),
    // Ensure undefined values are handled
    size: f.size || 0,
    etag: f.etag || '',
    key: f.key || 'unknown'
  }))

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav email={email} />
      
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Cloud Storage</h1>
            <p className="text-muted-foreground">Secure file storage powered by R2 Network</p>
          </div>
          
          <FileManager files={serializedFiles} />
        </div>
      </main>
    </div>
  )
}
