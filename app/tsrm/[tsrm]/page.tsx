export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5

import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import YeniTasarim from "./yeni-tasarim";

import { Database } from "@/app/supabase";

type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"];

export default async function YeniTasarimOlustur() {
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

  const { data: tasarimlar } = await supabase
    .from("tasarimlar")
    .select(`tasarim_title`);

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

  // admin yetkisinde tüm tasarımların görülebilmesi - erişilebilmesi
  let tasarimlarx: TasarimlarX[] | null = [];

  if (profil != null) {
    if (profil[0].yetki !== "admin" && (firma != null || firma != undefined)) {
      const { data: tasarim_firma } = await supabase
        .from("tasarimlar")
        .select()
        .eq("firma_id", firma[0].firma_id);
        tasarimlarx = tasarim_firma;
    } else {
      const { data: tasarim_tum } = await supabase.from("tasarimlar").select();

      tasarimlarx = tasarim_tum;
    }

    const { data: tasarim_firma_id } = await supabase
      .from("tasarimlar")
      .select("firma_id");

    const { data: tasarimBilgiler } = await supabase
      .from("tasarimlar")
      .select("tasarim_title");

    /*   let result = tasarimlarx.map(({ tasarim_title }) => tasarim_title) */
  }

  return (
    <>
      <div className="flex flex-col gap-y-8 pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex-none object-contain">
          <YeniTasarim firmabilgi={firma_bilgi} />
        </div>
      </div>
    </>
  );
}
