import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Database } from '@/database.types'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import PatentDetayCard from './patent-detay-card'

interface PatentDetay {
  params: {
    referans_no: string
  }
}

const PatentDetay = async ({ params }: PatentDetay) => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: secilenPatent } = await supabase
    .from('patentler')
    .select()
    .eq('referans_no', `${params.patentdetay}`)

  return (
    <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px] ">
      <h1>PATENT Detay Sayfası --- TASARLANACAK ---</h1>
      <h1>{params.patentdetay}</h1>
      <h1>{secilenPatent[0].patent_title}</h1>
      <h1>{secilenPatent[0].ozet}</h1>
      {/*       <MarkaCardTek data={secilenMarka} />

      <div className="container py-10 mx-auto">
        <MarkaForm session={session} secilenMarka={secilenMarka} />
      </div> */}
    </div>
  )
}

export default PatentDetay
