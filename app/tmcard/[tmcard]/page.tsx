export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;

import { cookies } from "next/headers";
/* mport { redirect } from 'next/navigation' */
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import MarkaDetayCard from "./components/marka-detay-card";

import MarkaCardTek from "./components/marka-card-tek";
import MarkaForm from "./components/marka-form";
import MarkaSinifForm from "./components/marka-sinif-form";
import MarkaSinifFormEdit from "./components/marka-sinif-form-edit";
import { Database } from "@/app/supabase";

/* type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];
type MarkaSiniflarX = Database["public"]["Tables"]["marka_siniflar"]["Row"]; */

interface MarkaCardYazProps {
  params: {
    referans_no: string;
    tmcard: string;
  };
}

const MarkaCardYaz = async ({ params }: MarkaCardYazProps) => {
  /* const supabase = createServerComponentClient<Database>({ cookies }) */
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: secilenMarka } = await supabase
    .from("markalar")
    .select()
    .eq("referans_no", `${params.tmcard}`);

  let secilenMarkaSiniflar:
    | {
        marka_id: any;
        basvurulan_sinif_no: any;
        basvurulan_sinif_aciklamasi: any;
        basvurulan_sinif_id: any
      }[]
    | null = [];

  let secilenMarkaId = secilenMarka?.map(({ id }: any) => id);

  if (secilenMarka != null) {
    const { data: secilenMarkaSiniflarx } = await supabase
      .from("marka_siniflar")
      .select("id, marka_id, basvurulan_sinif_no, basvurulan_sinif_aciklamasi, basvurulan_sinif_id")
      .eq("marka_id", `${secilenMarkaId}`);

    secilenMarkaSiniflar = secilenMarkaSiniflarx;
  }

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


  return (
    <div className="flex flex-col content-center mx-auto pt-10 gap-y-8  px-4 sm:px-6 lg:px-8">
      <MarkaCardTek data={secilenMarka!} />

      <div className="container py-10 mx-auto">
        <MarkaForm session={session} secilenMarka={secilenMarka!} />
      </div>
      <div className="container py-10 mx-auto">
        <MarkaSinifForm
          session={session}
          secilenMarka={secilenMarka!}
          secilenMarkaSiniflar={secilenMarkaSiniflar!}
        />
      </div>
      {secilenMarkaSiniflar?.map((secilenMarkaSinif: any, index: any) => (
        <div key={index}>
          <div className="container py-10 mx-auto">
            <MarkaSinifFormEdit
              session={session}
              secilenMarka={secilenMarka!}
              secilenMarkaSinif={secilenMarkaSinif!}
              secilenMarkaSurecBilgileri={secilenMarkaSurecBilgileri!}
            />
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px] ">
        <MarkaDetayCard
          bilgiler={secilenMarka}
          secilenMarkaSiniflar={secilenMarkaSiniflar!}
          secilenMarkaSurecBilgileri={secilenMarkaSurecBilgileri!}
        />
      </div>
    </div>
  );
};

export default MarkaCardYaz;
