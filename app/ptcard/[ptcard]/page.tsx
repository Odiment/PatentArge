export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import PatentCardTek from "./components/patent-card-tek";
import PatentForm from "./components/patent-form";
import PatentIstemForm from "./components/patent_istem_form";
import PatentIstemFormEdit from "./components/patent_istem_form_edit";
import PatentTarifnameForm from "./components/patent_tarifname";
import PatentTarifnameFormEdit from "./components/patent_tarifname_edit";

import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentCardYazProps {
  params: {
    referans_no: string;
    ptcard: string;
  };
}

const PatentCardYaz = async ({ params }: PatentCardYazProps) => {
  /* const supabase = createServerComponentClient<Database>({ cookies }); */
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: secilenPatent } = await supabase
    .from("patentler")
    .select()
    .eq("referans_no", `${params.ptcard}`);

  // Patent resim seçimi

  let secilenPatentResimlerx: {
    patent_resim_url: string | null;
    id: string;
  }[] = [];

  let secilenPatent_id = secilenPatent?.map(({ id }) => id);

  if (secilenPatent != null) {
    const { data: secilenPatentResimler } = await supabase
      .from("patent_resimler")
      .select("patent_resim_url, id")
      .eq("patent_id", secilenPatent_id);
    if (secilenPatentResimler != null) {
      let patent_resim_url = secilenPatentResimler.map(
        ({ patent_resim_url }) => patent_resim_url
      );
      secilenPatentResimlerx = secilenPatentResimler;
    }
  }
  // Ürün resim seçimi

  let secilenProductResimlerx: {
    product_resim_url: string | null;
    product_remote_url: string | null;
    id: string;
  }[] = [];

  if (secilenPatent != (null || undefined)) {
    let secilenPatent_id = secilenPatent.map(({ id }) => id);
    const { data: secilenProductResimler } = await supabase
      .from("product_resimler")
      .select("product_resim_url, product_remote_url, id")
      .eq("patent_id", secilenPatent_id);

    if (secilenProductResimler != null) {
      let product_resim_url = secilenProductResimler.map(
        ({ product_resim_url }) => product_resim_url
      );
      secilenProductResimlerx = secilenProductResimler;
    }
  }

  // İstemler

  let secilenPatentIstemler:
    | {
        patent_id: any;
        istem_no: any;
        istem_metni: any;
      }[]
    | null = [];

  if (secilenPatent != null) {
    const { data: secilenPatentIstemlerx } = await supabase
      .from("patent_istemler")
      .select("id, patent_id, istem_no, istem_metni")
      .eq("patent_id", `${secilenPatent_id}`);

    secilenPatentIstemler = secilenPatentIstemlerx;
  }

  
  // Tarifname

  let secilenPatentTarifname: any;

  if (secilenPatent != null) {
    const { data: secilenPatentTarifnamex } = await supabase
      .from("patent_tarifname")
      .select("tarifname")
      .eq("patent_id", `${secilenPatent_id}`);

    secilenPatentTarifname = secilenPatentTarifnamex;
  }

  let tarifname = secilenPatentTarifname?.map(({ tarifname }: any) => tarifname)

  /* console.log("secilenPatentTarifname");
  console.log(secilenPatentTarifname); */

  console.log("secilenPatentTarifname")
  console.log(secilenPatentTarifname)

  // Patent Süreç Bilgileri
  /*   let secilenMarkaSurecBilgileri:
    | {
        marka_id: any;
        islem_tarihi: any;
        islem: any;
        islem_aciklamasi: any;
      }[]
    | null = [];

  if (secilenPatent != null) {
    const { data: secilenMarkaSurecBilgilerix } = await supabase
      .from("marka_surec")
      .select("id, marka_id, islem_tarihi, islem, islem_aciklamasi")
      .eq("marka_id", `${secilenPatent_id}`);

      secilenMarkaSurecBilgileri = secilenMarkaSurecBilgilerix;
  } */

  return (
    <div className="flex flex-col content-center mx-auto pt-10 gap-y-8  px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center  text-xl font-extrabold items-center">
        <h1>Patent Bilgileri Düzenleme/Güncelleme Ekranı</h1>
      </div>
      <PatentCardTek
        veri={secilenPatent!}
        patent_resimler={secilenPatentResimlerx}
        product_resimler={secilenProductResimlerx}
      />

      <div className="container py-10 mx-auto">
        <PatentForm session={session} secilenPatent={secilenPatent!} />
      </div>

     {/*  <div className="container py-10 mx-auto">
        <PatentTarifnameForm
          session={session}
          secilenPatent={secilenPatent!}
          secilenPatentTarifname={tarifname}
        />
      </div> */}

      <div className="container py-10 mx-auto">
        <PatentTarifnameFormEdit
          session={session}
          secilenPatent={secilenPatent!}
          tarifname={tarifname}
        />
      </div>

      <div className="container py-10 mx-auto">
        <PatentIstemForm
          session={session}
          secilenPatent={secilenPatent!}
          secilenPatentIstemler={secilenPatentIstemler!}
        />
      </div>
      {secilenPatentIstemler?.map((secilenPatentIstem: any, index: any) => (
        <div key={index}>
          <div className="container py-10 mx-auto">
            <PatentIstemFormEdit
              session={session}
              secilenPatent={secilenPatent!}
              secilenPatentIstemler={secilenPatentIstem!}
              /*  secilenPatentSurecBilgileri={secilenPatentSurecBilgileri!} */
            />
          </div>
        </div>
      ))}


      {/*       <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px] ">
        <PatentDetayCard
          bilgiler={secilenPatent}
          secilenMarkaSiniflar={secilenPatentIstemler!}
          secilenMarkaSurecBilgileri={secilenPatentSurecBilgileri!}
        />
      </div> */}
    </div>
  );
};

export default PatentCardYaz;
