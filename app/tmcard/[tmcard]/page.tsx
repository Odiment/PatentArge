import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Database } from '@/database.types'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import MarkaCardTek from './components/marka-card-tek'
import MarkaForm from './components/marka-form'

interface MarkaCardYazProps {
  params: {
    referans_no: string
  }
}

const MarkaCardYaz = async ({ params }: MarkaCardYazProps) => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: secilenMarka } = await supabase
    .from('markalar')
    .select()
    .eq('referans_no', `${params.tmcard}`)

  return (
    <div className="flex flex-col content-center mx-auto pt-10 gap-y-8  px-4 sm:px-6 lg:px-8">
      <MarkaCardTek data={secilenMarka} />

      <div className="container py-10 mx-auto">
        <MarkaForm session={session} secilenMarka={secilenMarka} />
      </div>
    </div>
  )
}

export default MarkaCardYaz
