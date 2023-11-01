import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import YeniFirma from './yeni-firma'

import { getSession } from "@/app/auth/getSession/getSession"

import { cache } from "react";
import { Database } from "@/app/supabase";

/* export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
}); */


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
  /* const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore }); */

  /* const {
    data: { session },
  } = await supabase.auth.getSession() */

/*   const {
    data: { user },
  } = await supabase.auth.getUser() */

  /* const {session, user, supabase} = await getSession() */

  const createServerSupabaseClient = cache(() => {
    const cookieStore = cookies();
    return createServerComponentClient<Database>({ cookies: () => cookieStore });
  });

  const session = await getSession()

  const supabase = createServerSupabaseClient();


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
