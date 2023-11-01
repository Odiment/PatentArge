export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import PatentDetayCard from "./patent-detay-card";

import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentDetay {
  params: {
    patentdetay: string;
  };
}

/* export const getSession = async () => {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
   const {
        data: { user },
      } = await supabase.auth.getUser();

      const {
        data: { session },
      } = await supabase.auth.getSession()

      return {session, user, supabase}
} */

const PatentDetay = async ({ params }: PatentDetay) => {
  /* const supabase = createServerComponentClient<Database>({ cookies }); */
   const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore }); 

   const {
    data: { session },
  } = await supabase.auth.getSession(); 

  /* const {session, user, supabase} = await getSession() */

  const { data: secilenPatent } = await supabase
    .from("patentler")
    .select()
    .eq("referans_no", `${params.patentdetay}`);

  return (
    <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px] ">
      <h1>PATENT Detay Sayfası --- TASARLANACAK ---</h1>
      <h1>{params.patentdetay}</h1>

      {secilenPatent != null && (
        <>
          <h1>{secilenPatent[0].patent_title}</h1>
          <h1>{secilenPatent[0].ozet}</h1>
          {/*       <MarkaCardTek data={secilenMarka} />

      <div className="container py-10 mx-auto">
        <MarkaForm session={session} secilenMarka={secilenMarka} />
      </div> */}
        </>
      )}
    </div>
  );
};

export default PatentDetay;
