import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '../../database.types'
import PatentList from './components/patent-list'
import NextUiDataTable from './components/nextui-data-table'
import { SearchInput } from './components/search-input'

interface RootPageProps {
  searchParams: {
    name: string | null
  }
}

export default async function PatentKart({ searchParams }: PatentIdPageProps) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let ad = `${searchParams.name}`
  let durum = ad === 'undefined' || ad === null

  const { data: profil } = await supabase
    .from('profiles')
    .select(`id, firma_ad, yetki`)
    .eq('id', user.id)

  const { data: firma } = await supabase
    .from('firma_profil')
    .select('firma_id')
    .eq('user_email', user.email)

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

  // Arama çubuğundan yazılan anahtar kelimeye göre getitirilecek patentler
  var aranan = patentlerx.reduce((aranan, thing) => {
    if (thing.patent_title.includes(`${searchParams.name}`)) {
      aranan.push(thing)
    }
    return aranan
  }, [])

  // Arama yapılan patentlerin id bilgileri
  let arananPatentler_id = aranan.map(({ id }) => id)

  // Tüm patentlerin id bilgileri
  /*  let secilenPatent_id = patentlerx.map(({ id }) => id) */

  const { data: tumPatentResimler } = await supabase
    .from('patent_resimler')
    .select('patent_resim_url, patent_id')

  let tumPatentResimlerPatent_id = tumPatentResimler.map(
    ({ patent_id }) => patent_id
  )

  var arananPatentResimler = tumPatentResimler.reduce(
    (arananPatentResimler, thing) => {
      if (thing.patent_id.includes(`${arananPatentler_id}`)) {
        arananPatentResimler.push(thing)
      }
      return arananPatentResimler
    },
    []
  )

  if (!session) {
    redirect('/')
  }

  return (
    <>
      <div className="flex-none object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
        <PatentList
          items={durum ? patentlerx : aranan}
          bilgiler={durum ? patentlerx : aranan}
          patentResimler={durum ? tumPatentResimler : arananPatentResimler}
          user={user}
        />
      </div>
    </>
  )
}
