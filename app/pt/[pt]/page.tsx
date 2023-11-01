import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import YeniPatent from "./yeni-patent";

import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

/*  interface PatentCardProps {
  data: PatentlerX | null;
  bilgiler: PatentlerX | null;
  patent_id: string;
  userid: string;
  patentResimler:
    | {
        patent_resim_url: string | null;
        patent_id: string;
      }[]
    | null;
} */

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

export default async function YeniPatentOlustur() {
  /* const supabase = createServerComponentClient<Database>({ cookies }); */
   const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore }); 

   const {
    data: { session },
  } = await supabase.auth.getSession(); 

   const {
    data: { user },
  } = await supabase.auth.getUser(); 

  /* const {session, user, supabase} = await getSession() */

  if (!session) {
    redirect("/");
  }

  const { data: patentler } = await supabase
    .from("patentler")
    .select(`patent_title`);

  const { data: profil } = await supabase
    .from("profiles")
    .select(`id, firma_ad, yetki`)
    .eq("id", user?.id!);

  const { data: firma } = await supabase
    .from("firma_profil")
    .select("firma_id")
    .eq("user_email", user?.email!);

  const { data: firma_bilgi } = await supabase
    .from("firmalar")
    .select("id, firma, firma_ad, firma_unvan");

  // admin yetkisinde tüm patentlerin görülebilmesi - erişilebilmesi
  let patentlerx: PatentlerX[] | null = [];

  if (profil != null) {
    if (profil[0].yetki !== "admin" && (firma != null || firma != undefined)) {
      const { data: patent_firma } = await supabase
        .from("patentler")
        .select()
        .eq("firma_id", firma[0].firma_id);
      patentlerx = patent_firma;
    } else {
      const { data: patent_tum } = await supabase.from("patentler").select();

      patentlerx = patent_tum;
    }

    const { data: patent_firma_id } = await supabase
      .from("patentler")
      .select("firma_id");

    const { data: patentBilgiler } = await supabase
      .from("patentler")
      .select("patent_title");

    /*   let result = patentlerx.map(({ patent_title }) => patent_title) */
  }

  return (
    <>
      <div className="flex flex-col gap-y-8 pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex-none object-contain">
          <YeniPatent firmabilgi={firma_bilgi} />
        </div>
      </div>
    </>
  );
}
