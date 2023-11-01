import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '../../database.types'
import YeniFirma from './yeni-firma'

import { getSession } from "@/app/auth/getSession/getSession"


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

export default async function YeniFirmaOlustur() {
  /* const supabase = createServerComponentClient<Database>({ cookies }) */
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  /* const {
    data: { session },
  } = await supabase.auth.getSession() */

/*   const {
    data: { user },
  } = await supabase.auth.getUser() */

  /* const {session, user, supabase} = await getSession() */

  const session = await getSession()


  const { data: firma_bilgi } = await supabase
    .from('firmalar')
    .select('id, firma, firma_ad, firma_unvan')

  if (!session) {
    redirect('/')
  }

  return (
    <>
      <div className="flex flex-col gap-y-8 pt-10 px-4 sm:px-6 lg:px-8  ">
        <div className="flex-none object-contain ">
          <YeniFirma firmabilgi={firma_bilgi} />
        </div>
      </div>
    </>
  )
}
