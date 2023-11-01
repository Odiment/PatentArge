export const dynamic = 'force dynamic'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

/* export const getSession = async () => {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
        data: { session },
      } = await supabase.auth.getSession()
      

      return {session, supabase}

} */

export async function POST(req: NextRequest) {
  /* const supabase = createRouteHandlerClient({ cookies }) */
   const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  /* const {session, supabase} = await getSession() */

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()} 


  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}