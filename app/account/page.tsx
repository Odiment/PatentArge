import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "../database.types"
import AccountForm from "./account-form"

export const getSession = async () => {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
   const {
        data: { user },
      } = await supabase.auth.getUser();

      const {
        data: { session },
      } = await supabase.auth.getSession()

      return {session, user, supabase}
}

export default async function Account() {
  /* const supabase = createServerComponentClient<Database>({ cookies }) */
  /* const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession() */

  const {session, user, supabase} = await getSession()

  return (
    <>
      <AccountForm session={session} />
    </>
  )
}
