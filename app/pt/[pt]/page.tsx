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
import YeniPatent from "./yeni-patent";

import EksikBilgiPatent from "./eksikBilgiPatent";



import { Database } from "@/app/supabase";

/* type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"]; */

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

  if (!session) {
    redirect("/");
  }

  /*   const { data: patentler } = await supabase
    .from("patentler")
    .select(`patent_title`);

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

  // admin yetkisinde tüm patentlerin görülebilmesi - erişilebilmesi
  /* let patentlerx: PatentlerX[] | null = [];

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
 
    let result = patentlerx.map(({ patent_title }) => patent_title)
  }
  */

  const { data: eksikVeriPatentler } = await supabase
    .from("patentler")
    .select("id, patent_title, referans_no, firma_unvan")
    .eq("class_no", "111");

  let eksikVeriPatent: any = null;
  let eksikPatentRef: any = null;
  let eksikPatentId: any = null;
  let eksikPatentFirma: any = null;

  if (eksikVeriPatentler != null) {
    let eksikVeriPatentx = eksikVeriPatentler.map(
      ({ patent_title }) => patent_title
    );
    eksikVeriPatent = eksikVeriPatentx;

    let eksikPatentRefx = eksikVeriPatentler.map(
      ({ referans_no }) => referans_no
    );
    eksikPatentRef = eksikPatentRefx;

    let eksikPatentIdx = eksikVeriPatentler.map(({ id }: any) => id);
    eksikPatentId = eksikPatentIdx;

    let eksikPatentFirmax = eksikVeriPatentler.map(
      ({ firma_unvan }: any) => firma_unvan
    );
    eksikPatentFirma = eksikPatentFirmax;
  }

  let firma_bilgi_id: React.Key | null | undefined = firma_bilgi?.map(
    ({ id }) => id
  ) as React.Key | null | undefined;

  return (
    <>
      <div className="flex flex-col gap-y-8 pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex-none object-contain">
          <YeniPatent firmabilgi={firma_bilgi} />
        </div>
        <div className="md:ml-14 lg:ml-20 container grid items-center gap-6 pb-8">
          <h1 className="text-xl font-extrabold">
            Verileri Düzenlenecek Tasarımlar
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-4 min-[1350px]:grid-cols-6 min-[1650px]:grid-cols-8 gap-4">
            {eksikVeriPatent?.map((eksikPatent: any, index: any) => (
              <div key={index}>
                <EksikBilgiPatent
                  key={index}
                  firma_unvan={eksikPatentFirma[index]}
                  eksikPatent={eksikPatent}
                  eksikPatentRef={eksikPatentRef[index]}
                  /*  marka_id={item.id} */
                  userid={user?.id!}
                  eksikPatentId={eksikPatentId[index]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
