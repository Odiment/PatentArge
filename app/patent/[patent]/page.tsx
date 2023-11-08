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
import PatentList from "./components/patent-list";
import Filter from "@/components/filter";

import { getSession } from "@/app/auth/getSession/getSession";
import { getUser } from "@/app/auth/getUser/getUser";

import { cache } from "react";
import { Database } from "@/app/supabase";

type PatentlerX = Database["public"]["Tables"]["patentler"]["Row"];

interface PatentIdPageProps {
  searchParams: {
    name: string | null;
    kategori: string | null;
    firma: string | null;
  };
}

export default async function PatentKart({ searchParams }: PatentIdPageProps) {
  const createServerSupabaseClient = cache(() => {
    const cookieStore = cookies();
    return createServerComponentClient<Database>({
      cookies: () => cookieStore,
    });
  });

  const session = await getSession();
  const user = await getUser();

  const supabase = createServerSupabaseClient();

  if (!session) {
    redirect("/");
  }

  let ad = `${searchParams.name}`;
  let durum = ad === "undefined" || ad === null;

  let kategori = `${searchParams.kategori}`;
  let durumKategori = kategori === "undefined" || kategori === null;

  let firmaAd = `${searchParams.firma}`;
  let durumFirma = firmaAd === "undefined" || firmaAd === null;

  type Profil =
    | { id: string | null; firma_ad: string | null; yetki: string | null }[]
    | null;

  let profil: Profil | undefined;

  type Firma = { firma_id: string }[] | null;
  let firma: Firma | undefined;
  let yetki: any | null;

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

    let yetkix = profil?.map(({ yetki }: any) => yetki);
    yetki = yetkix;

  }

  let items: PatentlerX[] | null = [];
  let patentlerx: PatentlerX[] | null = [];
  let arananFirmaPatent: PatentlerX[] | null = [];

  let patentResimlerx:
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

    // Arama çubuğundan yazılan anahtar kelimeye göre getitirilecek patentler
    var aranan = patentlerx?.reduce((result: any, thing) => {
      if (
        thing.patent_title != null &&
        thing.patent_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase())
      ) {
        result.push(thing);
      }
      return result;
    }, []);

    var arananFirma = patentlerx?.reduce((result: any, thing) => {
      if (
        thing.firma_unvan != null &&
        thing.firma_unvan.toLowerCase().includes(`${searchParams.firma}`.toLowerCase())
      ) {
        result.push(thing);
      }
      return result;
    }, []);

    let arananFirmaId = arananFirma?.map(({ firma_id }: any) => firma_id);

    if (durumFirma === false) {
      const { data: arananFirmaPatentx } = await supabase
        .from("patentler")
        .select()
        .eq("firma_id", arananFirmaId[0]);

      arananFirmaPatent = arananFirmaPatentx;
    }

    var arananKategori = patentlerx?.reduce((result: any, thing) => {
      if (
        thing.status != null &&
        thing.status.includes(`${searchParams.kategori}`)
      ) {
        result.push(thing);
      }

      return result;
    }, []);

    var arananVeKategori = patentlerx?.reduce((result: any, thing) => {
      if (thing.patent_title != null && thing.status != null) {
        if (
          thing.patent_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase()) &&
          thing.status.includes(`${searchParams.kategori}`)
        ) {
          result.push(thing);
        }
      }

      return result;
    }, []);

    var firmaArananVeKategori = arananFirma?.reduce(
      (result: any, thing: any) => {
        if (thing.patent_title != null && thing.status != null) {
          if (
            thing.patent_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase()) &&
            thing.status.includes(`${searchParams.kategori}`)
          ) {
            result.push(thing);
          }
        }

        return result;
      },
      []
    );

    let yalnizcaGecerli: PatentlerX[] = [];
    let firmaYalnizcaGecerli: PatentlerX[] = [];

    let durumIptalOlmayan = searchParams.kategori;

    if ((durumIptalOlmayan = "yalnizcaGecerli")) {
      yalnizcaGecerli = patentlerx?.reduce((result: any, thing) => {
        if (thing.status != null) {
          if (!thing.status.includes("iptal")) {
            result.push(thing);
          }
        }
        return result;
      }, []);

      if (durumFirma === false) {
        firmaYalnizcaGecerli = arananFirma?.reduce(
          (result: any, thing: any) => {
            if (thing.status != null) {
              if (!thing.status.includes("iptal")) {
                result.push(thing);
              }
            }
            return result;
          },
          []
        );
      }

      if (yalnizcaGecerli != null) {
        var arananYalnizcaGecerli = yalnizcaGecerli.reduce(
          (result: any, thing) => {
            if (thing.patent_title != null) {
              if (thing.patent_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase())) {
                result.push(thing);
              }
            }

            return result;
          },
          []
        );
      }

      if (firmaYalnizcaGecerli != null) {
        var arananFirmaYalnizcaGecerli = firmaYalnizcaGecerli.reduce(
          (result: any, thing) => {
            if (thing.patent_title != null) {
              if (thing.patent_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase())) {
                result.push(thing);
              }
            }

            return result;
          },
          []
        );
      }
    }

    var firmadaAranan = arananFirma?.reduce((result: any, thing: any) => {
      if (
        thing.patent_title != null &&
        thing.patent_title.toLowerCase().includes(`${searchParams.name}`.toLowerCase())
      ) {
        result.push(thing);
      }

      return result;
    }, []);

    var firmadaArananKategori = arananFirma?.reduce(
      (result: any, thing: any) => {
        if (
          thing.status != null &&
          thing.status.includes(`${searchParams.kategori}`)
        ) {
          result.push(thing);
        }

        return result;
      },
      []
    );

    // Arama yapılan patentlerin id bilgileri
    let arananPatentler_id = aranan.map(({ id }: any) => id);

    // Tüm patentlerin id bilgileri
    /*  let secilenPatent_id = patentlerx.map(({ id }) => id) */

    const { data: tumPatentResimler } = await supabase
      .from("patent_resimler")
      .select("patent_resim_url, patent_id");

    patentResimlerx = tumPatentResimler;

    /* if (tumPatentResimler != null) {
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
   */

    // Eğer firma araması yapılmadıysa, standart filtreleme yap...
    if (durumFirma === true) {
      if (durum === true) {
        items = patentlerx;
      } else items = aranan;

      if (durumKategori === true) {
        items = patentlerx;
      } else items = arananKategori;

      if (durum === false && durumKategori === false) {
        items = arananVeKategori;
      }

      if (searchParams.kategori === "tumu") {
        items = patentlerx;
      }

      let durumTumuVeAranan =
        searchParams.kategori === "tumu" && durum === false;

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

    // Eğer firma bazlı arama yapılıyorsa önceliği firma aramasına ver...
    if (durumFirma === false) {
      if (durum === true) {
        items = arananFirma;
      } else items = firmadaAranan;

      if (durumKategori === true) {
        items = arananFirma;
      } else items = firmadaArananKategori;

      if (durumKategori === false && durum === false) {
        items = firmaArananVeKategori;
      }

      if (searchParams.kategori === "tumu") {
        items = arananFirma;
      }

      let durumTumuVeAranan =
        searchParams.kategori === "tumu" && durum === false;

      if (durumTumuVeAranan === true) {
        items = firmadaAranan;
      }

      if (searchParams.kategori === "yalnizcaGecerli") {
        items = firmaYalnizcaGecerli;
      }

      let durumYalnizcaGecerliVeAranan =
        searchParams.kategori === "yalnizcaGecerli" && durum === false;

      if (durumYalnizcaGecerliVeAranan === true) {
        items = arananFirmaYalnizcaGecerli;
      }
    }
  }

  return (
    <div className="flex-none object-contain ml-[7px] md:ml-[55px] lg:ml-[115px] mr-[10px]">
      <div className="grid grid-cols-8 gap-4">
        <div className="col-span-4 pb-4">
          <Filter />
        </div>
      </div>
      <PatentList
        /* items={items} */
        bilgiler={items}
        patentResimler={patentResimlerx}
        yetki={yetki[0]}
      />
    </div>
  );
}
