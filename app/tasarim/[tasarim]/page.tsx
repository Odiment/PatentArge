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
import TasarimList from "./components/tasarim-list";

import { Database } from "@/app/supabase";

type TasarimlarX = Database["public"]["Tables"]["tasarimlar"]["Row"];

interface TasarimIdPageProps {
  searchParams: {
    name: string | null;
    kategori: string | null;
  };
}

export default async function TasarimKart({ searchParams }: TasarimIdPageProps) {
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

  let tasarimlarx: TasarimlarX[] | null = [];
  let tasarimResimlerx:
    | {
        tasarim_resim_url: string | null;
        tasarim_id: string;
      }[]
    | null = [];
  // admin yetkisinde tüm tasarımların görülebilmesi - erişilebilmesi
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

    // Arama çubuğundan yazılan anahtar kelimeye göre getitirilecek tasarımlar
    var aranan = tasarimlarx?.reduce((result: any, thing) => {
      if (
        thing.tasarim_title != null &&
        thing.tasarim_title.includes(`${searchParams.name}`)
      ) {
        result.push(thing);
      }
      return result;
    }, []);

    // Arama yapılan tasarımların id bilgileri
    let arananTasarimlar_id = aranan.map(({ id }: any) => id);

    // Tüm tasarımların id bilgileri
    /*  let secilenTasarim_id = tasarimlarx.map(({ id }) => id) */

    const { data: tumTasarimResimler } = await supabase
      .from("tasarim_resimler")
      .select("tasarim_resim_url, tasarim_id");

    tasarimResimlerx = tumTasarimResimler;

    if (tumTasarimResimler != null) {
      let tumTasarimResimlerTasarim_id = tumTasarimResimler.map(
        ({ tasarim_id }) => tasarim_id
      );

      var arananTasarimResimler = tumTasarimResimler.reduce(
        (result: any, thing) => {
          if (thing.tasarim_id.includes(`${arananTasarimlar_id}`)) {
            result.push(thing);
          }
          return result;
        },
        []
      );
    }
  }

  return (
    <>
      <div
        key={1}
        className="flex-none object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
        <TasarimList
          key={user?.id}
          items={durum ? tasarimlarx : aranan}
          bilgiler={durum ? tasarimlarx : aranan}
          tasarimResimler={durum ? tasarimResimlerx : arananTasarimResimler}
          userid={user?.id!}
        />
      </div>
    </>
  );
}
