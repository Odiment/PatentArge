export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = "auto";
export const runtime = "nodejs";
export const preferredRegion = "auto";
export const maxDuration = 5;

import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import YeniMarka from "./yeni-marka";
import MarkaSinifForm from './marka-sinif-form'

import { Database } from "@/app/supabase";
import EksikBilgiMarka from "./eksikBilgiMarka";


/* type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"]; */

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

export default async function YeniMarkaOlustur() {
  /* const supabase = createServerComponentClient<Database>({ cookies }) */
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

 /*  const { data: markalar } = await supabase.from("markalar").select(`marka`); */

/*   const { data: profil } = await supabase
    .from("profiles")
    .select(`id, firma_unvan, yetki`)
    .eq("id", user?.id!); */

/*   const { data: firma } = await supabase
    .from("firma_profil")
    .select("firma_id")
    .eq("user_email", user?.email!);



let firma_id = firma?.map(({ id }: any) => id); */

  const { data: firma_bilgi } = await supabase
    .from("firmalar")
    .select("id, firma, firma_ad, firma_unvan")
    

  // admin yetkisinde tüm markaların görülebilmesi - erişilebilmesi
/*   let markalarx: MarkalarX[] | null = [];

  if (firma != (null || undefined) && profil != (null || undefined)) {
    if (profil[0].yetki !== "admin") {
      const { data: marka_firma } = await supabase
        .from("markalar")
        .select()
        .eq("firma_id", firma[0].firma_id);
      markalarx = marka_firma;
    } else {
      const { data: marka_tum } = await supabase.from("markalar").select();

      markalarx = marka_tum;
    }
  }
 */
  const { data: eksikVeriMarkalar } = await supabase
    .from("markalar")
    .select("id, marka, referans_no, firma_unvan")
    .eq("class_no", "111");




  let eksikVeriMarka: any = null;
  let eksikMarkaRef: any = null;
  let eksikMarkaId: any = null;
  let eksikMarkaFirma: any = null;


  /* let eksikVeriMarka = eksikVeriMarkalar?.map((marka) => marka) */
  if (eksikVeriMarkalar != null) {
    
    let eksikVeriMarkax = eksikVeriMarkalar.map(({ marka }) => marka);
    eksikVeriMarka = eksikVeriMarkax;
    
    let eksikMarkaRefx = eksikVeriMarkalar.map(
      ({ referans_no }) => referans_no
    );
    eksikMarkaRef = eksikMarkaRefx;

    let eksikMarkaIdx = eksikVeriMarkalar.map(({ id }: any) => id);
    eksikMarkaId = eksikMarkaIdx;

let eksikMarkaFirmax = eksikVeriMarkalar.map(({ firma_unvan }: any) => firma_unvan);
    eksikMarkaFirma = eksikMarkaFirmax;

  }

  let firma_bilgi_id: React.Key | null | undefined = firma_bilgi?.map(
    ({ id }) => id
  ) as React.Key | null | undefined;


  return (
    <>
      <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex-none object-contain">
          <YeniMarka key={firma_bilgi_id} firmabilgi={firma_bilgi} />
        </div>

{/*         <div className="container py-10 mx-auto">
        <MarkaSinifForm session={session} secilenMarka={secilenMarka!} secilenMarkaSiniflar={secilenMarkaSiniflar!} />
      </div> */}

        <div className="md:ml-14 lg:ml-20 container grid items-center gap-6 pb-8">
        <h1 className="text-xl font-extrabold">Verileri Düzenlenecek Markalar</h1>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-4 min-[1350px]:grid-cols-6 min-[1650px]:grid-cols-8 gap-4">
            {eksikVeriMarka?.map((eksikMarka: any, index: any) => (
              <div
                key={index}>
                <EksikBilgiMarka
                  key={index}
                  firma_unvan = {eksikMarkaFirma[index]}
                  eksikMarka={eksikMarka}
                  eksikMarkaRef={eksikMarkaRef[index]}
                  /*  marka_id={item.id} */
                  userid={user?.id!}
                  eksikMarkaId = {eksikMarkaId[index]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
