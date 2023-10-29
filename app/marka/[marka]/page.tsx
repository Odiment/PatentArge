import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { Database } from '../../database.types'
import MarkaList from './components/marka-list'
import { SearchInput } from '@/components/search-input'
import Filter from '@/components/filter'

interface MarkaIdPageProps {
  searchParams: {
    name: string | null
    kategori: string | null
  }
}

/* interface MarkaUser {
    user: {
        id: string | null
        email: string | null
}
} */

export default async function MarkaKart({ searchParams }: MarkaIdPageProps) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("user")
  console.log(user.email)

  if (!session) {
    redirect('/')
  }

  let ad = `${searchParams.name}`
  let durum = ad === 'undefined' || ad === null

  let kategori = `${searchParams.kategori}`
  let durumKategori = kategori === 'undefined' || kategori === null

  const { data: profil } = await supabase
    .from('profiles')
    .select(`id, firma_ad, yetki`)
    .eq('id', user.id)

  const { data: firma } = await supabase
    .from('firma_profil')
    .select('firma_id')
    .eq('user_email', user.email)

  // admin yetkisinde tüm markaların görülebilmesi - erişilebilmesi
  let markalarx: array | null

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

  var aranan = markalarx.reduce((aranan, thing) => {
    if (thing.marka.includes(`${searchParams.name}`)) {
      aranan.push(thing)
    }
    return aranan
  }, [])

  var arananKategori = markalarx.reduce((arananKategori, thing) => {
    if (thing.status.includes(`${searchParams.kategori}`)) {
      arananKategori.push(thing)
    }

    return arananKategori
  }, [])

  var arananVeKategori = markalarx.reduce((arananVeKategori, thing) => {
    if (
      thing.marka.includes(`${searchParams.name}`) &
      thing.status.includes(`${searchParams.kategori}`)
    ) {
      arananVeKategori.push(thing)
    }

    return arananVeKategori
  }, [])

  let yalnizcaGecerli: string | null

  let durumIptalOlmayan = searchParams.kategori

  if ((durumIptalOlmayan = 'yalnizcaGecerli')) {
    yalnizcaGecerli = markalarx.reduce((yalnizcaGecerli, thing) => {
      if (!thing.status.includes('iptal')) {
        yalnizcaGecerli.push(thing)
      }
      return yalnizcaGecerli
    }, [])
  }

  var arananYalnizcaGecerli = yalnizcaGecerli.reduce(
    (arananYalnizcaGecerli, thing) => {
      if (thing.marka.includes(`${searchParams.name}`)) {
        arananYalnizcaGecerli.push(thing)
      }

      return arananYalnizcaGecerli
    },
    []
  )

  let items: string | null
  if (durum === true) {
    items = markalarx
  } else items = aranan

  if (durumKategori === true) {
    items = markalarx
  } else items = arananKategori

  if ((durum === false) & (durumKategori === false)) {
    items = arananVeKategori
  }

  if (searchParams.kategori === 'tumu') {
    items = markalarx
  }

  let durumTumuVeAranan = searchParams.kategori === 'tumu' && durum === false

  if (durumTumuVeAranan === true) {
    items = aranan
  }

  if (searchParams.kategori === 'yalnizcaGecerli') {
    items = yalnizcaGecerli
  }

  let durumYalnizcaGecerliVeAranan =
    searchParams.kategori === 'yalnizcaGecerli' && durum === false

  if (durumYalnizcaGecerliVeAranan === true) {
    items = arananYalnizcaGecerli
  }

  return (
    <>
      <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
        <Filter />
        <MarkaList key={items.id} items={items} bilgiler={items} user={user} />
      </div>
    </>
  )
}
