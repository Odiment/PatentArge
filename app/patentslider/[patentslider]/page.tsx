import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import PatentList from "./components/patent-list";
import Filter from "@/components/filter";

import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentIdPageProps {
  searchParams: {
    name: string | null;
    kategori: string | null;
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

export default async function PatentProductSunu({
  searchParams,
}: PatentIdPageProps) {
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

  let ad = `${searchParams.name}`;
  let durum = ad === "undefined" || ad === null;

  let kategori = `${searchParams.kategori}`;
  let durumKategori = kategori === "undefined" || kategori === null;

  type Profil =
    | { id: string | null; firma_ad: string | null; yetki: string | null }[]
    | null;

  let profil: Profil | undefined;

  type Firma = { firma_id: string }[] | null;
  let firma: Firma | undefined;

  if (user != null || user != undefined) {
    const { data: profiltek } = await supabase
      .from("profiles")
      .select(`id, firma_ad, yetki`)
      .eq("id", user.id);

    profil = profiltek;

    const useremail: string = user.email || "";

    const { data: firmatek } = await supabase
      .from("firma_profil")
      .select("firma_id")
      .eq("user_email", useremail);

    firma = firmatek;
  }

  let patentlerx: PatentlerX[] | null = [];
  let tumPatentResimlerx:
    | {
        patent_resim_url: string | null;
        patent_id: string;
      }[]
    | null = [];

  // admin yetkisinde tüm patentlerin görülebilmesi - erişilebilmesi

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
  }

  // Arama çubuğundan yazılan anahtar kelimeye göre getitirilecek patentler
  var aranan = patentlerx?.reduce((result: any, thing) => {
    if (
      thing.patent_title != null &&
      thing.patent_title.includes(`${searchParams.name}`)
    ) {
      result.push(thing);
    }
    return result;
  }, []);

  // Arama yapılan patentlerin id bilgileri
  let arananPatentler_id = aranan.map(({ id }: any) => id);

  // Tüm patentlerin id bilgileri
  /*  let secilenPatent_id = patentlerx.map(({ id }) => id) */

  const { data: tumPatentResimler } = await supabase
    .from("patent_resimler")
    .select("patent_resim_url, patent_id");

  tumPatentResimlerx = tumPatentResimler;

  if (tumPatentResimler != null) {
    let tumPatentResimlerPatent_id = tumPatentResimler.map(
      ({ patent_id }) => patent_id
    );

    var arananPatentResimler = tumPatentResimler.reduce(
      (result: any, thing) => {
        if (thing.patent_id.includes(`${arananPatentler_id}`)) {
          result.push(thing);
        }
        return result;
      },
      []
    );
  }

  const { data: tumProductResimler } = await supabase
    .from("product_resimler")
    .select("product_resim_url, patent_id");

  const { data: tumProductRemoteResimler } = await supabase
    .from("product_resimler")
    .select("product_remote_url, patent_id");

  // Ürün resimlerinin veritabanından getirilmesi

  let tumProductResimlerx:
    | {
        product_resim_url: string | null;
        patent_id: string;
      }[]
    | null = [];

  if (tumProductResimler != null) {
    /*   let tumProductResimler_id = tumProductResimler.map(
    ({ patent_id }) => patent_id
  )
  let tumProductRemoteResimler_id = tumProductRemoteResimler.map(
    ({ patent_id }) => patent_id
  ) */

    var arananProductResimler = tumProductResimler.reduce(
      (result: any, thing) => {
        if (thing.patent_id.includes(`${arananPatentler_id}`)) {
          result.push(thing);
        }
        return result;
      },
      []
    );
    tumProductResimlerx = tumProductResimler;
  }

  let tumProductRemoteResimlerx:
    | {
        product_remote_url: string | null;
        patent_id: string;
      }[]
    | null = [];

  if (tumProductRemoteResimler != null) {
    var arananProductRemoteResimler = tumProductRemoteResimler.reduce(
      (result: any, thing) => {
        if (thing.patent_id.includes(`${arananPatentler_id}`)) {
          result.push(thing);
        }
        return result;
      },
      []
    );
    tumProductRemoteResimlerx = tumProductRemoteResimler;
  }

  return (
    <>
      <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
        <Filter />
        <div className="flex-none object-contain">
          <PatentList
            items={durum ? patentlerx : aranan}
            bilgiler={durum ? patentlerx : aranan}
            patentResimler={durum ? tumPatentResimlerx : arananPatentResimler}
            productResimler={
              durum ? tumProductResimlerx : arananProductResimler
            }
            productRemoteResimler={
              durum ? tumProductRemoteResimlerx : arananProductRemoteResimler
            }
            userid={user?.id!}
          />
        </div>
      </div>
    </>
  );
}
