import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import MarkaList from "./components/marka-list";
import Filter from "@/components/filter";

import { Database } from "@/app/supabase";

type MarkalarX = Database["public"]["Tables"]["markalar"]["Row"];

interface MarkaIdPageProps {
  searchParams: {
    name: string | null;
    kategori: string | null;
  };
}

export default async function MarkaKart({ searchParams }: MarkaIdPageProps) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  let items: MarkalarX[] | null = [];
  let markalarx: MarkalarX[] | null = [];
  // admin yetkisinde tüm markaların görülebilmesi - erişilebilmesi
  if (profil != null) {
    if (profil[0].yetki !== "admin" && (firma != null || firma != undefined)) {
      const { data: marka_firma } = await supabase
        .from("markalar")
        .select()
        .eq("firma_id", firma[0].firma_id);
      markalarx = marka_firma;
    } else {
      const { data: marka_tum } = await supabase.from("markalar").select();

      markalarx = marka_tum;
    }

    var aranan = markalarx?.reduce((result: any, thing) => {
      if (thing.marka != null && thing.marka.includes(`${searchParams.name}`)) {
        result.push(thing);
      }

      return result;
    }, []);

    var arananKategori = markalarx?.reduce((result: any, thing) => {
      if (
        thing.status != null &&
        thing.status.includes(`${searchParams.kategori}`)
      ) {
        result.push(thing);
      }

      return result;
    }, []);

    var arananVeKategori = markalarx?.reduce((result: any, thing) => {
      if (thing.marka != null && thing.status != null) {
        if (
          thing.marka.includes(`${searchParams.name}`) &&
          thing.status.includes(`${searchParams.kategori}`)
        ) {
          result.push(thing);
        }
      }

      return result;
    }, []);

    let yalnizcaGecerli: MarkalarX[] = [];

    let durumIptalOlmayan = searchParams.kategori;

    if ((durumIptalOlmayan = "yalnizcaGecerli")) {
      yalnizcaGecerli = markalarx?.reduce((result: any, thing) => {
        if (thing.status != null) {
          if (!thing.status.includes("iptal")) {
            result.push(thing);
          }
        }
        return result;
      }, []);

      if (yalnizcaGecerli != null) {
        var arananYalnizcaGecerli = yalnizcaGecerli.reduce(
          (result: any, thing) => {
            if (thing.marka != null) {
              if (thing.marka.includes(`${searchParams.name}`)) {
                result.push(thing);
              }
            }

            return result;
          },
          []
        );
      }
    }

    if (durum === true) {
      items = markalarx;
    } else items = aranan;

    if (durumKategori === true) {
      items = markalarx;
    } else items = arananKategori;

    if (durum === false && durumKategori === false) {
      items = arananVeKategori;
    }

    if (searchParams.kategori === "tumu") {
      items = markalarx;
    }

    let durumTumuVeAranan = searchParams.kategori === "tumu" && durum === false;

    if (durumTumuVeAranan === true) {
      items = aranan;
    }

    if (searchParams.kategori === "yalnizcaGecerli") {
      items = yalnizcaGecerli;
    }

    let durumYalnizcaGecerliVeAranan =
      searchParams.kategori === "yalnizcaGecerli" && durum === false;

    if (durumYalnizcaGecerliVeAranan === true) {
      items = arananYalnizcaGecerli;
    }
  }

  let itemid: React.Key | null | undefined = items?.map(({ id }) => id) as React.Key | null | undefined


  return (
    <>
      <div className="flex flex-col gap-y-8 pt-5 object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
        <Filter />
        <MarkaList
          key={itemid}
          items={items}
          bilgiler={items}
          userid={user?.id!}
        />
      </div>
    </>
  );
}
