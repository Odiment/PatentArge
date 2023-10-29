import React from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusIcon } from '@/icons/PlusIcon'
import { Database } from '../../database.types'
import NextUiDataTable from './components/nextui-data-table'

interface RootPageProps {
  searchParams: {
    name: string | null
  }
}

export default async function PatentTablo({ searchParams }: PatentIdPageProps) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let ad = `${searchParams.name}`
  let durum = ad === 'undefined' || ad === null

  const { data: secilenPatentler } = await supabase
    .from('patentler')
    .select(`patent`)
    .textSearch(`patent`, `%${searchParams.name}%`)

  const { data: profil } = await supabase
    .from('profiles')
    .select(`full_name, username, avatar_url, yetki, pozisyon`)
    .eq('id', user?.id)
    .single()

  const { data: patentler } = await supabase
    .from('patentler')
    .select(`patent_title`)

  const { data: patentBilgiler } = await supabase.from('patentler').select()

  const { data: tumPatentResimler } = await supabase
    .from('patent_resimler')
    .select('patent_resim_url, patent_id')

  if (!session) {
    redirect('/')
  }

  return (
    <>
      <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
        <div className="">
          {profil.yetki == 'admin' && (
            <Link
              className="justify-end link border-solid border-4 border-primary/25 font-bold hover:text-primary hover:bg-primary/10 rounded-lg transition p-3"
              href="/pt/new"
            >
              + Yeni Ekle
            </Link>
          )}
        </div>
        <NextUiDataTable
          veri={patentBilgiler ?? []}
          user={user}
          patentResimler={tumPatentResimler}
          kullanici={user}
        />
      </div>
    </>
  )
}
