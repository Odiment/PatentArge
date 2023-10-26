import './globals.css'
/* import { Metadata } from "next"; */
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

/* import { siteConfig } from '@/config/site' */
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
/* import { Sidebar } from '@/components/sidebar'
import { SiteHeader } from '@/components/site-header' */

import Providers from './providers'

import TopNavigation from '@/components/topnavigation'
import SideNavigation from '@/components/sidenavigation'
import Nav from '@/components/Nav'

/* export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
} */

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
        >
          <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
            <div className="relative flex min-h-screen flex-col">
              <TopNavigation session={session} user={user} />
              <div className="hidden md:flex w-20 flex-col fixed inset-y-0">
                <SideNavigation session={session} user={user} />
              </div>
              <Nav session={session} user={user} />

              <div className="flex-1 ml-[5px] md:ml-[30px] lg:ml-[90px] ">
                {children}
              </div>
            </div>
          </Providers>
        </body>
      </html>
    </>
  )
}
