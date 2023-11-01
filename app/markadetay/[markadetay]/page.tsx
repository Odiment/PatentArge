import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import MarkaDetayCard from "./marka-detay-card";

import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaDetay {
  params: {
    markadetay: string;
  };
}

export const getSession = async () => {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
   const {
        data: { user },
      } = await supabase.auth.getUser();

      const {
        data: { session },
      } = await supabase.auth.getSession()

      return {session, user, supabase}
}

const MarkaDetay = async ({ params }: MarkaDetay) => {
  /* const supabase = createServerComponentClient<Database>({ cookies }); */
 /*  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession(); */

  const {session, user, supabase} = await getSession()

  const { data: secilenMarka } = await supabase
    .from("markalar")
    .select()
    .eq("referans_no", `${params.markadetay}`);

  return (
    <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px] ">
      <h1>Marka Detay Sayfası --- TASARLANACAK ---</h1>
      <h1>{params.markadetay}</h1>

      {secilenMarka != null && (
        <div>
          <h1>{secilenMarka[0].marka}</h1>
          <h1>{secilenMarka[0].durum_aciklamasi}</h1>

          {/*       <MarkaCardTek data={secilenMarka} />

<div className="container py-10 mx-auto">
<MarkaForm session={session} secilenMarka={secilenMarka} />
</div> */}
        </div>
      )}
    </div>
  );
};

export default MarkaDetay;
