import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Database } from '@/database.types'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import PatentCardTek from './components/patent-card-tek'
import PatentForm from './components/patent-form'

interface PatentCardYazProps {
  params: {
    referans_no: string
  }
}

const PatentCardYaz = async ({ params }: PatentCardYazProps) => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: secilenPatent } = await supabase
    .from('patentler')
    .select()
    .eq('referans_no', `${params.ptcard}`)

  // Patent resim seçimi
  const { data: secilenPatentResimler } = await supabase
    .from('patent_resimler')
    .select('patent_resim_url, id')
    .eq('patent_id', `${secilenPatent[0].id}`)

  let patent_resim_url = secilenPatentResimler.map(
    ({ patent_resim_url }) => patent_resim_url
  )

  // Ürün resim seçimi
  const { data: secilenProductResimler } = await supabase
    .from('product_resimler')
    .select('product_resim_url, product_remote_url, id')
    .eq('patent_id', `${secilenPatent[0].id}`)

  let product_resim_url = secilenProductResimler.map(
    ({ product_resim_url }) => product_resim_url
  )

  /*   console.log("secilenPatentResimler")
  console.log(secilenPatentResimler)
  console.log("patent_resim_url")
  console.log(patent_resim_url) */

  return (
    <div className="flex flex-col content-center mx-auto pt-10 gap-y-8  px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center  text-xl font-extrabold items-center">
        <h1>Patent Bilgileri Düzenleme/Güncelleme Ekranı</h1>
      </div>
      <PatentCardTek
        veri={secilenPatent}
        patent_resimler={secilenPatentResimler}
        product_resimler={secilenProductResimler}
      />

      <div className="container py-10 mx-auto">
        <PatentForm session={session} secilenPatent={secilenPatent} />
      </div>
    </div>
  )
}

export default PatentCardYaz
