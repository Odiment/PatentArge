import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import NextUiDataTable from "./components/nextui-data-table";

import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface RootPageProps {
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

export default async function PatentTablo({ searchParams }: RootPageProps) {
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

  const { data: secilenPatentler } = await supabase
    .from("patentler")
    .select(`patent`)
    .textSearch(`patent`, `%${searchParams.name}%`);
  type Profil =
    | { id: string | null; firma_ad: string | null; yetki: string | null }[]
    | null;

  let profil: Profil | undefined;

  type Firma = { firma_id: string }[] | null;
  let firma: Firma | undefined;

  if (user != null || user != undefined) {
    const useremail: string = user.email || "";

    const { data: profiltek } = await supabase
      .from("profiles")
      .select(`id, firma_ad, yetki`)
      .eq("id", user.id);

    profil = profiltek;

    const { data: firmatek } = await supabase
      .from("firma_profil")
      .select("firma_id")
      .eq("user_email", useremail);

    firma = firmatek;
  }

  let patentlerx: PatentlerX[] | null = [];
  let patentResimlerx:
    | {
        patent_resim_url: string | null;
        patent_id: string;
      }[]
    | null = [];

  if (profil != null) {
    if (profil[0].yetki !== "admin" && (firma != null || firma != undefined)) {
      const { data: patent_firma } = await supabase
        .from("patentler")
        .select()
        .eq("firma_id", firma[0].firma_id);
      patentlerx = patent_firma;

      const { data: patentResim_firma } = await supabase
        .from("patent_resimler")
        .select("patent_resim_url, patent_id");
      /* .eq("firma_id", firma[0].firma_id); */

      patentResimlerx = patentResim_firma;
    } else {
      const { data: patentler_tum } = await supabase.from("patentler").select();

      patentlerx = patentler_tum;

      const { data: tumPatentResimler } = await supabase
        .from("patent_resimler")
        .select("patent_resim_url, patent_id");

      patentResimlerx = tumPatentResimler;
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
        {profil != null && (
          <div className="">
            {profil[0].yetki == "admin" && (
              <Link
                className="justify-end link border-solid border-4 border-primary/25 font-bold hover:text-primary hover:bg-primary/10 rounded-lg transition p-3"
                href="/pt/new">
                + Yeni Ekle
              </Link>
            )}
          </div>
        )}
        <NextUiDataTable
          veri={patentlerx ?? []}
          userid={user?.id!}
          patentResimler={patentResimlerx}
          /* kullanici={user} */
        />
      </div>
    </>
  );
}
