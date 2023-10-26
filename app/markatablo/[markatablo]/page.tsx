import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusIcon } from '@/icons/PlusIcon'
import { Database } from '../../database.types'
import MarkaList from './components/marka-list'
import NextUiDataTable from './components/nextui-data-table'
import { SearchInput } from './components/search-input'

interface RootPageProps {
  searchParams: {
    name: string | null
  }
}

export default async function MarkaTablo({ searchParams }: MarkaIdPageProps) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!session) {
    redirect('/')
  }

  let ad = `${searchParams.name}`
  let durum = ad === 'undefined' || ad === null

  const { data: secilenMarkalar } = await supabase
    .from('markalar')
    .select(`marka`)
    .textSearch(`marka`, `%${searchParams.name}%`)

  const { data: profil } = await supabase
    .from('profiles')
    .select(`full_name, username, avatar_url, yetki, pozisyon`)
    .eq('id', user?.id)
    .single()

  const { data: firma } = await supabase
    .from('firma_profil')
    .select('firma_id')
    .eq('user_email', user.email)

  let markalarx: array | null

  if (profil.yetki !== 'admin') {
    const { data: marka_firma } = await supabase
      .from('markalar')
      .select()
      .eq('firma_id', firma[0].firma_id)
    markalarx = marka_firma
  } else {
    const { data: marka_tum } = await supabase.from('markalar').select()

    markalarx = marka_tum
  }

  return (
    <>
      <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
        <div className="">
          {profil.yetki == 'admin' && (
            <Link
              className="justify-end link border-solid border-4 border-primary/25 font-bold hover:text-primary hover:bg-primary/10 rounded-lg transition p-3"
              href="/tm/new"
            >
              + Yeni Ekle
            </Link>
          )}
        </div>

        <NextUiDataTable veri={markalarx ?? []} user={user} />
      </div>
    </>
  )
}
