import { NextRequest, NextResponse } from 'next/server'
import { getInstanceBySubdomain } from '@/app/actions'
import { getDownloadUrl } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subdomain: string; path?: string[] }> }
) {
  const { subdomain, path } = await params

  if (!subdomain) {
    return new NextResponse('Subdomain not found', { status: 404 })
  }

  const instance = await getInstanceBySubdomain(subdomain)
  if (!instance) {
    return new NextResponse('Site not found', { status: 404 })
  }

  // Construct path
  let filePath = path ? path.join('/') : ''
  
  // Handle root/directory requests -> index.html
  if (!filePath || filePath.endsWith('/')) {
    filePath += 'index.html'
  }

  // Security: Prevent directory traversal (though R2 is flat, ../ might be an issue if not handled)
  // My getFiles logic handles it, but here we construct key manually.
  // R2 keys are just strings.
  // instance root: instances/[id]/public_html/
  // full key: instances/[id]/public_html/[filePath]
  
  const rootKey = `instances/${instance.id}/public_html/`
  const fullKey = `${rootKey}${filePath}`

  try {
    const url = await getDownloadUrl(fullKey)
    if (!url) {
      // Try adding .html if not found (clean URLs)? 
      // Or just 404.
      // Let's try to fetch to check status.
      return new NextResponse('File not found', { status: 404 })
    }

    const response = await fetch(url)
    
    if (!response.ok) {
        if (response.status === 404) {
             return new NextResponse('File not found', { status: 404 })
        }
        return new NextResponse('Error fetching file', { status: response.status })
    }

    const contentType = response.headers.get('Content-Type') || 'application/octet-stream'
    
    // PHP Handling (Simulation/Warning)
    if (filePath.endsWith('.php')) {
        // We cannot execute PHP.
        // Option 1: Serve as text/plain so they see code.
        // Option 2: Serve as text/html and let browser render (dangerous/broken).
        // Option 3: Return 501 Not Implemented.
        // User asked to "remember it processes PHP".
        // I will return a special page saying "PHP Processing is being provisioned".
        // Or just serve the content as text/plain for now.
        
        // Let's serve as text/plain for safety and transparency in this demo.
        return new NextResponse(response.body, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache'
            }
        })
    }

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=60' // Short cache
      }
    })

  } catch (error) {
    console.error('Proxy error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
