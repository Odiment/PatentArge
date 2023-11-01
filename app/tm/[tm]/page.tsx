export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5

import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import YeniMarka from './yeni-marka'

import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

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

export default async function YeniMarkaOlustur() {
  /* const supabase = createServerComponentClient<Database>({ cookies }) */
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser() 

  

  if (!session) {
    redirect('/')
  }

  const { data: markalar } = await supabase.from('markalar').select(`marka`)

  const { data: profil } = await supabase
    .from('profiles')
    .select(`id, firma_ad, yetki`)
    .eq('id', user?.id!)

  const { data: firma } = await supabase
    .from('firma_profil')
    .select('firma_id')
    .eq('user_email', user?.email!)

  const { data: firma_bilgi } = await supabase
    .from('firmalar')
    .select('id, firma, firma_ad, firma_unvan')

  // admin yetkisinde tüm markaların görülebilmesi - erişilebilmesi
  let markalarx: MarkalarX[] | null = []

  if ((firma != (null || undefined)) && (profil != (null || undefined))){
  if (profil[0].yetki !== 'admin') {
    const { data: marka_firma } = await supabase
      .from('markalar')
      .select()
      .eq('firma_id', firma[0].firma_id)
    markalarx = marka_firma
  } else {
    const { data: marka_tum } = await supabase.from('markalar').select()

    markalarx = marka_tum
  }
}

/*   const { data: marka_firma_id } = await supabase
    .from('markalar')
    .select('firma_id')

  const { data: markaBilgiler } = await supabase
    .from('markalar')
    .select('marka') */
/* if(markalarx != null) {
    let result = markalarx.map(({ marka }) => marka)
}
 */

let firma_bilgi_id: React.Key | null | undefined = firma_bilgi?.map(({ id }) => id) as React.Key | null | undefined

  return (
    <>
      <div className="flex flex-col gap-y-8 pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex-none object-contain">
          <YeniMarka key={firma_bilgi_id} firmabilgi={firma_bilgi} />
        </div>
      </div>
    </>
  )
}
