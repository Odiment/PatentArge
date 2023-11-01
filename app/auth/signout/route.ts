import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export const getSession = async () => {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
        data: { session },
      } = await supabase.auth.getSession()
    // Check if we have a session
      

      return {session, supabase}

}

export async function POST(req: NextRequest) {
  /* const supabase = createRouteHandlerClient({ cookies }) */
  /* const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore }); */

  const {session, supabase} = await getSession()

  if (session) {
    await supabase.auth.signOut()} 


  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}