import { cookies } from 'next/headers'
/* mport { redirect } from 'next/navigation' */
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import MarkaCardTek from './components/marka-card-tek'
import MarkaForm from './components/marka-form'
import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaCardYazProps {
  params: {
    referans_no: string;
    tmcard: string;
  };
}

export const getSession = async () => {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
   /*  const {
        data: { user },
      } = await supabase.auth.getUser(); */

      const {
        data: { session },
      } = await supabase.auth.getSession()

      return {session, supabase}
}

const MarkaCardYaz = async ({ params }: MarkaCardYazProps) => {
  /* const supabase = createServerComponentClient<Database>({ cookies }) */
  /* const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore }); */
  
  const {session, supabase} = await getSession()

  const { data: secilenMarka } = await supabase
    .from('markalar')
    .select()
    .eq('referans_no', `${params.tmcard}`)

  return (
    <div className="flex flex-col content-center mx-auto pt-10 gap-y-8  px-4 sm:px-6 lg:px-8">
      <MarkaCardTek data={secilenMarka!} />

      <div className="container py-10 mx-auto">
        <MarkaForm session={session} secilenMarka={secilenMarka!} />
      </div>
    </div>
  )
}

export default MarkaCardYaz
