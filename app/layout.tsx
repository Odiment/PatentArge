export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5

import "./globals.css";
/* import { Metadata } from "next"; */
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

/* import { siteConfig } from '@/config/site' */
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
/* import { Sidebar } from '@/components/sidebar'
import { SiteHeader } from '@/components/site-header' */

import Providers from "./providers";

import TopNavigation from "@/components/topnavigation";
import SideNavigation from "@/components/sidenavigation";
import Nav from "@/components/Nav";

import { getSession } from "@/app/auth/getSession/getSession";
import { getUser } from "@/app/auth/getUser/getUser";

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
  children: React.ReactNode;
}

/* export const getSession = async () => {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
   const {
        data: { user },
      } = await supabase.auth.getUser();

      const {
        data: { session },
      } = await supabase.auth.getSession()

      return {session, user, supabase}
} */

export default async function RootLayout({ children }: RootLayoutProps) {
  /* const supabase = createServerComponentClient<Database>({ cookies }) */
  /*  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore }); */

/*   const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();  */

  /* const {session, user, supabase} = await getSession() */

  const session = await getSession();
  const user = await getUser();

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}>
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex min-h-screen flex-col">
              <TopNavigation session={session} />
              <div className="hidden md:flex w-20 flex-col fixed inset-y-0">
                <SideNavigation session={session} userid={user?.id!} />
              </div>
              <Nav session={session} />

              <div className="flex-1 ml-[5px] md:ml-[30px] lg:ml-[90px] ">
                {children}
              </div>
            </div>
          </Providers>
        </body>
      </html>
    </>
  );
}
