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

import TasarimCardTek from "./components/tasarim-card-tek";
import TasarimForm from "./components/tasarim-form";

import { Database } from "@/app/supabase";

type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"];

interface TasarimCardYazProps {
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

const TasarimCardYaz = async ({ params }: TasarimCardYazProps) => {
  /* const supabase = createServerComponentClient<Database>({ cookies }); */
   const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore }); 

  const {
    data: { session },
  } = await supabase.auth.getSession();

  /* const {session, user, supabase} = await getSession() */

  const { data: secilenTasarim } = await supabase
    .from("tasarimlar")
    .select()
    .eq("referans_no", `${params.ptcard}`);

  // Tasarim resim seçimi

  let secilenTasarimResimlerx: {
    tasarim_resim_url: string | null;
    id: string;
  }[] = [];

  if (secilenTasarim != null) {
    let secilenTasarim_id = secilenTasarim.map(({ id }) => id);
    const { data: secilenTasarimResimler } = await supabase
      .from("tasarim_resimler")
      .select("tasarim_resim_url, id")
      .eq("tasarim_id", secilenTasarim_id);
    if (secilenTasarimResimler != null) {
      let tasarim_resim_url = secilenTasarimResimler.map(
        ({ tasarim_resim_url }) => tasarim_resim_url
      );
      secilenTasarimResimlerx = secilenTasarimResimler;
    }
  }
  // Ürün resim seçimi

  let secilenProductResimlerx: {
    product_resim_url: string | null;
    product_remote_url: string | null;
    id: string;
  }[] = [];

  if (secilenTasarim != (null || undefined)) {
    let secilenTasarim_id = secilenTasarim.map(({ id }) => id);
    const { data: secilenProductResimler } = await supabase
      .from("product_resimler")
      .select("product_resim_url, product_remote_url, id")
      .eq("tasarim_id", secilenTasarim_id);

    if (secilenProductResimler != null) {
      let product_resim_url = secilenProductResimler.map(
        ({ product_resim_url }) => product_resim_url
      );
      secilenProductResimlerx = secilenProductResimler;
    }
  }

  return (
    <div className="flex flex-col content-center mx-auto pt-10 gap-y-8  px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center  text-xl font-extrabold items-center">
        <h1>Tasarım Bilgileri Düzenleme/Güncelleme Ekranı</h1>
      </div>
      <TasarimCardTek
        veri={secilenTasarim!}
        tasarim_resimler={secilenTasarimResimlerx}
        product_resimler={secilenProductResimlerx}
      />

      <div className="container py-10 mx-auto">
        <TasarimForm session={session} secilenTasarim={secilenTasarim} />
      </div>
    </div>
  );
};

export default TasarimCardYaz;
