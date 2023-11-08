export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import MarkaDetayCard from "./marka-detay-card";

import { Database } from "@/app/supabase";

import { getSession } from "@/app/auth/getSession/getSession";
import { getUser } from "@/app/auth/getUser/getUser";
import { getYetki } from "@/app/auth/getYetki/getYetki";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaDetay {
  params: {
    markadetay: string;
  };
}

const MarkaDetay = async ({ params }: MarkaDetay) => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const session = await getSession();
  const user = await getUser();
  const yetki = await getYetki();

  const { data: secilenMarka } = await supabase
    .from("markalar")
    .select()
    .eq("referans_no", `${params.markadetay}`);

    let secilenMarkaId = secilenMarka?.map(({ id }: any) => id);


const { data: secilenMarkaSiniflar } = await supabase
    .from("marka_siniflar")
    .select("basvurulan_sinif_no, basvurulan_sinif_aciklamasi")
    .eq("marka_id", `${secilenMarkaId}`)

    let secilenMarkaSurecBilgileri:
    | {
        marka_id: any;
        islem_tarihi: any;
        islem: any;
        islem_aciklamasi: any;
      }[]
    | null = [];

  if (secilenMarka != null) {
    const { data: secilenMarkaSurecBilgilerix } = await supabase
      .from("marka_surec")
      .select("id, marka_id, islem_tarihi, islem, islem_aciklamasi")
      .eq("marka_id", `${secilenMarkaId}`);

      secilenMarkaSurecBilgileri = secilenMarkaSurecBilgilerix;
  }

  let basvuru_no: React.Key | null | undefined = secilenMarka?.map(
    ({ basvuru_no }) => basvuru_no
  ) as React.Key | null | undefined;

  return (
    <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px] ">
      {secilenMarka != null && (
        <div key={basvuru_no}>
          <MarkaDetayCard bilgiler={secilenMarka}  secilenMarkaSiniflar={secilenMarkaSiniflar} secilenMarkaSurecBilgileri={secilenMarkaSurecBilgileri!} yetki={yetki} />
        </div>
      )}
    </div>
  );
};

export default MarkaDetay;
