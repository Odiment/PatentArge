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

import TasarimDetayCard from "./tasarim-detay-card";

import { Database } from "@/app/supabase";
/* 
type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"]; */

interface TasarimDetay {
  params: {
    tasarimdetay: string;
  };
}

const TasarimDetay = async ({ params }: TasarimDetay) => {
  /* const supabase = createServerComponentClient<Database>({ cookies }); */
   const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore }); 

   const {
    data: { session },
  } = await supabase.auth.getSession(); 

  const { data: secilenTasarim } = await supabase
    .from("tasarimlar")
    .select()
    .eq("referans_no", `${params.tasarimdetay}`);

  return (
    <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px] ">
      <h1>TASARIM Detay Sayfası --- TASARLANACAK ---</h1>
      <h1>{params.tasarimdetay}</h1>

      {secilenTasarim != null && (
        <>
          <h1>{secilenTasarim[0].tasarim_title}</h1>
          <h1>{secilenTasarim[0].ozet}</h1>
          {/*       <MarkaCardTek data={secilenMarka} />

      <div className="container py-10 mx-auto">
        <MarkaForm session={session} secilenMarka={secilenMarka} />
      </div> */}
        </>
      )}
    </div>
  );
};

export default TasarimDetay;
