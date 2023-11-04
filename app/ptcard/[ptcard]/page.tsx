export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5

import { cookies } from "next/headers";
/* import { redirect } from 'next/navigation' */
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import PatentCardTek from "./components/patent-card-tek";
import PatentForm from "./components/patent-form";

import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentCardYazProps {
  params: {
    referans_no: string;
    ptcard: string;
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

const PatentCardYaz = async ({ params }: PatentCardYazProps) => {
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
    .eq("referans_no", `${params.ptcard}`);

  // Patent resim seçimi

  let secilenPatentResimlerx: {
    patent_resim_url: string | null;
    id: string;
  }[] = [];

  if (secilenPatent != null) {
    let secilenPatent_id = secilenPatent.map(({ id }) => id);
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
        veri={secilenPatent!}
        patent_resimler={secilenPatentResimlerx}
        product_resimler={secilenProductResimlerx}
      />

      <div className="container py-10 mx-auto">
        <PatentForm session={session} secilenPatent={secilenPatent!} />
      </div>
    </div>
  );
};

export default PatentCardYaz;
