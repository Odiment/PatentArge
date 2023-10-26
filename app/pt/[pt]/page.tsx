import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '../../database.types'
import YeniPatent from './yeni-patent'

export default async function YeniPatentOlustur() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: patentler } = await supabase
    .from('patentler')
    .select(`patent_title`)

  const { data: profil } = await supabase
    .from('profiles')
    .select(`id, firma_ad, yetki`)
    .eq('id', user.id)

  const { data: firma } = await supabase
    .from('firma_profil')
    .select('firma_id')
    .eq('user_email', user.email)

  const { data: firma_bilgi } = await supabase
    .from('firmalar')
    .select('id, firma, firma_ad, firma_unvan')

  // admin yetkisinde tüm patentlerin görülebilmesi - erişilebilmesi
  let patentlerx: array | null

  if (profil[0].yetki !== 'admin') {
    const { data: patent_firma } = await supabase
      .from('patentler')
      .select()
      .eq('firma_id', firma[0].firma_id)
    patentlerx = patent_firma
  } else {
    const { data: patent_tum } = await supabase.from('patentler').select()

    patentlerx = patent_tum
  }

  const { data: patent_firma_id } = await supabase
    .from('patentler')
    .select('firma_id')

  const { data: patentBilgiler } = await supabase
    .from('patentler')
    .select('patent_title')

  /*   let result = patentlerx.map(({ patent_title }) => patent_title) */

  if (!session) {
    redirect('/')
  }

  return (
    <>
      <div className="flex flex-col gap-y-8 pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex-none object-contain">
          <YeniPatent firmabilgi={firma_bilgi} />
        </div>
      </div>
    </>
  )
}
