import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // Define the main domain (for local testing, you might need to adjust /etc/hosts)
  // In production, this would be 'hostprime.shop'
  // For local, we can assume anything not 'localhost:3000' is a subdomain if we use a proxy
  // But strictly, let's look for '.hostprime.shop' or assume a specific header if behind a proxy
  
  // Regex to extract subdomain
  // Matches subdomain.hostprime.shop
  // Or subdomain.localhost:3000 (for local testing if configured)
  const currentHost = hostname.replace(/:\d+$/, '') // remove port
  const isLocal = currentHost.includes('localhost')
  const rootDomain = isLocal ? 'localhost' : 'hostprime.shop'
  
  // If we are on a subdomain
  if (currentHost.endsWith(`.${rootDomain}`) && currentHost !== `www.${rootDomain}`) {
    const subdomain = currentHost.replace(`.${rootDomain}`, '')
    
    // Rewrite to the site route
    // /path -> /site/subdomain/path
    url.pathname = `/site/${subdomain}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - dashboard (dashboard routes)
     * - login (login route)
     * - admin (admin route)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|dashboard|login|admin).*)',
  ],
}
