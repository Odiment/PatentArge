import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Database } from '@/database.types'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import MarkaDetayCard from './marka-detay-card'

interface MarkaDetay {
  params: {
    referans_no: string
  }
}

const MarkaDetay = async ({ params }: MarkaDetay) => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: secilenMarka } = await supabase
    .from('markalar')
    .select()
    .eq('referans_no', `${params.markadetay}`)

  return (
    <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px] ">
      <h1>Marka Detay Sayfası --- TASARLANACAK ---</h1>
      <h1>{params.markadetay}</h1>
      <h1>{secilenMarka[0].marka}</h1>
      <h1>{secilenMarka[0].durum_aciklamasi}</h1>
      {/*       <MarkaCardTek data={secilenMarka} />

      <div className="container py-10 mx-auto">
        <MarkaForm session={session} secilenMarka={secilenMarka} />
      </div> */}
    </div>
  )
}

export default MarkaDetay
