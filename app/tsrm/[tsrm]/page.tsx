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

import EksikBilgiTasarim from "./eksikBilgiTasarim";

/* type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"]; */

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

  if (!session) {
    redirect("/");
  }

  /* const { data: tasarimlar } = await supabase
    .from("tasarimlar")
    .select(`tasarim_title`);

  const { data: profil } = await supabase
    .from("profiles")
    .select(`id, firma_ad, yetki`)
    .eq("id", user?.id!);

  const { data: firma } = await supabase
    .from("firma_profil")
    .select("firma_id")
    .eq("user_email", user?.email!); */

  const { data: firma_bilgi } = await supabase
    .from("firmalar")
    .select("id, firma, firma_ad, firma_unvan");

  // admin yetkisinde tüm tasarımların görülebilmesi - erişilebilmesi
/*   let tasarimlarx: TasarimlarX[] | null = [];

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

    let result = tasarimlarx.map(({ tasarim_title }) => tasarim_title)
  } */

  const { data: eksikVeriTasarimlar } = await supabase
  .from("tasarimlar")
  .select("id, tasarim_title, referans_no, firma_unvan")
  .eq("class_no", "111");

let eksikVeriTasarim: any = null;
let eksikTasarimRef: any = null;
let eksikTasarimId: any = null;
let eksikTasarimFirma: any = null;

if (eksikVeriTasarimlar != null) {
  
  let eksikVeriTasarimx = eksikVeriTasarimlar.map(({ tasarim_title }) => tasarim_title);
  eksikVeriTasarim = eksikVeriTasarimx;
  
  let eksikTasarimRefx = eksikVeriTasarimlar.map(
    ({ referans_no }) => referans_no
  );
  eksikTasarimRef = eksikTasarimRefx;

  let eksikTasarimIdx = eksikVeriTasarimlar.map(({ id }: any) => id);
  eksikTasarimId = eksikTasarimIdx;

let eksikTasarimFirmax = eksikVeriTasarimlar.map(({ firma_unvan }: any) => firma_unvan);
  eksikTasarimFirma = eksikTasarimFirmax;

}


let firma_bilgi_id: React.Key | null | undefined = firma_bilgi?.map(
  ({ id }) => id
) as React.Key | null | undefined;




  return (
    <>
      <div className="flex flex-col gap-y-8 pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex-none object-contain">
          <YeniTasarim key={firma_bilgi_id} firmabilgi={firma_bilgi} />
        </div>
        <div className="md:ml-14 lg:ml-20 container grid items-center gap-6 pb-8">
        <h1 className="text-xl font-extrabold">Verileri Düzenlenecek Tasarımlar</h1>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-4 min-[1350px]:grid-cols-6 min-[1650px]:grid-cols-8 gap-4">
            {eksikVeriTasarim?.map((eksikTasarim: any, index: any) => (
              <div
                key={index}>
                <EksikBilgiTasarim
                  key={index}
                  firma_unvan = {eksikTasarimFirma[index]}
                  eksikTasarim={eksikTasarim}
                  eksikTasarimRef={eksikTasarimRef[index]}
                  /*  marka_id={item.id} */
                  userid={user?.id!}
                  eksikTasarimId = {eksikTasarimId[index]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
