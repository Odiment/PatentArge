import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '../../database.types'
import YeniFirma from './yeni-firma'

export default async function YeniFirmaOlustur() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  /* const { data: markalar } = await supabase.from('markalar').select(`marka`) */

  /*  const { data: profil } = await supabase
    .from('profiles')
    .select(`id, firma_ad, yetki`)
    .eq('id', user.id)

  const { data: firma } = await supabase
    .from('firma_profil')
    .select('firma_id')
    .eq('user_email', user.email) */

  const { data: firma_bilgi } = await supabase
    .from('firmalar')
    .select('id, firma, firma_ad, firma_unvan')

  // admin yetkisinde tüm markaların görülebilmesi - erişilebilmesi
  /*   let markalarx: array | null

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
 */
  /*   const { data: marka_firma_id } = await supabase
    .from('markalar')
    .select('firma_id') */

  /*   const { data: markaBilgiler } = await supabase
    .from('markalar')
    .select('marka') */

  /*   let result = markalarx.map(({ marka }) => marka) */

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
