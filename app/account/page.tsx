import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

/* import { Database } from "../database.types" */
import AccountForm from "./account-form"

import { redirect } from 'next/navigation'


export const getSession = async () => {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
/*    const {
        data: { user },
      } = await supabase.auth.getUser(); */

      const {
        data: { session },
      } = await supabase.auth.getSession()

      return {session}
}

export default async function Account() {
  /* const supabase = createServerComponentClient<Database>({ cookies }) */
  /* const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession() */

  const {session} = await getSession()

  if (!session) {
    redirect('/')
  }

  return (
    <>
      <AccountForm session={session} />
    </>
  )
}
