export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { redirect } from "next/navigation";

import PatentDetayCard from "./patent-detay-card";

import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentDetay {
  params: {
    patentdetay: string;
  };
}

const PatentDetay = async ({ params }: PatentDetay) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const { data: secilenPatent } = await supabase
    .from("patentler")
    .select()
    .eq("referans_no", `${params.patentdetay}`);


    const { data: secilenPatentidx } = await supabase
    .from("patentler")
    .select("id")
    .eq("referans_no", `${params.patentdetay}`);

    let secilenPatentid = secilenPatentidx?.map(({ id }: any) => id);
    let patentResimlerx:
    | {
        patent_resim_url: string | null;
        patent_id: string;
      }[]
    | null = [];

    const { data: tumPatentResimler } = await supabase
      .from("patent_resimler")
      .select("patent_resim_url, patent_id");

    patentResimlerx = tumPatentResimler;

let tumPatentResimlerPatent_id: any 

    if (tumPatentResimler != null) {
        let tumPatentResimlerPatent_idx = tumPatentResimler.map(
          ({ patent_id }) => patent_id
        );

        tumPatentResimlerPatent_id = tumPatentResimlerPatent_idx

        var arananPatentResimler = tumPatentResimler.reduce(
            (result: any, thing) => {
              if (thing.patent_id.includes(`${secilenPatentid}`)) {
                result.push(thing);
              }
              return result;
            },
            []
          );
        }
/*         let itemid: React.Key | null | undefined = items?.map(({ id }) => id) as
    | React.Key
    | null
    | undefined; */

  return (
    <div key={8} className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px] ">
      {secilenPatent != null && (
        <>        
          <PatentDetayCard
          key={tumPatentResimlerPatent_id}
          bilgiler={secilenPatent}
          patent_id={secilenPatentid}
          patentResimler={arananPatentResimler}
          />
        </>
      )}
    </div>
  );
};

export default PatentDetay
